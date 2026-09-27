/* AVANISH JHA — SHOWREEL 2026 · VOL. 05
   Studio-portfolio film: the patterns of award-winning sites, played as one 30s take —
   preloader counter, curtain reveal, kinetic serif/grotesk headline, rotating badge,
   custom cursor, crossing marquees, bento grid, FLIP expand, horizontal gallery with
   velocity skew, outline-to-fill type, section slide-overs, magnetic CTA.
   128 BPM: beat = 0.46875s, bar = 1.875s (score: audio5.py). */
(() => {
'use strict';
const { RS, E, cl, lerp, P, bump, K, T, rise, show, txt, chars, scene, $, $$ } = Reel;
const B = 60 / 128, bt = n => n * B;
const INK = '#0d0d0c', PAPER = '#f1efe9';
const riseAll = (cs, t, s, st = .028, d = .8, from = 115) => cs.forEach((c, i) => rise(c, P(t, s + i * st, d, E.outExpo), from));
const up = (el, t, s, d = 40, dur = .7) => { const p = P(t, s, dur, E.outExpo); T(el, { y: (1 - p) * d, o: P(t, s, .25) }); };
const clipUp = (el, p, r = 30) => { el.style.clipPath = p >= 1 ? 'none' : `inset(${(100 * (1 - p)).toFixed(2)}% 0 0 0 round ${r}px)`; };
const draw = el => { const L = el.getTotalLength(); el.style.strokeDasharray = L; return p => el.style.strokeDashoffset = (L * (1 - p)).toFixed(2); };

/* ───── A · preloader: odometer 000 → 100 on the beat, then the curtain lifts (0 – 3.75) ───── */
{ const R = {};
  const V = [[0, 0], [bt(1), 9], [bt(2), 24], [bt(3), 38], [bt(4), 57], [bt(5), 71], [bt(6), 88], [bt(6.5), 100]];
  const WORDS = ['Strategy', 'Design', 'Code', 'Motion', 'Launch', 'Websites', 'Apps'];
  scene('a', 0, 3.86, () => { const el = $('#a'); R.cu = $('.curtain', el); R.lb = $$('.lbl', el); R.bar = $('.bar', el); R.cyc = $('.cyc', el);
    const odo = $('.odo', el); R.col = [];
    for (let k = 0; k < 3; k++) { const c = document.createElement('span'); c.className = 'col'; const s = document.createElement('span'); s.style.display = 'block';
      for (let j = 0; j < 20; j++) { const i = document.createElement('i'); i.textContent = j % 10; s.appendChild(i); } c.appendChild(s); odo.appendChild(c); R.col.push(s); }
    const pc = document.createElement('span'); pc.className = 'pc'; pc.textContent = '%'; odo.appendChild(pc); R.pc = pc; R.odo = odo;
    R.cyc.innerHTML = '<span class="m"><i></i></span>'; R.cw = $('.cyc i', el); }, t => {
    let j = 0; while (j < V.length - 1 && t >= V[j + 1][0]) j++;
    const v0 = V[Math.max(0, j - 1)][1], v1 = V[j][1], p = j === 0 ? 1 : P(t, V[j][0], .36, E.outExpo);
    [100, 10, 1].forEach((m, k) => { const d0 = Math.floor(v0 / m) % 10, d1 = Math.floor(v1 / m) % 10; const pos = d0 + ((d1 - d0 + 10) % 10) * p;
      R.col[k].style.transform = `translateY(${(-pos * 330).toFixed(1)}px)`; });
    R.col[0].parentElement.style.opacity = v1 >= 100 || (j === V.length - 1) ? 1 : .18;
    T(R.bar, { sx: lerp(v0, v1, p) / 100 });
    // one word per beat, masked
    const wi = Math.min(WORDS.length - 1, Math.floor(t / B)); txt(R.cw, WORDS[wi]); rise(R.cw, P(t, wi * B, .3, E.outExpo), 110);
    R.lb.forEach((l, i) => T(l, { o: P(t, .1 + i * .08, .3) }));
    // exit: digits leave, curtain lifts with a curved hem
    const ex = P(t, bt(7), .32, E.inOutCubic); T(R.odo, { y: -ex * 360 }); T(R.cyc, { o: 1 - ex });
    const cu = P(t, 3.3, .52, E.inOutQuart), hem = Math.sin(Math.PI * Math.min(1, cu * 1.15)) * 260;
    R.cu.style.transform = `translateY(${(-1200 * cu).toFixed(1)}px)`;
    R.cu.style.borderRadius = `0 0 50% 50% / 0 0 ${hem.toFixed(1)}px ${hem.toFixed(1)}px`;
  }); }

/* ───── B · hero: kinetic headline, badge, cursor → lime flood (3.3 – 7.5) ───── */
{ const R = {};
  scene('b', 3.28, 7.5, () => { const el = $('#b'); R.el = el; R.hero = $('.hero', el);
    R.c1 = chars($('.w1', el), 'Digital'); R.c2 = chars($('.l2', el), 'experiences'); R.c3 = chars($('.w3', el), 'that'); R.c4 = chars($('.mv', el), 'move.');
    R.pill = $('.pill', el); R.pv = $('.pv', el); R.scr = draw($('.scrib path', el)); R.sp = $('.scrib', el);
    R.bd = $('.badge', el); R.bs = $('.badge svg', el); R.ft = $('.foot', el); R.fp = $$('.foot>*', el); }, t => {
    const par = 1 - P(t, 3.34, .9, E.outQuart);
    T(R.hero, { y: par * 260, s: 1 + .06 * P(t, 6.65, .7, E.inExpo) }); R.hero.style.transformOrigin = '800px 620px';
    riseAll(R.c1, t, 3.45); riseAll(R.c2, t, 3.62, .026); riseAll(R.c3, t, 3.82); riseAll(R.c4, t, 3.92, .03);
    R.pill.style.width = (380 * P(t, 4.1, .8, E.outExpo)).toFixed(1) + 'px';
    T(R.pv, { y: -70 * P(t, 4.7, 1.6, E.inOutCubic) });
    R.scr(P(t, bt(10.5), .5, E.inOutCubic)); R.sp.style.opacity = t > bt(10.5) ? 1 : 0;
    const hov = P(t, 5.78, .3, E.outExpo) * (1 - P(t, 6.1, .3, E.inOutCubic));
    T(R.bd, { y: par * 200, s: E.outBack(P(t, 4.3, .7)) * (1 + .12 * hov) });
    R.bs.style.transform = `rotate(${(t * 40 + 90 * E.inOutCubic(P(t, 5.78, .6))).toFixed(2)}deg)`;
    up(R.fp[0], t, 4.5, 30); up(R.fp[1], t, 4.62, 30);
    R.ft.style.borderTopColor = `rgba(13,13,12,${(.14 * P(t, 4.4, .4)).toFixed(3)})`;
  }); }

/* ───── C1 · crossing marquees on lime (7.5 – 9.4) ───── */
{ const R = {};
  const ITEMS = [['Websites', 0], ['web apps', 1], ['Online stores', 0], ['dashboards', 1], ['Landing pages', 0], ['portals', 1]];
  const line = () => [0, 1, 2].map(() => ITEMS.map(([w, s]) => (s ? `<span class="serif">${w}</span>` : w) + '<b>✦</b>').join('')).join('');
  scene('c1', 7.3, 9.46, () => { const el = $('#c1'); R.ba = $('.ba', el); R.bb = $('.bb', el); R.ta = $('.ba .tr', el); R.tb = $('.bb .tr', el);
    R.ta.innerHTML = line(); R.tb.innerHTML = line(); }, t => {
    const ia = P(t, 7.48, .6, E.outExpo), ib = P(t, 7.6, .6, E.outExpo), ex = P(t, 9.08, .34, E.inOutExpo);
    const kick = k => Math.floor((t - 7.5) / B) + E.outExpo(cl(((t - 7.5) / B) % 1 * 2.2));    // stepped surge on each beat
    T(R.ta, { x: -300 - 170 * kick() - 90 * (t - 7.5), o: 1 - P(t, 9.08, .15) });
    T(R.tb, { x: -2600 + 170 * kick() + 90 * (t - 7.5), o: 1 - P(t, 9.0, .15) });
    R.ba.style.transform = `translate(${((1 - ia) * 2400).toFixed(1)}px,${(175 * ex).toFixed(1)}px) rotate(${(-6 * (1 - ex)).toFixed(3)}deg) scaleY(${(1 + 4.3 * ex).toFixed(4)})`;
    R.bb.style.transform = `translate(${((ib - 1) * 2400 + 2600 * P(t, 8.95, .4, E.inExpo)).toFixed(1)}px,0) rotate(5deg)`;
  }); }

/* ───── C2 · bento grid → hover tilt → FLIP expand to full screen (9.44 – 13.1) ───── */
{ const R = {};
  const X0 = 640, Y0 = 150, CW = 380, RH = 270, G = 20;
  const RECT = [[0, 0, 2, 2], [2, 0, 1, 1], [2, 1, 1, 1], [0, 2, 1, 1], [1, 2, 1, 1], [2, 2, 1, 1]].map(([c, r, w, h]) => [X0 + c * (CW + G), Y0 + r * (RH + G), w * CW + (w - 1) * G, h * RH + (h - 1) * G]);
  const HB = [.34, .5, .42, .62, .55, .7, .8, .9, 1];
  scene('c2', 9.44, 13.12, () => { const el = $('#c2'); R.el = el; R.tl = $$('.tile', el); R.in = $$('.tile .in', el);
    R.tl.forEach((d, i) => { const [x, y, w, h] = RECT[i]; Object.assign(d.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); });
    R.hd = $('.hd', el); R.k = $('.hd .k', el); R.t1 = chars($('.t1', el), 'What I'); R.t2 = chars($('.t2', el), 'build.'); R.hp = $('.hd p', el); R.n = $('.hd .n', el);
    R.mk = $('.mk', el); R.mkc = $$('.mk>*:not(.mk-nav)', el); R.lab1 = $('.t-web .lab', el);
    R.tg = $$('.tg>div', el).map(d => [$('i', d), $('b', d)]);
    R.cart = $('.pr em', el); R.bars = $$('.bars i', el); R.seo = $('.t-seo .big', el);
    R.pc = draw($('.pay circle', el)); R.pk = draw($('.pay path', el)); }, t => {
    // header
    T(R.k, { o: P(t, 9.5, .3) }); riseAll(R.t1, t, 9.5, .03); riseAll(R.t2, t, 9.66, .03); up(R.hp, t, 9.9, 24); up(R.n, t, 10.05, 24);
    const gone = P(t, 12.12, .3, E.inCubic);
    T(R.hd, { o: 1 - gone, x: -60 * gone });
    // tiles reveal on the 8ths
    R.tl.forEach((d, i) => { const s = 9.46 + i * B / 2, p = P(t, s, .75, E.outExpo);
      clipUp(d, p); T(R.in[i], { s: lerp(1.25, 1, p), y: (1 - p) * 60 });
      if (i) { T(d, { o: 1 - gone, s: 1 - .08 * gone }); } });
    // inner micro-animations
    R.mkc.forEach(c => T(c, { y: -150 * P(t, 10.5, 1.4, E.inOutCubic) }));
    R.tg.forEach(([tr, kn], i) => { const p = P(t, 10.25 + i * .22, .35, E.outExpo); T(kn, { x: 30 * p }); tr.style.background = p > .5 ? '#d4ff3f' : '#3a3a38'; kn.style.background = p > .5 ? INK : PAPER; });
    const added = t >= 10.95; txt(R.cart, added ? 'Added ✓' : 'Add to cart'); R.cart.style.background = added ? '#d4ff3f' : PAPER;
    T(R.cart, { s: 1 + .12 * bump(t, 10.95, .25) });
    R.bars.forEach((b, i) => T(b, { sy: HB[i] * P(t, 10.1 + i * .05, .7, E.outExpo) + .02 }));
    txt(R.seo, String(Math.round(100 * P(RS.TQ, 10.3, 1.1, E.outCubic))));
    R.pc(P(t, 10.5, .6, E.inOutCubic)); R.pk(P(t, 10.95, .35, E.outCubic));
    // hover tilt on the big tile, then FLIP expand
    const d = R.tl[0], hov = P(t, 11.45, .4, E.outCubic) * (1 - P(t, 12.15, .2)), ex = P(t, bt(26), .72, E.inOutExpo);
    const [x, y, w, h] = RECT[0];
    Object.assign(d.style, { left: lerp(x, 0, ex) + 'px', top: lerp(y, 0, ex) + 'px', width: lerp(w, 1920, ex) + 'px', height: lerp(h, 1080, ex) + 'px', borderRadius: lerp(30, 0, ex) + 'px' });
    const wob = Math.sin(t * 3.1) * hov;
    d.style.transform = hov > .001 ? `perspective(1400px) rotateX(${(-4 * hov + wob).toFixed(3)}deg) rotateY(${(6 * hov).toFixed(3)}deg) scale(${(1 + .02 * hov).toFixed(4)})` : 'none';
    T(R.mk, { o: 1 - P(t, 12.2, .3), s: 1 - .05 * P(t, 12.2, .3) }); T(R.lab1, { o: 1 - P(t, 12.15, .2) });
  }); }

/* ───── D · selected work — horizontal gallery, velocity skew, stickers (12.95 – 20.7) ───── */
{ const R = {};
  const X = t => K(t, [[14.0, 1800], [14.9, 0, E.outExpo], [16.45, 0], [17.12, -1500, E.inOutExpo]]);
  scene('d', 12.95, 20.72, () => { const el = $('#d'); R.ttl = $('.ttl', el); R.w1 = chars($('.ttl .w1', el), 'Selected'); R.w2 = chars($('.ttl .w2', el), 'work'); R.sup = $('.ttl sup', el);
    R.tr = $('.track', el); R.cd = $$('.card', el); R.site = $$('.site', el); R.stk = $$('.stk', el); R.sn = $('.p1 .sn', el); R.meta = $$('.meta', el).map(m => [...m.children]);
    R.ch = draw($('.fv .ch path', el)); R.fvc = $('.fv .c1', el); }, t => {
    riseAll(R.w1, t, 13.125, .03); riseAll(R.w2, t, 13.3, .04); T(R.sup, { o: P(t, 13.5, .3) });
    const sh = P(t, 13.8, .7, E.inOutExpo);
    T(R.ttl, { x: lerp(0, 0, sh), y: lerp(0, -208, sh), s: lerp(1, .15, sh) });
    const x = X(t), v = (X(t + 1 / 60) - x) * 60;
    T(R.tr, { x });
    const sk = cl(-v * .0016, -9, 9);
    R.cd.forEach((c, i) => { c.style.transform = Math.abs(sk) > .01 ? `skewX(${sk.toFixed(3)}deg)` : 'none';
      const rp = P(t, i ? 16.55 : 14.0, 1.1, E.outExpo);
      T(R.site[i], { s: lerp(1.3, 1, rp), x: cl(v * -.03, -60, 60), y: -[160, 300][i] * P(t, i ? 18.3 : 15.1, 1.4, E.inOutCubic) }); R.site[i].style.transformOrigin = '50% 0'; });
    R.ch(P(t, 14.6, 1.3, E.inOutCubic));
    // stickers pop and spin
    R.stk.forEach((s, i) => { const p = P(t, i ? 17.45 : 15.0, .6, E.outBackS); T(s, { s: p, r: -14 + 10 * Math.sin(t * .8 + i) + (1 - p) * -60 }); });
    txt(R.sn, Math.round(1247 * P(RS.TQ, 15.05, 1.1, E.outCubic)).toLocaleString('en-IN'));
    R.meta.forEach((m, i) => m.forEach((c, j) => up(c, t, (i ? 17.25 : 14.55) + j * .06, 30, .6)));
  }); }

/* ───── E · the standard: outline type fills lime on the beat (20.15 – 24.4) ───── */
{ const R = {};
  const FILL = [bt(45), bt(47), bt(49)];
  scene('e', 20.12, 24.42, () => { const el = $('#e'); R.bg = $('.bg', el); R.k = $('.k', el); R.k2 = $('.k2', el); R.ln = $$('.ln', el).map(l => [$('.o', l), $('.f', l), $('em', l)]);
    R.ln.forEach(([o, , em]) => em.style.left = (o.offsetWidth + 26) + 'px');
    R.st = $('.strip', el); R.stt = $('.strip .tr', el);
    R.stt.innerHTML = Array(4).fill(['100/100 Performance', 'Mobile-first', 'SSL secured', 'SEO ready', 'Accessible', 'Lightning fast']).flat().map(w => w + '<b>✦</b>').join(''); }, t => {
    const p = P(t, 20.15, .5, E.inOutExpo);
    R.bg.style.transform = `translateY(${(1080 * (1 - p)).toFixed(1)}px)`; R.bg.style.borderRadius = `${(140 * (1 - p)).toFixed(1)}px ${(140 * (1 - p)).toFixed(1)}px 0 0`;
    T(R.k, { o: P(t, 20.6, .3) }); T(R.k2, { o: P(t, 20.7, .3) });
    const out = i => P(t, 23.85 + i * .06, .4, E.inExpo);
    R.ln.forEach(([o, f, em], i) => { const s = bt(44) + i * B / 2, q = P(t, s, .7, E.outExpo), y = (1 - q) * 210 - out(i) * 210;
      T(o, { y }); T(f, { y }); T(em, { y, o: P(t, FILL[i] + .2, .3) });
      const fp = P(t, FILL[i], .55, E.inOutCubic); f.style.clipPath = `inset(-10% ${(100 * (1 - fp)).toFixed(2)}% -10% 0)`; });
    T(R.st, { y: (1 - P(t, 20.8, .6, E.outExpo)) * 90 + P(t, 23.9, .4, E.inExpo) * 90 });
    T(R.stt, { x: -((t - 20) * 260) % 1800 });
  }); }

/* ───── G · process: one word per beat, each on its own wipe (24.25 – 26.3) ───── */
{ const R = {};
  const W = [bt(52), bt(53), bt(54), bt(55)];
  scene('g', 24.2, 26.34, () => { const el = $('#g'); R.pn = $$('.pn', el); R.w = R.pn.map(p => chars($('.w', p), $('.w', p).textContent)); R.k = R.pn.map(p => $('.k', p)); R.prog = $('.prog', el); }, t => {
    let cur = 0;
    R.pn.forEach((p, i) => { const q = P(t, W[i] - .14, .3, E.inOutExpo); if (t >= W[i] - .14) cur = i;
      p.style.clipPath = q >= 1 ? 'none' : `inset(${(100 * (1 - q)).toFixed(2)}% 0 0 0)`; show(p, t >= W[i] - .14);
      riseAll(R.w[i], t, W[i] - .02, .022, .55); T(R.k[i], { o: P(t, W[i], .2) });
      if (i < 3) { const nx = P(t, W[i + 1] - .14, .3, E.inOutExpo); T($('.w', p), { y: -160 * nx }); } });
    T(R.prog, { sx: P(t, 24.3, 1.9) }); R.prog.style.background = cur === 2 ? '#d4ff3f' : INK;
  }); }

/* ───── H · contact: lime slide-over, magnetic CTA, full-bleed name (25.95 – 30) ───── */
{ const R = {};
  scene('h', 25.95, 30.01, () => { const el = $('#h'); R.bg = $('.bg', el); R.k = $('.k', el); R.dot = $('.dot', el);
    R.l1 = chars($('.l1', el), 'Let’s build'); R.l2a = chars($('.l2 .a', el), 'something'); R.l2b = chars($('.l2 .b', el), 'iconic.');
    R.cta = $('.cta', el); R.rl = $('.rl', el); R.ct = $$('.ct span', el); R.bd = $('.b2', el); R.bs = $('.b2 svg', el); R.fine = $('.fine', el);
    const nm = $('.name', el); nm.innerHTML = '<span style="display:inline-block">Avanish Jha</span>'; const w = nm.firstChild.offsetWidth; nm.style.fontSize = Math.min(360, 268 * 1400 / w).toFixed(1) + 'px'; R.nm = chars(nm, 'Avanish Jha'); }, t => {
    const p = P(t, 25.98, .34, E.inOutExpo);
    R.bg.style.transform = `translateY(${(1080 * (1 - p)).toFixed(1)}px)`; R.bg.style.borderRadius = `${(140 * (1 - p)).toFixed(1)}px ${(140 * (1 - p)).toFixed(1)}px 0 0`;
    T(R.k, { o: P(t, 26.45, .3) }); T(R.dot, { s: 1 + .5 * ((t * 1.6) % 1), o: 1 - .6 * ((t * 1.6) % 1) });
    riseAll(R.l1, t, 26.25, .03); riseAll(R.l2a, t, 26.4, .025); riseAll(R.l2b, t, 26.55, .035);
    riseAll(R.nm, t, 26.75, .035, .9, 140);
    // magnetic pill: leans toward the cursor while it hovers, label rolls on hover
    const cp = CUR(t), dx = cp.x - 325, dy = cp.y - 641, near = Math.max(0, 1 - Math.hypot(dx, dy) / 420) * P(t, 27.1, .2);
    const ip = P(t, 26.9, .6, E.outExpo);
    T(R.cta, { x: dx * .22 * near, y: dy * .22 * near, s: ip * (1 - .06 * bump(t, bt(59), .22)) }); R.cta.style.clipPath = `inset(0 ${(100 * (1 - ip)).toFixed(2)}% 0 0 round 56px)`;
    T(R.rl, { y: -112 * P(t, 27.35, .45, E.outExpo) });
    R.ct.forEach((c, i) => up(c, t, 27.0 + i * .1, 26));
    T(R.bd, { s: E.outBack(P(t, 27.1, .7)) }); R.bs.style.transform = `rotate(${(t * 40).toFixed(2)}deg)`;
    T(R.fine, { o: .7 * P(t, 27.5, .5) });
  }); }

/* ───── always-on UI: nav with section indicator, custom cursor, lime flood ───── */
const CURS = [
  { a: 5.2, b: 6.75, lab: 'Explore ↘', k: [[5.2, 1580, 1130, .16], [5.85, 1680, 310, .16], [6.15, 1680, 310, .16], [6.42, 905, 760, .16], [6.52, 905, 760, 1]] },
  { a: 10.85, b: 12.3, lab: 'Open ↗', k: [[10.85, 1300, 1150, .16], [11.55, 1060, 470, .16], [11.72, 1030, 440, 1], [12.1, 1010, 430, 1]] },
  { a: 15.15, b: 16.42, lab: 'View ↗', k: [[15.15, 1560, 1150, .16], [15.65, 1120, 600, .16], [15.8, 1110, 590, 1], [16.4, 1060, 560, 1]] },
  { a: 17.6, b: 20.0, lab: 'View ↗', k: [[17.6, 1500, 1150, .16], [18.1, 900, 620, .16], [18.25, 890, 610, 1], [20.0, 820, 560, 1]] },
  { a: 26.95, b: 30.01, lab: '', k: [[26.95, 1500, 1150, .16], [27.4, 440, 650, .16], [28.2, 470, 662, .16], [30, 500, 690, .16]] },
];
function CUR(t) {
  for (const c of CURS) if (t >= c.a && t < c.b) {
    const kk = n => c.k.map(r => [r[0], r[n], E.inOutCubic]);
    return { x: K(t, kk(1)), y: K(t, kk(2)), s: K(t, kk(3)), o: P(t, c.a, .12) * (1 - P(t, c.b - .12, .12)), c };
  }
  return { x: 0, y: 0, s: 0, o: 0 };
}
{ const R = {};
  const NAV = [[3.3, INK], [7.4, INK], [9.3, PAPER], [12.6, INK], [20.4, PAPER], [bt(52) - .1, INK], [bt(54) - .1, PAPER], [bt(55) - .1, INK]];
  const ACT = [[0, -1], [7.5, 1], [13.1, 0], [20.4, 2], [26.1, 3]];
  scene('ui', 0, 30.01, () => { const el = $('#ui'); R.nav = $('nav', el); R.ind = $('.ind', el); R.cur = $('.cur', el); R.cl = $('.cl', el); R.fl = $('.flood', el);
    R.xs = $$('.lk span', el).map(s => s.offsetLeft + s.offsetWidth / 2); R.navc = [...R.nav.children]; }, t => {
    // nav
    let col = INK; NAV.forEach(([a, c]) => { if (t >= a) col = c; }); R.nav.style.color = col;
    R.navc.forEach((c, i) => T(c, { o: P(t, 3.85 + i * .08, .4), y: (1 - P(t, 3.85 + i * .08, .6, E.outExpo)) * -30 }));
    let ai = -1, at = 0, pi = -1; ACT.forEach(([a, i]) => { if (t >= a) { pi = ai; ai = i; at = a; } });
    const mv = P(t, at, .5, E.outExpo), x0 = pi < 0 ? R.xs[Math.max(ai, 0)] : R.xs[pi];
    R.ind.style.left = (ai < 0 ? 0 : lerp(x0, R.xs[ai], mv)).toFixed(1) + 'px'; T(R.ind, { o: ai < 0 ? 0 : (pi < 0 ? mv : 1), s: ai < 0 ? 0 : 1 });
    // cursor
    const c = CUR(t); show(R.cur, c.o > 0);
    if (c.o > 0) { T(R.cur, { x: c.x, y: c.y, s: c.s * (1 - .15 * bump(t, bt(14), .16) - .15 * bump(t, bt(26), .16) - .3 * bump(t, bt(59), .2)), o: c.o }); txt(R.cl, c.c.lab); T(R.cl, { o: cl((c.s - .5) / .5), s: .6 + .4 * cl((c.s - .3) / .7) });
      R.cur.style.background = t > 26.9 && t < 27.25 ? INK : '#d4ff3f'; }
    // lime flood: hero → marquees
    const f = P(t, 6.62, .58, E.inOutExpo); show(R.fl, t >= 6.6 && t < 7.55);
    if (t >= 6.6 && t < 7.55) T(R.fl, { x: 905, y: 760, s: 1.2 + f * 30 });
  }); }

Reel.start({ W: 1920, H: 1080, accent: '#d4ff3f', audio: '../assets/showreel-vol5-audio.m4a',
  fonts: ['800 20px "Bricolage Grotesque"', '500 20px "Bricolage Grotesque"', 'italic 400 20px "Instrument Serif"', '400 20px "JetBrains Mono"', '400 20px Inter', '600 20px Inter', '400 20px "Tiro Devanagari Hindi"'],
  fx: { hud: false, wipes: [], cover: null, shake: [[7.5, 9], [13.125, 5], [20.625, 4], [26.25, 7]], flash: [[7.5, .18, '#ffffff'], [26.25, .12, '#ffffff']] } });
})();
