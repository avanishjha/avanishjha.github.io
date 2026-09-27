/* AVANISH JHA — SHOWREEL 2026 · VOL. 04
   Keynote look (white / black / one blue) × high-energy motion graphics.
   128 BPM: beat = 0.46875s, bar = 1.875s. Sections sit on the same bars as Vol. 02,
   so the score (audio4.py) drops where the picture does. */
(() => {
'use strict';
const { RS, E, cl, lerp, P, bump, decay, K, T, rise, show, txt, chars, scene, $, $$ } = Reel;
const { WS, DB, KA, lap, tab, pho, shadow, place, chart, count } = Dev;
const B = 60 / 128, bt = n => n * B;
const slam = (el, t, s, from = 1.3) => { const p = P(t, s, .32, E.outExpo); T(el, { s: lerp(from, 1, p), o: P(t, s, .06), b: (1 - p) * 14 }); };
const up = (el, t, s, d = 60, dur = .6) => { const p = P(t, s, dur, E.outExpo); T(el, { y: (1 - p) * d, o: P(t, s, .15) }); };

/* ───── A · loading line → one word per beat (0 – 3.75) ───── */
{ const R = {};
  scene('a', 0, 3.76, () => { R.p = $$('#a .panel'); R.line = $('#a .line'); R.pct = $('#a .pct'); R.w = $$('#a .big'); R.ix = $$('#a .idx'); }, t => {
    const W = [0, bt(4), bt(5), bt(6), bt(7), 3.76];
    let k = 0; while (k < 4 && t >= W[k + 1]) k++;
    R.p.forEach((p, i) => show(p, i === k));
    if (k === 0) {
      const p = P(t, .15, 1.45, E.inOutCubic), fat = P(t, 1.62, .25, E.inExpo);
      T(R.line, { sx: p, sy: 1 + fat * 280 }); R.line.style.background = fat > .5 ? '#fbfbfd' : '#0071e3';
      txt(R.pct, `BUILDING  ${String(Math.round(100 * P(RS.TQ, .15, 1.45, E.inOutCubic))).padStart(3, '0')}%`);
      T(R.pct, { o: P(t, .2, .2) * (1 - P(t, 1.6, .1)) });
    } else {
      slam(R.w[k - 1], t, W[k], 1.35); T(R.ix[k - 1], { o: P(t, W[k] + .05, .1) * .6 });
      if (k === 4) T(R.w[3], { s: 1 - .2 * P(t, 3.55, .2, E.inExpo), o: 1 - P(t, 3.6, .15), b: 10 * P(t, 3.55, .2) });
    }
  }); }

/* ───── B · headline → service grid (3.75 – 7.5) ───── */
{ const R = {};
  scene('b', 3.7, 7.55, () => { const el = $('#b'); R.el = el; R.hl = $('.hl', el); R.w = $$('.hl .m>i', el); R.ul = $('.ul', el); R.gc = $$('.gc', el);
    R.ic = $$('.gc svg', el).map(s => [...s.children].map(c => { const L = c.getTotalLength ? c.getTotalLength() : 200; c.style.strokeDasharray = L; return [c, L]; }));
    const im = $('.hl .im', el).parentElement.getBoundingClientRect(); Object.assign(R.ul.style, { left: im.left + 'px', top: im.bottom - 18 + 'px', width: im.width - 20 + 'px' }); }, t => {
    R.el.style.opacity = 1 - P(t, 7.28, .2);
    R.w.forEach((w, i) => rise(w, P(t, 3.75 + i * B / 2, .45, E.outExpo)));
    const sh = P(t, bt(11.5), .5, E.inOutExpo);
    T(R.hl, { y: lerp(0, -265, sh), s: lerp(1, .56, sh) });
    T(R.ul, { sx: P(t, bt(10.3), .35, E.outExpo) * (1 - sh), o: 1 - sh });
    R.gc.forEach((g, i) => { const s = bt(12) + i * .07, p = P(t, s, .55, E.outExpo);
      T(g, { rx: lerp(-80, 0, p), y: (1 - p) * 120 - 40 * P(t, 7.1, .35, E.inCubic), o: P(t, s, .1), s: 1 - .15 * P(t, 7.1, .35, E.inCubic) });
      R.ic[i].forEach(([c, L], j) => c.style.strokeDashoffset = L * (1 - P(t, s + .15 + j * .06, .5, E.inOutCubic))); });
  }); }

/* ───── C · laptop flies in, words roll, zoom-through, one build → every screen (7.5 – 13.125) ───── */
{ const R = {};
  scene('c', 7.45, 13.2, () => { const el = $('#c'); R.el = el; const dv = $('.dev', el);
    R.kt = $('.kt', el); R.ktm = $('.kt .m>i', el); R.roll = $$('.roll span', el); R.cap = $('.cap .m>i', el); R.capw = $('.cap', el); R.cur = $('.cur', el); R.rip = $('.rip', el); R.iris = $('.iris', el);
    R.sh = shadow(dv, 860, 930, 1000, 60);
    R.l = lap(dv, 1280, 800, WS()); place(R.l, 780, 230, .78); R.site = $('.ws', R.l);
    R.l2 = lap(dv, 1280, 800, WS()); place(R.l2, 560, 330, .56); R.t2 = tab(dv, 1100, 780, DB()); place(R.t2, 200, 470, .4); R.p2 = pho(dv, 380, 800, KA()); place(R.p2, 1330, 420, .56);
    count(R.t2, 1); chart(R.t2).p.style.strokeDashoffset = 0; }, t => {
    // act 1: laptop spins in, headline + rolling word
    const a1 = 1 - P(t, bt(22), .25);
    const lp = P(t, 7.5, .8, E.outExpo), zp = P(t, bt(22), .5, E.inExpo);
    T(R.l, { x: (1 - lp) * 700, ry: lerp(-75, -8, lp) + 8 * P(t, 8.4, 1.5, E.inOutSine), s: .78 * lerp(.7, 1, lp) * lerp(1, 3.2, zp), o: P(t, 7.5, .1) * (1 - P(t, bt(22) + .35, .12)) });
    R.l.style.transformOrigin = '50% 45%';
    R.sh.style.opacity = lp * a1;
    rise(R.ktm, P(t, 7.6, .6, E.outExpo));
    const roll = K(t, [[bt(18), 0], [bt(19), 1, E.outExpo], [bt(20), 1], [bt(21), 2, E.outExpo]]);
    R.roll.forEach(r => T(r, { y: -roll * r.offsetHeight }));
    T(R.kt, { o: (P(t, 7.6, .15)) * a1, x: -120 * zp });
    T(R.site, { y: -P(t, 8.6, 1.4, E.inOutCubic) * 330 });
    const cx = K(t, [[8.6, 1700], [9.3, 1060, E.inOutCubic], [9.8, 1060], [10.1, 1200, E.inOutCubic]]), cy = K(t, [[8.6, 950], [9.3, 500, E.inOutCubic], [9.8, 500], [10.1, 620, E.inOutCubic]]);
    T(R.cur, { x: cx, y: cy, s: 1 - .15 * bump(t, bt(20.5), .12), o: P(t, 8.6, .1) * (1 - P(t, 10.0, .15)) });
    const rp = P(t, bt(20.6), .5, E.outCubic); T(R.rip, { x: 1076, y: 516, s: 1 + rp * 3, o: t > bt(20.6) ? 1 - rp : 0 });
    // act 2: three devices spin into a lineup
    [R.l2, R.t2, R.p2].forEach((d, i) => { const s = bt(23) + i * .12, p = P(t, s, .7, E.outExpo);
      T(d, { ry: lerp(90, 0, p), y: (1 - p) * 80, s: d._s * lerp(.8, 1, p) * lerp(1, 1.03, P(t, bt(23), 2)), o: P(t, s, .1) }); });
    rise(R.cap, P(t, bt(23.5), .6, E.outExpo)); T(R.capw, { o: t > bt(22.9) ? 1 : 0 });
    // iris to black
    const ir = P(t, bt(27), .45, E.inOutQuart); T(R.iris, { s: ir * 480 }); R.iris.style.opacity = ir > 0 ? 1 : 0;
  }); }

/* ───── D · Fifty Villagers: tablet slams in, huge numbers orbit (13.125 – 16.875) ───── */
{ const R = {};
  scene('d', 13.1, 16.9, () => { const el = $('#d'); R.el = el; const dv = $('.dev', el);
    R.tb = tab(dv, 1100, 780, DB()); place(R.tb, 520, 60, .78); R.c = chart(R.tb);
    R.n = [$('.n1', el), $('.n2', el), $('.n3', el)]; R.ttl = $$('.ttl>*', el); R.svg = $('svg.lk', el);
    R.svg.innerHTML = [[420, 260, 620, 280], [1550, 700, 1300, 590], [1510, 220, 1330, 240]].map(([a, b, c, d]) => `<path d="M${a},${b} L${c},${d}" stroke="#0071e3" stroke-width="2.5" fill="none"/><circle cx="${c}" cy="${d}" r="7" fill="#0071e3"/>`).join('');
    R.ln = $$('path', R.svg).map(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; return [p, L]; }); R.dt = $$('circle', R.svg); }, t => {
    const p = P(t, 13.125, .7, E.outExpo), W = -2400 * P(t, 16.55, .32, E.inExpo);
    T(R.tb, { x: W, y: (1 - p) * 700, rx: lerp(55, 6, p) - 4 * P(t, 14, 2.5, E.inOutSine), s: .78 * lerp(1, 1.04, P(t, 13.1, 3.5)), o: P(t, 13.125, .08) });
    R.tb.style.transformOrigin = '50% 100%';
    count(R.tb, P(RS.TQ, 13.6, 1.1, E.outCubic)); R.c.p.style.strokeDashoffset = R.c.L * (1 - P(t, 13.7, 1.3, E.inOutCubic));
    const V = [[1247, ''], [4.2, 'r'], [28, '']];
    R.n.forEach((n, i) => { const s = bt(30) + i * B, q = P(RS.TQ, s, .9, E.outCubic);
      n.firstChild.textContent = V[i][1] ? '₹' + (V[i][0] * q).toFixed(1) + 'L' : Math.round(V[i][0] * q).toLocaleString('en-IN');
      slam(n, t, s, 1.5); T(n, { x: W, s: lerp(1.5, 1, P(t, s, .32, E.outExpo)), o: P(t, s, .06), b: (1 - P(t, s, .32, E.outExpo)) * 14 });
      const [pa, L] = R.ln[i]; pa.style.strokeDashoffset = L * (1 - P(t, s + .15, .35, E.inOutCubic)); R.dt[i].style.opacity = P(t, s + .45, .1); });
    T(R.svg, { x: W });
    R.ttl.forEach((e, i) => { up(e, t, bt(32) + i * .1, 50); T(e, { x: W, y: (1 - P(t, bt(32) + i * .1, .6, E.outExpo)) * 50, o: P(t, bt(32) + i * .1, .15) }); });
  }); }

/* ───── E · Kalam Ashram: phone spins in, name types, chips pop on the beat (16.875 – 20.625) ───── */
{ const R = {};
  scene('e', 16.55, 20.7, () => { const el = $('#e'); R.el = el; const dv = $('.dev', el);
    R.sh = shadow(dv, 470, 960, 480, 50); R.ph = pho(dv, 380, 800, KA()); place(R.ph, 520, 140); R.ka = $('.ka', R.ph);
    R.ttl = $('.ttl', el); R.ey = $('.ttl .ey', el); R.nm = chars($('.ttl .nm', el), 'Kalam Ashram'); R.ln = $('.ttl .ln', el); R.ch = $$('.chips span', el); R.st = $$('.sts>div', el); R.c300 = $('.c300', el); }, t => {
    const Wi = 2400 * (1 - P(t, 16.6, .5, E.outExpo)), out = P(t, bt(43), .45, E.inExpo);
    const p = P(t, 16.8, .9, E.outExpo);
    T(R.ph, { x: Wi, ry: lerp(-200, 0, p) + 540 * out, y: (1 - p) * 100, s: 1 - .4 * out, o: P(t, 16.8, .1) * (1 - out) });
    R.sh.style.opacity = p * (1 - out);
    T(R.ka, { y: -P(t, 18.4, 1.6, E.inOutCubic) * 150 });
    T(R.ttl, { x: Wi + 200 * out, o: 1 - out });
    up(R.ey, t, 17.0, 30);
    R.nm.forEach((c, i) => rise(c, P(t, 17.1 + i * .03, .5, E.outExpo)));
    up(R.ln, t, 17.6, 30);
    R.ch.forEach((c, i) => T(c, { s: P(t, bt(38) + i * B / 2, .35, E.outBackS), o: P(t, bt(38) + i * B / 2, .06) }));
    R.st.forEach((s, i) => up(s, t, bt(40) + i * .12, 60));
    txt(R.c300, String(Math.round(300 * P(RS.TQ, bt(40), .9, E.outCubic))));
  }); }

/* ───── F · gauges → Fast. Secure. Found on Google. (20.625 – 24.375) ───── */
{ const R = {};
  const LB = ['Performance', 'SEO', 'Accessibility'], C = 2 * Math.PI * 140;
  scene('f', 20.6, 24.4, () => { const el = $('#f'); R.el = el; R.w = $('.w', el);
    R.rg = LB.map((l, i) => { const d = document.createElement('div'); d.className = 'rg'; d.style.left = 560 + i * 400 + 'px'; d.style.top = '400px';
      d.innerHTML = `<svg viewBox="0 0 320 320"><circle cx="160" cy="160" r="140" fill="none" stroke="#1f1f23" stroke-width="18"/><circle class="pc" cx="160" cy="160" r="140" fill="none" stroke="#0071e3" stroke-width="18" stroke-linecap="round" transform="rotate(-90 160 160)" stroke-dasharray="${C}"/></svg><div class="n">0</div><div class="l">${l}</div>`;
      $('.rgs', el).appendChild(d); return { d, pc: $('.pc', d), n: $('.n', d) }; }); }, t => {
    R.el.style.opacity = 1 - P(t, 24.2, .15);
    R.rg.forEach((g, i) => { const s = bt(44) + i * B, c = P(t, s + .1, 1.1, E.outCubic);
      slam(g.d, t, s, 1.6); g.pc.style.strokeDashoffset = C * (1 - c); txt(g.n, String(Math.round(100 * P(RS.TQ, s + .1, 1.1, E.outCubic))));
      T(g.d, { s: lerp(1.6, 1, P(t, s, .32, E.outExpo)) * (1 + .08 * bump(t, s + 1.2, .25)), o: P(t, s, .06), y: -60 * P(t, bt(48) - .2, .4, E.inOutCubic) }); });
    const WS_ = [[bt(48), 'Fast.'], [bt(49), 'Secure.'], [bt(50), 'Found on Google.']];
    let cur = -1; WS_.forEach(([s], i) => { if (t >= s) cur = i; });
    txt(R.w, cur < 0 ? '' : WS_[cur][1]); if (cur >= 0) slam(R.w, t, WS_[cur][0], 1.4);
  }); }

/* ───── G · Design. Develop. Deliver. (24.375 – 26.25) ───── */
{ const R = {};
  scene('g', 24.37, 26.3, () => { R.p = $$('#g .panel'); R.w = $$('#g .big'); }, t => {
    const W = [bt(52), bt(52) + .625, bt(52) + 1.25, 26.3];
    let k = 0; while (k < 2 && t >= W[k + 1]) k++;
    R.p.forEach((p, i) => show(p, i === k)); slam(R.w[k], t, W[k], 1.4);
    if (k === 2) T(R.w[2], { s: 1 + 2.5 * P(t, 25.95, .3, E.inExpo), o: 1 - P(t, 26.1, .15) });
  }); }

/* ───── H · end card (26.25 – 30) ───── */
{ const R = {};
  scene('h', 26.2, 30.01, () => { const el = $('#h'); R.nm = chars($('.nm', el), 'Avanish Jha'); R.sub = $('.sub', el); R.d = $$('.dotc', el); R.pill = $('.pill', el); R.ct = $('.ct', el); }, t => {
    R.nm.forEach((c, i) => rise(c, P(t, 26.3 + i * .035, .7, E.outExpo)));
    up(R.sub, t, 26.9, 30);
    const from = [[200, 200], [1720, 300], [960, 1000]];
    R.d.forEach((d, i) => { const p = P(t, 26.4 + i * .08, .9, E.inOutCubic), mg = P(t, 27.35, .3, E.inOutCubic);
      T(d, { x: lerp(from[i][0], 960, p), y: lerp(from[i][1], 665, p), s: 1 + .5 * bump(t, 27.2, .3), o: P(t, 26.4, .1) * (1 - mg) }); });
    const pp = P(t, 27.35, .55, E.outBackS); T(R.pill, { sx: lerp(.15, 1, pp), sy: lerp(.8, 1, P(t, 27.35, .35, E.outExpo)), o: P(t, 27.33, .05) });
    up(R.ct, t, 27.9, 20);
  }); }

Reel.start({ W: 1920, H: 1080, accent: '#0071e3', audio: '../assets/showreel-vol4-audio.m4a',
  fonts: ['400 20px Inter', '500 20px Inter', '600 20px Inter', '700 20px Inter', '400 20px "JetBrains Mono"'],
  fx: { hud: false, wipes: [], cover: null,
    shake: [[bt(8), 6], [bt(16), 8], [bt(28), 8], [bt(36), 6], [bt(52), 12], [bt(52) + .625, 10], [bt(52) + 1.25, 10], [bt(56), 6]],
    flash: [[bt(8), .12, '#ffffff'], [bt(52), .12, '#ffffff']] } });
})();
