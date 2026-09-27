"""
AVANISH JHA — SHOWREEL 2026 · VOL. 02 · original soundtrack.
128 BPM (beat = 0.46875s, bar = 1.875s, 16 bars = 30s), F minor.
Future-house groove: punchy kick, swung hats, off-beat bass, supersaw
chord stabs, FM-bell arps — and a bansuri-style flute for Kalam Ashram.
Cues line up with vol2.js.

    python3 audio2.py out.wav
"""
import sys
import numpy as np
from synth import *

reseed(128)
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

# ── A · the pixel (0 – 3.75) ──
for i in range(8): drums.add(hp(hat(), 5000), i * B / 2, .07 + .01 * i, pan=.3)           # ticking clock
bass.add(sub(41, bt(8), .2), 0)
L1, L2 = 19, 26
keys(.3, L1, .034, .42, 5, -.3); keys(1.02, L2, .028, .42, 6, .2)
sfx.add(pop(220, 700, .12), 1.76, .3, rev=.4)                                                # the full stop lands
sfx.add(sweep(noise(S(.5)), 3000, 400, 'band', .9) * np.hanning(S(.5)) * 1.2, 1.875, .45)     # letters fall
sfx.add(whoosh(.45, 300, 3000, .6), 1.95, .5)
for i, (tl, m) in enumerate(zip([2.344, 2.813, 3.047, 3.281, 3.516], [72, 77, 80, 84, 89])):   # mosaic splits
    sfx.add(fm(mtof(m), .5, 2.0, 2.5, 7), tl, .5, pan=(-.3, .3, -.2, .2, 0)[i], rev=.4)
    sfx.add(pop(300 + i * 80, 900 + i * 200, .07), tl, .35)
    drums.add(tom(90 + i * 25, .3), tl, .35)
fill(bt(6), 16, .45)
sfx.add(riser(1.4, 300, 9000), 2.35, .6)
sfx.add(revcym(.6), 3.15, .55)

# ── B · particles (3.75 – 7.5) ──
sfx.add(impact(1.0), 3.75, .85, rev=.5); drums.add(crash(2.0, 1.6), 3.75, .4)
groove(3.75, 7.42, stabs=True)
for i, mt in enumerate([3.75, bt(10), bt(12), bt(14)]):
    sfx.add(whoosh(.55, 400, 7000, .5), mt - .05, .5, pan=(-.4, .4, -.3, .3)[i])
    sparkle(mt, .55, 26, 84, 100, .09, 10 + i)
arp_bells(bt(10), 7.42, .2)
sfx.add(riser(.7, 600, 10000), 6.72, .5)
sfx.add(whoosh(.5, 200, 9000, .3), 7.4, .9, rev=.3)                                           # explosion

# ── C · bento (7.5 – 13.125) ──
sfx.add(impact(1.1), 7.5, .9, rev=.55); drums.add(crash(2.2, 1.5), 7.5, .45)
for i in range(7): sfx.add(lay(pop(260 + i * 40, 700 + i * 90, .08), tok(500 + i * 60) * .4), 7.46 + i * .055, .32, pan=-.6 + i * .2)
groove(7.5, bt(27), perc=True)
arp_bells(7.5, bt(27), .24)
sfx.add(whoosh(.35, 800, 6000, .5), bt(18), .3, pan=-.4)                                      # headline
for i in range(3): sfx.add(click(2600, .018), bt(19 + i * .5), .55, pan=.3)                   # toggles
for tt in [bt(20), bt(22)]: sfx.add(click(1800, .025), tt - .03, .5, pan=.35); sfx.add(lay(bell(mtof(96), .5, 7), bell(mtof(101), .6, 6) * .7), tt, .22, pan=.4, rev=.3)
for i in range(9): sfx.add(fm(mtof(77 + [0, 3, 5, 7, 10, 12, 15, 17, 19][i]), .2, 2, 1, 16), bt(21) + i * .035, .14, pan=-.6 + i * .08)
sfx.add(chatter(.9, 70, 4200, 21), bt(22), .16, pan=.2); sfx.add(bell(mtof(89), 1.0, 3), bt(22) + .92, .3, rev=.4)
sfx.add(click(2000, .02), bt(23) - .02, .6, pan=-.2); sfx.add(sweep(noise(S(.45)), 900, 3500, 'band', .6) * np.hanning(S(.45)), bt(23), .2)
for j, m in enumerate([84, 88, 91, 96]): sfx.add(bell(mtof(m), 1.2, 2.8), bt(24) + j * .05, .3, pan=.3, rev=.45)   # payment success (major lift)
sfx.add(whoosh(.5, 500, 5000, .5), bt(25), .35, pan=.6)                                        # phone scroll
fill(bt(26), 16, .5)
sfx.add(riser(.9, 300, 11000), bt(26) - .3, .6); sfx.add(whoosh(.5, 150, 6000, .75), bt(27) - .05, .8, rev=.3)

# ── D · Fifty Villagers — exploded (13.125 – 16.875) ──
sfx.add(impact(1.0), bt(28), .85, rev=.55); drums.add(crash(2, 1.6), bt(28), .35)
groove(bt(28), bt(35), stabs=False, perc=True)
arp_bells(bt(28), bt(35), .22, 24, (0, 1, 2, 3, 4, 3, 2, 1))
sfx.add(sweep(noise(S(1.0)), 200, 4000, 'band', .8) * np.sin(np.pi * T(S(1.0)) / 1.0) * 1.3, 13.3, .5)   # camera tilts to iso
for i in range(11): sfx.add(lay(tok(420 + i * 45), pop(200 + i * 30, 500 + i * 60, .06) * .5), 13.35 + i * .04 + .3, .3, pan=-.5 + i * .1)
for i in range(4): sfx.add(fm(mtof([84, 87, 89, 91][i]), .3, 3, 1.5, 12), 14.35 + i * .15, .28, pan=(-.5, .5, -.2, .4)[i], rev=.35)
sfx.add(chatter(.9, 80, 3600, 31), 13.9, .15, pan=.3)
sfx.add(lay(bell(mtof(91), .8, 5), bell(mtof(96), .8, 5) * .8), 14.95, .32, pan=.5, rev=.35)       # toast
sfx.add(bell(mtof(103), .4, 9), bt(33), .2, pan=.5)                                            # paid
sfx.add(sweep(noise(S(.6)), 4000, 300, 'band', .8) * np.hanning(S(.6)), 15.9, .45)             # collapse
fill(bt(35), 8, .55)
sfx.add(whoosh(.55, 150, 9000, .8), 16.45, 1.0, pan=0, rev=.25)                                # whip-pan

# ── E · Kalam Ashram — carousel, flute (16.875 – 20.625) ──
sfx.add(impact(.6), bt(36), .6, rev=.6)
for tt in np.arange(bt(36), bt(44) - 1e-6, BAR):
    drums.add(kick2(.9), tt, .9); KICKS.append(tt)
    drums.add(kick2(.6), tt + 2.5 * B, .6); KICKS.append(tt + 2.5 * B)
    drums.add(snare(.3, 180), tt + 2 * B, .5, rev=.35)
for i, tt in enumerate(np.arange(bt(36), bt(44) - 1e-6, STEP)): drums.add(shaker(), tt + (.02 if i % 2 else 0), .1 + .06 * (i % 4 == 2), pan=.35)
for tt in np.arange(bt(36), bt(44) - 1e-6, B): bass.add(bass_hit(CH[chord_at(tt)][1], .4, 500), tt, .6)
MEL = [(bt(36), 72, .85), (bt(38), 73, .4), (bt(39), 72, .4), (bt(40), 70, .4), (bt(41), 68, .85), (bt(42) + .47, 67, .4), (bt(43), 64, .9)]
for tt, m, d in MEL:
    mel.add(flute(mtof(m), d), tt, .55, pan=-.1, rev=.45)
for i, tt in enumerate([bt(38), bt(40), bt(42)]): sfx.add(whoosh(.6, 200, 4000, .5), tt - .05, .45, pan=(.5, -.5, .4)[i])     # carousel turns
sfx.add(chatter(.9, 55, 3200, 41), 17.7, .14, pan=-.4)
for i in range(5): sfx.add(fm(mtof([84, 87, 89, 91, 96][i]), .3, 2, 1.2, 12), 18.3 + i * .08, .2, pan=-.4 + i * .1, rev=.3)
sfx.add(riser(.55, 400, 9000), 20.0, .55); sfx.add(whoosh(.45, 300, 8000, .7), 20.2, .7)

# ── F · code → pixels → deploy (20.625 – 24.375) ──
sfx.add(impact(.8), bt(44), .75, rev=.5)
groove(bt(44), 24.3, perc=True, stabs=False)
arp_bells(bt(44), 24.3, .18, 24, (0, 4, 2, 3, 1, 4, 2, 3))
CODE = [(20.72, .24, 43), (20.98, .22, 33), (21.22, .1, 10), (21.34, .1, 9), (21.47, .34, 38), (21.9, .22, 20), (22.25, .26, 23), (22.56, .06, 6), (22.64, .05, 4), (22.7, .03, 1)]
for i, (s_, d, n) in enumerate(CODE): keys(s_, n, d / n, .3, 60 + i, -.35)
for i, (s_, pk) in enumerate([(21.82, 84), (22.16, 88), (22.54, 91)]):
    z = sweep(noise(S(.3)), 600, 7000, 'band', .5) * np.sin(np.pi * T(S(.3)) / .3) * 1.1
    sfx.add(z, s_ - .28, .4, pan=.2); sfx.add(lay(fm(mtof(pk), .5, 3, 2, 8), pop(400, 1200, .06) * .6), s_, .4, pan=.4, rev=.35)
sfx.add(whoosh(.45, 300, 4000, .5), 22.86, .45, pan=-.3)                                       # terminal slides up
keys(22.97, 16, .015, .3, 77, -.3)
for tt in [23.28, 23.42]: sfx.add(fm(mtof(96), .15, 2, .8, 20), tt, .2, pan=-.2)
sfx.add(riser(.45, 800, 8000), 23.56, .4)
for j, m in enumerate([89, 93, 96, 101]): sfx.add(bell(mtof(m), 1.1, 3), 24.0 + j * .045, .3, pan=.4, rev=.45)   # live!
for i in range(4): sfx.add(chatter(.4, 60, 4000 + i * 300, 90 + i), 23.6 + i * .06, .08, pan=.5)
sfx.add(revcym(.35), 24.03, .5)

# ── G · Design. Develop. Deliver. (24.375 – 26.25) ──
for i, (tt, c) in enumerate([(bt(52), 'Fm'), (bt(52) + .625, 'Db'), (bt(52) + 1.25, 'Eb')]):
    sfx.add(impact(1.0 + .1 * i), tt, .8, rev=.5); drums.add(kick2(), tt, 1.0); KICKS.append(tt)
    drums.add(clap(), tt, .6, rev=.35); drums.add(crash(1.2, 2.5), tt, .3)
    arp.add(stab([m + 12 for m in CH[c][0]], .5, 4200), tt, .7, rev=.45)
    bass.add(bass_hit(CH[c][1], .5, 700), tt, .9)
    sfx.add(sweep(noise(S(.35)), 2000, 300, 'band', .8) * np.hanning(S(.35)), tt + .02, .3, pan=(-.4, .4, 0)[i])
for tt in [bt(52) + .47, bt(52) + 1.1]: fill(tt, 4, .35)
sfx.add(sweep(noise(S(.5)), 9000, 800, 'band', .6) * np.exp(-T(S(.5)) * 4) * 1.4, 26.02, .5, rev=.5)   # "Deliver." shatters
sparkle(26.02, .5, 40, 91, 108, .1, 111)

# ── H · outro (26.25 – 30) ──
sfx.add(impact(1.2), bt(56), .95, rev=.7); drums.add(crash(3.2, 1.0), bt(56), .45)
bass.add(lay(sub(29, 3.7, .8), sub(41, 3.7, .35)), bt(56))
pad2(bt(56), bt(60), CH['Fm9'][0], cut=2400, g=1.1, att=.08, rel=1.2); pad2(bt(60), 30.5, CH['Ab9'][0], cut=2600, g=1.1, att=.3, rel=2.0)
sparkle(26.25, .75, 34, 84, 103, .11, 222)
for j, m in enumerate([77, 80, 84, 89, 92, 96]): sfx.add(bell(mtof(m), 1.8, 2.2), 26.95 + j * .04, .22, pan=-.5 + j * .2, rev=.6)   # name resolves
sfx.add(chatter(.6, 55, 4200, 301), 27.25, .14); sfx.add(pop(300, 900, .1), 27.6, .45, rev=.35); sfx.add(chatter(.5, 60, 4600, 302), 27.9, .12, pan=.3)
for tt in [bt(58), bt(60)]: drums.add(lp(kick2(), 900), tt, .6)
for j, m in enumerate([80, 84, 87, 92]): sfx.add(bell(mtof(m), 2.6, 1.2), bt(60) + j * .06, .22, pan=-.3 + j * .2, rev=.7)
mel.add(flute(mtof(84), 1.6), bt(60) + .1, .3, pan=.1, rev=.7)

# ───────────────────────── mix ─────────────────────────
mix = mixdown([drums, bass, pad, arp, mel, sfx], {'drums': .85, 'bass': .6, 'pad': .42, 'arp': .5, 'mel': .8, 'sfx': 1.05}, KICKS,
              [(3.68, 3.75), (bt(27) - .07, bt(28)), (bt(52) - .07, bt(52)), (bt(56) - .06, bt(56))], N, pad_bus=pad, duck_depth=.6)
write(sys.argv[1] if len(sys.argv) > 1 else 'soundtrack-vol2.wav', mix)
