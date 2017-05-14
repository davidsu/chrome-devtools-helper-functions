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

    function findPath(_obj, prop, exactOnly = false, limit = 10){
        var foundCount = 0
        var seen = new Set()
        function _findPath(obj, currpath){
            if(foundCount > limit){
                return
            }
            if(!obj || seen.has(obj) || /requirejs\.s/.test(currpath) || currpath.length > 130){
                return
            }
            seen.add(obj)
            for (var k in obj){
                var nextPath = currpath + '.' + k
                if(k === prop || (!exactOnly && k.toLowerCase().indexOf(prop.toLowerCase())!=-1)){
                    console.log(nextPath)
                    foundCount++
                }
                try{
                _findPath(obj[k], nextPath)
                }catch(e){}
            }    
        }
        _findPath(_obj, '')
    }

    window.printJsonCircular = printJsonCircular
    window.findPath = findPath

    function injectInPreviewFrame(count){
        if(count>30) return;

        const preview = document.querySelector('#preview')
        if(preview && preview.contentWindow){
            preview.contentWindow.findPath = findPath
        } else {
            setTimeout(() => injectInPreviewFrame(count+1), 1000)
        }
    }
    injectInPreviewFrame(0)
    console.log('loading extension')
}
window.utilsInject = utilsInject;
utilsInject();
