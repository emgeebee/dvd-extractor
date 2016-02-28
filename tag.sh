automator -i "/Volumes/Videos/broke/Atonement (2007)/Atonement (2007).m4v" "/Users/mat/Library/Services/Batch Rip • Add Movie Tags (Filename).workflow"


#!/bin/sh
shopt -s extglob
IFS=$'\n'
time=$(date +%k%M)
for file in `find /Volumes/video/Films/ -name "*.m4v"`
do
		echo "${file}"
		automator -i "${file}" "/Users/mat/Library/Services/Batch Rip • Add Movie Tags (Filename).workflow"

done
