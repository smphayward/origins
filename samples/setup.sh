#! /bin/bash

# Variables
ROOT_URL="http://localhost:8080"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
THUMBS_DIR="${SCRIPT_DIR}/thumbnails"
ANIMALS_DIR="${SCRIPT_DIR}/collections/animals"
PLACES_DIR="${SCRIPT_DIR}/collections/places"
SPORTS_DIR="${SCRIPT_DIR}/collections/sports"
ANIMALS_JSON="{\"id\":\"animals\",\"name\":\"Animals\",\"rootDirectory\":\"${ANIMALS_DIR}\"}"
PLACES_JSON="{\"id\":\"places\",\"name\":\"Places\",\"rootDirectory\":\"${PLACES_DIR}\"}"
SPORTS_JSON="{\"id\":\"sports\",\"name\":\"Sports\",\"rootDirectory\":\"${SPORTS_DIR}\"}"

echo
echo
echo "██████  ██    ██ ██████   ██████  ███████ "
echo "██   ██ ██    ██ ██   ██ ██       ██      "
echo "██████  ██    ██ ██████  ██   ███ █████   "
echo "██      ██    ██ ██   ██ ██    ██ ██      "
echo "██       ██████  ██   ██  ██████  ███████ "
echo
echo "Purging items and collections. This could take a few minutes..."
echo
echo
curl "${ROOT_URL}/api/items/purge" -X POST 
echo
echo
curl "${ROOT_URL}/api/collections/purge" -X POST
echo
echo

echo "Deleting thumbnails directory..."
echo
rm -rfv ${THUMBS_DIR}
echo
echo "Re-creating thumbnails directory..."
echo
mkdir -p ${THUMBS_DIR}
echo
echo

echo " ██████ ██████  ███████  █████  ████████ ███████ "
echo "██      ██   ██ ██      ██   ██    ██    ██      "
echo "██      ██████  █████   ███████    ██    █████   "
echo "██      ██   ██ ██      ██   ██    ██    ██      "
echo " ██████ ██   ██ ███████ ██   ██    ██    ███████ "
echo
echo
curl "${ROOT_URL}/api/collections/animals" -X PUT -H "Content-Type:application/json" -d "${ANIMALS_JSON}" 
echo
echo
curl "${ROOT_URL}/api/collections/places" -X PUT -H "Content-Type:application/json" -d "${PLACES_JSON}" 
echo
echo
curl "${ROOT_URL}/api/collections/sports" -X PUT -H "Content-Type:application/json" -d "${SPORTS_JSON}" 
echo
echo

echo "██████  ██████   ██████   ██████ ███████ ███████ ███████ "
echo "██   ██ ██   ██ ██    ██ ██      ██      ██      ██      "
echo "██████  ██████  ██    ██ ██      █████   ███████ ███████ "
echo "██      ██   ██ ██    ██ ██      ██           ██      ██ "
echo "██      ██   ██  ██████   ██████ ███████ ███████ ███████ "
echo
echo "Processing collections. This could take a few minutes..."
echo
echo
curl "${ROOT_URL}/api/collections/animals/process" -X POST
echo
echo
curl "${ROOT_URL}/api/collections/places/process" -X POST 
echo
echo
curl "${ROOT_URL}/api/collections/sports/process" -X POST 
echo
echo
