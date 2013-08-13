#!/bin/bash

for i in `ls ~/source/Mako/games/` ; do
    java -jar dist/Maker.jar games/$i/$i.fs ~/code/Mako.js/$i
done
