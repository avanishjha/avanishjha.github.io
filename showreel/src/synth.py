"""
Shared synth toolkit for the showreel soundtracks: filters, a bus mixer,
drums, synths, sound effects and a mastering chain. Everything is
generated from noise and oscillators with numpy/scipy, so the score is
original and reproducible (seeded).
"""
import numpy as np
from scipy import signal

SR = 48000
R = np.random.default_rng(2026)

def reseed(seed):
    """Restart the shared noise generator (keeps the same object, so names imported elsewhere stay valid)."""
    R.bit_generator.state = np.random.default_rng(seed).bit_generator.state

# ───────────────────────── helpers ─────────────────────────
def T(n): return np.arange(n) / SR
def S(sec): return int(round(sec * SR))
def mtof(m): return 440.0 * 2 ** ((m - 69) / 12)
def noise(n): return R.uniform(-1, 1, n)
def sos(kind, f, order=2):
    return signal.butter(order, f, btype=kind, fs=SR, output='sos')
def lp(x, f, o=2): return signal.sosfilt(sos('low', f, o), x)
def hp(x, f, o=2): return signal.sosfilt(sos('high', f, o), x)
def bp(x, lo, hi, o=2): return signal.sosfilt(sos('band', [lo, hi], o), x)

def sweep(x, f0, f1, kind='band', width=1.0, block=256, curve='log'):
    """Time-varying filter (block-wise coefficients, state carried)."""
    y = np.zeros_like(x); nb = int(np.ceil(len(x) / block)); zi = None
    for b in range(nb):
        p = b / max(1, nb - 1)
        f = f0 * (f1 / f0) ** p if curve == 'log' else f0 + (f1 - f0) * p
        f = min(max(f, 30), SR / 2 * 0.9)
        if kind == 'band':
            s_ = sos('band', [f / (1 + width / 2), min(f * (1 + width / 2), SR / 2 * .95)], 2)
        else:
            s_ = sos(kind, f, 2)
        if zi is None or zi.shape[0] != s_.shape[0]:
            zi = np.zeros((s_.shape[0], 2))
        seg = x[b * block:(b + 1) * block]
        y[b * block:(b + 1) * block], zi = signal.sosfilt(s_, seg, zi=zi)
    return y

def pan2(x, pan=0.0):
    a = (pan + 1) * np.pi / 4
    return np.vstack([x * np.cos(a), x * np.sin(a)]) * np.sqrt(2)


class Bus:
    def __init__(self, name, length):
        self.name = name; self.L = length; self.x = np.zeros((2, length)); self.send = np.zeros((2, length))
    def add(self, sig, t, g=1.0, pan=0.0, rev=0.0):
        if sig.ndim == 1: sig = pan2(sig, pan)
        i = S(t)
        if i < 0: sig = sig[:, -i:]; i = 0
        n = min(sig.shape[1], self.L - i)
        if n <= 0: return
        self.x[:, i:i + n] += g * sig[:, :n]
        if rev: self.send[:, i:i + n] += g * rev * sig[:, :n]

# ───────────────────────── instruments ─────────────────────────
def kick(f0=150, f1=46, pk=32, ak=5.5, dur=.6, click=.35):
    n = S(dur); t = T(n)
    f = f1 + (f0 - f1) * np.exp(-t * pk)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * ak)
    c = hp(noise(n), 1500) * np.exp(-t * 350) * click
    return np.tanh(1.8 * (x + c)) * .9

def clap(dur=.35):
    n = S(dur); t = T(n); e = np.zeros(n)
    for k, d in enumerate([0, .011, .023]):
        i = S(d); e[i:] += np.exp(-(t[:n - i]) * 140) * (1 - k * .15)
    e += np.exp(-t * 16) * .55
    return bp(noise(n), 900, 3200) * e * 1.4

def snare(dur=.3, tone=190):
    n = S(dur); t = T(n)
    body = np.sin(2 * np.pi * tone * t) * np.exp(-t * 28) * .6
    nz = bp(noise(n), 1600, 7500) * np.exp(-t * 17)
    return np.tanh(1.3 * (body + nz))

def hat(open_=False):
    n = S(.45 if open_ else .08); t = T(n)
    return lp(hp(noise(n), 7000, 3), 12000) * np.exp(-t * (8 if open_ else 55)) * (.45 if open_ else .6)

def tom(f=140, dur=.4):
    n = S(dur); t = T(n); ff = f * (1 + .6 * np.exp(-t * 25))
    return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 9)

def crash(dur=2.2, k=1.7):
    n = S(dur); t = T(n)
    x = lp(hp(noise(n), 3800, 2), 11000) * .6 + bp(noise(n), 5000, 9000) * .3
    return x * np.exp(-t * k) * (1 - np.exp(-t * 400))

def boom(dur=2.6, f0=85, f1=28, pk=7, ak=1.9):
    n = S(dur); t = T(n)
    f = f1 + (f0 - f1) * np.exp(-t * pk)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * ak)

def impact(size=1.0):
    n = S(2.8); t = T(n)
    x = boom(2.8) * 1.0
    x += lp(noise(n), 900) * np.exp(-t * 9) * .7
    x += hp(noise(n), 2200) * np.exp(-t * 26) * .45
    x = np.tanh(1.4 * x) * size
    return x

def saw_add(f, n, top=5000, ph=0.0):
    t = T(n); x = np.zeros(n); kmax = max(1, int(top / f))
    for k in range(1, kmax + 1):
        x += np.sin(2 * np.pi * k * f * t + ph * k) / k
    return x * .55

def blip(f=1800, dur=.1, drop=.3, k=45):
    n = S(dur); t = T(n); ff = f * (1 - drop * (1 - np.exp(-t * 60)))
    ph = 2 * np.pi * np.cumsum(ff) / SR
    return (np.sin(ph) + .25 * np.sin(2 * ph)) * np.exp(-t * k) * (1 - np.exp(-t * 3000))

def pop(f0=320, f1=980, dur=.09):
    n = S(dur); t = T(n); ff = f1 + (f0 - f1) * np.exp(-t * 90)
    return np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 38) * (1 - np.exp(-t * 4000))

def click(f=3200, dur=.012):
    n = S(dur); t = T(n)
    return (bp(noise(n), f * .6, min(f * 1.6, 20000)) * 1.6 + np.sin(2 * np.pi * f * t) * .4) * np.exp(-t * 520)

def tick(): return bp(noise(S(.004)), 3000, 9000) * np.exp(-T(S(.004)) * 1200) * 1.4

def bell(f, dur=1.6, k=3.2):
    n = S(dur); t = T(n); x = np.zeros(n)
    for m, a, kk in [(1, 1, 1), (2.0, .5, 1.6), (3.01, .28, 2.4), (4.16, .18, 3.2), (5.43, .1, 4.5)]:
        x += a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k * kk)
    return x * (1 - np.exp(-t * 2500)) * .6

def whoosh(dur=.6, f0=300, f1=4500, peak=.55):
    n = S(dur); t = T(n)
    half = int(n * peak)
    f = np.concatenate([np.geomspace(f0, f1, half), np.geomspace(f1, f0 * 1.5, n - half)])
    x = noise(n); y = np.zeros(n); blk = 256; zi = np.zeros((2, 2))
    for b in range(0, n, blk):
        fc = f[b]; s_ = sos('band', [fc / 1.6, min(fc * 1.6, 22000)], 2)
        if zi.shape[0] != s_.shape[0]: zi = np.zeros((s_.shape[0], 2))
        y[b:b + blk], zi = signal.sosfilt(s_, x[b:b + blk], zi=zi)
    env = np.sin(np.pi * np.clip(t / (dur * peak), 0, 1) / 2) ** 2
    env *= np.where(t > dur * peak, np.exp(-(t - dur * peak) * 7 / dur), 1)
    return y * env * 2.2

def riser(dur=1.0, f0=250, f1=7000, tone=True):
    n = S(dur); t = T(n); p = t / dur
    x = sweep(noise(n), f0, min(f1, 8000), 'band', 1.2) * (p ** 2.2) * 2.0
    if tone:
        ff = 180 * (8 ** p ** 1.5)
        ph = 2 * np.pi * np.cumsum(ff * (1 + .004 * np.sin(2 * np.pi * 7 * t))) / SR
        x += (np.sin(ph) * .5 + np.sin(ph * 1.5) * .25) * p ** 2.5 * .55
    return x

def revcym(dur=.8):
    return crash(dur * 1.2, 2.2)[:S(dur)][::-1] * .9

def chatter(dur, rate=55, f=4200, seed=1):
    n = S(dur); x = np.zeros(n); r = np.random.default_rng(seed)
    tt = 0.0
    while tt < dur - .01:
        c = click(f * (0.7 + r.random() * .8), .008) * (.5 + r.random() * .5)
        i = S(tt); x[i:i + len(c)] += c[:n - i]
        tt += 1 / rate * (.5 + r.random())
    return x

def glitch(dur=.12, f=880):
    n = S(dur); t = T(n)
    src = np.sign(np.sin(2 * np.pi * f * t)) * .6 + noise(n) * .4
    src = np.round(src * 4) / 4
    seg = S(.018); out = np.zeros(n)
    for k in range(0, n, seg * 2): out[k:k + seg] = src[k:k + seg] * (1 - k / n)
    return bp(out, 400, 9000)

def ks(freq, dur, decay=.9965, bright=.55, buzz=0.0):
    """Karplus–Strong pluck, pitch-corrected by resampling."""
    n = S(dur); Nf = SR / freq; Ni = int(np.ceil(Nf)); m = int(n * Ni / Nf) + Ni
    b = noise(Ni)
    b = bright * b + (1 - bright) * np.convolve(b, np.ones(3) / 3, 'same')
    out = np.zeros(m); out[:Ni] = b
    for i in range(Ni, m, Ni):
        prev = out[i - Ni:i]; sh = np.concatenate(([out[i - Ni - 1] if i - Ni - 1 >= 0 else 0], prev[:-1]))
        blk = decay * .5 * (prev + sh); k = min(Ni, m - i); out[i:i + k] = blk[:k]
    y = np.interp(np.arange(n) * (Ni / Nf), np.arange(m), out)
    if buzz: y = np.tanh(y * (1 + buzz * 6)) * .8 + bp(y, 2500, 6000) * buzz * 1.5
    return y * (1 - np.exp(-T(n) * 3000))

# ───────────────────────── mixing + mastering ─────────────────────────
def mixdown(buses, gains, kicks, gaps, n_out, duck=('bass', 'pad', 'arp'), dry=('sfx',), pad_bus=None, fade_from=29.2,
            duck_depth=.55, rev_level=.55, peak=.84):
    """Sidechain-duck the music to the kicks, carve silences before impacts, add a hall reverb and master."""
    L = buses[0].L
    ducker = np.ones(L)
    for k in kicks:
        i = S(k); n = min(S(.45), L - i); ducker[i:i + n] = np.minimum(ducker[i:i + n], 1 - duck_depth * np.exp(-T(n) * 9))
    gap = np.ones(L)
    for a, b in gaps:
        ia, ib = S(a), S(b); gap[ia:ib] = np.linspace(1, .05, ib - ia) ** 2
    mix = np.zeros((2, L)); send = np.zeros((2, L))
    for b in buses:
        g = gains[b.name]
        x = b.x * g; s_ = b.send * g
        if b.name in duck: x = x * ducker; s_ = s_ * ducker
        if b.name not in dry: x = x * gap
        mix += x; send += s_
    # reverb: synthetic stereo hall
    irn = S(2.4); it = T(irn)
    ir = np.vstack([lp(noise(irn), 5500) * np.exp(-it * 2.6), lp(noise(irn), 5500) * np.exp(-it * 2.6)])
    ir[:, :S(.018)] = 0; ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
    pad_x = pad_bus.x if pad_bus is not None else np.zeros((2, L))
    wet = np.vstack([signal.fftconvolve(send[0] + pad_x[0] * .08, ir[0])[:L], signal.fftconvolve(send[1] + pad_x[1] * .08, ir[1])[:L]])
    mix += wet * rev_level
    mix = np.vstack([hp(mix[0], 32), hp(mix[1], 32)])
    mix = mix - .5 * np.vstack([lp(mix[0], 90), lp(mix[1], 90)])   # low shelf ≈ -6 dB
    mix = np.vstack([lp(mix[0], 13000), lp(mix[1], 13000)])
    mix = mix[:, :n_out]
    # master: gentle glue + soft limit
    mix = np.tanh(mix / np.percentile(np.abs(mix), 99.99) * .85) / np.tanh(.85)
    fo = np.ones(n_out); fo[S(fade_from):] = np.linspace(1, 0, n_out - S(fade_from)) ** 1.5
    fi = np.minimum(1, T(n_out) / .004)
    mix = mix * fo * fi
    return mix / np.max(np.abs(mix)) * peak   # ≈ -1.5 dBFS, true-peak safe after AAC

def write(path, mix):
    from scipy.io import wavfile
    wavfile.write(path, SR, (mix.T * 32767).astype(np.int16))
    print('wrote', path, 'peak', np.max(np.abs(mix)).round(3), 'rms', np.sqrt(np.mean(mix ** 2)).round(3))
