const getConsole = () => {
    if(console.log.toString() !== 'function info() { [native code] }') {
        const frame = document.head.appendChild(document.createElement('iframe'))
        return frame.contentWindow.console
    }
    return console

}
module.exports = {
    console: getConsole()
}
