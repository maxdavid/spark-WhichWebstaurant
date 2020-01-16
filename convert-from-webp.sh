#!/bin/bash
# Converts webp image to png, deletes original webp

IMGPATH=$1

NEWPATH=`echo ${IMGPATH} | sed 's/\(.*\)\..*/\1/'`.png
dwebp ${IMGPATH} -o ${NEWPATH}
rm ${IMGPATH}
