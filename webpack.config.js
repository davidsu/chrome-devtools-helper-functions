const {execSync} = require('child_process')
const webpack = require('webpack')

try{
    execSync('rm -rf build')
}catch(e){}

webpack({
    entry: './src/index.js',
    output: {
        path: __dirname + '/build',
        filename: 'script.js'
    }
}, function(err, stats) {
    execSync('cp ./manifest.json ./build/manifest.json')
    execSync('cp ./background.js ./build/background.js')
    execSync('rm build.zip; zip -r build.zip build/')
})
