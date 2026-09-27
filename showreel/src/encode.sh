#!/usr/bin/env bash
# Blend motion-blur sub-frames, mux the soundtrack and export deliverables.
#   ./encode.sh <framesDir> <soundtrack.wav> [sub=4]
#   9:16 cut:  NAME=avanish-jha-showreel-2026-vertical SHARE=720:1280 POSTER=poster-vertical ./encode.sh …
#   Vol. 02:   NAME=avanish-jha-showreel-2026-vol2 POSTER=poster-vol2 AUDIO=showreel-vol2-audio ./encode.sh …
set -euo pipefail
FRAMES=$1; WAV=$2; SUB=${3:-4}
HERE=$(cd "$(dirname "$0")" && pwd); OUT=$(dirname "$HERE")
FF=${FFMPEG:-$(command -v ffmpeg || python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")}
EXT=$(ls "$FRAMES" | sed -n '1s/.*\.//p')
RATE=$((60 * SUB))
BLEND="tmix=frames=$SUB,select='eq(mod(n\,$SUB)\,$((SUB - 1)))',setpts=N/60/TB"
[ "$SUB" = 1 ] && BLEND="setpts=N/60/TB"
NAME=${NAME:-avanish-jha-showreel-2026}; SHARE=${SHARE:-1280:720}; POSTER=${POSTER:-poster}; AUDIO=${AUDIO:-showreel-audio}
mkdir -p "$OUT/assets"

# 1 · master: 1080p60, H.264 High, AAC (soundtrack is mastered to ≈ -14 LUFS in audio.py)
"$FF" -hide_banner -loglevel error -stats -y \
  -framerate $RATE -i "$FRAMES/f_%06d.$EXT" -i "$WAV" \
  -filter_complex "[0:v]$BLEND,format=yuv420p[v];[1:a]aresample=48000[a]" \
  -map "[v]" -map "[a]" -r 60 -c:v libx264 -preset slow -crf 23 -profile:v high -level 4.2 \
  -x264-params "aq-mode=3:deblock=-1,-1" -g 120 -bf 3 \
  -c:a aac -b:a 192k -movflags +faststart -shortest \
  -metadata title="Avanish Jha — Showreel 2026" -metadata artist="Avanish Jha" -metadata comment="avanishjha.dev" \
  "$OUT/$NAME.mp4"

M="$OUT/$NAME.mp4"
# 2 · share cut: 720p30, small enough for WhatsApp / email
"$FF" -hide_banner -loglevel error -y -i "$M" \
  -vf "scale=$SHARE:flags=lanczos,fps=30" -c:v libx264 -preset slow -crf 21 -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart "$OUT/$NAME-720p.mp4"

# 3 · poster (final logo lockup) + audio for the live, in-browser version
"$FF" -hide_banner -loglevel error -y -ss 29.9 -i "$M" -frames:v 1 -q:v 3 "$OUT/assets/$POSTER.jpg"
"$FF" -hide_banner -loglevel error -y -i "$M" -vn -c:a copy "$OUT/assets/$AUDIO.m4a"
ls -la "$OUT"/*.mp4 "$OUT"/assets/
