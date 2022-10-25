#! /bin/bash

# Variables
ROOT_URL="http://localhost:8080"
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
THUMBS_DIR="${SCRIPT_DIR}/thumbnails"
COLLECTIONS_DIR="${SCRIPT_DIR}/collections"
DATA_DIR="${SCRIPT_DIR}/data"
ANIMALS_DIR="${DATA_DIR}/animals"
PLACES_DIR="${DATA_DIR}/places"
SPORTS_DIR="${DATA_DIR}/sports"
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
curl "${ROOT_URL}/api/items/purge?q=collectionId:\"animals\"" -X POST 
echo
echo
curl "${ROOT_URL}/api/items/purge?q=collectionId:\"places\"" -X POST 
echo
echo
curl "${ROOT_URL}/api/items/purge?q=collectionId:\"sports\"" -X POST 
# echo
# echo
# curl "${ROOT_URL}/api/items/purge" -X POST 
echo
echo
curl "${ROOT_URL}/api/collections/purge?q=id:(\"animals\"%20\"places\"%20\"sports\")" -X POST
echo
echo
rm -rfv "${DATA_DIR}"
echo
echo

echo "████████ ██   ██ ██    ██ ███    ███ ██████  ███████ "
echo "   ██    ██   ██ ██    ██ ████  ████ ██   ██ ██      "
echo "   ██    ███████ ██    ██ ██ ████ ██ ██████  ███████ "
echo "   ██    ██   ██ ██    ██ ██  ██  ██ ██   ██      ██ "
echo "   ██    ██   ██  ██████  ██      ██ ██████  ███████ "
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

echo "██████   █████  ████████  █████  "
echo "██   ██ ██   ██    ██    ██   ██ "
echo "██   ██ ███████    ██    ███████ "
echo "██   ██ ██   ██    ██    ██   ██ "
echo "██████  ██   ██    ██    ██   ██ "
echo
echo
echo "Copying 'collections' directory to 'data'."
echo "This allows any testing that manipulates the files and directories"
echo "  without destroying the original 'collections' contents."
echo
cp -rv ./collections ./data
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
