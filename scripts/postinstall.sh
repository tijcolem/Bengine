#!/bin/sh

SCRIPT="$0"
SCRIPTPATH=$(dirname "$SCRIPT")  

echo "scriptpath: $SCRIPTPATH"

# create symlinks to
ln -sf ../../node_modules/mocha/mocha.css ${SCRIPTPATH}/../public/css
ln -sf ../../node_modules/mocha/mocha.js ${SCRIPTPATH}/../public/js
ln -sf ../../node_modules/chai/chai.js ${SCRIPTPATH}/../public/js

# reset block symlinks
rm -rf ../public/blocks/*
BLOCKS=$(ls -l "$SCRIPTPATH"/../blocks | tail -n +2 | tr -s ' ' | cut -d" " -f9)
for name in $BLOCKS; do ln -sf "../../blocks/$name/$name.js" "${SCRIPTPATH}/../public/blocks/$name.js"; done
unset BLOCKS

# generate ssl certificates
DOMAIN=$(cat $SCRIPTPATH/../config/config.json | grep "domain" | cut -d'"' -f4 | cut -d'/' -f3)
"$SCRIPTPATH"/../tools/gencert.sh "$DOMAIN"

rm -rf ../ssl
mv ssl ../ssl

cd $SCRIPTPATH;

