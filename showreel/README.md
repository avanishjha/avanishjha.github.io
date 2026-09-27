# Showreel 2026

30-second motion reel with an original synthesized soundtrack, in two cuts: 16:9 (1920×1080) and 9:16 (1080×1920), both at 60fps.

| File | Use |
| --- | --- |
| `avanish-jha-showreel-2026.mp4` | Master, 1080p60. For the website, LinkedIn, YouTube and proposals. |
| `avanish-jha-showreel-2026-720p.mp4` | Small 720p cut for WhatsApp and email. |
| `avanish-jha-showreel-2026-vertical.mp4` | 9:16 cut, 1080×1920 at 60fps. For Instagram Reels and YouTube Shorts. |
| `avanish-jha-showreel-2026-vertical-720p.mp4` | Small 9:16 cut for WhatsApp Status. |
| `avanish-jha-showreel-2026-vol2.mp4` | Vol. 02 "Aurora": a second, standalone reel in violet and cyan, 1080p60. |
| `avanish-jha-showreel-2026-vol2-720p.mp4` | Small Vol. 02 cut for WhatsApp and email. |
| `index.html` | Share page at `avanishjha.dev/showreel/`. |
| `src/` | The reel's source: HTML, CSS and JS, plus the renderer and the soundtrack synth. |

## How it's made

Every shot is plain HTML and CSS. `src/engine.js` holds the shared timeline, effects and player; `src/reel.js` (16:9) and `src/vertical.js` (9:16) lay the scenes out for each format on the same timeline, so one soundtrack fits both. The timeline is deterministic, so every frame is a pure function of time `t`. `src/render.mjs` seeks headless Chromium to each frame and captures 4 sub-frames across a 180° shutter, which gives real motion blur. `src/audio.py` synthesizes the score and every sound effect on the same 120 BPM grid (kicks, plucks, a tanpura drone, risers, UI clicks).

Vol. 02 is its own composition (`src/vol2.html`, `vol2.css`, `vol2.js`) with its own score (`src/audio2.py`) at 128 BPM. It runs on the same engine, with a pixel-to-mosaic intro, canvas particle morphs, variable-font type (Anybody's width and weight axes), a 3D bento grid, an exploded isometric dashboard with projected callouts, a 3D device carousel and a code-to-UI sequence. Both scores share the instruments in `src/synth.py`.

Open `src/index.html` (or `src/vertical.html`, `src/vol2.html`) through any static server to watch it live in the browser.

## Re-render

```bash
cd showreel/src
node render.mjs frames /tmp/frames --sub 4 --jpg     # ~5 min
python3 audio.py /tmp/soundtrack.wav                 # numpy + scipy
./encode.sh /tmp/frames /tmp/soundtrack.wav 4        # ffmpeg

# 9:16 cut
node render.mjs frames /tmp/framesV --page vertical.html --size 1080x1920 --sub 4 --jpg
NAME=avanish-jha-showreel-2026-vertical SHARE=720:1280 POSTER=poster-vertical ./encode.sh /tmp/framesV /tmp/soundtrack.wav 4

# Vol. 02
node render.mjs frames /tmp/frames2 --page vol2.html --sub 4 --jpg
python3 audio2.py /tmp/soundtrack2.wav
NAME=avanish-jha-showreel-2026-vol2 POSTER=poster-vol2 AUDIO=showreel-vol2-audio ./encode.sh /tmp/frames2 /tmp/soundtrack2.wav 4
```

Scene timings, copy and colours are near the top of each scene block in `reel.js` and `vertical.js`. The audio cues in `audio.py` use the same timestamps, so keep timing changes in step across all three.
