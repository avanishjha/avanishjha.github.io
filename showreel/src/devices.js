/* Shared device mockups + screen UIs for Vol. 03 and Vol. 04 (light, keynote style). */
(() => {
'use strict';
const { T, txt, $, $$ } = Reel;
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

window.Dev = { WS, DB, KA, ST, lap, tab, pho, shadow, place, chart, count };
})();
