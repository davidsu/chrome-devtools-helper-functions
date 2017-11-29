const findPathBFS = require('./findPathBFS')
const printJsonCircular = require('./printJsonCircular')
const findPathDFS = require('./findPathDFS')
require('./overrideConsoleError')

window.tojson = (j) => JSON.stringify(j, null, 4)
window.printJsonCircular = printJsonCircular
window.findPath = findPathBFS
window.findPathDFS = window.fpDFS = findPathDFS
!window.fp && (window.fp = findPathBFS)
window.requirejs && !window.fdp && (window.fdp = (...a) => { console.log('require.s.contexts._.defined'); findPathBFS('requirejs.s.contexts._.defined', ...a) })
findPath.help = 
`fp = findPath(_obj, prop, limit = 300000)        json traverse: find property somewhere in this object
                                                  pass "typeof _obj == 'string'" to search in window obj and print the whole path
                                                  prop may be a regex or a string

fp.details                                        reprint last results but console.log the actual object with it's path

fp.filter(regex)                                  filter results using regex.test(key)

fp.get(regex)                                     same as fp.details but filter by regex.test(key)

fp.reverse                                        print fp.result in reverse(shortest last)

fp.take(n)                                        like _.take(fp.result, n)

fdp                                               "findDefinePath" like findPath(require.s.contexts._.defined, ...)                                                                            

printJsonCircular(obj)                            JSON.stringify(obj, null, 4) but allow for object with circular reference

tojson(obj)                                       JSON.stringify(obj, null, 4)
`
