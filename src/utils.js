function isMatch(foundProp, fullPath, prop) {
    if (typeof prop === 'string') {
        return foundProp === prop || (foundProp.toLowerCase().indexOf(prop.toLowerCase())!=-1)
    }
    return prop instanceof RegExp && prop.test(fullPath)  
}

function _getPath(parent, path, initialPath){
    path = /^[_a-zA-Z]\w*$/.test(path) ? path : `['${path}']`
    while(parent) {
        let prefix = parent.__key || ''
        if (prefix) {
            prefix = /^[_a-zA-Z]\w*$/.test(prefix) ? prefix : `['${prefix}']`
            prefix = prefix + '.'
        }
        path = prefix + path
        parent = parent.__parent
    }
    if(initialPath){
        path = `${initialPath}.${path}`
    }
    path = path.replace(/\.\[/g, '[')
    return path
}
module.exports = {
    isMatch,
    _getPath
}
