const findPathBFS = require('./findPathBFS')
const printJsonCircular = require('./printJsonCircular')
const findPathDFS = require('./findPathDFS')
require('./overrideConsoleError')

window.tojson = (j) => JSON.stringify(j, null, 4)
window.printJsonCircular = printJsonCircular
window.findPath = findPathBFS
window.findPathDFS = window.fpDFS = findPathDFS
!window.fp && (window.fp = findPathBFS)
window.requirejs && !window.fdp && (window.fdp = (...a) => { console.log('require.s.contexts._.defined'); findPathDFS('requirejs.s.contexts._.defined', ...a) })
findPath.help = 
`fp = findPath(_obj, prop, limit = 10, exactOnly = false)                   json traverse: find property somewhere in this object
                                                                            pass "typeof _obj == 'string'" to search in window obj and print the whole path
                                                                            prop may be a regex or a string
fdp                                                                         "findDefinePath" like findPath(require.s.contexts._.defined, ...)                                                                            
printJsonCircular(obj)                                                      JSON.stringify(obj, null, 4) but allow for object with circular reference
tojson(obj)                                                                 JSON.stringify(obj, null, 4)
`
