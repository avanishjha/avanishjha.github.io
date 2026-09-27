/* ═══════════════════════════════════════════════════════════════════
   AVANISH JHA — SHOWREEL 2026 · VOL. 02 · "Aurora" (1920×1080)
   128 BPM: 1 beat = 0.46875s, 1 bar = 1.875s, 16 bars = 30s.
   A  0.000  the pixel → mosaic       E 16.875  Kalam Ashram carousel
   B  3.750  particle morphs          F 20.625  code → pixels → deploy
   C  7.500  bento grid               G 24.375  Design. Develop. Deliver.
   D 13.125  Fifty Villagers, 3D      H 26.250  particles → name, CTA
   ═══════════════════════════════════════════════════════════════════ */
(() => {
'use strict';
const { RS, E, cl, lerp, P, bump, decay, K, hash, rng, T, rise, show, txt, html, scr, rel, scene, $, $$ } = Reel;
const B = 60 / 128, bt = n => n * B;
const VIO = [124, 92, 255], CYA = [34, 211, 238];
const mix = (a, b, p) => a.map((v, i) => Math.round(v + (b[i] - v) * p));
const fvs = (el, w, g) => { el.style.fontVariationSettings = `'wdth' ${w.toFixed(1)}, 'wght' ${Math.round(g)}`; };
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

/* ───── aurora background ───── */
{
  const R = {};
  scene('bg', 0, 30.01, () => { R.b = $$('#bg .blob'); R.dots = $('#bg .dots'); }, t => {
    const I = K(t, [[0, 0], [2.3, .12], [3.75, .55, E.outCubic], [7.5, .7], [13.1, .5], [16.9, .75], [20.6, .45], [24.3, .3], [26.25, .95, E.outCubic], [30, 1]]);
    R.dots.style.opacity = (P(t, .2, 1.2) * .9).toFixed(3);
    const pos = [[480 + 260 * Math.sin(t * .35), 380 + 160 * Math.cos(t * .3)], [1450 + 220 * Math.cos(t * .28), 620 + 180 * Math.sin(t * .33)], [960 + 400 * Math.sin(t * .2 + 2), 900 + 120 * Math.cos(t * .25)]];
    R.b.forEach((b, i) => T(b, { x: pos[i][0], y: pos[i][1], s: 1 + .08 * Math.sin(t * .5 + i), o: I }));
  });
}

/* ───── HUD: chapter timeline ───── */
{
  const R = {};
  const CH = [[0, 'Idea'], [7.5, 'Craft'], [13.125, 'Work'], [20.625, 'Code'], [26.25, 'Hello'], [30]];
  const W = 1792, GAP = 10;
  scene('hud2', 0, 30.01, () => {
    const bar = $('#hud2 .bar'); R.el = $('#hud2'); R.segs = []; R.labs = [];
    for (let i = 0; i < 5; i++) {
      const x0 = CH[i][0] / 30 * W, x1 = CH[i + 1][0] / 30 * W - GAP;
      const s = document.createElement('div'); s.className = 'seg'; Object.assign(s.style, { left: x0 + 'px', width: x1 - x0 + 'px' }); s.innerHTML = '<i></i>'; bar.appendChild(s); R.segs.push(s.firstChild);
      const l = document.createElement('div'); l.className = 'lab'; l.style.left = x0 + 'px'; l.innerHTML = `<b>0${i + 1}</b>${CH[i][1]}`; bar.appendChild(l); R.labs.push(l);
    }
    R.head = document.createElement('i'); R.head.className = 'head'; bar.appendChild(R.head);
  }, t => {
    R.el.style.opacity = P(t, .35, .6).toFixed(3);
    R.segs.forEach((s, i) => { s.style.width = cl((t - CH[i][0]) / (CH[i + 1][0] - CH[i][0])) * 100 + '%'; });
    R.labs.forEach((l, i) => l.style.color = t >= CH[i][0] && t < CH[i + 1][0] ? 'var(--text)' : t >= CH[i + 1][0] ? 'var(--muted)' : 'var(--dim)');
    let i = 0; while (i < 4 && t >= CH[i + 1][0]) i++;
    const x0 = CH[i][0] / 30 * W, x1 = CH[i + 1][0] / 30 * W - GAP;
    R.head.style.left = lerp(x0, x1, cl((t - CH[i][0]) / (CH[i + 1][0] - CH[i][0]))) + 'px';
  });
}

/* ───── A · THE PIXEL (0 – 3.75) ───── */
{
  const R = {};
  const L1 = 'Every great product', L2 = 'starts with a single pixel';
  const TL = [2.344, 2.813, 3.047, 3.281, 3.516];   // split beats
  const lv = (n, S) => (i, j) => {
    const g = n === 1 ? 0 : Math.max(6, 22 - n * 2), c = (S - (n - 1) * g) / n, ci = Math.floor(i * n / 16), cj = Math.floor(j * n / 9);
    return [960 - S / 2 + ci * (c + g), 540 - S / 2 + cj * (c + g), c, c, ((ci + .5) / n) * .7 + ((cj + .5) / n) * .3, n === 1 ? 22 : 16];
  };
  const full = (i, j) => [i * 120 + 4, j * 120 + 4, 112, 112, i / 15 * .7 + j / 8 * .3, 12];
  scene('a1', 0, 3.8, () => {
    const el = $('#a1'), stage = $('#stage');
    R.fly = $('.fly', el); R.cv = $('#mosaic').getContext('2d');
    const mk = (line, text, hl) => [...text].map((ch, i) => { const s = document.createElement('span'); s.className = 'ch' + (hl && i >= text.indexOf('a single') ? ' hl' : ''); s.textContent = ch; line.appendChild(s); return s; });
    R.c1 = mk($('.l1', el), L1); R.c2 = mk($('.l2', el), L2, true);
    R.all = [...R.c1, ...R.c2];
    // cursor stops: right edge of each char (and line starts)
    R.pos = R.all.map(s => { const r = rel(s, stage); return [r.x + r.w + 10, r.y + r.h * .5 - 10]; });
    const f1 = rel(R.c1[0], stage), f2 = rel(R.c2[0], stage);
    R.start1 = [f1.x, f1.y + f1.h * .5 - 10]; R.start2 = [f2.x, f2.y + f2.h * .5 - 10];
    R.tt = R.all.map((_, k) => k < L1.length ? .3 + k * .034 : 1.02 + (k - L1.length) * .028);
    R.levels = [lv(1, 200), lv(2, 440), lv(4, 680), lv(8, 980), full];
  }, t => {
    const TQ = RS.TQ;
    // typing
    let n = 0; R.tt.forEach(ti => { if (TQ >= ti) n++; });
    R.all.forEach((s, k) => {
      const f = P(t, 1.875 + (R.all.length - 1 - k) * .008, .5, E.inQuad);
      s.style.visibility = k < n ? 'visible' : 'hidden';
      s.style.transform = f > 0 ? `translate(${(hash(k, 3) - .5) * 120 * f}px,${(f * f * 560).toFixed(1)}px) rotate(${((hash(k, 5) - .5) * 80 * f).toFixed(1)}deg)` : 'none';
      s.style.opacity = (1 - f).toFixed(3);
    });
    // the pixel: typing cursor → full stop → flies to centre
    const at = n === 0 ? R.start1 : n === L1.length && TQ < 1.02 ? R.start2 : R.pos[n - 1];
    const typing = TQ > .3 && TQ < 1.76;
    const blink = typing || t > 1.95 || Math.floor(t / (B / 2)) % 2 === 0;
    const fp = P(t, 1.95, .39, E.inOutCubic), sz = lerp(20, 26, fp);
    T(R.fly, { x: lerp(at[0], 960 - 13, fp), y: lerp(at[1], 540 - 13, fp), s: sz / 20 });
    R.fly.style.opacity = t < 2.344 && blink ? 1 : 0;
    // mosaic: one square → 2×2 → 4×4 → 8×8 → full-screen 16×9 → dots
    const c = R.cv; c.clearRect(0, 0, 1920, 1080);
    if (t < 2.344) return;
    let k = 0; while (k < 4 && t >= TL[k + 1]) k++;
    const flash = [1, 2, 3, 4].reduce((a, i) => a + decay(t, TL[i], 9) * .45, 0) + decay(t, TL[0], 6) * .4;
    for (let j = 0; j < 9; j++) for (let i = 0; i < 16; i++) {
      let r;
      if (k === 0) { const S = lerp(26, 200, P(t, TL[0], .36, E.outBackS)); r = lv(1, S)(i, j); }
      else { const a = R.levels[k - 1](i, j), b = R.levels[k](i, j), p = P(t, TL[k], .22, E.outExpo); r = a.map((v, q) => lerp(v, b[q], p)); }
      let [x, y, w, h, u, rad] = r;
      if (t >= 3.52) {  // collapse into glowing dots, rippling out from the centre
        const d = Math.hypot(x + w / 2 - 960, y + h / 2 - 540), q = P(t, 3.53 + d * .00011, .19, E.inCubic);
        const cx = x + w / 2, cy = y + h / 2; w = h = lerp(w, 7, q); x = cx - w / 2; y = cy - h / 2; rad = lerp(rad, 3.5, q);
      }
      const col = mix(mix(VIO, CYA, u), [255, 255, 255], cl(flash));
      c.fillStyle = `rgb(${col})`; rr(c, x, y, w, h, Math.min(rad, w / 2)); c.fill();
    }
  });
}

/* ───── B / H · PARTICLES (3.75 – 7.9, 26.25 – 30) ───── */
{
  const R = {};
  const N = 2600;
  const MORPH = [[3.75, 1], [bt(10), 2], [bt(12), 3], [bt(14), 4]];
  const BOOM = 7.42;
  const WORDS = [[3.9, bt(9.85), 100], [bt(10.3), bt(11.85), 132], [bt(12.3), bt(13.85), 76]];
  function sample(draw, n, seed, step = 3) {
    const cv = document.createElement('canvas'); cv.width = 1920; cv.height = 1080; const g = cv.getContext('2d');
    g.fillStyle = g.strokeStyle = '#fff'; draw(g);
    const d = g.getImageData(0, 0, 1920, 1080).data, pts = [];
    for (let y = 0; y < 1080; y += step) for (let x = 0; x < 1920; x += step) if (d[(y * 1920 + x) * 4 + 3] > 128) pts.push([x, y]);
    const r = rng(seed);
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    return Array.from({ length: n }, (_, i) => { const p = pts[i % pts.length]; return [p[0] + (r() - .5) * step, p[1] + (r() - .5) * step]; });
  }
  const bigText = (text, maxW, y, size) => g => {
    g.font = `900 ${size}px Anybody`; g.fontStretch = 'expanded'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const w = g.measureText(text).width; if (w > maxW) { size *= maxW / w; g.font = `900 ${size}px Anybody`; }
    g.fillText(text, 960, y);
  };
  scene('px', 3.7, 30.01, () => {
    const el = $('#px');
    R.sh = $('.sharp', el); R.gl = $('.glow', el); R.c = R.sh.getContext('2d'); R.g = R.gl.getContext('2d');
    R.idx = $('.lbl .idx', el); R.ws = $$('.lbl .w', el); R.subs = $$('.lbl .sub', el); R.ln = $('.lbl .ln', el);
    const r = rng(21);
    R.p = Array.from({ length: N }, (_, i) => {
      const k = i % 144, a = r() * 6.283, m = 60 + r() * 150;
      return { t0: [(k % 16) * 120 + 60 + (r() - .5) * 20, Math.floor(k / 16) * 120 + 60 + (r() - .5) * 20], s: 2.1 + r() * 1.9, a: .7 + r() * .3, cx: Math.cos(a) * m, cy: Math.sin(a) * m, d: r() * .14, ph: r() * 6.283, ex: [Math.cos(r() * 6.283), Math.sin(r() * 6.283)], sp: 600 + r() * 1000, ang: r() * 6.283 };
    });
    const browser = g => {
      g.lineWidth = 5; rr(g, 940, 300, 720, 480, 26); g.stroke();
      g.beginPath(); g.moveTo(940, 356); g.lineTo(1660, 356); g.stroke();
      [972, 998, 1024].forEach(x => { g.beginPath(); g.arc(x, 328, 7, 0, 7); g.fill(); });
      rr(g, 1060, 318, 300, 22, 11); g.stroke();
      g.fillRect(980, 400, 380, 38); g.fillRect(980, 452, 280, 38); g.fillRect(980, 516, 400, 10); g.fillRect(980, 538, 330, 10);
      rr(g, 980, 575, 160, 48, 24); g.fill(); rr(g, 1420, 395, 200, 240, 18); g.stroke(); g.beginPath(); g.arc(1520, 490, 48, 0, 7); g.stroke();
      [980, 1200, 1420].forEach(x => { rr(g, x, 665, 200, 80, 14); g.stroke(); });
    };
    const phone = g => {
      g.lineWidth = 6; rr(g, 1150, 250, 300, 580, 46); g.stroke(); rr(g, 1255, 268, 90, 22, 11); g.fill();
      for (let y = 0; y < 4; y++) for (let x = 0; x < 3; x++) { rr(g, 1184 + x * 84, 330 + y * 92, 64, 64, 18); (x + y) % 2 ? g.stroke() : g.fill(); }
      g.fillRect(1220, 792, 160, 6);
    };
    const chart = g => {
      g.lineWidth = 5; g.beginPath(); g.moveTo(960, 300); g.lineTo(960, 780); g.lineTo(1660, 780); g.stroke();
      const hs = [120, 170, 150, 230, 210, 290, 270, 360]; g.lineWidth = 4; g.beginPath();
      hs.forEach((h, k) => { g.fillRect(1000 + k * 80, 780 - h, 46, h); });
      hs.forEach((h, k) => { const x = 1023 + k * 80, y = 780 - h - 50; k ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke();
      hs.forEach((h, k) => { g.beginPath(); g.arc(1023 + k * 80, 780 - h - 50, 9, 0, 7); g.fill(); });
    };
    const nm = rel($('#h8 .nm'), $('#stage')), dl = rel($('#g7 .w3 .t'), $('#stage'));
    const deliver = g => { g.font = '900 300px Anybody'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.letterSpacing = '-10.5px'; g.fillText('Deliver.', 960, dl.y + dl.h * .5); };
    R.T = [R.p.map(q => q.t0), sample(browser, N, 1), sample(phone, N, 2), sample(chart, N, 3), sample(bigText('ANYTHING', 1600, 540, 260), N, 4, 4), sample(bigText('AVANISH JHA', 1760, nm.y + nm.h * .5, 176), N, 7, 3), sample(deliver, N, 8, 3)];
    R.cols = Array.from({ length: 24 }, (_, i) => `rgb(${mix(VIO, CYA, i / 23)})`);
  }, t => {
    const c = R.c; c.clearRect(0, 0, 1920, 1080);
    const A = t < 7.95, H = t >= 26.0;
    if (A || H) {
      c.globalCompositeOperation = 'lighter';
      let k = 0; while (k < MORPH.length - 1 && t >= MORPH[k + 1][0]) k++;
      const [ts, to] = MORPH[k], from = k === 0 ? 0 : MORPH[k - 1][1];
      for (let i = 0; i < N; i++) {
        const q = R.p[i]; let x, y, al = q.a;
        if (A) {
          const p = P(t, ts + q.d * (k === 0 ? 1.6 : k === 3 ? .7 : 1), k === 3 ? .44 : .5, E.inOutCubic), a = R.T[from][i], b = R.T[to][i], sw = Math.sin(Math.PI * p) * (k === 0 ? 1.5 : 1);
          x = lerp(a[0], b[0], p) + q.cx * sw + Math.sin(t * 2.1 + q.ph) * 1.4;
          y = lerp(a[1], b[1], p) + q.cy * sw + Math.cos(t * 1.7 + q.ph) * 1.4;
          if (t < 3.75) al *= 0;
          if (t >= BOOM) { const e = 1 - Math.exp(-(t - BOOM) * 4), dx = x - 960, dy = y - 540, dl = Math.hypot(dx, dy) || 1; x += (dx / dl * .7 + q.ex[0] * .3) * q.sp * e; y += (dy / dl * .7 + q.ex[1] * .3) * q.sp * e; al *= 1 - P(t, BOOM + .05, .5); }
        } else {
          // "Deliver." shatters into particles, which regroup as the name
          const a = R.T[6][i], burst = P(t, 26.02, .35, E.outCubic), p = P(t, 26.25 + q.d * 1.3, .72, E.inOutCubic), b = R.T[5][i], sw = Math.sin(Math.PI * p);
          const sx = a[0] + ((a[0] - 960) * .35 + q.ex[0] * 160) * burst, sy = a[1] + ((a[1] - 490) * .6 + q.ex[1] * 160) * burst;
          x = lerp(sx, b[0], p) + q.cx * sw * 1.6 + Math.sin(t * .9 + q.ph) * 2.5;
          y = lerp(sy, b[1], p) + q.cy * sw * 1.6 + Math.cos(t * .8 + q.ph) * 2.5;
          al *= P(t, 26.0, .08) * lerp(1, .22, P(t, 27.05, .6));
        }
        if (al < .01 || x < -10 || x > 1930 || y < -10 || y > 1090) continue;
        c.globalAlpha = al; c.fillStyle = R.cols[Math.max(0, Math.min(23, Math.floor(x / 1920 * 24)))];
        c.fillRect(x - q.s / 2, y - q.s / 2, q.s, q.s);
      }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    }
    R.g.clearRect(0, 0, 1920, 1080); R.g.drawImage(R.sh, 0, 0);
    // variable-font labels beside the particle shapes
    let cur = -1; WORDS.forEach(([a], i) => { if (t >= a - .02) cur = i; });
    R.ws.forEach((w, i) => {
      const [a, b, W] = WORDS[i], pin = P(t, a, .5, E.outExpo), q = P(t, b, .24, E.inCubic);
      show(w, t >= a && t < b + .25);
      fvs(w, lerp(50, W, pin) + 60 * q, lerp(200, 820, pin));
      T(w, { y: (1 - pin) * 50, x: -40 * q, o: P(t, a, .12) * (1 - q) });
      const s = R.subs[i]; show(s, t >= a && t < b + .25);
      T(s, { y: (1 - P(t, a + .1, .5, E.outExpo)) * 20, o: P(t, a + .1, .2) * (1 - q) });
    });
    txt(R.idx, cur < 0 || t > WORDS[2][1] + .1 ? '' : scr(`0${cur + 1} / 03 — ${['Websites', 'Apps', 'Dashboards'][cur]}`, P(RS.TQ, WORDS[cur][0], .35), 40 + cur));
    T(R.ln, { sx: P(t, 3.95, .6, E.outExpo) * (1 - P(t, WORDS[2][1], .25)) });
  });
}

/* ───── C · BENTO (7.5 – 13.125) ───── */
{
  const R = {};
  const X0 = 120, Y0 = 130, G = 18, CW = (1680 - 3 * G) / 4, RH = (820 - 2 * G) / 3;
  const rect = (c0, c1, r0, r1) => [X0 + c0 * (CW + G), Y0 + r0 * (RH + G), (c1 - c0 + 1) * CW + (c1 - c0) * G, (r1 - r0 + 1) * RH + (r1 - r0) * G];
  const L = { t1: rect(0, 1, 0, 1), t2: rect(2, 2, 0, 0), t3: rect(3, 3, 0, 1), t4: rect(2, 2, 1, 1), t5: rect(0, 0, 2, 2), t6: rect(1, 1, 2, 2), t7: rect(2, 3, 2, 2) };
  const HL = { t1: [bt(18), bt(23)], t2: [bt(19)], t4: [bt(20), bt(22)], t5: [bt(21)], t6: [bt(22)], t7: [bt(24)], t3: [bt(25)] };
  const CIRC = 2 * Math.PI * 54;
  scene('c3', 7.35, 13.2, () => {
    R.el = $('#c3'); R.bento = $('#c3 .bento'); R.tiles = {};
    for (const id in L) { const e = $('#' + id), [x, y, w, h] = L[id]; Object.assign(e.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px', transformOrigin: `${w / 2}px ${h / 2}px` }); R.tiles[id] = { e, hl: $('.hl', e), d: 7.44 + Math.hypot(x + w / 2 - 960, y + h / 2 - 540) / 1100 * .38 }; }
    // zoom-through target: t1's mini browser → full frame
    const [x, y] = L.t1, mw = L.t1[2] - 52, mh = L.t1[3] - 104;
    R.zk = 1500 / mw; R.zx = -R.zk * (x + 26 + mw / 2 - 960); R.zy = -R.zk * (y + 26 + mh / 2 - 540);
    R.t1 = { h: $$('#t1 h3 .m>i'), s: $$('#t1 .sb'), vv: $('#t1 .vv'), bar: $('#t1 .card s'), cta: $('#t1 .cta'), cur: $('#t1 .cur') };
    R.t1.s.forEach((b, i) => Object.assign(b.style, { width: [340, 280][i] + 'px', height: [340, 280][i] + 'px', background: `radial-gradient(circle,${['rgba(124,92,255,.75)', 'rgba(34,211,238,.6)'][i]},transparent 65%)` }));
    R.t2 = { tg: $$('#t2 .tg'), pb: $('#t2 .pb s'), pl: $('#t2 .pl') };
    R.t3 = { feed: $('#t3 .feed') };
    R.t4 = { pa: $('#t4 .pa'), b: $('#t4 .cart b') };
    R.t5 = { k: $('#t5 .kpi'), bars: $$('#t5 .bars i') };
    R.t5.hs = R.t5.bars.map((_, i) => .3 + .7 * ((i + 1) / 9) * (.75 + hash(i, 9) * .25));
    R.t6 = { pc: $('#t6 .pc'), n: $('#t6 .rg .n') }; R.t6.pc.style.strokeDasharray = CIRC;
    R.t7 = { bt: $('#t7 .bt'), bl: $('#t7 .bt .bl'), r1: $('#t7 .r1'), r2: $('#t7 .r2') };
    R.t7.w1 = R.t7.r1.scrollWidth / 2; R.t7.w2 = R.t7.r2.scrollWidth / 2;
  }, t => {
    const TQ = RS.TQ;
    // camera: gentle 3D drift, then zoom through the website tile
    const zp = P(t, bt(27), .47, E.inOutExpo), calm = 1 - P(t, 12.2, .45, E.inOutCubic);
    T(R.bento, { x: R.zx * zp, y: R.zy * zp, rx: lerp(7, 2, P(t, 7.5, 5, E.inOutSine)) * calm, ry: lerp(-6, 5, P(t, 7.5, 5, E.inOutSine)) * calm, s: lerp(lerp(.97, 1.01, P(t, 7.5, 5)), R.zk, zp) });
    R.bento.style.transformOrigin = '960px 540px';
    for (const id in R.tiles) {
      const { e, hl, d } = R.tiles[id], p = P(t, d, .75, E.outExpo);
      T(e, { z: lerp(-700, 0, p), rx: lerp(40, 0, p), s: lerp(.78, 1, p), o: P(t, d, .15) * (id === 't1' ? 1 : 1 - P(t, bt(27), .25)) });
      hl.style.opacity = (HL[id] || []).reduce((a, h) => a + bump(t, h - .05, .5), 0).toFixed(3);
    }
    // t1 website
    const W1 = R.t1;
    W1.h.forEach((w, i) => rise(w, P(t, bt(18) + i * .08, .6, E.outExpo)));
    W1.s.forEach((b, i) => T(b, { x: [360 + 120 * Math.sin(t * .9), 520 + 90 * Math.cos(t * .7)][i], y: [40 + 60 * Math.cos(t * .8), 160 + 70 * Math.sin(t * .6)][i] }));
    txt(W1.vv, Math.round(12480 * P(TQ, 8.6, 1.4, E.outCubic)).toLocaleString('en-IN'));
    W1.bar.style.width = P(t, 8.6, 1.4, E.outCubic) * 82 + '%';
    const cx = K(t, [[9.9, 690], [10.55, 128, E.inOutCubic], [11.1, 128], [11.6, 420, E.inOutCubic]]), cy = K(t, [[9.9, 440], [10.55, 378, E.inOutCubic], [11.1, 378], [11.6, 470, E.inOutCubic]]);
    T(W1.cur, { x: cx, y: cy, s: 1 - .15 * bump(t, bt(23) - .04, .12), o: P(t, 9.9, .15) * (1 - P(t, 11.5, .2)) });
    T(W1.cta, { s: 1 + .08 * bump(t, bt(23) - .02, .3) });
    W1.cta.style.boxShadow = `0 0 ${(40 * bump(t, bt(23), .6)).toFixed(1)}px rgba(124,92,255,.9)`;
    // t2 toggles
    R.t2.tg.forEach((g, i) => { const p = P(t, bt(19 + i * .5), .18, E.outBack); T(g.firstChild, { x: 22 * p }); g.style.background = p > .5 ? 'var(--violet)' : '#2a2a3d'; });
    R.t2.pb.style.width = P(t, 8.4, 2.1, E.inOutCubic) * 100 + '%';
    txt(R.t2.pl, TQ >= 10.5 ? 'SYNCED ✓' : 'SYNCING…');
    // t3 feed scroll
    T(R.t3.feed, { y: -(P(t, 8.2, 3.4, E.inOutSine) * 220 + P(t, bt(25), .6, E.inOutCubic) * 150) });
    // t4 cart
    T(R.t4.pa, { s: 1 - .1 * bump(t, bt(20) - .03, .14) - .1 * bump(t, bt(22) - .03, .14) });
    txt(R.t4.b, String((TQ >= bt(20) ? 1 : 0) + (TQ >= bt(22) ? 1 : 0)));
    T(R.t4.b, { s: 1 + .45 * bump(t, bt(20), .22) + .45 * bump(t, bt(22), .22) });
    // t5 dashboard
    R.t5.bars.forEach((b, i) => T(b, { sy: lerp(.12, R.t5.hs[i], P(t, bt(21) + i * .035, .55, E.outExpo)) * P(t, R.tiles.t5.d, .5) }));
    html(R.t5.k, `+${Math.round(128 * P(TQ, bt(21), .9, E.outCubic))}%<small>GROWTH</small>`);
    // t6 ring
    const rp = P(t, bt(22), .9, E.outCubic);
    R.t6.pc.style.strokeDashoffset = CIRC * (1 - rp); txt(R.t6.n, String(Math.round(100 * P(TQ, bt(22), .9, E.outCubic))));
    // t7 payment + integration marquee
    const paid = TQ >= bt(24), spin = TQ >= bt(23) && !paid;
    html(R.t7.bl, paid ? '<svg width="18" height="18"><use href="#i-check"/></svg>Paid' : spin ? '<i class="sp"></i>Processing' : 'Pay now');
    if (spin) { const sp = R.t7.bl.firstChild; sp.style.transform = `rotate(${(t * 720) % 360}deg)`; }
    R.t7.bt.style.background = paid ? 'var(--mint)' : '';
    T(R.t7.bt, { s: 1 - .06 * bump(t, bt(23) - .03, .14) + .06 * bump(t, bt(24), .25) });
    T(R.t7.r1, { x: -((t - 7) * 60 % R.t7.w1) }); T(R.t7.r2, { x: -R.t7.w2 + ((t - 7) * 50 % R.t7.w2) });
  });
}

/* ───── D · FIFTY VILLAGERS — EXPLODED 3D (13.125 – 16.875) ───── */
{
  const R = {};
  const PD = 2600;
  function proj(x, y, z, s) {  // plane-local point → screen (mirrors the CSS transform chain)
    const r = Math.PI / 180, px = (x - 750) * s.s, py = (y - 450) * s.s, cb = Math.cos(s.b * r), sb = Math.sin(s.b * r), ca = Math.cos(s.a * r), sa = Math.sin(s.a * r);
    const x1 = px * cb - py * sb, y1 = px * sb + py * cb, y2 = y1 * ca - z * sa, z2 = y1 * sa + z * ca;
    const X = 960 + s.X + s.W + x1, Y = 540 + s.Y + y2, f = PD / (PD - z2);
    return [960 + (X - 960) * f, 540 + (Y - 540) * f];
  }
  const CO = [ // anchor (plane coords, layer index) → label offset
    [[144, 586], 9, [-300, 110]], [[1290, 163], 10, [-290, -70]], [[638, 330], 7, [-230, -150]], [[1242, 360], 8, [190, -20]]];
  scene('d4', 13.05, 17.2, () => {
    const el = $('#d4'); R.el = el; R.plane = $('.plane', el);
    R.ly = [$('.base', el), $('.side', el), $('.top', el), ...$$('.st', el), $('.chart', el), $('.table', el), $('.roles', el), $('.toast', el)];
    // layer order: base, side, top, st×4, chart, table, roles, toast
    R.lz = [0, 60, 80, 150, 165, 180, 195, 115, 95, 220, 300];
    R.vs = $$('.st .v', el); R.rows = $$('.tr', el); R.sw = $('.sw', el); R.chips = $$('.roles span', el);
    const line = $('.chart .ln', el), area = $('.chart .ar', el);
    const v = [40, 52, 48, 70, 66, 88, 84, 110, 104, 132, 150, 172], pts = v.map((y, i) => [i * (640 / 11) + 8, 280 - y * 1.4]);
    let d = `M${pts[0][0]},${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2; d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`; }
    line.setAttribute('d', d); area.setAttribute('d', d + ' L648,300 L8,300 Z');
    R.line = line; R.area = area; R.pt = $('.chart .pt', el); R.len = line.getTotalLength(); line.style.strokeDasharray = R.len;
    R.co = $$('.co', el); R.svg = $('.callouts', el);
    R.svg.innerHTML = CO.map(() => '<path fill="none" stroke="rgba(165,146,255,.8)" stroke-width="1.5"/><circle r="6" fill="#22d3ee"/>').join('');
    R.paths = $$('path', R.svg); R.dots = $$('circle', R.svg);
    R.kick = $('.title .kick', el); R.kickT = R.kick.textContent; R.h = $('.title .h', el); R.pp = $('.title p', el); R.url = $('.title .url', el);
  }, t => {
    const TQ = RS.TQ;
    const st = {
      a: K(t, [[13.3, 0], [14.25, 55, E.inOutCubic], [15.95, 50, E.inOutSine], [16.5, 0, E.inOutCubic]]),
      b: K(t, [[13.3, 0], [14.25, -35, E.inOutCubic], [15.95, -22, E.inOutSine], [16.5, 0, E.inOutCubic]]),
      s: K(t, [[13.3, 1], [14.25, .7, E.inOutCubic], [15.95, .74], [16.5, .8, E.inOutCubic]]),
      X: K(t, [[13.3, 0], [14.25, 270, E.inOutCubic], [15.95, 290], [16.5, 180, E.inOutCubic]]),
      Y: K(t, [[13.3, 0], [14.25, 110, E.inOutCubic], [15.95, 100], [16.5, 0, E.inOutCubic]]),
      W: -P(t, 16.58, .32, E.inExpo) * 2600,   // whip-pan out
    };
    R.el.style.opacity = P(t, 13.05, .1).toFixed(3);
    T(R.plane, { x: st.X + st.W, y: st.Y, rx: st.a, r: st.b, s: st.s });
    const n = R.ly.length;
    const ez = i => P(t, 13.35 + i * .04, .9, E.inOutCubic) * (1 - P(t, 15.9 + (n - i) * .03, .5, E.inOutCubic));
    R.ly.forEach((l, i) => T(l, { z: R.lz[i] * ez(i) + .01 }));
    // dashboard life
    R.vs.forEach((v, i) => { const p = P(TQ, 13.9 + i * .06, .9, E.outCubic); txt(v, v.dataset.r ? '₹' + (parseFloat(v.dataset.r) * p).toFixed(1) + 'L' : Math.round(+v.dataset.n * p).toLocaleString('en-IN')); });
    const lp = P(t, 14.2, 1.0, E.inOutCubic); R.line.style.strokeDashoffset = R.len * (1 - lp); R.area.style.opacity = P(t, 14.6, .5);
    const pt = R.line.getPointAtLength(R.len * lp); R.pt.setAttribute('cx', pt.x); R.pt.setAttribute('cy', pt.y); R.pt.style.opacity = lp > 0 ? 1 : 0;
    R.rows.forEach((r, i) => T(r, { x: (1 - P(t, 14.3 + i * .06, .5, E.outExpo)) * 40, o: P(t, 14.3 + i * .06, .15) }));
    const paid = TQ >= bt(33); R.sw.className = 'pl sw ' + (paid ? 'ok' : 'pd'); txt(R.sw, paid ? 'Paid' : 'Pending');
    R.chips.forEach((c, i) => T(c, { x: (1 - P(t, 14.45 + i * .08, .45, E.outBackS)) * -30, o: P(t, 14.45 + i * .08, .12) }));
    T(R.ly[10], { z: R.lz[10] * ez(10) + .01, s: P(t, 14.95, .45, E.outBackS) });
    // callouts, projected from the 3D layers
    const out = P(t, 15.85, .2);
    CO.forEach(([[ax, ay], li, [ox, oy]], i) => {
      const s0 = 14.35 + i * .15, p = P(t, s0, .32, E.inOutCubic), [sx, sy] = proj(ax, ay, R.lz[li] * ez(li), st);
      const lx = sx + ox, ly = sy + oy, co = R.co[i], w = co.offsetWidth, h = co.offsetHeight;
      const ex = ox < 0 ? lx + w / 2 : lx - w / 2;
      const d = `M${sx.toFixed(1)},${sy.toFixed(1)} L${(sx + ox * .45).toFixed(1)},${ly.toFixed(1)} L${ex.toFixed(1)},${ly.toFixed(1)}`;
      R.paths[i].setAttribute('d', d);
      const L = R.paths[i].getTotalLength(); R.paths[i].style.strokeDasharray = L; R.paths[i].style.strokeDashoffset = L * (1 - p);
      R.paths[i].style.opacity = R.dots[i].style.opacity = (P(t, s0, .05) * (1 - out)).toFixed(3);
      R.dots[i].setAttribute('cx', sx); R.dots[i].setAttribute('cy', sy);
      T(co, { x: lx - w / 2, y: ly - h / 2, s: lerp(.8, 1, P(t, s0 + .2, .3, E.outBackS)), o: P(t, s0 + .2, .12) * (1 - out) });
    });
    // title
    txt(R.kick, scr(R.kickT, P(TQ, 13.4, .45), 61));
    const hp = P(t, 13.4, .7, E.outExpo), tout = P(t, 15.95, .3, E.inCubic); fvs(R.h, lerp(50, 112, hp) + 38 * tout, lerp(300, 900, hp));
    T(R.h, { o: P(t, 13.4, .15) * (1 - tout), x: st.W - 60 * tout });
    T(R.pp, { y: (1 - P(t, 13.7, .6, E.outExpo)) * 24, o: P(t, 13.7, .25) * (1 - tout), x: st.W - 60 * tout });
    T(R.url, { o: P(t, 13.95, .25) * (1 - tout), x: st.W - 60 * tout });
    T(R.kick, { x: st.W - 60 * tout, o: 1 - tout });
  });
}

/* ───── E · KALAM ASHRAM — 3D CAROUSEL (16.875 – 20.625) ───── */
{
  const R = {};
  const RAD = 390;
  scene('e5', 16.55, 20.8, () => {
    const el = $('#e5'); R.whip = $('.whip', el); R.ring = $('.ring', el); R.dv = $$('.dv', el); R.sh = $$('.dv .shade', el);
    R.kick = $('.kick', el); R.kickT = R.kick.textContent; R.hi = $('.hi', el); R.en = $('.en', el); R.ds = $('.ds', el); R.stats = $$('.stats>div', el); R.c300 = $('.c300', el); R.chips = $$('.chips span', el); R.left = $('.left', el);
    R.tl = $('.dv-t .pg', el); R.ph = $('.dv-p .ka2', el);
  }, t => {
    const TQ = RS.TQ;
    T(R.whip, { x: lerp(2600, 0, P(t, 16.62, .5, E.outExpo)) });
    const rot = (t - 16.6) * 14 + [bt(38), bt(40), bt(42)].reduce((a, s) => a + 120 * P(t, s, .6, E.inOutCubic), 0) + 360 * P(t, 20.2, .45, E.inExpo);
    R.dv.forEach((d, i) => {
      const ang = i * 120 - rot, cs = Math.cos(ang * Math.PI / 180);
      d.style.transform = `rotateY(${ang.toFixed(2)}deg) translateZ(${RAD}px)`;
      R.sh[i].style.opacity = cl(.66 * (1 - cs) / 1.4).toFixed(3);
    });
    T(R.ring, { s: 1 - .75 * P(t, 20.22, .4, E.inExpo), o: 1 - P(t, 20.4, .2) });
    T(R.tl, { y: -P(t, bt(40) + .3, 1.2, E.inOutCubic) * 60 });
    // left column
    txt(R.kick, scr(R.kickT, P(TQ, 16.95, .45), 71));
    R.hi.style.clipPath = `inset(-30% ${((1 - P(t, 17.0, .6, E.inOutCubic)) * 100).toFixed(2)}% -30% 0)`;
    T(R.hi, { y: (1 - P(t, 17.0, .8, E.outExpo)) * 24 });
    [R.en, R.ds].forEach((e, i) => T(e, { y: (1 - P(t, 17.25 + i * .12, .6, E.outExpo)) * 24, o: P(t, 17.25 + i * .12, .2) }));
    R.stats.forEach((s, i) => T(s, { y: (1 - P(t, 17.6 + i * .08, .6, E.outExpo)) * 30, o: P(t, 17.6 + i * .08, .2) }));
    txt(R.c300, String(Math.round(300 * P(TQ, 17.7, .9, E.outCubic))));
    R.chips.forEach((c, i) => T(c, { s: P(t, 18.3 + i * .08, .45, E.outBackS), o: P(t, 18.3 + i * .08, .1) }));
    T(R.left, { x: -140 * P(t, 20.2, .35, E.inCubic), o: 1 - P(t, 20.25, .3) });
  });
}

/* ───── F · CODE → PIXELS → DEPLOY (20.625 – 24.375) ───── */
{
  const R = {};
  const CODE = [ // [start, dur, tokens]
    [20.72, .24, [['kw', 'import'], ['', ' { motion } '], ['kw', 'from'], ['st', ' "@studio/ui"'], ['pu', ';']]],
    [0, 0, []],
    [20.98, .22, [['kw', 'export default function'], ['fn', ' Home'], ['pu', '() {']]],
    [21.22, .1, [['', '  '], ['kw', 'return'], ['pu', ' (']]],
    [21.34, .1, [['', '    '], ['tg', '<Hero']]],
    [21.47, .34, [['', '      '], ['at', 'title'], ['pu', '='], ['st', '"Your business, online."']]],
    [21.9, .22, [['', '      '], ['at', 'theme'], ['pu', '='], ['st', '"aurora"']]],
    [22.25, .26, [['', '      '], ['at', 'cta'], ['pu', '='], ['st', '"Get started"']]],
    [22.56, .06, [['', '    '], ['tg', '/>']]],
    [22.64, .05, [['', '  '], ['pu', ');']]],
    [22.7, .03, [['pu', '}']]],
  ];
  const TERM = [[22.97, '<span class="pr">$</span> npm run deploy', .24], [23.28, '<span class="ok">✓</span> Built in 2.1s · 0 errors'], [23.42, '<span class="ok">✓</span> 42 images optimised'], [23.56, '<span class="ar">▸</span> Deploying to yourbrand.com<span class="pbar"><s></s></span>'], [24.0, '<span class="ok">✓ Live</span> · https://yourbrand.com <span style="color:var(--muted)">(11.8s)</span>']];
  const LINKS = [[5, 21.82, 'h2'], [6, 22.16, 'theme'], [7, 22.54, 'cta']];
  scene('f6', 20.55, 24.45, () => {
    const el = $('#f6'); R.el = el; const code = $('.code', el), stage = $('#stage');
    R.ed = $('.ed', el); R.pv = $('.pv', el);
    R.lines = CODE.map(([, , tk], i) => {
      const l = document.createElement('div'); l.className = 'l';
      l.innerHTML = `<span class="g">${i + 1}</span><span class="tx">${tk.map(([c, s]) => `<span class="${c}">${s.replace(/</g, '&lt;')}</span>`).join('')}</span>`;
      code.appendChild(l); return { tx: $('.tx', l), n: tk.reduce((a, [, s]) => a + s.length, 0) };
    });
    const probe = document.createElement('span'); probe.textContent = 'x'.repeat(20); code.appendChild(probe); R.cw = probe.getBoundingClientRect().width / 20; probe.remove();
    R.cr = document.createElement('i'); R.cr.className = 'cr'; R.cr.style.position = 'absolute'; code.appendChild(R.cr);
    R.cb = rel(code, stage);
    R.wait = $('.wait', el); R.theme = $('.theme', el); R.nav = $('.pv .nav', el); R.h2 = $$('.pv h2 .m>i', el); R.p = $('.pv p', el); R.cta = $('.pv .cta', el);
    R.ut = $('.ut', el); R.live = $('.live', el); R.term = $('.term', el); R.tl = $('.term .tl', el);
    const lh = $('.lh', el); R.lhN = []; R.lhC = []; const C = 2 * Math.PI * 22;
    ['Performance', 'Accessibility', 'SEO', 'Best practice'].forEach(nm => {
      const d = document.createElement('div');
      d.innerHTML = `<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="4"/><circle cx="26" cy="26" r="22" fill="none" stroke="#6ef2c4" stroke-width="4" stroke-linecap="round" transform="rotate(-90 26 26)" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><span class="n">0</span>${nm}`;
      lh.appendChild(d); R.lhC.push($$('circle', d)[1]); R.lhN.push($('.n', d));
    });
    R.lhW = $$('.lh>div', el); R.C = C;
    // connectors: from the end of a code line to what it creates in the preview
    const svg = $('.links', el);
    svg.innerHTML = `<defs><linearGradient id="lkG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a592ff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>` + LINKS.map(() => '<path fill="none" stroke="url(#lkG)" stroke-width="3" stroke-linecap="round"/><circle r="7" fill="#fff"/>').join('');
    R.lk = LINKS.map(([li, s, tgt], i) => {
      const x0 = R.cb.x + 92 + R.lines[li].n * R.cw + 16, y0 = R.cb.y + li * 46 + 23;
      const tr = tgt === 'theme' ? { x: 1410, y: 440, w: 0, h: 0 } : rel(tgt === 'h2' ? $('.pv h2', el) : R.cta, stage);
      const x1 = tr.x + (tgt === 'theme' ? 0 : -6), y1 = tr.y + (tgt === 'theme' ? 0 : tr.h * (tgt === 'h2' ? .3 : .5));
      const path = $$('path', svg)[i]; path.setAttribute('d', `M${x0},${y0} C${x0 + 160},${y0} ${x1 - 180},${y1} ${x1},${y1}`);
      const L = path.getTotalLength(); path.style.strokeDasharray = L;
      return { path, dot: $$('circle', svg)[i], L, s };
    });
  }, t => {
    const TQ = RS.TQ;
    R.el.style.opacity = (P(t, 20.5, .1) * (1 - P(t, 24.22, .15))).toFixed(3);
    const wp = P(t, 20.5, .55, E.outExpo);
    T(R.ed, { x: (1 - wp) * -160, ry: (1 - wp) * 18, o: wp }); T(R.pv, { x: (1 - wp) * 160, ry: (1 - wp) * -18, o: wp });
    T(R.el, { s: 1 - .05 * P(t, 24.18, .2, E.inCubic), b: 12 * P(t, 24.2, .17) });
    // typing
    let cur = 0;
    R.lines.forEach((l, i) => {
      const [s, d] = CODE[i], p = d ? P(TQ, s, d) : (TQ >= CODE[i + 1 < CODE.length ? i + 1 : i][0] ? 1 : 0);
      const n = Math.floor(l.n * p); l.tx.style.width = n * R.cw + 'px';
      if (d && TQ >= s) cur = i;
    });
    const cl_ = R.lines[cur], typing = TQ < CODE[cur][0] + CODE[cur][1];
    Object.assign(R.cr.style, { left: 92 + Math.floor(cl_.n * P(TQ, CODE[cur][0], CODE[cur][1])) * R.cw + 'px', top: cur * 46 + 8 + 'px' });
    R.cr.style.opacity = t > 20.65 && t < 22.95 && (typing || Math.floor(t / (B / 2)) % 2 === 0) ? 1 : 0;
    // preview reacts
    R.wait.style.opacity = 1 - P(t, 21.8, .2);
    R.h2.forEach((w, i) => rise(w, P(t, 21.82 + i * .08, .5, E.outExpo)));
    R.theme.style.clipPath = `circle(${(P(t, 22.16, .55, E.inOutCubic) * 1250).toFixed(0)}px at 50% 38%)`;
    T(R.nav, { o: P(t, 22.3, .25), y: (1 - P(t, 22.3, .4, E.outExpo)) * -12 });
    T(R.p, { o: P(t, 22.4, .25), y: (1 - P(t, 22.4, .5, E.outExpo)) * 16 });
    T(R.cta, { s: P(t, 22.54, .45, E.outBackS), o: P(t, 22.54, .1) });
    R.lk.forEach(k => {
      const p = P(t, k.s - .28, .3, E.inOutCubic), fade = 1 - P(t, k.s + .5, .25);
      k.path.style.strokeDashoffset = k.L * (1 - p); k.path.style.opacity = (P(t, k.s - .28, .03) * fade).toFixed(3);
      const pt = k.path.getPointAtLength(k.L * p); k.dot.setAttribute('cx', pt.x); k.dot.setAttribute('cy', pt.y); k.dot.style.opacity = (p > 0 && p < 1 ? 1 : 0) * fade;
    });
    // terminal → deploy → live
    T(R.term, { y: (1 - P(t, 22.86, .42, E.outExpo)) * 380, o: P(t, 22.86, .1) });
    html(R.tl, TERM.filter(([s]) => TQ >= s).map(([s, h, typ], i) => i === 0 && typ ? (TQ < s + typ ? h.slice(0, 26 + Math.floor((h.length - 26) * P(TQ, s, typ))) : h) : h).join('\n'));
    const pb = $('.pbar s', R.tl); if (pb) pb.style.width = P(t, 23.56, .4, E.inOutCubic) * 100 + '%';
    const live = TQ >= 24.0;
    txt(R.ut, live ? 'https://yourbrand.com' : 'localhost:3000');
    T(R.live, { s: P(t, 24.0, .3, E.outBackS), o: P(t, 24.0, .08) });
    R.lhW.forEach((w, i) => { const p = P(t, 23.6 + i * .06, .5, E.outCubic); T(w, { o: P(t, 23.6 + i * .06, .1), y: (1 - P(t, 23.6 + i * .06, .4, E.outExpo)) * 12 }); R.lhC[i].style.strokeDashoffset = R.C * (1 - p); txt(R.lhN[i], String(Math.round(100 * P(TQ, 23.6 + i * .06, .5, E.outCubic)))); });
  });
}

/* ───── G · DESIGN. DEVELOP. DELIVER. (24.375 – 26.25) ───── */
{
  const R = {};
  const WT = [bt(52), bt(52) + .625, bt(52) + 1.25, 26.3];
  scene('g7', 24.36, 26.35, () => {
    R.w = $$('#g7 .wd').map(w => ({ w, t: $('.t', w), e: $('.e', w), s: $('.s', w), st: $('.s', w).textContent }));
    R.sw = $('#g7 .sweep');
  }, t => {
    let cur = 0; while (cur < 2 && t >= WT[cur + 1]) cur++;
    R.w.forEach((o, i) => show(o.w, i === cur));
    const o = R.w[cur], lt = t - WT[cur];
    fvs(o.t, K(lt, [[0, 150], [.26, 84, E.outExpo], [.6, 100, E.inOutSine]]), lerp(300, 900, P(lt, 0, .25, E.outExpo)));
    fvs(o.e, K(lt, [[0, 150], [.26, 84, E.outExpo], [.6, 100, E.inOutSine]]), 900);
    const dead = cur === 2 ? P(t, 26.02, .26, E.inCubic) : 0;
    T(o.t, { s: lerp(1.22, 1, P(lt, 0, .35, E.outExpo)) * (1 + .5 * dead), b: 22 * dead, o: 1 - dead });
    T(o.e, { s: lerp(1.7, 1.14, P(lt, 0, .5, E.outExpo)), o: .9 * (1 - dead) });
    txt(o.s, scr(o.st, P(RS.TQ, WT[cur] + .08, .35), 80 + cur));
    T(o.s, { o: 1 - dead });
    T(R.sw, { sx: P(lt, .05, .35, E.outExpo) * (1 - P(lt, .45, .15)) });
  });
}

/* ───── H · OUTRO (26.25 – 30) ───── */
{
  const R = {};
  scene('h8', 26.2, 30.01, () => {
    const el = $('#h8'); R.nm = $('.nm', el); R.sub = $('.sub', el); R.cta = $('.cta', el); R.ct = $('.ct', el); R.orb = $('.orb', el); R.od = $('.orb .od', el); R.pl = $$('.pulse i', el);
  }, t => {
    const TQ = RS.TQ;
    T(R.nm, { o: P(t, 26.95, .4), s: lerp(1.03, 1, P(t, 26.95, 1, E.outCubic)) });
    R.orb.style.opacity = (P(t, 27.1, .6) * .9).toFixed(3);
    const a = t * 1.1; R.od.setAttribute('cx', (960 + 820 * Math.cos(a)).toFixed(1)); R.od.setAttribute('cy', (420 + 190 * Math.sin(a)).toFixed(1));
    txt(R.sub, scr('FULL-STACK DEVELOPER  —  WEBSITES · APPS · ANYTHING', P(TQ, 27.25, .6), 91));
    T(R.cta, { s: lerp(.8, 1, P(t, 27.6, .55, E.outBackS)), o: P(t, 27.6, .12) });
    R.cta.style.setProperty('--a', `${((t * 140) % 360).toFixed(1)}deg`);
    html(R.ct, TQ < 27.9 ? '' : `${scr('avanishjha.dev', P(TQ, 27.9, .45), 92)}<span>·</span>${scr('avanishjha2011@gmail.com', P(TQ, 28.0, .5), 93)}`);
    [26.25, bt(58), bt(60)].forEach((s, i) => { const p = P(t, s, 1.4, E.outCubic), r = lerp(20, 700, p); Object.assign(R.pl[i].style, { width: 2 * r + 'px', height: 2 * r + 'px', left: -r + 'px', top: -r + 'px', opacity: t < s ? 0 : ((1 - p) * .7).toFixed(3) }); });
  });
}

Reel.start({
  W: 1920, H: 1080, deva: 'Rozha', accent: '#7c5cff', audio: '../assets/showreel-vol2-audio.m4a',
  fonts: ['400 20px "Space Grotesk"', '600 20px "Space Grotesk"', '700 20px "Space Grotesk"', '900 20px Anybody', '400 20px "JetBrains Mono"', '400 20px "Rozha One"'],
  fx: {
    hud: false, wipes: [], cover: null,
    shake: [[3.75, 6], [bt(16), 8], [bt(28), 6], [bt(36), 10], [bt(52), 14], [bt(52) + .625, 12], [bt(52) + 1.25, 12], [bt(56), 8], [bt(60), 5]],
    flash: [[3.75, .14, '#7c5cff'], [bt(28), .1, '#ffffff'], [bt(52), .18, '#ffffff'], [bt(56), .14, '#22d3ee']],
  },
});
})();
