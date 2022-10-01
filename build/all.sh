#! /bin/bash

# This script refreshes an entire local deployment with the latest version of origins.

set -e

git pull

./build.sh

./docker-local.sh

sudo docker compose up -d