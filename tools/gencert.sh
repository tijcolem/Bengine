#!/bin/bash

if [ $# -ne 1 ]
then
        echo "Usage: gencert.sh [name]"
        exit
fi

DOMAIN="$1"

mkdir -p ./ssl

openssl genrsa -des3 -passout pass:x -out ./ssl/bengine.pass.key 2048
openssl rsa -passin pass:x -in ./ssl/bengine.pass.key -out ./ssl/bengine.key
rm ./ssl/bengine.pass.key

openssl req -new -key ./ssl/bengine.key -out ./ssl/bengine.csr -subj "/CN=$DOMAIN"
openssl x509 -req -days 3650 -in ./ssl/bengine.csr -signkey ./ssl/bengine.key -out ./ssl/bengine.crt

