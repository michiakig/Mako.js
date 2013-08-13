#!/bin/bash
mkdir -p roms/{demos,games}
function buildAll() {
    # find .fs source files
    find="find . -name '*.fs' -path '*$1*'"
    for path in $(eval $find) ; do
        echo "compiling $path"
        name=$(basename "$path")
        name="${name%.*}"
        java -jar dist/Maker.jar $path ./roms/$1/$name
    done
}
buildAll demos
buildAll games
