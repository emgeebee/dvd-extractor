#!/bin/sh
shopt -s extglob
IFS=$'\n'
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
printf "%s\n" ${DIR}
cd ${DIR}
for file in `find /Volumes/usbshare1/Music/DVDrips -name "*.mkv"`
do
	if [ -a ${file} ]; then
		filename=$(basename "$file")
		filename=${filename%.*}
		time=$(date +%k%M)
		#echo ${time} "${filename}"
		#if [[ "$time" -le 2359 ]];then
			/Applications/ffmpeg -i ${file} -vn -acodec copy /Volumes/usbshare1/Music/DVDrips/${filename}.mp3  >> logs/queueoutput_$(date +%Y%m%d).txt 2>&1
			rm "${file}"
		#else
		#exit 0
		#fi
	fi
done



#queue.sh >> logs/queueoutput_$(date +%Y%m%d).txt 2>&1
