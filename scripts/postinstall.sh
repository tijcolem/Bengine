#!/bin/sh
  
SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
SCRIPTPATH=`dirname $SCRIPT`

# create symlinks to
ln -sf ../../node_modules/mocha/mocha.css ./public/css
ln -sf ../../node_modules/mocha/mocha.js ./public/js
ln -sf ../../node_modules/chai/chai.js ./public/js

# reset block symlinks
rm -rf public/blocks/*
BLOCKS=$(ls -l ./blocks | tail -n +2 | tr -s ' ' | cut -d" " -f9)
for name in $BLOCKS; do ln -s "../../blocks/$name/$name.js" "./public/blocks/$name.js"; done
unset BLOCKS

# get config file
if [ $# == 1 ]; then
    CONFIG="$SCRIPTPATH/../$1"
else
    CONFIG="$SCRIPTPATH/../config.json"
fi

# generate ssl certificates
DOMAIN=$(cat $SCRIPTPATH/../config.json | grep "domain" | cut -d'"' -f4 | cut -d'/' -f3)
"$SCRIPTPATH"/../tools/gencert.sh "$DOMAIN"

cd $SCRIPTPATH;

