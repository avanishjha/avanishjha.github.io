"""
AVANISH JHA — SHOWREEL 2026 · VOL. 03 · keynote-style score.
120 BPM, C major. Warm felt piano, soft pulse, gentle lift, clean resolve.
Cues line up with vol3.js.   python3 audio3.py out.wav
"""
import sys
import numpy as np
from synth import *

reseed(303)
DUR = 30.0; N = int(SR * DUR); L = N + SR * 4
drums, bass, pad, arp, mel, sfx = (Bus(n, L) for n in ['drums', 'bass', 'pad', 'arp', 'mel', 'sfx'])
KICKS = []

def piano(m, dur=2.5, vel=1.0):
    """Felt piano: stretched harmonics, per-partial decay, soft hammer."""
    n = S(dur); t = T(n); f = mtof(m); x = np.zeros(n)
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + .0004 * k * k)
        if fk > 12000: break
        x += np.sin(2 * np.pi * fk * t) * (vel ** (k * .35)) / k ** 1.3 * np.exp(-t * (1.1 + k * .55))
    x += lp(noise(n), 1800) * np.exp(-t * 60) * .08 * vel
    x = lp(x, 2500 + 2500 * vel) * (1 - np.exp(-t * 800))
    return x * vel * .5

def soft_kick(): return lp(kick(f0=110, f1=45, pk=24, ak=7, dur=.45, click=.05), 600)

CH = [(0, [48, 55, 59, 64]), (4, [45, 52, 55, 60]), (8, [41, 48, 52, 57]), (12, [43, 50, 55, 59])]  # Cmaj7 Am7 Fmaj7 G(add)
def chord(t): return CH[int(t // 2) % 4][1]

# piano: sparse at first, then flowing 8ths
MELO = [67, 72, 71, 67, 69, 64, 65, 67]
for bar in range(15):
    t0 = bar * 2.0
    c = chord(t0)
    for i, m in enumerate(c[1:]):
        mel.add(piano(m, 3.0, .55), t0 + i * .02, .5, pan=-.2 + i * .15, rev=.5)
    bass.add(piano(c[0] - 12, 3.0, .6), t0, .6, rev=.3)
    if t0 >= 3.0:
        for k in range(4):
            m = c[1 + k % 3] + 12 + (12 if k == 3 and t0 >= 15 else 0)
            mel.add(piano(m, 1.6, .38), t0 + .5 + k * .5 + (.25 if k % 2 else 0) * 0, .35, pan=.25, rev=.55)
    if t0 >= 7.0 and t0 < 26:
        mel.add(piano(MELO[bar % 8] + 12, 2.0, .5), t0 + 1.0, .32, pan=-.1, rev=.6)
# final chord
for i, m in enumerate([36, 48, 55, 59, 62, 64, 67, 71]):
    mel.add(piano(m, 5.0, .6), 26.0 + i * .03, .5, pan=-.3 + i * .08, rev=.7)

# warm pad under it all, swell into the black slides
for t0 in np.arange(0, 26, 2.0):
    n = S(2.6); t = T(n); st = np.zeros(n)
    for m in chord(t0):
        st += saw_add(mtof(m + 12), n, 1400) * .1
    env = np.minimum(1, t / .6) * np.where(t > 2.0, np.exp(-(t - 2.0) * 5), 1)
    g = .25 + .35 * (11 <= t0 < 15) + .15 * (t0 >= 15)
    pad.add(hp(lp(st, 1200), 120) * env * g, t0, pan=0, rev=.3)

# soft pulse from the laptop shot on, a gentle beat from the case studies
for tt in np.arange(3.0, 26.0, .5):
    if tt < 11 or tt >= 15:
        drums.add(soft_kick(), tt, .35 if tt < 15 else .5); KICKS.append(tt)
    if tt >= 15 and (tt * 2) % 2 == 1: drums.add(clap(), tt, .12, rev=.5)
    drums.add(hp(hat(), 6000), tt + .25, .05 if tt < 15 else .08, pan=.3)

# restrained transitions
for tt in [3.0, 7.0, 15.0, 19.0, 23.0]: sfx.add(whoosh(.7, 300, 3000, .6), tt - .1, .12, rev=.4)
sfx.add(boom(2.0, 60, 32, 6, 2.5), 11.0, .35); sfx.add(boom(3.0, 55, 30, 5, 1.5), 26.0, .4)
for tt in [11.1, 12.4, 13.7]: sfx.add(piano(84, 1.5, .5), tt, .15, pan=.3, rev=.7)

mix = mixdown([drums, bass, pad, arp, mel, sfx], {'drums': .7, 'bass': .7, 'pad': .5, 'arp': .5, 'mel': .95, 'sfx': .9}, KICKS,
              [], N, pad_bus=pad, duck_depth=.2, rev_level=.7, fade_from=28.5)
write(sys.argv[1] if len(sys.argv) > 1 else 'soundtrack-vol3.wav', mix)
