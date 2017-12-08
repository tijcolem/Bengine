#!/bin/sh

SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
SCRIPTPATH=`dirname $SCRIPT`

# get config file
if [ $# == 1 ]; then
    CONFIG="$SCRIPTPATH/$1"
else
    CONFIG="$SCRIPTPATH/config.json"
fi

# set production level
LEVEL=$(cat $SCRIPTPATH/config.json | grep -E -o "\"level\":\s*\"(\w*)\"" | cut -d'"' -f4)

if [ ${LEVEL:0:1} == "d" ]; then
	NODE_ENV=dev;
elif [ ${LEVEL:0:1} == "s" ]; then
	NODE_ENV=production;
elif [ ${LEVEL:0:1} == "p" ]; then
	NODE_ENV=production;
else
	echo "Config error. 'level' not set correctly.";
	exit 1;
fi

# generate ssl certificates
DOMAIN=$(cat $SCRIPTPATH/config.json | grep "domain" | cut -d'"' -f4 | cut -d'/' -f3)
"$SCRIPTPATH"/tools/gencert.sh "$DOMAIN"

cd $SCRIPTPATH
node main "$CONFIG";
