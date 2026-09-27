"""
AVANISH JHA — SHOWREEL 2026 · VOL. 05 · original soundtrack (Vol. 02 groove, new arrangement).
128 BPM (beat = 0.46875s, bar = 1.875s, 16 bars = 30s), F minor.
Future-house groove: punchy kick, swung hats, off-beat bass, supersaw
chord stabs, FM-bell arps — and a bansuri-style flute for Kalam Ashram.
Cues line up with vol5.js.

    python3 audio5.py out.wav
"""
import sys
import numpy as np
from synth import *

reseed(505)
B = 60 / 128
def bt(n): return n * B
BAR = 4 * B
STEP = B / 4                              # 16th note
DUR = 30.0
N = int(SR * DUR)
L = N + SR * 4
drums, bass, pad, arp, mel, sfx = (Bus(n, L) for n in ['drums', 'bass', 'pad', 'arp', 'mel', 'sfx'])
KICKS = []

# ───────────────────────── instruments (Vol. 02 colour) ─────────────────────────
def lay(*xs):
    """Sum one-shot sounds of different lengths (zero-padded)."""
    out = np.zeros(max(len(x) for x in xs))
    for x in xs: out[:len(x)] += x
    return out

def kick2(g=1.0):
    return kick(f0=190, f1=50, pk=42, ak=8.5, dur=.38, click=.55) * g

def tok(f=820):
    n = S(.07); t = T(n)
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 60) + bp(noise(n), 2000, 6000) * np.exp(-t * 200) * .4)

def shaker():
    n = S(.09); t = T(n)
    return bp(noise(n), 5000, 11000) * np.exp(-t * 45) * (1 - np.exp(-t * 300))

def fm(f, dur=.5, ratio=3.5, idx=2.2, k=8.0):
    n = S(dur); t = T(n)
    mod = np.sin(2 * np.pi * f * ratio * t) * idx * np.exp(-t * k * 1.4)
    return np.sin(2 * np.pi * f * t + mod) * np.exp(-t * k) * (1 - np.exp(-t * 2500))

def flute(f, dur, vib=.011):
    n = S(dur + .15); t = T(n)
    vibr = 1 + vib * np.sin(2 * np.pi * 5.3 * t) * np.clip((t - .12) / .25, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vibr) / SR
    tone = np.sin(ph) + .2 * np.sin(2 * ph) + .07 * np.sin(3 * ph)
    breath = bp(noise(n), f * 1.4, min(f * 4.5, 16000)) * .16 * (1 + np.exp(-t * 18))
    env = np.minimum(1, t / .06) * np.where(t > dur, np.clip(1 - (t - dur) / .15, 0, 1), 1)
    return (tone + breath) * env * .5

_stab_cache = {}
def stab(notes, dur=.26, cut=3400):
    key = (tuple(notes), dur, cut)
    if key not in _stab_cache:
        n = S(dur + .2); t = T(n); st = np.zeros((2, n))
        for m in notes:
            f = mtof(m)
            for v, det in enumerate([-.13, -.06, 0, .06, .13]):
                st += pan2(saw_add(f * 2 ** (det / 12), n, top=min(7000, cut * 2), ph=R.random() * 6.28), (-.85, -.4, 0, .4, .85)[v]) * .09
        env = np.exp(-t * 6.5) * np.minimum(1, t / .003) * np.where(t > dur, np.exp(-(t - dur) * 25), 1)
        _stab_cache[key] = np.vstack([lp(st[0], cut), lp(st[1], cut)]) * env
    return _stab_cache[key]

def bass_hit(m, dur=.19, cut=900):
    n = S(dur + .04); t = T(n); f = mtof(m)
    x = lp(saw_add(f, n, 2200), cut) * 1.1 + np.sin(2 * np.pi * f * t) * .75
    env = np.minimum(1, t / .003) * (.55 + .45 * np.exp(-t * 9)) * np.where(t > dur, np.exp(-(t - dur) * 90), 1)
    return np.tanh(1.5 * x * env)

def sub(m, dur, g=1.0):
    n = S(dur); t = T(n)
    return np.sin(2 * np.pi * mtof(m) * t) * np.minimum(1, t / .05) * np.minimum(1, (dur - t) / .2 + .0001).clip(0, 1) * g

def pad2(t0, t1, notes, cut=1600, g=1.0, att=.3, rel=.6):
    n = S(t1 - t0 + rel); t = T(n); st = np.zeros((2, n))
    for m in notes:
        f = mtof(m)
        for v, det in enumerate([-.09, 0, .09]):
            st += pan2(saw_add(f * 2 ** (det / 12), n, top=min(5000, cut * 2.5), ph=R.random() * 6.28), (-.6, 0, .6)[v]) * .12
    env = np.minimum(1, t / att) * np.where(t > (t1 - t0), np.exp(-(t - (t1 - t0)) * 6), 1)
    pad.add(np.vstack([hp(lp(st[0], cut), 140), hp(lp(st[1], cut), 140)]) * env * g, t0)

def sparkle(t0, dur, rate=30, lo=84, hi=100, g=.12, seed=1, pan=0.0):
    r = np.random.default_rng(seed); tt = 0.0; scale = [0, 3, 5, 7, 10]
    while tt < dur:
        m = 12 * (lo // 12) + scale[r.integers(5)] + 12 * r.integers(0, (hi - lo) // 12 + 1)
        sfx.add(fm(mtof(m), .35, 2.0, 1.2, 14), t0 + tt, g * (.4 + .6 * r.random()), pan=pan + r.uniform(-.6, .6), rev=.5)
        tt += 1 / rate * (.4 + r.random())

def keys(t0, n, spacing, g=.3, seed=3, pan=-.25):
    r = np.random.default_rng(seed)
    for i in range(n): sfx.add(lay(click(2200 + r.random() * 1800, .012), tok(1400 + r.random() * 600) * .15), t0 + i * spacing + r.uniform(-.004, .004), g, pan=pan)

# ───────────────────────── harmony ─────────────────────────
CH = {
    'Fm': ([53, 56, 60, 65, 68], 41), 'Db': ([49, 53, 56, 61, 65], 37), 'Ab': ([48, 51, 56, 60, 63], 44), 'Eb': ([51, 55, 58, 63, 67], 39),
    'Bbm': ([49, 53, 58, 61, 65], 46), 'C': ([48, 52, 55, 60, 64], 36), 'Fm9': ([53, 56, 60, 65, 67, 72], 41), 'Ab9': ([51, 56, 60, 63, 70, 72], 44),
}
PROG = [(0, 'Fm'), (bt(4), 'Db'), (bt(8), 'Fm'), (bt(12), 'Db'), (bt(14), 'Eb'), (bt(16), 'Fm'), (bt(20), 'Db'), (bt(24), 'Ab'), (bt(26), 'Eb'),
        (bt(28), 'Fm'), (bt(32), 'Db'), (bt(34), 'C'), (bt(36), 'Bbm'), (bt(40), 'Fm'), (bt(42), 'C'), (bt(44), 'Fm'), (bt(48), 'Db'), (bt(50), 'Eb'),
        (bt(52), 'Fm'), (bt(52) + .625, 'Db'), (bt(52) + 1.25, 'Eb'), (bt(56), 'Fm9'), (bt(60), 'Ab9'), (31, None)]
def chord_at(t):
    c = 'Fm'
    for a, n in PROG:
        if t >= a and n: c = n
    return c

# ───────────────────────── grooves ─────────────────────────
def groove(a, b, kick_=True, clap_=True, hats=True, bass_=True, stabs=True, openhat=True, perc=False, g=1.0):
    s = 0
    while True:
        t = a + s * STEP
        if t >= b - 1e-6: break
        st = s % 16; sw = .022 if st % 2 else 0; c = chord_at(t); notes, root = CH[c]
        if kick_ and st % 4 == 0: drums.add(kick2(), t, .95 * g); KICKS.append(t)
        if clap_ and st in (4, 12): drums.add(clap(), t, .62 * g, rev=.22)
        if hats: drums.add(hat(), t + sw, (.2 if st % 2 else .13) * g, pan=.25)
        if openhat and st in (2, 6, 10, 14): drums.add(hat(open_=True), t, .16 * g, pan=-.2)
        if perc and st in (3, 7, 11, 14): drums.add(tok(760 if st != 14 else 1020), t + sw, .22 * g, pan=.45)
        if bass_ and st in (2, 6, 10, 14): bass.add(bass_hit(root + (12 if st == 14 else 0)), t, .9 * g)
        if stabs and st in (0, 3, 6, 10, 12): arp.add(stab([m + 12 for m in notes[:4]]), t, .5 * g, rev=.3)
        s += 1

def arp_bells(a, b, g=.28, octave=24, pat=(0, 2, 3, 4, 3, 2, 1, 2)):
    s = 0
    while a + s * STEP < b - 1e-6:
        t = a + s * STEP; notes = CH[chord_at(t)][0]; m = notes[pat[s % len(pat)] % len(notes)] + octave
        arp.add(fm(mtof(m), .4, 3.5, 1.8, 9), t, g * (1.15 if s % 4 == 0 else .85), pan=.4 * np.sin(s * .8), rev=.35)
        s += 1

def fill(t0, n=8, g=.5):
    for i in range(n): drums.add(snare(.12, 210 + i * 12), t0 + i * STEP / 2, g * (.25 + .75 * i / n))

# ───────────────────────── arrangement ─────────────────────────
# pads under everything except the very top
pad2(0, bt(8), [53, 60, 65], cut=700, g=.7, att=1.8)
for (a, c), (b, _) in zip(PROG[2:-3], PROG[3:-2]):
    if a < bt(36) or a >= bt(44): pad2(a, b, CH[c][0], cut=1500, g=.75)
pad2(bt(36), bt(40), CH['Bbm'][0], cut=1100, g=.9, att=.5); pad2(bt(40), bt(42), CH['Fm'][0], cut=1100, g=.9); pad2(bt(42), bt(44), CH['C'][0], cut=1100, g=.9)

def blip(f=1800, g=.3, t0=0.0, pan=0.0):
    sfx.add(lay(click(f, .012), fm(f / 2, .18, 2, 1, 22) * .6), t0, g, pan=pan)

# ── A · preloader: odometer ticks on the beat, curtain lifts (0 – 3.75) ──
bass.add(sub(41, 3.6, .22), 0)
for i in range(26): drums.add(hp(hat(), 5000), .1 + i * STEP, .04 + .0045 * i, pan=.3 * np.sin(i))
for i, tt in enumerate([bt(1), bt(2), bt(3), bt(4), bt(5), bt(6), bt(6.5)]):
    sfx.add(lay(tok(700 + 90 * i), pop(260 + 40 * i, 800 + 120 * i, .07) * .7), tt, .38, pan=-.3 + .1 * i)
    arp.add(fm(mtof([72, 75, 77, 79, 80, 84, 87][i]), .35, 3.5, 1.6, 10), tt, .22, pan=.3, rev=.4)
for tt in [bt(4), bt(5), bt(6)]: drums.add(lp(kick2(), 1200), tt, .55); KICKS.append(tt)
sfx.add(riser(2.2, 250, 9000), 1.1, .42)
fill(bt(7), 8, .5)
sfx.add(whoosh(.55, 150, 9000, .9), 3.28, .85, rev=.3); sfx.add(revcym(.45), 3.3, .45)

# ── B · hero drops: kinetic headline, badge, click → lime flood (3.75 – 7.5) ──
sfx.add(impact(1.0), 3.75, .85, rev=.5); drums.add(crash(2.0, 1.6), 3.75, .4)
groove(3.75, 6.56)
for i in range(4): sfx.add(fm(mtof([77, 80, 84, 89][i]), .3, 3, 1.4, 12), 3.45 + i * .17, .28, pan=-.4 + i * .25, rev=.3)
sfx.add(whoosh(.35, 500, 7000, .5), 4.1, .3)                                    # pill opens
sfx.add(sweep(noise(S(.4)), 1500, 6000, 'band', .7) * np.hanning(S(.4)), bt(10.5), .25, pan=.2)   # scribble
blip(2100, .3, 5.8, .5)                                                          # badge hover
sfx.add(click(1800, .02), bt(14), .7); sfx.add(pop(300, 1000, .09), bt(14), .45, rev=.3)
sfx.add(riser(.85, 500, 11000), 6.62, .6); sfx.add(whoosh(.6, 120, 8000, .9), 6.75, .9, rev=.3)
drums.add(snare(.12, 220), bt(15), .3); fill(bt(15) + B / 2, 4, .45)

# ── C1 · crossing marquees surge on every beat (7.5 – 9.375) ──
sfx.add(impact(1.2), 7.5, .95, rev=.55); drums.add(crash(2.2, 1.4), 7.5, .5)
groove(7.5, 9.1, perc=True)
arp_bells(7.5, 9.1, .2)
for i in range(4): sfx.add(whoosh(.3, 200, 3500, .5), 7.5 + i * B, .35, pan=(-.6, .6)[i % 2])
sfx.add(lay(boom(.7, 110, 40, 8, 5), whoosh(.4, 100, 6000, .9) * .8), 9.08, .75, rev=.3)   # band swallows the frame

# ── C2 · bento grid on the 8ths, micro-interactions, FLIP expand (9.375 – 13.125) ──
groove(bt(20), bt(26), perc=True)
arp_bells(bt(20), bt(26), .2, 24, (0, 2, 4, 2, 3, 1, 4, 2))
for i in range(6): sfx.add(lay(tok(520 + i * 80), pop(240 + i * 40, 700 + i * 90, .07) * .6), 9.46 + i * B / 2, .36, pan=-.5 + i * .2)
for i in range(3): blip(1600 + 200 * i, .22, 10.25 + i * .22, .4)
sfx.add(lay(bell(mtof(96), .5, 7), bell(mtof(101), .6, 6) * .7), 10.95, .24, pan=.4, rev=.3)   # added to cart / paid
sfx.add(chatter(1.0, 70, 4000, 61), 10.3, .1, pan=.2)
blip(1900, .25, 11.45, -.2); sfx.add(click(1800, .02), bt(26), .65); sfx.add(pop(300, 1000, .09), bt(26), .4, rev=.3)
sfx.add(riser(.8, 400, 11000), 12.2, .6); sfx.add(whoosh(.6, 150, 8000, .9), 12.35, .8, rev=.3)
fill(bt(26) + B, 8, .5)

# ── D · selected work: title, gallery slides in, stickers, whip-pan (13.125 – 16.875) ──
sfx.add(impact(1.0), bt(28), .85, rev=.55); drums.add(crash(2, 1.6), bt(28), .35)
for i in range(4): sfx.add(fm(mtof([72, 77, 80, 84][i]), .35, 3, 1.5, 10), bt(28) + i * .09, .24, pan=-.3 + .2 * i, rev=.35)
groove(bt(28), bt(35), stabs=False, perc=True)
arp_bells(bt(28), bt(35), .22, 24, (0, 1, 2, 3, 4, 3, 2, 1))
sfx.add(whoosh(.7, 180, 5000, .6), 13.95, .75, pan=.5)                          # gallery slides in
sfx.add(lay(pop(200, 900, .1), boom(.4, 120, 60, 12, 8) * .5), 15.0, .5, pan=.4, rev=.3)   # sticker
sfx.add(chatter(1.0, 70, 4200, 71), 15.05, .1, pan=.4)
fill(bt(35), 8, .55)
sfx.add(whoosh(.6, 150, 9000, .85), 16.45, 1.0, rev=.25)                        # whip-pan

# ── D · Kalam Ashram — half-time, flute (16.875 – 20.625) ──
sfx.add(impact(.6), bt(36), .6, rev=.6)
for tt in np.arange(bt(36), bt(44) - 1e-6, BAR):
    drums.add(kick2(.9), tt, .9); KICKS.append(tt)
    drums.add(kick2(.6), tt + 2.5 * B, .6); KICKS.append(tt + 2.5 * B)
    drums.add(snare(.3, 180), tt + 2 * B, .5, rev=.35)
for i, tt in enumerate(np.arange(bt(36), bt(44) - 1e-6, STEP)): drums.add(shaker(), tt + (.02 if i % 2 else 0), .1 + .06 * (i % 4 == 2), pan=.35)
for tt in np.arange(bt(36), bt(44) - 1e-6, B): bass.add(bass_hit(CH[chord_at(tt)][1], .4, 500), tt, .6)
MEL = [(bt(36), 72, .85), (bt(38), 75, .4), (bt(39), 77, .4), (bt(40), 75, .4), (bt(41), 72, .85), (bt(42) + .47, 70, .4), (bt(43), 68, .9)]
for tt, m, d in MEL:
    mel.add(flute(mtof(m), d), tt, .55, pan=-.1, rev=.45)
sfx.add(lay(pop(200, 900, .1), boom(.4, 120, 60, 12, 8) * .5), 17.45, .5, pan=.4, rev=.3)
blip(1700, .22, 18.1, -.3)
sfx.add(whoosh(.8, 150, 7000, .6), 20.1, .8, rev=.25)                           # ink section slides over

# ── E · the standard: ghost type fills lime on the beat (20.625 – 24.375) ──
sfx.add(impact(.85), bt(44), .75, rev=.5)
groove(bt(44), 23.85, perc=True, stabs=False)
arp_bells(bt(44), 23.85, .18, 24, (0, 4, 2, 3, 1, 4, 2, 3))
for i, tt in enumerate([bt(45), bt(47), bt(49)]):
    sfx.add(sweep(noise(S(.55)), 600, 9000, 'band', .7) * np.hanning(S(.55)), tt, .42, pan=(-.4, 0, .4)[i])
    arp.add(stab([m + 12 for m in CH[chord_at(tt)][0][:4]], .35), tt + .5, .55, rev=.4); drums.add(clap(), tt + .5, .45, rev=.3)
sfx.add(whoosh(.45, 300, 8000, .7), 23.85, .7); sfx.add(revcym(.35), 24.03, .5)

# ── G · Idea. Design. Code. Launch. — one hit per beat (24.375 – 26.25) ──
for i, (tt, c) in enumerate([(bt(52), 'Fm'), (bt(53), 'Db'), (bt(54), 'Eb'), (bt(55), 'C')]):
    sfx.add(impact(.9 + .1 * i), tt, .75, rev=.5); drums.add(kick2(), tt, 1.0); KICKS.append(tt)
    drums.add(clap(), tt, .55, rev=.35); drums.add(crash(1.0, 2.5), tt, .25)
    arp.add(stab([m + 12 for m in CH[c][0]], .4, 4200), tt, .7, rev=.45)
    bass.add(bass_hit(CH[c][1], .4, 700), tt, .9)
    sfx.add(whoosh(.25, 300, 6000, .5), tt - .14, .4, pan=(-.4, .4, -.2, .2)[i])
fill(bt(55) + B / 2, 4, .45)
sfx.add(whoosh(.4, 150, 8000, .8), 25.98, .85, rev=.3)                          # lime slides over

# ── H · contact: resolve, magnetic CTA click (26.25 – 30) ──
sfx.add(impact(1.2), bt(56), .95, rev=.7); drums.add(crash(3.2, 1.0), bt(56), .45)
bass.add(lay(sub(29, 3.7, .8), sub(41, 3.7, .35)), bt(56))
pad2(bt(56), bt(60), CH['Fm9'][0], cut=2400, g=1.1, att=.08, rel=1.2); pad2(bt(60), 30.5, CH['Ab9'][0], cut=2600, g=1.1, att=.3, rel=2.0)
sparkle(26.25, .75, 34, 84, 103, .11, 222)
for j, m in enumerate([77, 80, 84, 89, 92, 96]): sfx.add(bell(mtof(m), 1.8, 2.2), 26.75 + j * .04, .22, pan=-.5 + j * .2, rev=.6)   # name rises
blip(2000, .25, 27.35, -.3)
sfx.add(click(1800, .02), bt(59), .7); sfx.add(pop(300, 1000, .1), bt(59), .5, rev=.35)
for tt in [bt(58), bt(60)]: drums.add(lp(kick2(), 900), tt, .6)
for j, m in enumerate([80, 84, 87, 92]): sfx.add(bell(mtof(m), 2.6, 1.2), bt(60) + j * .06, .22, pan=-.3 + j * .2, rev=.7)
mel.add(flute(mtof(84), 1.6), bt(60) + .1, .3, pan=.1, rev=.7)

# ───────────────────────── mix ─────────────────────────
mix = mixdown([drums, bass, pad, arp, mel, sfx], {'drums': .85, 'bass': .6, 'pad': .42, 'arp': .5, 'mel': .8, 'sfx': 1.05}, KICKS,
              [(3.68, 3.75), (7.43, 7.5), (bt(28) - .07, bt(28)), (bt(56) - .06, bt(56))], N, pad_bus=pad, duck_depth=.6)
write(sys.argv[1] if len(sys.argv) > 1 else 'soundtrack-vol5.wav', mix)
