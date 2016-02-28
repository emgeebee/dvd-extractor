#!/bin/bash
SAVEIFS=$IFS
IFS=$(echo -en "\n\b")

for i in $(find /Volumes/Videos -type f -name "*.m4v"); do
    echo "$i"

	#osascript -e 'tell application "Finder" to make new alias file to POSIX file "$i" at POSIX file "/Users/matrulesok2/Music/iTunes New/iTunes Media/Automatically Add to iTunes/"'
done

IFS=$SAVEIFS
