# create symlinks to
ln -sf ../../node_modules/mocha/mocha.css ./public/css
ln -sf ../../node_modules/mocha/mocha.js ./public/js
ln -sf ../../node_modules/chai/chai.js ./public/js

# reset block symlinks
rm -rf public/blocks/*
BLOCKS=$(ls -l ./blocks | tail -n +2 | tr -s ' ' | cut -d" " -f9)
for name in $BLOCKS; do ln -s "../../blocks/$name/$name.js" "./public/blocks/$name.js"; done
unset BLOCKS
