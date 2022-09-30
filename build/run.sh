SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
OUTPUT_DIR=$( realpath "${SCRIPT_DIR}/dist" ) 

echo "--- Running Origins Server ---"
( cd $OUTPUT_DIR; node index.js )
echo