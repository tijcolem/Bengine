#!/bin/sh

SCRIPT="$0"
SCRIPTPATH=$(dirname "$SCRIPT")  

# cd into script directory
echo "scriptpath: $SCRIPTPATH"
cd ./$SCRIPTPATH/..

# create symlinks to
ln -sf ../../node_modules/mocha/mocha.css ./public/css
ln -sf ../../node_modules/mocha/mocha.js ./public/js
ln -sf ../../node_modules/chai/chai.js ./public/js

# reset block symlinks
rm -rf ./public/blocks/*

BLOCKS=$(ls -l ./blocks | tail -n +2 | tr -s ' ' | cut -d" " -f9)
for name in $BLOCKS; do ln -sf "../../blocks/$name/$name.js" "./public/blocks/$name.js"; done
unset BLOCKS

# generate ssl certificates
DOMAIN=$(cat ./config/config.json | grep "domain" | cut -d'"' -f4 | cut -d'/' -f3)
./tools/gencert.sh "$DOMAIN"

