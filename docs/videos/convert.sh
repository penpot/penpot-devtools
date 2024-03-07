#!/bin/bash
SCALE=720

ffmpeg -y -ss 00 -t 20 -i Penpot\ DevTools.webm \
    -vf "fps=10,scale=$SCALE:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 REPL.gif

ffmpeg -y -ss 22 -t 20 -i Penpot\ DevTools.webm \
    -vf "fps=10,scale=$SCALE:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 State.gif

ffmpeg -y -ss 104 -t 20 -i Penpot\ DevTools.webm \
    -vf "fps=10,scale=$SCALE:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 Options.gif
