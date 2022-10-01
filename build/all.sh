#! /bin/bash

# This script refreshes an entire local deployment with the latest version of origins.

set -e

echo "██████  ██    ██ ██      ██      "
echo "██   ██ ██    ██ ██      ██      "
echo "██████  ██    ██ ██      ██      "
echo "██      ██    ██ ██      ██      "
echo "██       ██████  ███████ ███████ "
git pull
echo
echo

echo "██████  ██    ██ ██ ██      ██████  "
echo "██   ██ ██    ██ ██ ██      ██   ██ "
echo "██████  ██    ██ ██ ██      ██   ██ "
echo "██   ██ ██    ██ ██ ██      ██   ██ "
echo "██████   ██████  ██ ███████ ██████  "
./build.sh
echo
echo

echo "██████   ██████   ██████ ██   ██ ███████ ██████  "
echo "██   ██ ██    ██ ██      ██  ██  ██      ██   ██ "
echo "██   ██ ██    ██ ██      █████   █████   ██████  "
echo "██   ██ ██    ██ ██      ██  ██  ██      ██   ██ "
echo "██████   ██████   ██████ ██   ██ ███████ ██   ██ "
./docker-local.sh
echo
echo

sudo docker compose up -d
echo " ██████  ██████  ███    ███ ██████   ██████  ███████ ███████ "
echo "██      ██    ██ ████  ████ ██   ██ ██    ██ ██      ██      "
echo "██      ██    ██ ██ ████ ██ ██████  ██    ██ ███████ █████   "
echo "██      ██    ██ ██  ██  ██ ██      ██    ██      ██ ██      "
echo " ██████  ██████  ██      ██ ██       ██████  ███████ ███████ "
echo
echo