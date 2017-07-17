function utilsInject(){
    function printJsonCircular(o) {
        var cache = [];
        var a = JSON.stringify(o, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            } else {
                var functionObj = {}
                functionObj['function' + key] = key
                cache.push(functionObj)
            }
            return value;
        }, 4);
        return a;
    }

    function findPath(_obj, prop, limit = 10, exactOnly = false){
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
            if(!obj || seen.has(obj) || /.requirejs\.s/.test(currpath) || currpath.length > 130){
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
        _findPath(_obj, initialPath)
    }

    window.printJsonCircular = printJsonCircular
    window.findPath = findPath
    !window.fp && (window.fp = findPath)
    window.requirejs && !window.fdp && (window.fdp = (...a) => { console.log('require.s.contexts._.defined'); findPath('requirejs.s.contexts._.defined', ...a) })
}
window.utilsInject = utilsInject;
window.tojson = (j) => JSON.stringify(j, null, 4)
utilsInject();
utilsInject.help = 
`fp = findPath(_obj, prop, limit = 10, exactOnly = false)                   json traverse: find property somewhere in this object
                                                                            pass "typeof _obj == 'string'" to search in window obj and print the whole path
fdp                                                                         "findDefinePath" like findPath(require.s.contexts._.defined, ...)                                                                            
printJsonCircular(obj)                                                      JSON.stringify(obj, null, 4) but allow for object with circular reference
tojson(obj)                                                                 JSON.stringify(obj, null, 4)
`
