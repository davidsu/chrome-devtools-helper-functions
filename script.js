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
            let queue = [{
                obj,
                path:currpath
            }]
            let i = 1
            let maxiterations = 60000
            while(queue.length  && i < maxiterations){
                i++
                let curr = queue.shift()
                let currpath = curr.path
                let obj = curr.obj
                if(!obj || seen.has(obj) || /(.requirejs\.s|_reactInternalInstance)/.test(currpath) || currpath.length > 280){
                    continue
                }
                if(foundCount > limit){
                    return
                }
                seen.add(obj)
                if(queue.length < maxiterations - i){
                    for(var k in obj) {
                        let nextPath = currpath + '.' + k
                        if(!/^[_a-zA-Z]\w*$/.test(k)) {
                            nextPath = currpath + "['" + k +"']"
                        }
                        if(isMatch(k, nextPath)){
                            console.log(nextPath)
                            foundCount++
                        }
                        queue.push({
                            obj: obj[k],
                            path: nextPath
                        })
                    }
                }
            }
            if(queue.length) console.log(queue)
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
    window.findPathDFS = window.fpDFS = findPathDFS
    !window.fp && (window.fp = findPath)
    window.requirejs && !window.fdp && (window.fdp = (...a) => { console.log('require.s.contexts._.defined'); findPath('requirejs.s.contexts._.defined', ...a) })
}
oldconsoleerror = console.error
console.error = function (a) {
    if (typeof a === 'string' && /^Warning:.*(https:\/\/fb.me|React.*npm|Calling PropTypes validators directly is not supported|Failed prop type:)/.test(a) ) {
        return
    }
    oldconsoleerror.apply(console.error, arguments)
}
restoreConsoleError = () => console.error = oldconsoleerror
window.utilsInject = utilsInject;
window.tojson = (j) => JSON.stringify(j, null, 4)
utilsInject();
utilsInject.help = findPath.help = 
`fp = findPath(_obj, prop, limit = 10, exactOnly = false)                   json traverse: find property somewhere in this object
                                                                            pass "typeof _obj == 'string'" to search in window obj and print the whole path
                                                                            prop may be a regex or a string
fdp                                                                         "findDefinePath" like findPath(require.s.contexts._.defined, ...)                                                                            
printJsonCircular(obj)                                                      JSON.stringify(obj, null, 4) but allow for object with circular reference
tojson(obj)                                                                 JSON.stringify(obj, null, 4)
`
