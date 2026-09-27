/* ═══════════════════════════════════════════════════════════════════
   AVANISH JHA — SHOWREEL 2026 · shared engine
   Deterministic timeline: every frame is a pure function of time `t`,
   so the renderer can seek to any frame and get an identical image.
   Music grid: 120 BPM → 1 beat = 0.5s, 1 bar = 2s.
   Used by reel.js (16:9) and vertical.js (9:16); both formats share the
   same timing, transitions and HUD so one soundtrack fits both.
   ═══════════════════════════════════════════════════════════════════ */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const FPS = 60, DUR = 30;
// RS.FR: current frame index (drives deterministic "randomness")
// RS.TQ: frame-quantized time: text & counters change once per frame, never between motion-blur sub-frames
// RS.W/H: stage size · RS.SCALE: preview scale of the stage
const RS = { FR: 0, TQ: 0, W: 0, H: 0, SCALE: 1 };

/* ─────────── easing + math ─────────── */
const E = {
  lin: x => x,
  outQuad: x => 1 - (1 - x) * (1 - x),
  inCubic: x => x * x * x,
  outCubic: x => 1 - (1 - x) ** 3,
  inOutCubic: x => x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2,
  inQuart: x => x ** 4,
  outQuart: x => 1 - (1 - x) ** 4,
  inOutQuart: x => x < .5 ? 8 * x ** 4 : 1 - (-2 * x + 2) ** 4 / 2,
  inExpo: x => x === 0 ? 0 : 2 ** (10 * x - 10),
  outExpo: x => x === 1 ? 1 : 1 - 2 ** (-10 * x),
  inOutExpo: x => x === 0 ? 0 : x === 1 ? 1 : x < .5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2,
  outBack: x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; },
  outBackS: x => { const c1 = 2.4, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; },
  inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
};
const cl = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
const lerp = (a, b, p) => a + (b - a) * p;
const P = (t, s, d, e = E.lin) => e(cl((t - s) / d));
const bump = (t, s, d) => (t < s || t > s + d) ? 0 : Math.sin(Math.PI * (t - s) / d);
const decay = (t, s, k) => t < s ? 0 : Math.exp(-(t - s) * k);
function K(t, keys) {           // keyframes: [time, value, easeIntoThisKey]
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (t <= k[0]) { const k0 = keys[i - 1]; return lerp(k0[1], k[1], (k[2] || E.inOutCubic)((t - k0[0]) / (k[0] - k0[0]))); }
  }
  return keys[keys.length - 1][1];
}
const hash = (a, b = 0) => { let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ─────────── DOM helpers ─────────── */
function T(el, o) {
  let s = '';
  if (o.x || o.y || o.z) s += o.z ? `translate3d(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px,${o.z.toFixed(2)}px) ` : `translate(${(o.x || 0).toFixed(2)}px,${(o.y || 0).toFixed(2)}px) `;
  if (o.rx) s += `rotateX(${o.rx.toFixed(3)}deg) `;
  if (o.ry) s += `rotateY(${o.ry.toFixed(3)}deg) `;
  if (o.r) s += `rotate(${o.r.toFixed(3)}deg) `;
  if (o.s !== undefined && o.s !== 1) s += `scale(${o.s.toFixed(4)}) `;
  if (o.sx !== undefined || o.sy !== undefined) s += `scale(${(o.sx ?? 1).toFixed(4)},${(o.sy ?? 1).toFixed(4)}) `;
  el.style.transform = s || 'none';
  if (o.o !== undefined) el.style.opacity = o.o < .002 ? 0 : o.o > .998 ? 1 : o.o.toFixed(3);
  if (o.b !== undefined) el.style.filter = o.b > .05 ? `blur(${o.b.toFixed(2)}px)` : 'none';
}
const rise = (el, p, from = 135) => { el.style.transform = p >= 1 ? 'none' : `translateY(${((1 - p) * from).toFixed(2)}%)`; };
const show = (el, on) => { const v = on ? 'visible' : 'hidden'; if (el._v !== v) { el.style.visibility = v; el._v = v; } };
const txt = (el, s) => { if (el._t !== s) { el.textContent = s; el._t = s; } };
const html = (el, s) => { if (el._h !== s) { el.innerHTML = s; el._h = s; } };
function chars(el, text, cls) {  // wrap each char in a rise mask
  el.textContent = ''; const out = [];
  for (const ch of text) {
    if (ch === ' ') { el.appendChild(document.createTextNode(' ')); continue; }
    const m = document.createElement('span'); m.className = 'm';
    const i = document.createElement('i'); i.textContent = ch;
    if (cls && cls(ch)) i.className = cls(ch);
    m.appendChild(i); el.appendChild(m); out.push(i);
  }
  return out;
}
const GLY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>';
function scr(text, p, seed = 1) {  // scramble-decode reveal
  if (p <= 0) return '';
  if (p >= 1) return text;
  const n = text.length, L = Math.ceil(Math.min(1, p * 1.7) * n), k = Math.floor(cl((p - .3) / .7) * n);
  let s = '';
  for (let i = 0; i < L; i++) {
    const c = text[i];
    s += (i < k || c === ' ' || c === '·' || c === '—' || c === '\n') ? c : GLY[Math.floor(hash(seed * 7919 + i, Math.floor(RS.FR / 2)) * GLY.length)];
  }
  return s;
}
const rel = (el, root) => { const a = el.getBoundingClientRect(), b = root.getBoundingClientRect(), k = RS.SCALE; return { x: (a.left - b.left) / k, y: (a.top - b.top) / k, w: a.width / k, h: a.height / k }; };

/* ═══════════════════════════ SCENES ═══════════════════════════ */
const scenes = [];
const scene = (id, a, b, build, render) => scenes.push({ el: $('#' + id), a, b, build, render });

/* ═══════════════════════════ GLOBAL FX ═══════════════════════════ */
const FX = {};
const SECTIONS = [[0, '[00] — Boot'], [1.95, '[01] — The promise'], [6, '[02] — What I build'], [10, '[03] — Process'], [16, '[04] — Work / Fifty Villagers'], [19.75, '[05] — Work / Kalam Ashram'], [24, '[06] — The standard'], [26, '[07] — Let’s talk']];
const HUDC = [[0, 'b'], [1.99, 'i'], [4, 'b'], [5.9, 'i'], [6.5, 'b'], [7, 'i'], [8, 'b'], [8.5, 'i'], [9.1667, 'b'], [9.3333, 'i'], [9.5, 'b'], [9.97, 'i'], [10.18, 'b'], [23.99, 'i'], [26, 'b']];
const SHAKE = [[2.0, 5], [4.0, 24], [6.0, 6], [7.0, 4], [9.0, 5], [9.5, 8], [10.0, 10], [14.86, 5], [16.0, 14], [20.0, 5], [24.0, 8], [26.0, 20]];
const FLASH = [[4.0, .28, '#ff4d1c'], [10.0, .16, '#efece4'], [16.0, .1, '#efece4'], [26.0, .12, '#efece4']];
const WIPES = [{ t: 5.54, c: ['#ff4d1c', '#0a0a0a', '#efece4'] }, { t: 23.54, c: ['#efece4', '#0a0a0a', '#ff4d1c'] }];
function buildFX() {
  FX.world = $('#world'); FX.flash = $('#fx-flash'); FX.grain = $('#fx-grain'); FX.cover = $('#cover'); FX.wipe = $('#wipe'); FX.panels = $$('#wipe>div');
  FX.hud = $('#hud'); FX.tr = $('#hud .tr'); FX.bl = $('#hud .bl'); FX.hs = $$('#hud .h');
  // film grain tile
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), im = g.createImageData(256, 256), r = rng(99);
  for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() - .5) * 150; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); FX.grain.style.backgroundImage = `url(${c.toDataURL()})`;
}
function renderFX(t) {
  // camera shake
  let sx = 0, sy = 0, sr = 0;
  SHAKE.forEach(([ti, a], i) => { const d = decay(t, ti, 9) * a; if (d > .01) { sx += d * (Math.sin(t * 91 + i) * .6 + Math.sin(t * 143 + i * 3) * .4); sy += d * (Math.sin(t * 107 + i * 2) * .6 + Math.sin(t * 61 + i) * .4); sr += d * .02 * Math.sin(t * 77 + i); } });
  FX.world.style.transform = Math.abs(sx) + Math.abs(sy) > .05 ? `translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) rotate(${sr.toFixed(3)}deg) scale(${(1 + (Math.abs(sx) + Math.abs(sy)) * .0006).toFixed(4)})` : 'none';
  // flash
  let fo = 0, fc = '#efece4'; FLASH.forEach(([ti, a, c]) => { const d = decay(t, ti, 16) * a; if (d > fo) { fo = d; fc = c; } });
  FX.flash.style.opacity = fo.toFixed(3); FX.flash.style.background = fc;
  // grain
  const gf = Math.floor(RS.FR / 2); // 30 Hz grain
  FX.grain.style.backgroundPosition = `${Math.floor(hash(gf, 1) * 256)}px ${Math.floor(hash(gf, 2) * 256)}px`;
  // accent cover (Anything. → Process)
  const cv = t >= 9.97 && t < 10.4; show(FX.cover, cv);
  if (cv) T(FX.cover, { y: -P(t, 10.0, .36, E.inOutQuart) * (RS.H + 10) });
  // shape wipes
  let w = null; WIPES.forEach(x => { if (t >= x.t && t < x.t + 1.0) w = x; });
  show(FX.wipe, !!w);
  if (w) FX.panels.forEach((p, i) => { p.style.background = w.c[i]; const pin = P(t, w.t + i * .06, .3, E.inOutQuart), pout = P(t, w.t + .46, .26, E.outQuart); p.style.transform = `translateY(${((1 - pin) * 101 - pout * 101).toFixed(2)}%)`; });
  // HUD
  let hc = 'b'; HUDC.forEach(([ti, c]) => { if (t >= ti) hc = c; });
  FX.hud.style.color = hc === 'b' ? 'var(--bone)' : 'var(--ink)';
  const f = RS.FR, ss = Math.floor(f / FPS), ff = f % FPS, pad = n => String(n).padStart(2, '0');
  txt(FX.tr, `TC 00:00:${pad(ss)}:${pad(ff)}`);
  let si = 0; SECTIONS.forEach(([ti], i) => { if (t >= ti) si = i; });
  txt(FX.bl, scr(SECTIONS[si][1], P(RS.TQ, SECTIONS[si][0] + .05, .4), 90 + si));
  const ho = P(t, .15, .4) * (1 - P(t, 25.85, .2));
  FX.hs.forEach(h => h.style.opacity = ho.toFixed(3));
  FX.hud.querySelectorAll('.cm').forEach(c => c.style.opacity = (P(t, .1, .3) * .65).toFixed(3));
}

/* ═══════════════════════════ PLAYER ═══════════════════════════ */
function seek(t, fr) {
  t = cl(t, 0, DUR - 1e-6);
  RS.FR = fr ?? Math.floor(t * FPS + 1e-6);
  RS.TQ = fr === undefined ? t : fr / FPS;
  for (const s of scenes) {
    const on = t >= s.a && t < s.b;
    if (s.on !== on) { s.el.style.display = on ? 'block' : 'none'; s.on = on; }
    if (on) s.render(t);
  }
  renderFX(t);
}
function fit() {
  const vw = innerWidth, vh = innerHeight, k = Math.min(vw / RS.W, vh / RS.H);
  RS.SCALE = k;
  const st = $('#stage');
  st.style.transform = `translate(${(vw - RS.W * k) / 2}px,${(vh - RS.H * k) / 2}px) scale(${k})`;
}
async function start({ W, H }) {
  RS.W = W; RS.H = H;
  await document.fonts.ready;
  await Promise.all(['400 20px Inter', '600 20px Inter', '700 20px Inter', '800 20px Inter', '900 20px Inter', 'italic 400 20px "Instrument Serif"', '400 20px "Instrument Serif"', '400 20px "JetBrains Mono"', '400 20px "Tiro Devanagari Hindi"']
    .map(f => document.fonts.load(f, f.includes('Tiro') ? 'कलाम आश्रम' : 'Aa₹')));
  RS.SCALE = 1; $('#stage').style.transform = 'none';
  // build every scene while visible so measurements are real
  for (const s of scenes) { s.el.style.visibility = 'visible'; s.build(); s.el.style.display = 'none'; s.on = false; }
  buildFX();
  const q = new URLSearchParams(location.search);
  if (q.has('render')) { seek(+q.get('t') || 0); window.__ready = true; return; }
  fit(); addEventListener('resize', fit);
  // real-time preview (click to play with sound)
  const audio = new Audio('../assets/showreel-audio.m4a'); let start = null, off = +q.get('t') || 0;
  seek(off);
  const loop = now => { if (start !== null) { const t = off + (now - start) / 1000; if (t >= DUR) { start = null; off = 0; } else seek(t); } requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  const hint = document.createElement('div');
  hint.textContent = '▶  Play — with sound';
  hint.style.cssText = 'position:fixed;left:50%;bottom:6vh;transform:translateX(-50%);padding:14px 26px;border-radius:30px;background:#ff4d1c;color:#0a0a0a;font:600 15px Inter,sans-serif;letter-spacing:.02em;cursor:pointer;z-index:9;box-shadow:0 10px 40px rgba(255,77,28,.4)';
  document.body.appendChild(hint);
  addEventListener('click', () => { hint.remove(); if (start === null) { off = off >= DUR - .05 ? 0 : off; audio.currentTime = off; audio.play().catch(() => {}); start = performance.now(); } else { audio.pause(); off += (performance.now() - start) / 1000; start = null; } });
}

window.__seek = seek;
window.Reel = { RS, FPS, DUR, E, cl, lerp, P, bump, decay, K, hash, rng, T, rise, show, txt, html, chars, scr, rel, scene, $, $$, start };
})();
