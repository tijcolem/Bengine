#!/bin/bash

# this file is for setting up Bengine on a VM

apt-get update && apt-get upgrade -y

# install docker
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install docker-ce

# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

# install node
nvm install node

# install apache
apt-get install -y apache2
a2dissite 000-default.conf
rm /etc/apache2/sites-available/000-default.conf
rm /etc/apache2/sites-available/default-ssl.conf
a2enmod ssl
a2enmod proxy
a2enmod proxy_http
a2enmod rewrite
a2enmod headers

# install certbot
add-apt-repository ppa:certbot/certbot
apt-get update
apt-get install -y python-certbot-apache
