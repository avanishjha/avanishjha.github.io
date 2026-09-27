# Showreel 2026

30-second motion reel: 1920×1080, 60fps, with an original synthesized soundtrack.

| File | Use |
| --- | --- |
| `avanish-jha-showreel-2026.mp4` | Master, 1080p60. For the website, LinkedIn, YouTube and proposals. |
| `avanish-jha-showreel-2026-720p.mp4` | Small 720p cut for WhatsApp and email. |
| `index.html` | Share page at `avanishjha.dev/showreel/`. |
| `src/` | The reel's source: HTML, CSS and JS, plus the renderer and the soundtrack synth. |

## How it's made

Every shot is plain HTML and CSS, driven by `src/reel.js`. The timeline is deterministic, so every frame is a pure function of time `t`. `src/render.mjs` seeks headless Chromium to each frame and captures 4 sub-frames across a 180° shutter, which gives real motion blur. `src/audio.py` synthesizes the score and every sound effect on the same 120 BPM grid (kicks, plucks, a tanpura drone, risers, UI clicks).

Open `src/index.html` through any static server to watch it live in the browser.

## Re-render

```bash
cd showreel/src
node render.mjs frames /tmp/frames --sub 4 --jpg     # ~5 min
python3 audio.py /tmp/soundtrack.wav                 # numpy + scipy
./encode.sh /tmp/frames /tmp/soundtrack.wav 4        # ffmpeg
```

Scene timings, copy and colours are near the top of each scene block in `reel.js`. The audio cues in `audio.py` use the same timestamps.
