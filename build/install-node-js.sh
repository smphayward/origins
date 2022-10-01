#! /bin/bash

# Crappy steps I found in a hurry
# TODO: Make this a much better experience

sudo apt-get update
sudo apt install nodejs
sudo apt install npm
npm install npm@latest -g   
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
hash -r