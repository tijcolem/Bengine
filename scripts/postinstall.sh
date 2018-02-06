#!/bin/sh

SCRIPT="$0"
SCRIPTPATH=$(dirname "$SCRIPT")  

# create symlinks to
ln -sf ../../node_modules/mocha/mocha.css ${SCRIPTPATH}/../public/css
ln -sf ../../node_modules/mocha/mocha.js ${SCRIPTPATH}/../public/js
ln -sf ../../node_modules/chai/chai.js ${SCRIPTPATH}/../public/js

# reset block symlinks
rm -rf ../public/blocks/*
BLOCKS=$(ls -l "$SCRIPTPATH"/../blocks | tail -n +2 | tr -s ' ' | cut -d" " -f9)
for name in $BLOCKS; do ln -sf "../../blocks/$name/$name.js" "${SCRIPTPATH}/../public/blocks/$name.js"; done
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

