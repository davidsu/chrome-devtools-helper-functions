function printJsonCircular(o) {
    const cache = new Set()
    var a = JSON.stringify(o, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.add(value);
        } else {
            var functionObj = {}
            functionObj['function' + key] = key
            cache.add(functionObj)
        }
        return value;
    }, 4);
    return a;
}

module.exports = printJsonCircular
