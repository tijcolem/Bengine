#!/bin/sh

SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
SCRIPTPATH=`dirname $SCRIPT`

# get config file
if [ $# == 1 ]; then
    CONFIG="$SCRIPTPATH/../$1"
else
    CONFIG="$SCRIPTPATH/../config.json"
fi

# generate ssl certificates
DOMAIN=$(cat $SCRIPTPATH/config.json | grep "domain" | cut -d'"' -f4 | cut -d'/' -f3)
"$SCRIPTPATH"/tools/gencert.sh "$DOMAIN"

cd $SCRIPTPATH;

