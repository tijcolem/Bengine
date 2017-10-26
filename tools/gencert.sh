#!/bin/bash

if [ $# -ne 1 ]
then
        echo "Usage: gencert.sh [name]"
        exit
fi

DOMAIN="$1"

mkdir -p ./ssl

openssl genrsa -des3 -passout pass:x -out ./ssl/$DOMAIN.pass.key 2048
openssl rsa -passin pass:x -in ./ssl/$DOMAIN.pass.key -out ./ssl/$DOMAIN.key
rm ./ssl/$DOMAIN.pass.key

openssl req -new -key ./ssl/$DOMAIN.key -out ./ssl/$DOMAIN.csr -subj "/CN=$DOMAIN"
openssl x509 -req -days 3650 -in ./ssl/$DOMAIN.csr -signkey ./ssl/$DOMAIN.key -out ./ssl/$DOMAIN.crt

