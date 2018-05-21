if(typeof window == 'undefined') window = global
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
window.ghcollapseall = $$('button.js-details-target').forEach(element => element.click())
findPath.help = 
`fp = findPath(_obj = 'rendered', prop, limit = 9000)        json traverse: find property somewhere in this object
                                                  pass "typeof _obj == 'string'" to search in window obj and print the whole path
                                                  prop may be a regex or a string.
                                                  examples:
                                                      fp('remove') // search for remove in window.rendered - limit to first 20 entries 
                                                      fp('getall', 100) // search for getall - ignore case - limit to first 100 entries
                                                      fp('editorAPI', 'boo') //search for boo in window.editorAPI - limit 20 entries
                                                  if limit is greate than 150 than limits the numbers of iterations rather than number of found entries

fp.details                                        reprint last results but console.log the actual object with it's path

fp.filter(regex)                                  filter results using regex.test(key)

fp.get(regex)                                     same as fp.details but filter by regex.test(key)

fp.reverse                                        print fp.result in reverse(shortest last)

fp.take(n)                                        like _.take(fp.result, n)

fdp                                               "findDefinePath" like findPath(require.s.contexts._.defined, ...)                                                                            

printJsonCircular(obj)                            JSON.stringify(obj, null, 4) but allow for object with circular reference

tojson(obj)                                       JSON.stringify(obj, null, 4)

ghcollapseall                                     on github pullrequest collapse all files
`
if(window==global) window=undefined
