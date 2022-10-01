#! /bin/bash


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
OUTPUT_DIR=$( realpath "${SCRIPT_DIR}/dist" ) 
UI_DIR=$( realpath "${SCRIPT_DIR}/../src/origins-ui" )
SERVER_DIR=$( realpath "${SCRIPT_DIR}/../src/origins-server" )

echo "--- Directories ---"
echo
echo "Build Script: ${SCRIPT_DIR}"
echo "Output:       ${OUTPUT_DIR}"
echo "UI:           ${UI_DIR}"
echo "Server:       ${SERVER_DIR}"
echo

echo "--- Delete Output Dir---"
rm -frv $OUTPUT_DIR
echo

echo "--- Create Output Dir ---"
mkdir -v $OUTPUT_DIR
echo

echo "--- Install Origins Server Dependencies ---"
( cd $SERVER_DIR; npm install )
echo

echo "--- Build Origins Server ---"
( cd $SERVER_DIR; npm run webpack )
echo

echo "--- Copy Origins Server Bits ---"
cp -rv "${SERVER_DIR}/dist/." ${OUTPUT_DIR}
echo

echo "--- Install Origins UI Dependencies ---"
( cd $UI_DIR; npm install )
echo

echo "--- Build Origins UI ---"
( cd $UI_DIR; npm run build )
echo

echo "--- Copy Origins UI Bits ---"
cp -rv "${UI_DIR}/dist/origins-ui/." "${OUTPUT_DIR}/ui"
echo
