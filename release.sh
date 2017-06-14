rm -rf release
mkdir release
cp ./background.js ./release/background.js
cp ./manifest.json ./release/manifest.json
cp ./script.js ./release/script.js
rm release.zip
#https://unix.stackexchange.com/questions/93139/can-i-zip-an-entire-folder-using-gzip
zip -r release.zip release/

