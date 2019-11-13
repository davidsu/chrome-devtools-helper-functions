const {execSync} = require('child_process')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const StringReplacePlugin = require("string-replace-webpack-plugin");
try{
    execSync('rm -rf build')
}catch(e){}

const webpackConfig = {
    entry: './src/index.js',
    optimization: {
		// We no not want to minimize our code.
		minimize: false
	},
    output: {
        path: __dirname + '/build',
        filename: 'script.js'
    }
} 
if(process.env.NODE_ENV === 'release') {
    const fs = require('fs')
    const manifestJson = JSON.parse(fs.readFileSync('manifest.json', 'utf8'))
    manifestJson.version = manifestJson.version.replace(/(\d+\.\d+\.)(\d+)/, (match, p1, p2) => `${p1}${parseInt(p2)+1}`)
    fs.writeFileSync('manifest.json', JSON.stringify(manifestJson, null, 4))
    webpackConfig.module = {
        rules: [{
            test: /findPathBFS/,
            exclude: /node_modules/,
            use:[{
                loader: StringReplacePlugin.replace({
                    replacements: [{
                        pattern: /(\s{2,})fplog/,
                        replacement: (match, g1) => `${g1}console.log` 
                    }]
                })
            }]
        }, {
            test: /index.js$/,
            exclude: /node_modules/,
            use:[{
                loader: StringReplacePlugin.replace({
                    replacements: [{
                        pattern: /require\('.\/overrideConsoleError'\)/,
                        replacement: () => ''
                    }]
                })
            }] 
        }]
    }
}
webpack(webpackConfig, function(err, stats) {
    fs.copyFileSync('manifest.json', path.resolve('build', 'manifest.json'))
    fs.copyFileSync('background.js', path.resolve('build', 'background.js'))
    // execSync('cp ./manifest.json ./build/manifest.json')
    // execSync('cp ./background.js ./build/background.js')
    // execSync('rm build.zip; zip -r build.zip build/')
})
