/* AVANISH JHA — SHOWREEL 2026 · VOL. 03 — keynote-style product film.
   One idea per shot, slow confident easing, white stage, product shots. 120 BPM. */
(() => {
'use strict';
const { RS, E, cl, lerp, P, T, txt, scene, $, $$ } = Reel;
const fade = (t, a, b) => P(t, a, .6, E.outCubic) * (1 - P(t, b - .5, .5, E.inCubic));
const up = (el, t, s, d = 40) => { const p = P(t, s, .9, E.outQuart); T(el, { y: (1 - p) * d, o: P(t, s, .5, E.outCubic), b: (1 - p) * 6 }); };

/* ───── device + screen builders ───── */
const WS = () => `<div class="ws"><div class="nav"><b>yourbrand</b><span>Work</span><span>Services</span><span>Pricing</span><i>Get in touch</i></div>
  <div class="hero"><h3>Crafted for the web.</h3><p>A fast, beautiful website that works as hard as you do.</p><div class="bt"><span class="p">Get started</span><span class="s">See our work ›</span></div></div>
  <div class="shot"><i style="left:6%;top:14%;width:40%;height:62%"></i><i style="left:50%;top:22%;width:44%;height:30%"></i><i style="left:50%;top:58%;width:44%;height:28%"></i></div></div>`;
const DB = () => `<div class="db"><div class="sd"><b>Fifty Villagers</b><div class="on">Dashboard</div><div>Students</div><div>Cohorts</div><div>Payments</div><div>Mentors</div><div>Reports</div></div>
  <div class="mn"><h4>Good morning<small>Here’s what’s happening this week.</small></h4>
  <div class="sts"><div class="st"><span>Active learners</span><b data-n="1247">0</b></div><div class="st"><span>Fees collected</span><b data-r="4.2">₹0</b></div></div>
  <div class="ch"><span>Enrolments · 12 weeks</span><svg viewBox="0 0 600 180" preserveAspectRatio="none"><path class="ln" fill="none" stroke="#0071e3" stroke-width="3.5" stroke-linecap="round"/></svg></div>
  <div class="ls"><div><i></i>Priya S. · Cohort 12<s>Paid</s></div><div><i></i>Rahul M. · Mentor assigned<s>Done</s></div></div></div></div>`;
const KA = () => `<div class="ka"><div class="top">Barmer, Rajasthan<b>Kalam Ashram</b></div>
  <div class="card"><i class="sun"></i><h5>Affordable residential education &amp; exam preparation.</h5><p>No tuition fee.</p></div>
  <div class="bt">Explore programmes</div>
  <div class="chips"><span>Sainik School</span><span>Navodaya</span><span>NEET</span><span>IIT-JEE</span><span>CUET</span></div>
  <div class="sts"><div><b>300</b><span>Students</span></div><div><b>₹0</b><span>Tuition fee</span></div></div></div>`;
const ST = () => `<div class="ka"><div class="top">yourbrand store<b>Aurora Lamp</b></div>
  <div class="card" style="background:linear-gradient(170deg,#eef1f7,#dde3ee)"><i class="sun" style="right:60px;bottom:40px;width:170px;height:170px;background:radial-gradient(circle at 40% 35%,#fff,#e4e9f2 60%,#c7cfdd)"></i><h5>₹2,499</h5><p>Free delivery · 7-day returns</p></div>
  <div class="bt">Add to bag</div><div class="chips"><span>Warm white</span><span>Graphite</span><span>Silver</span></div></div>`;
function lap(host, w, h, inner) {
  const d = document.createElement('div'); d.className = 'lap'; d.style.width = w + 'px'; d.style.height = h + 22 + 'px';
  d.innerHTML = `<div class="lid" style="height:${h}px"><div class="scr">${inner}</div></div><div class="base" style="top:${h}px"></div>`;
  host.appendChild(d); return d;
}
function tab(host, w, h, inner) { const d = document.createElement('div'); d.className = 'tab'; Object.assign(d.style, { width: w + 'px', height: h + 'px' }); d.innerHTML = `<div class="scr">${inner}</div>`; host.appendChild(d); return d; }
function pho(host, w, h, inner) { const d = document.createElement('div'); d.className = 'pho'; Object.assign(d.style, { width: w + 'px', height: h + 'px' }); d.innerHTML = `<i class="isl"></i><div class="scr">${inner}</div>`; host.appendChild(d); return d; }
function shadow(host, x, y, w, h) { const s = document.createElement('i'); s.className = 'shadow'; Object.assign(s.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); host.appendChild(s); return s; }
const place = (el, x, y, s = 1) => { el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.transformOrigin = '0 0'; el._s = s; };
function chart(root) {
  const v = [30, 38, 34, 52, 48, 64, 60, 82, 78, 100, 112, 130], d = v.map((y, i) => `${i ? 'L' : 'M'}${(i * 600 / 11).toFixed(1)},${(170 - y).toFixed(1)}`).join(' ');
  const p = $('.ln', root); p.setAttribute('d', d); const L = p.getTotalLength(); p.style.strokeDasharray = L; return { p, L };
}
const count = (root, p) => $$('[data-n],[data-r]', root).forEach(b => txt(b, b.dataset.r ? '₹' + (b.dataset.r * p).toFixed(1) + 'L' : Math.round(b.dataset.n * p).toLocaleString('en-IN')));

/* ───── 1 · hero line ───── */
{ const R = {};
  scene('s1', 0, 3.4, () => { R.el = $('#s1'); R.l = $$('#s1 .c'); }, t => {
    R.el.style.opacity = fade(t, -1, 3.35); up(R.l[0], t, .35, 50); up(R.l[1], t, 1.2, 30);
    T(R.el, { s: lerp(1, 1.03, P(t, 0, 3.4)), o: fade(t, -1, 3.35) });
  }); }

/* ───── 2 · laptop ───── */
{ const R = {};
  scene('s2', 3.0, 7.4, () => { const el = $('#s2'); R.el = el; R.t = $$('.c', el); const dv = $('.dev', el);
    R.sh = shadow(dv, 380, 1040, 1160, 70); R.l = lap(dv, 1280, 800, WS()); place(R.l, 320, 300); R.site = $('.ws', R.l); }, t => {
    R.el.style.opacity = fade(t, 3.0, 7.35); up(R.t[0], t, 3.15, 20); up(R.t[1], t, 3.3, 30);
    const p = P(t, 3.2, 1.6, E.outQuart);
    T(R.l, { y: (1 - p) * 260, s: lerp(1, 1.035, P(t, 3.2, 4.2)), o: P(t, 3.2, .6) }); R.sh.style.opacity = p;
    T(R.site, { y: -P(t, 5.0, 2.2, E.inOutCubic) * 240 });
  }); }

/* ───── 3 · three product cards ───── */
{ const R = {};
  scene('s3', 7.0, 11.4, () => { const el = $('#s3'); R.el = el; R.h = $('.c', el); R.cd = $$('.cd', el);
    const v = $$('.vis', el);
    R.l = lap(v[0], 1280, 800, WS()); Object.assign(R.l.style, { left: '27px', top: '285px', transform: 'scale(.36)' });
    R.tb = tab(v[1], 1100, 780, DB()); Object.assign(R.tb.style, { left: '37px', top: '270px', transform: 'scale(.4)' });
    R.ph = pho(v[2], 380, 800, ST()); Object.assign(R.ph.style, { left: '162px', top: '220px', transform: 'scale(.5)' });
    R.c = chart(R.tb); }, t => {
    R.el.style.opacity = fade(t, 7.0, 11.35); up(R.h, t, 7.15, 30);
    R.cd.forEach((c, i) => up(c, t, 7.45 + i * .14, 80));
    count(R.tb, P(RS.TQ, 8.2, 1.2, E.outCubic)); R.c.p.style.strokeDashoffset = R.c.L * (1 - P(t, 8.2, 1.4, E.inOutCubic));
    T($('.ka', R.ph), { y: -P(t, 8.6, 2, E.inOutCubic) * 80 });
  }); }

/* ───── 4 · black statement slides ───── */
{ const R = {};
  const W = [11.1, 12.4, 13.7, 15.2];
  scene('s4', 11.0, 15.4, () => { R.el = $('#s4'); R.w = $$('#s4 .wd'); R.sub = $('#s4 .lead'); }, t => {
    R.el.style.opacity = fade(t, 11.0, 15.35);
    R.w.forEach((w, i) => { const p = P(t, W[i], .8, E.outQuart), q = P(t, W[i + 1] - .35, .35, E.inCubic); T(w, { y: (1 - p) * 40 - q * 20, o: P(t, W[i], .45) * (i < 2 ? 1 - q : 1), b: (1 - p) * 6 + q * 6 * (i < 2) }); });
    up(R.sub, t, 13.95, 20);
  }); }

/* ───── 5 · Fifty Villagers ───── */
{ const R = {};
  scene('s5', 15.0, 19.4, () => { const el = $('#s5'); R.el = el; R.tx = $$('.txt>div', el); const dv = $('.dev', el);
    R.sh = shadow(dv, 880, 880, 1000, 60); R.tb = tab(dv, 1100, 780, DB()); place(R.tb, 830, 175, .9); R.c = chart(R.tb); }, t => {
    R.el.style.opacity = fade(t, 15.0, 19.35); R.tx.forEach((e, i) => up(e, t, 15.3 + i * .15, 30));
    const p = P(t, 15.15, 1.5, E.outQuart);
    T(R.tb, { x: (1 - p) * 300, s: .9 * lerp(1, 1.03, P(t, 15, 4.4)), o: P(t, 15.15, .6) }); R.sh.style.opacity = p;
    count(R.tb, P(RS.TQ, 15.9, 1.3, E.outCubic)); R.c.p.style.strokeDashoffset = R.c.L * (1 - P(t, 16.0, 1.6, E.inOutCubic));
  }); }

/* ───── 6 · Kalam Ashram ───── */
{ const R = {};
  scene('s6', 19.0, 23.4, () => { const el = $('#s6'); R.el = el; R.tx = $$('.txt>div', el); const dv = $('.dev', el);
    R.sh = shadow(dv, 470, 960, 480, 50); R.ph = pho(dv, 380, 800, KA()); place(R.ph, 520, 140); R.in = $('.ka', R.ph); }, t => {
    R.el.style.opacity = fade(t, 19.0, 23.35); R.tx.forEach((e, i) => up(e, t, 19.45 + i * .15, 30));
    const p = P(t, 19.15, 1.5, E.outQuart);
    T(R.ph, { y: (1 - p) * 220, s: lerp(1, 1.03, P(t, 19, 4.4)), o: P(t, 19.15, .6) }); R.sh.style.opacity = p;
    T(R.in, { y: -P(t, 21.0, 1.8, E.inOutCubic) * 120 });
  }); }

/* ───── 7 · the family shot ───── */
{ const R = {};
  scene('s7', 23.0, 26.4, () => { const el = $('#s7'); R.el = el; R.h = $('.c', el); const dv = $('.dev', el);
    R.sh = shadow(dv, 300, 910, 1320, 60);
    R.tb = tab(dv, 1100, 780, DB()); R.l = lap(dv, 1280, 800, WS()); R.ph = pho(dv, 380, 800, KA());
    place(R.l, 530, 330, .67); place(R.tb, 250, 470, .5); place(R.ph, 1390, 450, .56); count(R.tb, 1); const c = chart(R.tb); c.p.style.strokeDashoffset = 0; }, t => {
    R.el.style.opacity = fade(t, 23.0, 26.35); up(R.h, t, 23.2, 30);
    [R.l, R.tb, R.ph].forEach((d, i) => { const p = P(t, 23.3 + [0, .12, .24][i], 1.3, E.outQuart); T(d, { y: (1 - p) * 180, s: d._s * lerp(1, 1.02, P(t, 23, 3.4)), o: P(t, 23.3 + [0, .12, .24][i], .6) }); });
    R.sh.style.opacity = P(t, 23.4, 1);
  }); }

/* ───── 8 · end card ───── */
{ const R = {};
  scene('s8', 26.0, 30.01, () => { R.el = $('#s8'); R.l = $$('#s8 .c'); }, t => {
    R.el.style.opacity = P(t, 26.0, .6, E.outCubic); R.l.forEach((e, i) => up(e, t, 26.3 + i * .35, [50, 30, 20][i]));
    T(R.el, { s: lerp(1.02, 1, P(t, 26, 4, E.outCubic)), o: P(t, 26.0, .6, E.outCubic) });
  }); }

Reel.start({ W: 1920, H: 1080, accent: '#0071e3', audio: '../assets/showreel-vol3-audio.m4a',
  fonts: ['400 20px Inter', '500 20px Inter', '600 20px Inter', '700 20px Inter'],
  fx: { hud: false, wipes: [], cover: null, shake: [], flash: [] } });
})();
