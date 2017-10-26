#!/bin/sh

LEVEL=$(cat ./config.json | grep -E -o "\"level\":\s*\"(\w*)\"" | cut -d'"' -f4)

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

if [ $# == 1 ]; then
	node main $1;
else
	node main;
fi
