oldconsoleerror = console.error
console.error = function (a) {
    if (typeof a === 'string' && /^Warning:.*(https:\/\/fb.me|React.*npm|Calling PropTypes validators directly is not supported|Failed prop type:)/.test(a) ) {
        return
    }
    oldconsoleerror.apply(console.error, arguments)
}
restoreConsoleError = () => console.error = oldconsoleerror
