// Frame-accurate renderer: seeks the composition to every (sub)frame and
// captures it with headless Chromium. Frames are written as PNGs, then
// encoded by encode.sh.
//
//   node render.mjs frames <outDir> [--fps 60] [--sub 4] [--workers 4] [--from 0] [--to 30] [--jpg]
//   node render.mjs stills <outDir> 0.5 4.2 12.8 ...
//   add --page vertical.html --size 1080x1920 for the 9:16 cut
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // showreel/
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.m4a': 'audio/mp4', '.wav': 'audio/wav' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

const args = process.argv.slice(2);
const mode = args[0], out = args[1];
const optS = (k, d) => { const i = args.indexOf('--' + k); return i > 0 ? args[i + 1] : d; };
const opt = (k, d) => +optS(k, d);
const PAGE = optS('page', 'index.html'), [VW, VH] = optS('size', '1920x1080').split('x').map(Number);
fs.mkdirSync(out, { recursive: true });

const srv = await serve();
const url = `http://127.0.0.1:${srv.address().port}/src/${PAGE}?render=1`;
const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb', '--hide-scrollbars'] });

async function page() {
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  pg.on('pageerror', e => console.error('pageerror:', e.message));
  pg.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await pg.goto(url);
  await pg.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  const cdp = await ctx.newCDPSession(pg);
  return { pg, cdp };
}
async function shot({ pg, cdp }, t, file, fr) {
  await pg.evaluate(([t, fr]) => window.__seek(t, fr), [t, fr]);
  const jpg = file.endsWith('.jpg');
  const { data } = await cdp.send('Page.captureScreenshot', jpg ? { format: 'jpeg', quality: 94, optimizeForSpeed: true } : { format: 'png', optimizeForSpeed: true });
  fs.writeFileSync(file, Buffer.from(data, 'base64'));
}

const t0 = Date.now();
if (mode === 'stills') {
  const p = await page();
  // numeric args that aren't the value of a --flag
  const times = args.slice(2).filter((a, i, all) => /^[\d.]+$/.test(a) && !(all[i - 1] || '').startsWith('--'));
  for (const ts of times) { await shot(p, +ts, path.join(out, `still_${(+ts).toFixed(3)}.png`)); }
} else {
  const fps = opt('fps', 60), sub = opt('sub', 1), workers = opt('workers', 4), from = opt('from', 0), to = opt('to', 30);
  // motion blur: `sub` samples across a 180° shutter that opens on the frame,
  // so hard cuts on frame boundaries stay crisp
  const ext = args.includes('--jpg') ? 'jpg' : 'png';
  const jobs = [];
  for (let f = Math.round(from * fps); f < Math.round(to * fps); f++)
    for (let s = 0; s < sub; s++) jobs.push({ i: f * sub + s, f, t: (f + (s / sub) * .5) / fps });
  let next = 0, done = 0;
  await Promise.all(Array.from({ length: workers }, async () => {
    const p = await page();
    while (next < jobs.length) {
      const j = jobs[next++];
      await shot(p, Math.max(0, j.t), path.join(out, `f_${String(j.i).padStart(6, '0')}.${ext}`), j.f);
      if (++done % 120 === 0) console.log(`${done}/${jobs.length} · ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
}
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
await browser.close(); srv.close();
