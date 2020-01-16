#!/bin/bash

# Converts white backgrounds to transparent.
# Pass the image path and threshold percentage
# example:
#   ./background-remove.sh catpic.jpg 20%

IMGPATH=$1
THRESHOLD=$2

# start real
convert ${IMGPATH} \( +clone -fx 'p{0,0}' \)  -compose Difference  -composite   -modulate 100,0  +matte  ${IMGPATH}_difference.png

# remove the black, replace with transparency
convert ${IMGPATH}_difference.png -bordercolor white -border 1x1 -matte -fill none -fuzz 7% -draw 'alpha 1,1 floodfill' -shave 1x1 ${IMGPATH}_removed_black.png
composite  -compose Dst_Over -tile pattern:checkerboard ${IMGPATH}_removed_black.png ${IMGPATH}_removed_black_check.png

# create the matte 
convert ${IMGPATH}_removed_black.png -channel matte -separate  +matte ${IMGPATH}_matte.png

# negate the colors
convert ${IMGPATH}_matte.png -negate -blur 0x1 ${IMGPATH}_matte-negated.png

# eroding matte(to remove remaining white border pixels from clipped foreground)
convert ${IMGPATH}_matte.png -morphology Erode Diamond ${IMGPATH}_erode_matte.png

# you are going for: white interior, black exterior
composite -compose CopyOpacity ${IMGPATH}_erode_matte.png ${IMGPATH} ${IMGPATH}_finished.png

#remove white border pixels
convert ${IMGPATH}_finished.png -bordercolor white -border 1x1 -matte -fill none -fuzz  ${THRESHOLD}% -draw 'alpha 1,1 floodfill' -shave 1x1 ${IMGPATH}_final.png

#deleting extra files
rm ${IMGPATH}_difference.png
rm ${IMGPATH}_removed_black.png
rm ${IMGPATH}_removed_black_check.png
rm ${IMGPATH}_matte.png
rm ${IMGPATH}_matte-negated.png
rm ${IMGPATH}_erode_matte.png
rm ${IMGPATH}_finished.png
