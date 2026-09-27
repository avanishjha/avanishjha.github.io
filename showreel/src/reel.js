/* ═══════════════════════════════════════════════════════════════════
   AVANISH JHA — SHOWREEL 2026 · 16:9 (1920×1080) scenes
   Engine, FX and player live in engine.js.
   ═══════════════════════════════════════════════════════════════════ */
(() => {
'use strict';
const { RS, E, cl, lerp, P, bump, decay, K, hash, rng, T, rise, show, txt, html, chars, scr, rel, scene, $, $$ } = Reel;

/* ───── S1 · IGNITION (0 – 2.25) ───── */
{
  const R = {};
  scene('s1', 0, 2.26, () => {
    const el = $('#s1');
    Object.assign(R, { top: $('.half.top', el), bot: $('.half.bot', el), seams: $$('.seam', el), core: $('.core', el), dot: $('.dot', el), rings: $$('.ring', el), type: $('.type', el), t: $('.type .t', el), caret: $('.type .caret', el), sub: $('.sub', el) });
  }, t => {
    T(R.core, { s: lerp(1, 1.1, P(t, 0, 1.8, E.inOutSine)) });
    const pop = P(t, .02, .5, E.outBackS);
    const beat = decay(t, .5, 9) * .45 + decay(t, 1, 9) * .45;
    const st = P(t, 1.42, .42, E.inOutExpo);
    const w = lerp(20, 1980, st), h = lerp(20, 3, P(t, 1.42, .2, E.outCubic));
    Object.assign(R.dot.style, { width: w + 'px', height: h + 'px', marginLeft: -w / 2 + 'px', marginTop: -h / 2 + 'px' });
    T(R.dot, { s: t < 1.42 ? pop * (1 + beat) : 1 });
    show(R.core, t < 1.84);
    [0.02, .5, 1, 1.25].forEach((rt, i) => {
      const r = R.rings[i], p = P(t, rt, 1.35, E.outCubic), rad = lerp(12, 560 + i * 60, p);
      Object.assign(r.style, { width: 2 * rad + 'px', height: 2 * rad + 'px', left: 960 - rad + 'px', top: 540 - rad + 'px', opacity: t < rt ? 0 : ((1 - p) * .75).toFixed(3) });
    });
    const msg = 'hello, world', n = Math.floor(cl((RS.TQ - .3) / .05, 0, msg.length));
    txt(R.t, msg.slice(0, n));
    R.caret.style.opacity = (RS.TQ > .3 && RS.TQ < .3 + msg.length * .05) || Math.floor(RS.TQ * 4) % 2 === 0 ? 1 : 0;
    const ex = P(t, 1.3, .3, E.inCubic);
    T(R.type, { y: -ex * 24, o: P(t, .22, .1) * (1 - ex) });
    txt(R.sub, scr('avanishjha.dev — est. mumbai', P(RS.TQ, .62, .55), 3));
    T(R.sub, { y: -ex * 24, o: .9 * (1 - ex) });
    const sp = P(t, 1.8, .46, E.inOutExpo);
    T(R.top, { y: -sp * 580 }); T(R.bot, { y: sp * 580 });
    R.seams.forEach(s => s.style.opacity = t >= 1.84 ? 1 : 0);
  });
}

/* ───── S2 · PROMISE (1.8 – 6.0) ───── */
{
  const R = {};
  scene('s2', 1.8, 6.0, () => {
    const el = $('#s2');
    R.a = $('.s2a', el); R.b = $('.s2b', el);
    R.kick = $('.s2a .kick', el);
    R.words = $$('.s2a .l .m>i', el);
    R.scr = $('.scr', el); R.box = $('.scr .box', el); R.rect = $('.scr .box rect', el); R.fill = $('.scr .boxfill', el); R.dots = $$('.scr .dots b', el);
    // size the "screen" frame around the word
    const wm = rel($('.scr .m', el), R.scr);
    const bx = { x: wm.x - 22, y: wm.y + 16, w: wm.w + 44, h: 250 };
    Object.assign(R.box.style, { left: bx.x - 4 + 'px', top: bx.y - 4 + 'px', width: bx.w + 8 + 'px', height: bx.h + 8 + 'px' });
    Object.assign(R.rect, {}); R.rect.setAttribute('x', 4); R.rect.setAttribute('y', 4); R.rect.setAttribute('width', bx.w); R.rect.setAttribute('height', bx.h); R.rect.setAttribute('rx', 30);
    R.rect.setAttribute('fill', 'none'); R.rect.setAttribute('stroke', '#0a0a0a'); R.rect.setAttribute('stroke-width', 6);
    R.len = 2 * (bx.w + bx.h); R.rect.style.strokeDasharray = R.len;
    Object.assign(R.fill.style, { left: bx.x + 'px', top: bx.y + 'px', width: bx.w + 'px', height: bx.h + 'px' });
    const dts = $('.scr .dots', el); Object.assign(dts.style, { left: bx.x + 26 + 'px', top: bx.y + 24 + 'px' });
    R.badge = $('.badge', el); R.rot = $('.badge .rot', el);
    // marquee
    const mq = $('.mq', el); R.rows = [];
    for (let i = 0; i < 6; i++) {
      const r = document.createElement('div'); r.className = 'row'; r.style.top = i * 200 + 'px';
      r.textContent = 'BUILD IT — '.repeat(10); mq.appendChild(r); R.rows.push(r);
    }
    R.ican = $('.ican .m>i', el);
    R.br = $('.b-r', el); R.bc = $('.b-c', el); R.bf = $('.b-fill', el); R.bw = $('.bwrap', el);
    // every layer gets identical per-letter spans so glyph positions match exactly
    const splitB = (node, accDot) => { node.textContent = ''; return [...'BUILD IT.'].map(ch => {
      const s = document.createElement('span'); s.style.display = 'inline-block'; s.textContent = ch === ' ' ? ' ' : ch;
      if (accDot && ch === '.') s.className = 'acc'; node.appendChild(s); return s; }); };
    R.letters = splitB($('.b-main', el), true);
    splitB(R.br); splitB(R.bc); splitB(R.bf);
    const ic = $('.ican', el); ic.style.left = rel(R.letters[0], R.bw).x + 14 + 'px';
    R.tag = $('.s2b .tag', el);
  }, t => {
    const A = t < 4.0;
    show(R.a, A); show(R.b, !A);
    if (A) {
      T(R.a, { s: lerp(1, 1.035, P(t, 1.8, 2.2, E.lin)) });
      R.a.style.transformOrigin = '700px 540px';
      txt(R.kick, scr('[01] — The promise', P(RS.TQ, 2.05, .45), 11));
      const wt = [2.0, 2.08, 2.16, 2.34, 2.42, 2.52, 2.62];
      R.words.forEach((w, i) => {
        const pin = P(t, wt[i], .8, E.outExpo), pout = P(t, 3.64 + i * .025, .3, E.inExpo);
        w.style.transform = `translateY(${((1 - pin) * 135 - pout * 135).toFixed(2)}%)`;
      });
      const dp = P(t, 2.7, .5, E.inOutCubic), out = P(t, 3.64, .3, E.inExpo);
      R.rect.style.strokeDashoffset = R.len * (1 - dp);
      R.box.style.opacity = 1 - out;
      T(R.fill, { sy: P(t, 3.02, .4, E.outExpo), o: 1 - out });
      R.dots.forEach((d, i) => T(d, { s: P(t, 3.18 + i * .05, .3, E.outBackS) * (1 - out) }));
      const bp = P(t, 2.35, .6, E.outBackS);
      T(R.badge, { s: bp * (1 - P(t, 3.6, .3, E.inBack || E.inCubic)), o: P(t, 2.35, .1) });
      R.rot.setAttribute('transform', `rotate(${((t - 2) * 45).toFixed(2)} 150 150)`);
    } else {
      const lt = t - 4;
      R.rows.forEach((r, i) => {
        const half = 11 * 200 * 0.62 * 5; // approx width of 5 repeats
        const d = i % 2 ? 1 : -1, v = (lt * (120 + i * 18) + i * 350) % half;
        T(r, { x: d < 0 ? -v : -half + v, o: P(lt, 0, .35) });
      });
      R.letters.forEach((ch, i) => {
        const lt0 = 4 + i * .022, p = P(t, lt0, .55, E.outExpo);
        T(ch, { s: lerp(2.7, 1, p), y: (1 - p) * -40, o: P(t, lt0, .07), b: (1 - p) * 16 });
      });
      const off = 18 * decay(t, 4.1, 5) + 12 * bump(t, 4.62, .1) + 10 * bump(t, 5.26, .08);
      const co = P(t, 4.1, .05) * cl(off / 3);
      T(R.br, { x: off, o: co * .9 }); T(R.bc, { x: -off, o: co * .9 });
      const fp = P(t, 5.0, .5, E.inOutExpo);
      R.bf.style.clipPath = `inset(0 ${((1 - fp) * 100).toFixed(2)}% 0 0)`;
      rise(R.ican, P(t, 4.22, .7, E.outExpo));
      T(R.bw, { s: lerp(1, 1.06, P(t, 4, 2, E.lin)) });
      txt(R.tag, scr('WEBSITES · WEB APPS · STORES · DASHBOARDS · ANYTHING', P(RS.TQ, 4.55, .7), 5));
    }
  });
}

/* ───── S3 · WHAT I BUILD (6.0 – 10.0) ───── */
{
  const R = {};
  const W = [['c1', 6], ['c2', 6.5], ['c3', 7], ['c4', 7.5], ['c5', 8], ['c6', 8.5], ['c7', 9], ['c8', 9 + 1 / 6], ['c9', 9 + 2 / 6], ['c10', 9.5], ['end', 10.02]];
  scene('s3', 6.0, 10.02, () => {
    W.slice(0, -1).forEach(([id]) => R[id] = { el: $('#' + id) });
    for (const id in R) { R[id].num = $('.cnum', R[id].el); if (R[id].num) R[id].numT = R[id].num.textContent; }
    // c1
    R.c1.frame = $('#c1 .frame'); R.c1.w = $('#c1 .word .m>i');
    // c2
    R.c2.w = $('#c2 .word .m>i'); R.c2.ui = $$('#c2 .ui'); R.c2.tg = $('#c2 .tg'); R.c2.knob = $('#c2 .tg i');
    R.c2.cks = $$('#c2 .ck s'); R.c2.fil = $('#c2 .sl .fil'); R.c2.sk = $('#c2 .sl i'); R.c2.btn = $('#c2 .btn');
    // c3
    const bars = $('#c3 .bars'); R.c3.bars = []; const rr = rng(42); const pts = [];
    for (let i = 0; i < 17; i++) {
      const b = document.createElement('i'); const h = 100 + i * 12 + rr() * 90;
      Object.assign(b.style, { left: 38 + i * 110 + 'px', height: h + 'px' }); bars.appendChild(b); R.c3.bars.push(b);
      pts.push([38 + i * 110 + 39, 1080 - h - 50 - rr() * 30]);
    }
    const path = $('#c3 .ln path'); let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; const mx = (x0 + x1) / 2; d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`; }
    path.setAttribute('d', d); R.c3.path = path; R.c3.len = path.getTotalLength(); path.style.strokeDasharray = R.c3.len;
    R.c3.pt = $('#c3 .ln circle'); R.c3.w = $('#c3 .word');
    // c4
    R.c4.ws = $$('#c4 .word .m>i'); R.c4.prod = $('#c4 .prod'); R.c4.pr = $('#c4 .pr'); R.c4.add = $('#c4 .add'); R.c4.badge = $('#c4 .cart b');
    // c5
    R.c5.cols = $$('#c5 .col'); const hs = [230, 120, 170, 90, 260, 140, 110, 200, 150, 240, 100, 180];
    R.c5.cols.forEach((c, ci) => { for (let k = 0; k < 24; k++) { const b = document.createElement('i'); b.style.height = hs[(k + ci * 5) % hs.length] + 'px'; c.appendChild(b); } });
    R.c5.wo = $('#c5 .wo'); R.c5.wf = $('#c5 .wf');
    // c6
    R.c6.ws = $$('#c6 .word .m>i'); R.c6.ph = $('#c6 .ph');
    const blk = [[70, 250, 'var(--accent)'], [340, 26, 'var(--ink)'], [380, 26, 'rgba(10,10,10,.35)'], [420, 26, 'rgba(10,10,10,.35)'], [480, 70, 'var(--ink)'], [570, 120, 'rgba(10,10,10,.1)']];
    R.c6.blk = blk.map(([top, h, bg], i) => { const b = document.createElement('i'); b.className = 'blk'; Object.assign(b.style, { top: top + 'px', height: h + 'px', background: bg, right: i === 2 ? '90px' : i === 3 ? '140px' : '30px', borderRadius: h < 40 ? '8px' : '18px' }); R.c6.ph.appendChild(b); return b; });
    // stutter
    ['c7', 'c8', 'c9'].forEach(id => R[id].w = $('#' + id + ' .word'));
    // c10 — "Anything."
    const w10 = $('#c10 .word'); R.c10.w = w10; R.c10.and = $('#c10 .and');
    R.c10.ch = chars(w10, 'Anything.', ch => ch === '.' ? 'acc' : '');
    const dot = R.c10.ch[R.c10.ch.length - 1].parentElement;
    const wr = rel(w10, $('#stage')), dr = rel(dot, $('#stage'));
    R.c10.ox = dr.x - wr.x + dr.w * .42; R.c10.oy = dr.y - wr.y + dr.h * .66;
    R.c10.dx = wr.x + R.c10.ox; R.c10.dy = wr.y + R.c10.oy;
    w10.style.transformOrigin = `${R.c10.ox}px ${R.c10.oy}px`;
  }, t => {
    let cur = 0; for (let i = 0; i < W.length - 1; i++) if (t >= W[i][1]) cur = i;
    W.slice(0, -1).forEach(([id], i) => show(R[id].el, i === cur));
    const [id, t0] = W[cur], lt = t - t0, C = R[id];
    if (C.num) txt(C.num, scr(C.numT, P(RS.TQ - t0, 0, .22), cur + 3));
    switch (id) {
      case 'c1': {
        const p = P(lt, 0, .42, E.outExpo);
        const w = lerp(420, 1300, p), h = lerp(260, 640, P(lt, 0, .38, E.outExpo));
        Object.assign(C.frame.style, { width: w + 'px', height: h + 'px', left: 960 - w / 2 + 'px', top: 540 - h / 2 + 'px', opacity: P(lt, 0, .05) });
        rise(C.w, P(lt, .03, .45, E.outExpo));
        T(C.el, { s: lerp(1, 1.03, lt / .5) });
        break;
      }
      case 'c2': {
        rise(C.w, P(lt, 0, .42, E.outExpo));
        C.ui.forEach((u, i) => { const p = P(lt, .02 + i * .04, .38, E.outBackS); T(u, { s: p, o: P(lt, .02 + i * .04, .06) }); });
        const tp = P(lt, .17, .14, E.outBack);
        T(C.knob, { x: tp * 60 }); C.tg.style.background = tp > .5 ? 'var(--accent)' : 'transparent'; C.tg.style.borderColor = tp > .5 ? 'var(--accent)' : 'var(--bone)';
        C.knob.style.background = tp > .5 ? 'var(--ink)' : 'var(--bone)';
        C.cks.forEach((c, j) => { const p = P(lt, .16 + j * .07, .12, E.outBack); T(c.firstElementChild, { s: p }); c.style.background = p > .3 ? 'var(--accent)' : 'transparent'; c.style.borderColor = p > .3 ? 'var(--accent)' : 'var(--bone)'; c.style.color = 'var(--ink)'; });
        const sp = lerp(12, 80, P(lt, .06, .38, E.inOutCubic));
        C.fil.style.width = sp + '%'; C.sk.style.left = sp + '%';
        T(C.btn, { s: P(lt, .14, .38, E.outBackS) * (1 - .1 * bump(lt, .3, .1)), o: P(lt, .14, .06) });
        break;
      }
      case 'c3': {
        C.bars.forEach((b, i) => T(b, { sy: P(lt, i * .012, .36, E.outExpo) }));
        const lp = P(lt, .04, .42, E.inOutCubic);
        C.path.style.strokeDashoffset = C.len * (1 - lp);
        const pt = C.path.getPointAtLength(C.len * lp); C.pt.setAttribute('cx', pt.x); C.pt.setAttribute('cy', pt.y);
        C.pt.setAttribute('r', lp > .01 ? 14 : 0);
        const p = P(lt, 0, .34, E.outExpo);
        T(C.w, { s: lerp(1.3, 1, p), b: (1 - p) * 20, o: P(lt, 0, .08) });
        break;
      }
      case 'c4': {
        C.ws.forEach((w, i) => rise(w, P(lt, i * .06, .42, E.outExpo)));
        const p = P(lt, 0, .4, E.outExpo);
        T(C.prod, { x: (1 - p) * 560, r: (1 - p) * 9, o: P(lt, 0, .06) });
        txt(C.pr, '₹' + Math.round(2499 * P(RS.TQ - t0, .05, .28, E.outCubic)).toLocaleString('en-IN'));
        const added = RS.TQ - t0 > .3;
        T(C.add, { s: 1 - .07 * bump(lt, .26, .1) });
        C.add.style.background = added ? 'var(--accent)' : 'var(--ink)'; C.add.style.color = added ? 'var(--ink)' : 'var(--bone)';
        txt(C.add, added ? 'Added to cart ✓' : 'Add to cart');
        T(C.badge, { s: P(lt, .31, .16, E.outBackS) });
        break;
      }
      case 'c5': {
        C.cols.forEach((c, i) => T(c, { y: -(lt * 1100) - i * 300 - 200 }));
        const s = lerp(1.08, 1, P(lt, 0, .45, E.outExpo));
        T(C.wo, { s, o: P(lt, 0, .05) }); T(C.wf, { s });
        C.wf.style.clipPath = `inset(0 ${((1 - P(lt, .1, .28, E.inOutCubic)) * 100).toFixed(2)}% 0 0)`;
        break;
      }
      case 'c6': {
        C.ws.forEach((w, i) => rise(w, P(lt, i * .06, .42, E.outExpo)));
        const p = P(lt, 0, .42, E.outBack);
        T(C.ph, { r: lerp(-90, 0, p), s: lerp(.72, 1, P(lt, 0, .3, E.outExpo)), o: P(lt, 0, .05) });
        C.blk.forEach((b, i) => T(b, { sx: P(lt, .18 + i * .035, .22, E.outExpo), o: P(lt, .18 + i * .035, .05) }));
        C.blk.forEach(b => b.style.transformOrigin = '0 50%');
        break;
      }
      case 'c7': case 'c8': case 'c9':
        T(C.w, { s: lerp(1.16, 1, P(lt, 0, .15, E.outExpo)) });
        break;
      case 'c10': {
        C.ch.forEach((c, i) => rise(c, P(lt, i * .018, .34, E.outExpo)));
        const zp = P(t, 9.74, .27, E.inExpo);
        T(C.w, { x: (960 - C.dx) * zp, y: (540 - C.dy) * zp, s: lerp(1, 90, zp) * lerp(1, 1.04, P(lt, 0, .24)) });
        T(C.and, { o: P(lt, .1, .1) * (1 - P(t, 9.72, .08)) });
        break;
      }
    }
  });
}

/* ───── S4 · PROCESS (10.0 – 16.0) ───── */
{
  const R = {};
  const AX = 288, AY = 150;
  const WF = [ // x,y,w,h,label,t
    [0, 0, 1344, 76, 'NAV', 11.0], [48, 22, 190, 32, 'LOGO', 11.04], [796, 30, 60, 16, '', 11.07], [884, 30, 80, 16, '', 11.09], [992, 30, 60, 16, '', 11.11], [1080, 30, 70, 16, '', 11.13],
    [1170, 16, 126, 44, 'CTA', 11.16], [48, 124, 250, 20, '', 11.22], [44, 166, 610, 84, 'H1', 11.26], [44, 256, 470, 84, '', 11.31], [44, 346, 300, 84, '', 11.36],
    [48, 456, 500, 18, 'TEXT', 11.44], [48, 486, 420, 18, '', 11.48], [48, 548, 190, 56, 'BUTTON', 11.54], [252, 548, 196, 56, '', 11.58],
    [720, 104, 576, 476, 'IMAGE', 11.3], [48, 620, 400, 150, 'CARD', 11.66], [472, 620, 400, 150, 'CARD', 11.72], [896, 620, 400, 150, 'CARD', 11.78],
  ];
  const IMG = 15;
  const CUR = [[11.2, 1760, 1010], [11.62, 1386, 562], [11.72, 1386, 562], [12.1, 1296, 492], [12.24, 1296, 492], [12.6, 1520, 760], [13.6, 1560, 800], [13.94, 440, 722], [14.04, 440, 722], [14.3, 1548, 126], [14.55, 1548, 126], [14.95, 1660, 330]];
  const CONF = [];
  scene('s4', 10.0, 16.0, () => {
    const el = $('#s4');
    Object.assign(R, { el, cam: $('.cam', el), label: $('.artlabel', el), tb: $('.toolbar', el), dots: $$('.toolbar .dots b', el), url: $('.toolbar .url', el), ut: $('.toolbar .ut', el), pub: $('.toolbar .pub', el), pr: $('.toolbar .pub .pr', el), lb: $('.toolbar .pub .lb', el),
      art: $('.board', el), inner: $('.board .inner', el), border: $('.board .border', el), dims: $$('.dim', el), pg: $('.pg', el), sweep: $('.sweep', el), gx: $('.guides .gx', el), gy: $('.guides .gy', el),
      insp: $('.insp', el), sw: $$('.insp .sw i', el), steps: $$('.steps>div', el), stepsWrap: $('.steps', el), cursor: $('.cursor', el), phone: $('#s4 .phone'), mpg: $('#s4 .mpg'),
      dl: $$('.devlabel .m>i', el), chips: $$('.pg .art .chip', el), rg: $$('.pg .art .rg', el), b1: $('.pg .btns .b1', el) });
    R.inner.style.borderRadius = '0 0 16px 16px';
    // 12-col grid
    const g = $('.agrid', el); R.cols = []; R.rows = [];
    for (let c = 0; c < 12; c++) { const i = document.createElement('i'); Object.assign(i.style, { left: 48 + c * 106 + 'px', width: '82px' }); g.appendChild(i); R.cols.push(i); }
    for (let r = 1; r < 15; r++) { const u = document.createElement('u'); u.style.top = r * 48 + 'px'; g.appendChild(u); R.rows.push(u); }
    // wireframe
    const wf = $('.wf', el); R.wf = WF.map(([x, y, w, h, lb], i) => {
      const b = document.createElement('div'); b.className = 'b'; Object.assign(b.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      if (lb) { const s = document.createElement('span'); s.textContent = lb; b.appendChild(s); }
      if (i === IMG) b.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 576 476" preserveAspectRatio="none"><path d="M0 0L576 476M576 0L0 476" stroke="rgba(239,236,228,.3)" stroke-width="1.5"/></svg>');
      wf.appendChild(b); return b;
    });
    Object.assign(R.gx.style, { left: '-40px', right: '-40px', top: '104px', height: '1.5px' });
    Object.assign(R.gy.style, { top: '-40px', bottom: '-40px', left: '720px', width: '1.5px' });
    R.rg.forEach((r, i) => { const s = [330, 440, 560][i]; Object.assign(r.style, { width: s + 'px', height: s + 'px', margin: `${-s / 2}px 0 0 ${-s / 2}px` }); });
    R.chips[0].style.left = '36px'; R.chips[0].style.top = '40px'; R.chips[1].style.right = '30px'; R.chips[1].style.top = '300px';
    // confetti particles
    const rr = rng(7), cols = ['#ff4d1c', '#efece4', '#ffd166', '#5dde8a', '#ff9a6a'];
    for (let i = 0; i < 110; i++) CONF.push({ vx: (rr() - .5) * 1900, vy: -(120 + rr() * 700), s: 9 + rr() * 14, c: cols[i % cols.length], rot: rr() * 6.28, vr: (rr() - .5) * 18, sh: rr() < .5 });
    R.cv = $('#confetti').getContext('2d');
  }, t => {
    // ── camera
    const pb = P(t, 15.0, .8, E.inOutExpo), s = lerp(1, .66, pb) * lerp(1, 1.02, P(t, 10, 5, E.lin));
    const X = lerp(960, 690, pb), Y = lerp(483, 540, pb);
    T(R.cam, { x: X - s * 960, y: Y - s * 483, s });
    // ── artboard + label
    const ao = P(t, 10.02, .3);
    R.border.style.opacity = ao * (1 - P(t, 13.85, .25));
    html(R.label, RS.TQ < 10.1 ? '' : `${scr('yourbrand.com', P(RS.TQ, 10.1, .4), 2)} — <b>Desktop</b> · 1344 × 720`);
    R.label.style.opacity = 1 - P(t, 13.75, .15);
    R.dims.forEach(d => d.style.opacity = P(t, 10.35, .25) * (1 - P(t, 10.95, .25)));
    // ── grid
    R.cols.forEach((c, i) => T(c, { sy: P(t, 10.12 + i * .025, .45, E.outExpo), o: lerp(1, .35, P(t, 11, .4)) }));
    R.rows.forEach((u, i) => u.style.opacity = P(t, 10.3 + i * .015, .2));
    // ── wireframe
    R.wf.forEach((b, i) => {
      const bt = WF[i][5], p = P(t, bt, .36, E.outBackS);
      if (i === IMG) {
        const dp = P(t, 11.72, .38, E.inOutCubic);
        T(b, { x: lerp(90, 0, dp), y: lerp(70, 0, dp), r: lerp(3, 0, dp), s: lerp(.6, 1, p) * (1 + .015 * (t > 11.66 && t < 12.1 ? 1 : 0)), o: P(t, bt, .06) });
        b.classList.toggle('sel', t > 11.64 && t < 12.3);
      } else T(b, { s: lerp(.55, 1, p), o: P(t, bt, .06) });
    });
    const gp = bump(t, 12.06, .4);
    R.gx.style.opacity = gp; R.gy.style.opacity = gp;
    // ── design sweep
    const sp = P(t, 12.62, .9, E.inOutCubic);
    R.pg.style.clipPath = `inset(0 ${((1 - sp) * 100).toFixed(3)}% 0 0)`;
    R.sweep.style.left = sp * 1344 + 'px'; R.sweep.style.opacity = sp > 0 && sp < 1 ? 1 : 0;
    R.chips.forEach((c, i) => { const p = P(t, 13.35 + i * .2, .45, E.outBackS); T(c, { s: p, y: Math.sin(t * 2.4 + i * 2) * 5, o: P(t, 13.35 + i * .2, .08) }); });
    R.rg.forEach((r, i) => T(r, { s: 1 + .04 * Math.sin(t * 3 - i * .8) }));
    T(R.b1, { s: 1 + .06 * P(t, 13.9, .15, E.outBack) * (1 - P(t, 14.1, .2)) });
    R.b1.style.boxShadow = t > 13.9 && t < 14.3 ? '0 10px 30px rgba(255,77,28,.45)' : 'none';
    // ── inspector
    const ip = P(t, 12.45, .4, E.outExpo), io = P(t, 13.95, .25, E.inCubic);
    T(R.insp, { x: (1 - ip) * 80 + io * 60, o: P(t, 12.45, .12) * (1 - io) });
    R.sw.forEach((w, i) => T(w, { s: P(t, 12.6 + i * .05, .3, E.outBackS) }));
    // ── toolbar / publish
    const tp = P(t, 13.85, .3, E.outExpo);
    T(R.tb, { y: (1 - tp) * -14, o: tp });
    const live = RS.TQ >= 14.86;
    R.dots.forEach((d, i) => d.style.background = live ? ['#ff5f57', '#febc2e', '#28c840'][i] : '#3a3a3a');
    txt(R.ut, live ? 'https://yourbrand.com' : 'yourbrand.com');
    R.url.style.color = live ? 'var(--bone)' : 'var(--grey-2)';
    R.url.firstElementChild.style.color = live ? 'var(--live)' : 'inherit';
    T(R.pub, { s: 1 - .08 * bump(t, 14.32, .12) + .08 * bump(t, 14.86, .2) });
    R.pr.style.width = (live ? 0 : P(t, 14.36, .5, E.inOutCubic) * 100) + '%';
    R.pub.style.background = live ? '#1f3b29' : 'var(--accent)';
    R.pub.style.color = live ? 'var(--live)' : 'var(--ink)';
    html(R.lb, live ? '<i class="ld"></i>Live' : RS.TQ >= 14.36 ? 'Publishing…' : 'Publish');
    // ── steps
    const ST = [10.1, 11.0, 12.5, 14.2, 14.95];
    R.stepsWrap.style.opacity = P(t, 10.1, .3) * (1 - P(t, 15.0, .25));
    R.steps.forEach((st, i) => {
      const p = P(t, ST[i], ST[i + 1] - ST[i]);
      st.firstElementChild.firstElementChild.style.width = p * 100 + '%';
      st.style.color = t >= ST[i] && t < ST[i + 1] ? 'var(--bone)' : t >= ST[i + 1] ? 'var(--grey-2)' : 'var(--grey)';
    });
    // ── phone + label
    const php = P(t, 15.12, .75, E.outExpo);
    T(R.phone, { y: (1 - php) * 950, r: (1 - php) * 10, o: P(t, 15.12, .1) });
    T(R.mpg, { y: -P(t, 15.5, .5, E.inOutCubic) * 150 });
    R.dl.forEach((w, i) => rise(w, P(t, 15.34 + i * .12, .6, E.outExpo)));
    // ── cursor
    const cx = K(t, CUR.map(k => [k[0], k[1]])), cy = K(t, CUR.map(k => [k[0], k[2]]));
    const press = (t > 11.66 && t < 12.1) ? 1 : bump(t, 14.3, .1) + bump(t, 13.98, .08);
    T(R.cursor, { x: cx - 4, y: cy - 4, s: 1 - .14 * cl(press), o: P(t, 11.2, .1) * (1 - P(t, 14.7, .25)) });
    // ── confetti
    const c = R.cv; c.clearRect(0, 0, 1920, 1080);
    if (t > 14.86 && t < 16.0) {
      const dt = t - 14.86, k = 1.8, g = 2000, ox = 1545, oy = 123, e = (1 - Math.exp(-k * dt)) / k;
      for (const q of CONF) {
        const x = ox + q.vx * e, y = oy + (q.vy + g / k) * e - g * dt / k;
        c.save(); c.globalAlpha = 1 - P(dt, .7, .45); c.translate(x, y); c.rotate(q.rot + q.vr * dt); c.fillStyle = q.c;
        if (q.sh) c.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); else { c.beginPath(); c.arc(0, 0, q.s / 3, 0, 6.283); c.fill(); }
        c.restore();
      }
    }
  });
}

/* ───── S5 · FIFTY VILLAGERS (16.0 – 19.96) ───── */
{
  const R = {};
  const CH = [17.45, 17.7, 17.95, 18.2];
  scene('s5', 16.0, 19.97, () => {
    const el = $('#s5');
    Object.assign(R, { el, head: $('.head', el), kick: $('.head .kick', el), nm: $$('.head .m>i', el), big: $('.bignum', el), left: $('.left', el), desc: $('.desc', el), tags: $$('.tags span', el), url: $('.url', el),
      br: $('.fvb', el), st: $$('.db .st', el), vs: $$('.db .st .v', el), rows: $$('.db .tr', el), hl: $('.db .hl', el), its: $$('.db .it2', el), toast: $('.db .toast', el), sw1: $('.db .sw1', el),
      chips: $$('.chipf', el), line: $('.db svg.ch .ln', el), area: $('.db svg.ch .ar', el), pt: $('.db svg.ch .pt', el), glow: $('.glow', el) });
    R.kickT = R.kick.textContent;
    const hr = rel(R.head, $('#stage')); R.hw = hr.w; R.hh = hr.h;
    R.hl.style.top = '0px'; R.hlY = [0, 3].map(i => R.its[i].offsetTop);
    // chart
    const v = [40, 52, 48, 70, 66, 88, 84, 110, 104, 132, 150, 172], pts = v.map((y, i) => [i * 40, 240 - y * 1.25]);
    let d = `M${pts[0][0]},${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2; d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`; }
    R.line.setAttribute('d', d); R.area.setAttribute('d', d + ' L440,250 L0,250 Z');
    R.len = R.line.getTotalLength(); R.line.style.strokeDasharray = R.len;
  }, t => {
    // title: centre-stage → top-left
    const mp = P(t, 16.48, .6, E.inOutExpo), fs = .5;
    const x0 = 960 - R.hw / 2 - 120, y0 = 540 - R.hh / 2 - 150, zs = lerp(1, 1.04, P(t, 16, .48));
    T(R.head, { x: lerp(x0, 0, mp), y: lerp(y0, 0, mp), s: lerp(zs, fs, mp) });
    txt(R.kick, scr(R.kickT, P(RS.TQ, 16.02, .45), 21));
    R.nm.forEach((w, i) => rise(w, P(t, 15.95 + i * .08, .7, E.outExpo)));
    T(R.big, { x: (1 - P(t, 16.0, 1.2, E.outExpo)) * 300 - (t - 16) * 14, o: P(t, 16, .3) });
    R.glow.style.opacity = P(t, 16.5, .8);
    // left column
    const ex = P(t, 19.42, .3, E.inCubic);
    T(R.desc, { y: (1 - P(t, 16.95, .6, E.outExpo)) * 40, o: P(t, 16.95, .3) });
    R.tags.forEach((g, i) => T(g, { s: P(t, 17.12 + i * .07, .4, E.outBackS), o: P(t, 17.12 + i * .07, .08) }));
    txt(R.url.firstChild, scr('fiftyvillagers.org ', P(RS.TQ, 17.4, .5), 9));
    T(R.left, { x: -ex * 140, o: 1 - ex });
    R.head.style.opacity = 1 - ex;
    // browser 3D fly-in
    const bp = P(t, 16.72, .85, E.outExpo), drift = P(t, 17.3, 2.3, E.inOutSine);
    T(R.br, { x: lerp(760, 0, bp), y: lerp(300, 0, bp), z: lerp(-300, 0, bp) + ex * 260, rx: lerp(24, 6, bp) - drift * 2, ry: lerp(-50, -15, bp) + drift * 5, r: lerp(-5, 0, bp), o: P(t, 16.72, .1) * (1 - P(t, 19.7, .25)), b: ex * 6 });
    // dashboard life
    R.st.forEach((s, i) => T(s, { y: (1 - P(t, 17.05 + i * .05, .5, E.outExpo)) * 24, o: P(t, 17.05 + i * .05, .15) }));
    R.vs.forEach((v, i) => {
      const p = P(RS.TQ, 17.12 + i * .06, .85, E.outCubic);
      if (v.dataset.r) txt(v, '₹' + (parseFloat(v.dataset.r) * p).toFixed(1) + 'L');
      else txt(v, Math.round(+v.dataset.n * p).toLocaleString('en-IN'));
    });
    const lp = P(t, 17.2, 1.05, E.inOutCubic);
    R.line.style.strokeDashoffset = R.len * (1 - lp);
    R.area.style.opacity = P(t, 17.55, .6);
    const pt = R.line.getPointAtLength(R.len * lp); R.pt.setAttribute('cx', pt.x); R.pt.setAttribute('cy', pt.y); R.pt.style.opacity = lp > 0 ? 1 : 0;
    R.rows.forEach((r, i) => T(r, { x: (1 - P(t, 17.5 + i * .08, .5, E.outExpo)) * 40, o: P(t, 17.5 + i * .08, .15) }));
    const paid = RS.TQ >= 18.78;
    R.sw1.className = 'pl sw1 ' + (paid ? 'ok' : 'pd'); txt(R.sw1, paid ? 'Paid' : 'Pending');
    T(R.sw1, { s: 1 + .25 * bump(t, 18.78, .18) });
    const hp = P(t, 18.52, .32, E.inOutExpo);
    T(R.hl, { y: lerp(R.hlY[0], R.hlY[1], hp) });
    R.its.forEach((it, i) => it.style.color = (i === 0 && hp < .5) || (i === 3 && hp >= .5) ? 'var(--bone)' : 'rgba(239,236,228,.6)');
    const tp = P(t, 18.66, .45, E.outExpo);
    T(R.toast, { x: (1 - tp) * 80, o: P(t, 18.66, .12) });
    // floating feature chips
    R.chips.forEach((c, i) => {
      const p = P(t, CH[i], .5, E.outBackS);
      T(c, { x: -ex * 80, y: (1 - p) * 34 + Math.sin(t * 2.1 + i * 1.7) * 7, s: lerp(.7, 1, p), o: P(t, CH[i], .1) * (1 - ex) });
    });
  });
}

/* ───── S6 · KALAM ASHRAM (19.5 – 24.0) ───── */
{
  const R = {};
  function dune(base, amp, seed, w = 3400) {
    const r = rng(seed), f = [r() * 2 + 1.2, r() * 3 + 2.5, r() * 5 + 5], ph = [r() * 6, r() * 6, r() * 6];
    let d = `M-200,1100 L-200,${base}`;
    for (let x = -200; x <= w; x += 20) {
      const u = x / w * Math.PI * 2;
      const y = base - amp * (Math.sin(u * f[0] + ph[0]) * .6 + Math.sin(u * f[1] + ph[1]) * .28 + Math.sin(u * f[2] + ph[2]) * .12);
      d += ` L${x},${y.toFixed(1)}`;
    }
    return d + ` L${w},1100 Z`;
  }
  scene('s6', 19.5, 24.0, () => {
    const el = $('#s6');
    Object.assign(R, { el, sun: $('.sun', el), core: $('.sun .core', el), rgs: $$('.sun .rg', el), d: [$('.d1', el), $('.d2', el), $('.d3', el)], head: $('.head', el), kick: $('.head .kick', el), hi: $('.head .hi', el), en: $('.head .en', el),
      left: $('.left', el), stt: $$('.stt>div', el), c300: $('.c300', el), chips: $$('.chips span', el), quote: $('.quote', el), dev: $('.dev', el), kab: $('.kab', el), kap: $('.kap', el), ka: $('.ka', el), kam: $('.kam', el), stars: $('.stars', el) });
    R.kickT = R.kick.textContent;
    R.d[0].setAttribute('d', dune(800, 55, 3)); R.d[1].setAttribute('d', dune(880, 60, 9)); R.d[2].setAttribute('d', dune(975, 45, 17));
    R.rgs.forEach((r, i) => { const s = [800, 1040, 1340][i]; Object.assign(r.style, { width: s + 'px', height: s + 'px', left: -s / 2 + 'px', top: -s / 2 + 'px' }); });
    R.dev.style.cssText = 'position:absolute;inset:0;perspective:2200px;perspective-origin:1300px 540px';
    const rr = rng(11); R.dust = [];
    for (let i = 0; i < 70; i++) { const s = document.createElement('i'); const sz = 1.5 + rr() * 3; Object.assign(s.style, { width: sz + 'px', height: sz + 'px' }); R.stars.appendChild(s); R.dust.push({ el: s, x: rr() * 1920, y: rr() * 900, vx: 12 + rr() * 30, vy: -4 - rr() * 10, o: .15 + rr() * .5, ph: rr() * 6 }); }
    const hr = rel(R.head, $('#stage')); R.hw = hr.w; R.hh = hr.h;
  }, t => {
    // iris open from the Fifty Villagers browser
    const ir = P(t, 19.5, .5, E.inOutQuart);
    R.el.style.clipPath = ir < 1 ? `circle(${(ir * 1400).toFixed(1)}px at 1330px 540px)` : 'none';
    // sun
    const pa = P(t, 19.5, 1.5, E.outCubic), pb = P(t, 20.95, .7, E.inOutExpo);
    T(R.sun, { x: lerp(0, 330, pb), y: lerp(420, 0, pa) + lerp(0, 60, pb), s: lerp(1, .85, pb) });
    R.rgs.forEach((r, i) => T(r, { s: 1 + .025 * Math.sin(t * 2.2 - i), o: P(t, 19.9 + i * .12, .5) }));
    // dunes parallax
    R.d.forEach((d, i) => { const up = P(t, 19.5 + i * .08, 1.1, E.outExpo); d.setAttribute('transform', `translate(${(-(t - 19.5) * (18 + i * 26) - i * 180).toFixed(1)},${((1 - up) * (180 + i * 60)).toFixed(1)})`); });
    // dust
    R.dust.forEach((q, i) => { const lt = t - 19.5; q.el.style.transform = `translate(${((q.x + q.vx * lt) % 1920).toFixed(1)}px,${(q.y + q.vy * lt).toFixed(1)}px)`; q.el.style.opacity = (q.o * (.6 + .4 * Math.sin(t * 3 + q.ph)) * P(t, 19.7, .6)).toFixed(3); });
    // title
    const hx0 = 960 - R.hw / 2, hy0 = 380 - R.hh / 2, hs = .48;
    T(R.head, { x: lerp(hx0, 120, pb), y: lerp(hy0, 96, pb), s: lerp(lerp(1, 1.03, P(t, 19.8, 1.2)), hs, pb) });
    txt(R.kick, scr(R.kickT, P(RS.TQ, 19.85, .45), 31));
    const hp = P(t, 19.9, .75, E.inOutCubic);
    R.hi.style.clipPath = `inset(-20% ${((1 - hp) * 100).toFixed(2)}% -20% 0)`;
    T(R.hi, { y: (1 - P(t, 19.9, .9, E.outExpo)) * 30, b: (1 - hp) * 8 });
    T(R.en, { y: (1 - P(t, 20.35, .6, E.outExpo)) * 30, o: P(t, 20.35, .25) });
    // left column
    R.stt.forEach((s, i) => T(s, { y: (1 - P(t, 21.35 + i * .08, .6, E.outExpo)) * 40, o: P(t, 21.35 + i * .08, .2) }));
    txt(R.c300, String(Math.round(300 * P(RS.TQ, 21.4, .95, E.outCubic))));
    R.chips.forEach((c, i) => T(c, { s: P(t, 22.0 + i * .1, .45, E.outBackS), o: P(t, 22.0 + i * .1, .08) }));
    T(R.quote, { y: (1 - P(t, 22.62, .6, E.outExpo)) * 30, o: P(t, 22.62, .25) });
    // devices
    const bp = P(t, 21.2, .85, E.outExpo), php = P(t, 21.38, .85, E.outExpo);
    T(R.kab, { y: lerp(760, 0, bp), z: lerp(-200, 0, bp), rx: lerp(28, 5, bp), ry: lerp(-4, -9, bp) - P(t, 21.8, 2.0, E.inOutSine) * 3, o: P(t, 21.2, .1) });
    T(R.kap, { y: lerp(820, 0, php), r: lerp(12, -3, php), o: P(t, 21.38, .1) });
    T(R.ka, { y: -P(t, 22.3, 1.0, E.inOutCubic) * 340 });
    T(R.kam, { y: -P(t, 22.5, .95, E.inOutCubic) * 150 });
  });
}

/* ───── S7 · THE STANDARD (24.0 – 26.0) ───── */
{
  const R = {};
  const X = [420, 780, 1140, 1500], LB = ['Speed', 'Accessibility', 'Best practice', 'SEO'], CIRC = 2 * Math.PI * 112;
  scene('s7', 23.95, 26.0, () => {
    const el = $('#s7');
    Object.assign(R, { el, kick: $('.kick', el), h: $$('.h .m>i', el), sub: $$('.sub .m>i', el), dts: $$('.sub .dt', el) });
    R.kickT = R.kick.textContent;
    const box = $('.rgs', el);
    R.rg = X.map((x, i) => {
      const d = document.createElement('div'); d.className = 'rg'; d.style.left = x + 'px'; d.style.top = '590px';
      d.innerHTML = `<svg viewBox="0 0 260 260"><circle cx="130" cy="130" r="112" fill="none" stroke="rgba(10,10,10,.16)" stroke-width="14"/><circle class="pc" cx="130" cy="130" r="112" fill="none" stroke="#0a0a0a" stroke-width="14" stroke-linecap="round" transform="rotate(-90 130 130)" stroke-dasharray="${CIRC}"/></svg><div class="disk"></div><div class="n">0</div><div class="l">${LB[i]}</div>`;
      box.appendChild(d); return { d, pc: $('.pc', d), disk: $('.disk', d), n: $('.n', d), l: $('.l', d) };
    });
  }, t => {
    txt(R.kick, scr(R.kickT, P(RS.TQ, 24.05, .45), 41));
    R.h.forEach((w, i) => rise(w, P(t, 24.02 + i * .07, .7, E.outExpo)));
    R.rg.forEach((g, i) => {
      const s0 = 24.12 + i * .06, c = P(t, s0 + .08, .85, E.outCubic), done = s0 + .08 + .85;
      T(g.d, { s: P(t, s0, .5, E.outBackS) * (1 + .1 * bump(t, done, .22)) });
      g.pc.style.strokeDashoffset = CIRC * (1 - c);
      txt(g.n, String(Math.round(100 * P(RS.TQ, s0 + .08, .85, E.outCubic))));
      const dk = P(t, done, .28, E.outBackS);
      T(g.disk, { s: dk }); g.n.style.color = P(RS.TQ, done, .28, E.outBackS) > .45 ? 'var(--accent)' : 'var(--ink)';
      g.l.style.opacity = P(t, s0 + .2, .3);
    });
    R.sub.forEach((w, i) => rise(w, P(t, 25.2 + i * .09, .6, E.outExpo)));
    R.dts.forEach((d, i) => d.style.opacity = P(t, 25.3 + i * .09, .2) * .5);
    T(R.el, { s: lerp(1, 1.025, P(t, 24, 2)) });
  });
}

/* ───── S8 · OUTRO (26.0 – 30.0) ───── */
{
  const R = {};
  scene('s8', 26.0, 30.01, () => {
    const el = $('#s8');
    Object.assign(R, { el, strip: $('.strip', el), metas: $$('.meta', el), rule: $('.rule', el), rgs: $$('.rgs i', el), dot: $('.rgs .dot', el), badge: $('.badge', el), rot: $('.badge .rot', el), glow: $('.glow', el),
      role: $('.role', el), pill: $('.pill', el), rp: $('.pill .rp', el), arrow: $('.pill svg', el), c1: $('.contact .c1', el), c2: $('.contact .c2', el), cursor: $('#s8 .cursor') });
    R.metaT = R.metas.map(m => m.textContent);
    R.n1 = chars($('.name .n1', el), 'Avanish'); R.n2 = chars($('.name .n2', el), 'Jha.');
    R.rgs.forEach((r, i) => { const s = [260, 480, 680, 920][i]; Object.assign(r.style, { width: s + 'px', height: s + 'px', left: -s / 2 + 'px', top: -s / 2 + 'px', borderColor: `rgba(255,77,28,${[.55, .34, .22, .13][i]})` }); });
    const pr = rel(R.pill, $('#stage')); R.px = pr.x + pr.w * .62; R.py = pr.y + pr.h * .55; R.rpx = pr.w * .62; R.rpy = pr.h * .55;
  }, t => {
    T(R.strip, { sy: P(t, 26.0, .55, E.outExpo) });
    R.metas.forEach((m, i) => txt(m, scr(R.metaT[i], P(RS.TQ, 26.2 + i * .1, .5), 51 + i)));
    T(R.rule, { sx: P(t, 26.25, .7, E.outExpo) });
    [...R.n1, ...R.n2].forEach((c, i) => { const p = P(t, 25.97 + i * .045, 1.0, E.outExpo); rise(c, p, 140); });
    const beats = [26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5];
    const pulse = beats.reduce((a, b) => a + decay(t, b, 7) * (b === 29 ? 1.6 : 1), 0);
    R.rgs.forEach((r, i) => T(r, { s: lerp(.5, 1, P(t, 26.08 + i * .08, .9, E.outExpo)) * (1 + .018 * pulse), o: P(t, 26.08 + i * .08, .3) }));
    T(R.dot, { s: P(t, 26.08, .5, E.outBackS) * (1 + .22 * pulse) });
    R.glow.style.opacity = P(t, 26, .7) * (.85 + .15 * pulse);
    R.rot.setAttribute('transform', `rotate(${((t - 26) * 16).toFixed(2)} 200 200)`);
    R.badge.style.opacity = P(t, 26.5, .6);
    txt(R.role, scr('FULL-STACK DEVELOPER  ·  WEB  ·  APPS  ·  ANYTHING', P(RS.TQ, 26.62, .7), 61));
    const pp = P(t, 27.2, .55, E.outBackS), hov = P(t, 28.28, .2, E.outCubic);
    T(R.pill, { s: lerp(.6, 1, pp) * (1 + .045 * hov), o: P(t, 27.2, .1) });
    R.pill.style.boxShadow = `0 ${(18 * hov).toFixed(1)}px ${(50 * hov).toFixed(1)}px rgba(255,77,28,${(.5 * hov).toFixed(2)})`;
    T(R.arrow, { x: 6 * hov + 4 * Math.sin(Math.max(0, t - 27.6) * 6) * (1 - hov) });
    const rp = P(t, 28.56, .6, E.outCubic);
    Object.assign(R.rp.style, { left: R.rpx + 'px', top: R.rpy + 'px' });
    T(R.rp, { s: rp * 16, o: t < 28.56 ? 0 : (1 - rp) * .9 });
    txt(R.c1, scr('avanishjha.dev', P(RS.TQ, 27.42, .5), 71));
    txt(R.c2, scr('avanishjha2011@gmail.com', P(RS.TQ, 27.6, .6), 72));
    R.c2.style.color = 'var(--grey-2)';
    const cx = K(t, [[27.95, 900], [28.36, R.px, E.outCubic], [28.9, R.px], [29.5, R.px + 260, E.inOutCubic]]);
    const cy = K(t, [[27.95, 1120], [28.36, R.py, E.outCubic], [28.9, R.py], [29.5, R.py + 240, E.inOutCubic]]);
    T(R.cursor, { x: cx - 4, y: cy - 4, s: 1 - .15 * bump(t, 28.5, .12), o: P(t, 27.95, .08) * (1 - P(t, 29.1, .3)) });
  });
}

Reel.start({ W: 1920, H: 1080 });
})();
