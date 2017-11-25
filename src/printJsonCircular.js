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

module.exports = printJsonCircular
