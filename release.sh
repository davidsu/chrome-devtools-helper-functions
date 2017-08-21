rm -rf build
mkdir build
cp ./background.js ./build/background.js
cp ./manifest.json ./build/manifest.json
cp ./script.js ./build/script.js
rm build.zip
#https://unix.stackexchange.com/questions/93139/can-i-zip-an-entire-folder-using-gzip
zip -r build.zip build/

