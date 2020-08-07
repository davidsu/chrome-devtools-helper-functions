const {console} = require('./logger')
function findPathDFS(_obj, prop, limit = 10, exactOnly = false){
    var foundCount = 0
    var seen = new Set()
    function isMatch(foundProp, fullPath) {
        if (typeof prop === 'string') {
            return foundProp === prop || (!exactOnly && foundProp.toLowerCase().indexOf(prop.toLowerCase())!=-1)
        }
        return prop instanceof RegExp && prop.test(fullPath)  
    }
    function _findPath(obj, currpath){
        if(foundCount > limit){
            return
        }
        if(!obj || seen.has(obj) || /(.requirejs\.s|_reactInternalInstance)/.test(currpath) || currpath.length > 130){
            return
        }
        seen.add(obj)
        for (var k in obj){
            var nextPath = currpath + '.' + k
            if(!/^[_a-zA-Z]\w*$/.test(k)) {
                nextPath = currpath + "['" + k +"']"
            }
            if(isMatch(k, nextPath)){
                console.log(nextPath)
                foundCount++
            }
            try{
            _findPath(obj[k], nextPath)
            }catch(e){}
        }    
    }
    let initialPath = '';
    if (!_obj) {
        _obj = window
    } else if (typeof _obj === 'string') {
        initialPath = _obj
        let windowObjPath = _obj.split('.')
        _obj = window
        windowObjPath.forEach(p => _obj = _obj[p])
    }
    console.time('dfs')
    _findPath(_obj, initialPath)
    console.timeEnd('dfs')
}
module.exports = findPathDFS
