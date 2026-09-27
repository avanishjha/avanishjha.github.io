"""
AVANISH JHA — SHOWREEL 2026 · original soundtrack, synthesized from scratch.
120 BPM (beat = 0.5s, bar = 2s), D minor. Every hit is placed on the same
timeline as reel.js so sound and picture land together.

    python3 audio.py out.wav
"""
import sys
import numpy as np
from scipy import signal
from synth import *


DUR = 30.0
N = int(SR * DUR)
L = N + SR * 4                      # room for tails

drums, bass, pad, arp, mel, sfx = (Bus(n, L) for n in ['drums', 'bass', 'pad', 'arp', 'mel', 'sfx'])

# ───────────────────────── harmony ─────────────────────────
CH = {  # pad voicing, bass root (MIDI)
    'Dm': ([50, 53, 57, 62, 65], 38), 'Bb': ([46, 50, 53, 58, 62], 34), 'F': ([45, 48, 53, 57, 60], 41),
    'C': ([48, 52, 55, 60, 64], 36), 'Gm': ([46, 50, 55, 58, 62], 43), 'A': ([45, 49, 52, 57, 61], 33),
    'Dm9': ([50, 53, 57, 62, 64, 69], 38),
}
PROG = [(0, 2, 'Dm'), (2, 4, 'Dm'), (4, 6, 'Bb'), (6, 8, 'F'), (8, 10, 'C'), (10, 12, 'Dm'), (12, 14, 'Bb'), (14, 15, 'F'), (15, 16, 'C'),
        (16, 18, 'Dm'), (18, 20, 'Bb'), (20, 22, 'Gm'), (22, 24, 'A'), (24, 25, 'Bb'), (25, 26, 'C'), (26, 30, 'Dm9')]
def chord_at(t):
    for a, b, c in PROG:
        if a <= t < b: return c
    return 'Dm9'

def pad_chord(t0, t1, name, cutoff=1900, g=1.0, att=.25, rel=.5):
    notes = CH[name][0]; n = S(t1 - t0 + rel); t = T(n)
    st = np.zeros((2, n))
    for m in notes:
        f = mtof(m)
        for v, det in enumerate([-.11, -.05, 0, .05, .11]):
            x = saw_add(f * 2 ** (det / 12), n, top=min(5000, cutoff * 2.5), ph=R.random() * 6.28)
            st += pan2(x, (-.7, -.35, 0, .35, .7)[v]) * .12
    env = np.minimum(1, t / att) * np.where(t > (t1 - t0), np.exp(-(t - (t1 - t0)) * 7), 1)
    st = np.vstack([hp(lp(st[0], cutoff), 150), hp(lp(st[1], cutoff), 150)]) * env * g
    pad.add(st, t0)

def bass_note(t0, dur, m, g=1.0, cut=650):
    n = S(dur + .06); t = T(n); f = mtof(m)
    x = lp(saw_add(f, n, 2200), cut) * 1.3 + np.sin(2 * np.pi * f / 2 * t) * .4 + np.sin(2 * np.pi * f * t) * .35
    env = np.minimum(1, t / .004) * (.72 + .28 * np.exp(-t * 14)) * np.where(t > dur, np.exp(-(t - dur) * 60), 1)
    bass.add(np.tanh(1.3 * x * env) * g, t0)

def pluck(t0, m, g=1.0, pan=0.0, k=15, cut=4200, rev=.25):
    n = S(.45); t = T(n); f = mtof(m)
    x = np.zeros(n)
    for h in range(1, int(7000 / f) + 1, 2): x += np.sin(2 * np.pi * h * f * t) / h
    x = lp(x * np.exp(-t * k), cut) * .8
    arp.add(x * g, t0, pan=pan, rev=rev)

# ───────────────────────── arrangement ─────────────────────────
KICKS = []
def K_(t, g=1.0, **kw): KICKS.append(t); drums.add(kick(**kw), t, g)

# ── pads (whole piece) ──
for a, b, c in PROG:
    if a < 2: pad_chord(a, b, c, cutoff=650, g=.55, att=1.6)
    elif 20 <= a < 24: pad_chord(a, b, c, cutoff=1300, g=.8, att=.5)
    elif a >= 26: pad_chord(a, 30.5, c, cutoff=2600, g=1.0, att=.02, rel=2.5)
    else: pad_chord(a, b, c, cutoff=2100 if a >= 10 else 1700, g=.85)

# ── A · ignition (0–2) ──
sfx.add(pop(180, 520, .16), 0.02, .9, rev=.3)
drums.add(boom(.9, 70, 38, 12, 5), 0.0, .9)
for bt in [.5, 1.0]:
    drums.add(lp(kick(120, 44, 30, 7, .5, .1), 700), bt, .75)
for i in range(12): sfx.add(click(2600 + R.random() * 1500, .01), .3 + i * .05, .55, pan=-.2 + i * .03)
sfx.add(chatter(.55, 45, 5000, 3), .62, .22, pan=.2)
sfx.add(riser(1.1, 200, 6000), .9, .55, rev=.3)
sfx.add(whoosh(.55, 800, 9000, .7), 1.4, .45, pan=0)
sfx.add(whoosh(.7, 180, 3000, .45), 1.72, .9, rev=.35)
bass.add(np.sin(2 * np.pi * mtof(26) * T(S(2))) * np.minimum(1, T(S(2)) / 1.5) * .35, 0)

# ── B · promise (2–4) ──
sfx.add(impact(.8), 2.0, .8, rev=.45); drums.add(crash(1.6, 2.4), 2.0, .25)
K_(2.0); K_(3.0)
for k in range(8): drums.add(hat(), 2.25 + k * .5 if k < 4 else 2.25 + (k - 4) * .5, .0)
for tt in np.arange(2.25, 4.0, .5): drums.add(hat(), tt, .28, pan=.25)
for tt in [2.0, 3.0]: bass_note(tt, .9, 38, .8)
for i, wt in enumerate([2.0, 2.08, 2.16, 2.34, 2.42, 2.52, 2.62]): sfx.add(blip(1500 + i * 90, .07, .2, 60), wt + .03, .22, pan=-.3 + i * .1)
sfx.add(pop(260, 700, .12), 2.37, .35, pan=.6)
sfx.add(sweep(noise(S(.5)), 800, 5000, 'band', .8) * np.sin(np.pi * T(S(.5)) / .5) * 1.2, 2.7, .35)
sfx.add(pop(200, 620, .14), 3.02, .8, rev=.3)
for i in range(3): sfx.add(pop(500, 1300, .06), 3.18 + i * .05, .35, pan=-.2 + .2 * i)
sfx.add(whoosh(.35, 400, 5000, .6), 3.62, .45)
sfx.add(revcym(.5), 3.5, .5, rev=.2)
sfx.add(riser(.55, 600, 9000, False), 3.45, .4)

# ── C · BUILD IT (4–6) ──
sfx.add(impact(1.25), 4.0, 1.0, rev=.55); drums.add(crash(2.4, 1.3), 4.0, .5); drums.add(clap(), 4.0, .7, rev=.35)
for i in range(9): sfx.add(click(1800 + i * 160, .014), 4.0 + i * .022, .5, pan=-.5 + i * .12)
for k in range(4): K_(4.0 + k * .5)
for tt in [4.5, 5.5]: drums.add(clap(), tt, .75, rev=.25)
for tt in np.arange(4.0, 6.0, .25): drums.add(hat(), tt, .22 if (tt * 4) % 2 else .32, pan=.25)
for k in range(8): bass_note(4.0 + k * .25, .2, 34 + (12 if k % 4 == 3 else 0), .9)
sfx.add(glitch(.14, 660), 4.62, .35, pan=-.4); sfx.add(glitch(.1, 990), 5.26, .3, pan=.4)
sfx.add(chatter(.7, 60, 4800, 5), 4.55, .2, pan=.3)
sfx.add(whoosh(.5, 300, 6000, .6), 5.0, .45, pan=-.3)
sfx.add(whoosh(.75, 200, 5000, .6), 5.55, .8, rev=.25)

# ── D · capabilities (6–10) ──
for k in range(6): K_(6.0 + k * .5)
for tt in [6.5, 7.5, 8.5]: drums.add(clap(), tt, .75, rev=.25)
for tt in np.arange(6.0, 9.0, .25): drums.add(hat(open_=(abs((tt * 2) % 1 - .5) < .01)), tt, .26 if (tt * 4) % 2 else .2, pan=.2)
for k in range(12): bass_note(6.0 + k * .25, .2, (41 if 6.0 + k * .25 < 8 else 36) + (12 if k % 4 == 2 else 0), .9)
cards = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5]
for i, ct in enumerate(cards):
    sfx.add(whoosh(.28, 1200, 9000, .3), ct - .08, .35, pan=(-1) ** i * .4)
    pluck(ct, [62, 65, 69, 72, 74, 77][i], .7, pan=(-1) ** i * .3, k=10)
# c2 UI
sfx.add(click(2400, .02), 6.67, .7, pan=-.5); sfx.add(pop(600, 1200, .05), 6.69, .3, pan=-.5)
for j in range(3): sfx.add(click(3400, .012), 6.66 + j * .07, .5, pan=.5)
sfx.add(click(1500, .025), 6.8, .65, pan=.4)
# c3 bars
for i in range(17): sfx.add(blip(500 * 2 ** (i / 12 * 1.4), .06, .05, 70), 7.0 + i * .012, .12, pan=-.8 + i * .1)
sfx.add(sweep(noise(S(.4)), 500, 6000, 'band', .6) * np.hanning(S(.4)), 7.04, .25)
# c4 price + add to cart
sfx.add(chatter(.28, 90, 3600, 8), 7.55, .25, pan=.5)
sfx.add(click(1700, .03), 7.76, .8, pan=.4)
sfx.add(bell(mtof(88), .8, 5) + bell(mtof(93), .8, 5) * .8, 7.81, .45, pan=.5, rev=.3)
# c5 scroll
sfx.add(sweep(noise(S(.5)), 2000, 400, 'band', .9) * np.hanning(S(.5)) * 1.4, 8.0, .4)
# c6 phone
sfx.add(whoosh(.4, 250, 4000, .5), 8.5, .55, pan=.5); sfx.add(tom(95, .3), 8.72, .5, pan=.4)
# stutter 9.0 / 9.167 / 9.333
for i, st in enumerate([9.0, 9 + 1 / 6, 9 + 2 / 6]):
    drums.add(snare(tone=200 + i * 30), st, .7, rev=.3); drums.add(tom(110 + i * 40), st, .8)
    bass_note(st, .15, 36 + i * 2, .9)
    K_(st, .8)
# Anything.
sfx.add(impact(.7), 9.5, .7, rev=.5); drums.add(clap(), 9.5, .6, rev=.4)
for i in range(8): drums.add(snare(.12, 240), 9.5 + i * .0625, .18 + i * .06)
sfx.add(riser(.48, 500, 11000), 9.5, .8)
sfx.add(whoosh(.3, 400, 12000, .9), 9.72, .9)

# ── E · process (10–16) ──
sfx.add(impact(1.0), 10.0, .9, rev=.5); drums.add(crash(2.0, 1.8), 10.0, .4)
for k in range(12):
    tt = 10.0 + k * .5
    K_(tt)
    if k % 2: drums.add(clap(), tt, .6, rev=.2)
for tt in np.arange(10.0, 16.0, .125): drums.add(hat(), tt, .15 if (tt * 8) % 2 else .24, pan=.3)
for tt in np.arange(10.0, 16.0, .25):
    c = chord_at(tt); root = CH[c][1]
    bass_note(tt, .2, root + (12 if int(tt * 4) % 4 == 2 else 0), .8)
AP = [0, 2, 3, 4, 3, 2, 1, 2]
for i, tt in enumerate(np.arange(10.0, 16.0, .125)):
    notes = CH[chord_at(tt)][0]; m = notes[AP[i % 8] % len(notes)] + 12
    pluck(tt, m, .32 + .1 * (i % 4 == 0), pan=.35 * np.sin(i * .7), k=18, cut=3000 + 1500 * (tt > 12.6))
for c in range(12): sfx.add(tick(), 10.12 + c * .025, .6, pan=-.8 + c * .14)
sfx.add(chatter(.4, 50, 5200, 11), 10.1, .18)
WFT = [11.0, 11.04, 11.07, 11.09, 11.11, 11.13, 11.16, 11.22, 11.26, 11.3, 11.31, 11.36, 11.44, 11.48, 11.54, 11.58, 11.66, 11.72, 11.78]
for i, wt in enumerate(WFT): sfx.add(pop(300 + i * 25, 800 + i * 40, .06), wt + .02, .28, pan=-.6 + i * .06)
sfx.add(click(2200, .02), 11.66, .7, pan=.4)
sfx.add(sweep(noise(S(.38)), 600, 1800, 'band', .5) * np.hanning(S(.38)) * .8, 11.72, .35, pan=.3)
sfx.add(click(2600, .02), 12.1, .7, pan=.3); sfx.add(blip(880, .15, 0, 25), 12.1, .35, pan=.3)
sfx.add(whoosh(.4, 500, 5000, .5), 12.42, .35, pan=.7)
for i in range(4): sfx.add(pop(400, 1100 + i * 150, .05), 12.6 + i * .05, .25, pan=.7)
sw = sweep(noise(S(.95)), 300, 9000, 'band', .7, curve='log') * np.sin(np.pi * T(S(.95)) / .95) * 1.3
for j, m in enumerate([74, 77, 81, 84, 86, 89, 93]):
    b_ = bell(mtof(m), .6, 6) * .35; i0 = S(j * .12); k_ = min(len(b_), len(sw) - i0); sw[i0:i0 + k_] += b_[:k_]
sfx.add(sw, 12.62, .55, rev=.45)
for i in range(2): sfx.add(pop(500, 1300, .07), 13.36 + i * .2, .35, pan=.4)
sfx.add(click(3000, .01), 13.92, .4, pan=-.5)
sfx.add(whoosh(.35, 800, 6000, .4), 13.82, .3)
sfx.add(click(1900, .03), 14.32, .8, pan=.6)
sfx.add(riser(.54, 800, 8000), 14.34, .5, pan=.4)
for j, m in enumerate([74, 81, 86, 90]): sfx.add(bell(mtof(m), 1.4, 2.6), 14.86 + j * .055, .42, pan=.5, rev=.5)
cr = np.random.default_rng(4)
for i in range(22): sfx.add(pop(700 + cr.random() * 800, 1600 + cr.random() * 1500, .04), 14.88 + cr.random() * .5, .12, pan=cr.uniform(-.2, .9))
sfx.add(whoosh(.8, 150, 2500, .5), 14.95, .7, rev=.3)
sfx.add(whoosh(.5, 300, 5000, .5), 15.12, .4, pan=.6)
sfx.add(revcym(.55), 15.45, .55); sfx.add(riser(.55, 400, 9000, False), 15.45, .35)

# ── F · Fifty Villagers (16–20) ──
sfx.add(impact(1.15), 16.0, 1.0, rev=.55); drums.add(crash(2.2, 1.4), 16.0, .5); drums.add(clap(), 16.0, .5, rev=.3)
for k in range(7):
    tt = 16.0 + k * .5
    K_(tt)
    if k % 2: drums.add(clap(), tt, .65, rev=.2)
for tt in np.arange(16.0, 19.5, .125): drums.add(hat(open_=abs((tt * 2) % 1 - .5) < .01), tt, .17 if (tt * 8) % 2 else .26, pan=.3)
for tt in np.arange(16.0, 19.5, .25):
    root = CH[chord_at(tt)][1]; bass_note(tt, .2, root + (12 if int(tt * 4) % 4 == 3 else 0), .9)
HOOK = [(16.0, 74), (16.25, 72), (16.5, 69), (16.75, 72), (17.0, 74), (17.5, 77), (17.75, 76), (18.0, 74), (18.25, 72), (18.5, 70), (18.75, 69), (19.0, 70), (19.25, 72)]
for tt, m in HOOK: pluck(tt, m, .45, pan=-.2, k=9, cut=5000, rev=.35)
sfx.add(whoosh(.45, 300, 6000, .55), 16.0, .5, pan=-.4)
sfx.add(whoosh(.8, 150, 3500, .5), 16.72, .75, pan=.5, rev=.2)
sfx.add(chatter(.85, 70, 3000, 13), 17.12, .22, pan=.4)
ln = sweep(np.sin(2 * np.pi * np.cumsum(np.geomspace(300, 900, S(1.05))) / SR), 400, 3000, 'low') * .15 * np.hanning(S(1.05))
sfx.add(ln, 17.2, .8, pan=.3)
for i, ct in enumerate([17.45, 17.7, 17.95, 18.2]): sfx.add(blip(mtof([81, 84, 86, 89][i]), .14, 0, 20), ct, .4, pan=(-.6, .7, .7, .2)[i], rev=.3)
for i in range(5): sfx.add(tick(), 17.5 + i * .08, .5, pan=.6)
sfx.add(click(2200, .02), 18.52, .5, pan=.3)
sfx.add(bell(mtof(88), .6, 5), 18.66, .4, pan=.6, rev=.3); sfx.add(bell(mtof(93), .8, 4), 18.74, .4, pan=.6, rev=.3)
sfx.add(bell(mtof(96), .5, 7), 18.78, .25, pan=.5)
sfx.add(whoosh(.5, 200, 5000, .5), 19.42, .6, pan=-.5)
sfx.add(riser(.55, 300, 5000), 19.45, .5); sfx.add(revcym(.5), 19.5, .45)

# ── G · Kalam Ashram (20–24) — tanpura, sitar plucks, tabla ──
sfx.add(impact(.65), 20.0, .7, rev=.6)
for i, tt in enumerate(np.arange(19.8, 24.0, .5)):
    m = [50, 57, 62, 45][i % 4]
    mel.add(hp(ks(mtof(m), 1.6, .99965, .35, .35), 160), tt, .26, pan=(-.5, .5, -.2, .2)[i % 4], rev=.25)
PH = [(20.0, 69, .5), (20.25, 70, .25), (20.5, 69, .25), (20.75, 67, .25), (21.0, 65, .75), (21.5, 67, .25), (21.75, 69, .25),
      (22.0, 74, .5), (22.5, 73, .25), (22.75, 74, .25), (23.0, 76, .25), (23.25, 77, .25), (23.5, 76, .25), (23.75, 73, .25)]
for tt, m, d in PH:
    mel.add(ks(mtof(m), 1.2, .9975, .7, .5), tt, .55, pan=.15, rev=.35)
    mel.add(ks(mtof(m + 12), .5, .993, .8, .2), tt + .004, .12, pan=.3, rev=.3)
for tt in [20.0, 22.0]: K_(tt, .9); bass_note(tt, 1.8, CH[chord_at(tt)][1] + 12, .4, 500)
for tt in [20.75, 22.75]: K_(tt, .55)
for tt in [21.0, 23.0]: drums.add(snare(.35, 180), tt, .55, rev=.35)
def tabla_na(): n = S(.18); t = T(n); return (np.sin(2 * np.pi * 540 * t) * np.exp(-t * 22) + bp(noise(n), 2500, 6000) * np.exp(-t * 90) * .5)
def tabla_ge(): n = S(.4); t = T(n); f = 85 * (1 + .35 * (1 - np.exp(-t * 6))); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)
TB = [(0, 'g'), (.25, 'n'), (.375, 'n'), (.625, 'n'), (.75, 'g'), (1.0, 'n'), (1.25, 'n'), (1.5, 'g'), (1.625, 'n'), (1.875, 'n')]
for bar in [20.0, 22.0]:
    for off, kind in TB: drums.add(tabla_na() if kind == 'n' else tabla_ge(), bar + off, .45 if kind == 'n' else .6, pan=.35 if kind == 'n' else -.2, rev=.15)
for tt in np.arange(20.0, 23.5, .25): drums.add(hp(hat(), 4000), tt, .11, pan=-.4)
sfx.add(whoosh(.6, 200, 3000, .5), 20.95, .5, pan=-.4)
sfx.add(whoosh(.7, 150, 2500, .5), 21.2, .55, pan=.5, rev=.2)
sfx.add(chatter(.9, 55, 3200, 21), 21.4, .2, pan=-.4)
for i in range(5): mel.add(ks(mtof([81, 84, 86, 88, 93][i]), .6, .996, .8), 22.0 + i * .1, .28, pan=-.5 + i * .1, rev=.3)
sfx.add(riser(.95, 250, 9000), 23.05, .55); sfx.add(revcym(.5), 23.5, .5)
for i in range(8): drums.add(snare(.12, 230), 23.5 + i * .0625, .12 + i * .05)
sfx.add(whoosh(.6, 200, 5000, .6), 23.62, .75)

# ── H · the standard (24–26) ──
sfx.add(impact(.9), 24.0, .85, rev=.5); drums.add(crash(1.8, 2), 24.0, .4)
for k in range(4): K_(24.0 + k * .5)
drums.add(clap(), 24.5, .6); drums.add(clap(), 25.5, .5)
for tt in np.arange(24.0, 25.9, .125): drums.add(hat(), tt, .15 + .12 * ((tt * 8) % 2 == 0), pan=.3)
for tt in np.arange(24.0, 25.9, .25): bass_note(tt, .2, CH[chord_at(tt)][1] + (12 if int(tt * 4) % 2 else 0), .9)
for i in range(4):
    s0 = 24.12 + i * .06 + .08
    for k in range(20): sfx.add(tick(), s0 + .85 * (1 - (1 - k / 20) ** (1 / 3)), .35, pan=[-.6, -.2, .2, .6][i])
    sfx.add(bell(mtof([74, 77, 81, 86][i]), 1.2, 3), s0 + .85, .45, pan=[-.6, -.2, .2, .6][i], rev=.4)
for i in range(3): sfx.add(blip(1400 + i * 200, .06, .1, 60), 25.2 + i * .09, .18, pan=-.4 + .4 * i)
roll = [25.0 + i * .125 for i in range(4)] + [25.5 + i * .0625 for i in range(7)]
for i, tt in enumerate(roll): drums.add(snare(.1, 220 + i * 6), tt, .12 + i * .045)
sfx.add(riser(.9, 300, 11000), 25.0, .6)

# ── I · outro (26–30) ──
sfx.add(impact(1.35), 26.0, 1.0, rev=.7); drums.add(crash(3.5, .9), 26.0, .55)
bass.add(np.tanh(1.5 * (np.sin(2 * np.pi * mtof(26) * T(S(4))) * .9 + np.sin(2 * np.pi * mtof(38) * T(S(4))) * .4)) * np.exp(-T(S(4)) * .5), 26.0, .7)
NAME = [26.04 + i * .045 for i in range(11)]
for i, nt in enumerate(NAME): sfx.add(bell(mtof([74, 76, 77, 81, 84, 86, 88, 89, 93, 96, 98][i]), .7, 5), nt + .05, .13, pan=-.6 + i * .11, rev=.5)
for bt in [26.5, 27.0, 27.5, 28.0, 28.5]: drums.add(lp(kick(110, 42, 26, 6, .5, .05), 500), bt, .45)
sfx.add(chatter(.7, 55, 4200, 31), 26.62, .18, pan=-.3)
sfx.add(pop(300, 900, .1), 27.2, .5, rev=.3)
sfx.add(chatter(.5, 60, 4600, 33), 27.42, .15, pan=.2); sfx.add(chatter(.6, 60, 4000, 34), 27.6, .15, pan=.3)
sfx.add(click(2200, .025), 28.5, .7, pan=-.3); sfx.add(sweep(noise(S(.5)), 300, 3000, 'band', .7) * np.exp(-T(S(.5)) * 6) * 1.0, 28.56, .35, pan=-.3, rev=.3)
drums.add(lp(kick(120, 40, 24, 3.5, .9, .1), 700), 29.0, .9)
sfx.add(bell(mtof(74), 3.0, 1.1) + bell(mtof(81), 3.0, 1.2) * .6, 29.0, .4, rev=.7)
bass.add(np.sin(2 * np.pi * mtof(26) * T(S(1.5))) * np.exp(-T(S(1.5)) * 1.5), 29.0, .5)


# ───────────────────────── mix ─────────────────────────
mix = mixdown([drums, bass, pad, arp, mel, sfx], {'drums': .85, 'bass': .58, 'pad': .45, 'arp': .55, 'mel': .8, 'sfx': 1.1}, KICKS,
              [(3.9, 4.0), (9.93, 10.0), (15.92, 16.0), (25.9, 26.0)], N, pad_bus=pad)
write(sys.argv[1] if len(sys.argv) > 1 else 'soundtrack.wav', mix)
