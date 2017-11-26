const Dequeue = require('double-ended-queue')
const {isMatch, _getPath} = require('./utils')

let result
let initialPath = ''
const objOrFuncRegex = /(?:function|object)/
const isDomNode = node => typeof node == "object" && typeof node.nodeType === "number" && typeof node.nodeName==="string"
const shouldProcessNext = next => next && objOrFuncRegex.test(typeof next) && !isDomNode(next) && !next.__visited
let findcount = 0
function unmark(visitedQueue){
    let node
    while(node = visitedQueue.dequeue()){
        delete node.__parent
        delete node.__visited
        delete node.__depth
        delete node.__key
    }
}
function processNode(queue, visitedQueue, prop, parent, node, key) {
    if(Object.isExtensible(node)){
        node.__key = key
        node.__visited = 1
        node.__depth = parent.__depth + 1
        node.__parent = parent
    } else {
        node = {
            __original: node,
            __key: key,
            __visited: 1,
            __depth: parent.__depth + 1,
            __parent: parent
        }
    }
    //todo allow to match path
    if(isMatch(key, key, prop)){
        const path = _getPath(parent, key, initialPath)
        findcount = ++findcount % 2
        findcount ? console.log(path) : console.log(`%c${path}`, 'color:#bcb2a2')
        result.set(path, node)
    }
    queue.enqueue(node)
    visitedQueue.enqueue(node)
}

function processNodeIfNeeded(queue, visitedQueue, prop, parent, key) {
    if(!(/(^requirejs$|_reactInternalInstance|__key|__visited|__parent|__depth)/.test(key))){
        const originalNode = parent.__original || parent
        let node = originalNode[key]
        if(shouldProcessNext(node)){
            processNode(queue, visitedQueue, prop, parent, node, key)
            return true
        }
    }
}

function findPath(queue, visitedQueue, node, limit, prop) {
    let iterations = 0
    while ( node && ++iterations < limit){
        const originalNode = node.__original || node
        for(var k in originalNode) {
            processNodeIfNeeded(queue, visitedQueue, prop, node, k) && iterations++
        }
        node = queue.dequeue()
    }
    return {
        lastProcessedObj: node
    }

}

function extractRoot(root){
    initialPath = ''
    if (!root) {
        root = window
    } else if (typeof root === 'string') {
        initialPath = root
        let windowObjPath = root.split('.')
        root = window
        windowObjPath.forEach(p => root = root[p])
    }
    return root

}
function setup(rootArg){
    result = new Map()
    const queue = new Dequeue(5000)
    const visitedQueue = new Dequeue(5000)
    const root = extractRoot(rootArg)
    queue.enqueue(root)
    visitedQueue.enqueue(root)
    root.__visited = 1
    root.__depth = 1
    return {root, queue, visitedQueue}
}
function findPathBFS(rootArg, prop, limit = 300000){
    //todo: we need a set of isExtensible=false visited nodes
    //todo: get rid of this Dequeue, use an array instead
    console.time('fpBFS')
    const {root, queue, visitedQueue} = setup(rootArg)
    const {lastProcessedObj} = findPath(queue, visitedQueue, root, limit, prop)
    console.log(`max depth looked into = ${lastProcessedObj ? lastProcessedObj.__depth : visitedQueue.peekBack().__depth}`)
    unmark(visitedQueue)
    console.timeEnd('fpBFS')
}
findPathBFS.get = keyOrRegex => {
    if (keyOrRegex instanceof RegExp) {
        result.forEach((val, key) => {
            if(keyOrRegex.test(key)){
                console.log(`%c${key}`, 'color:#5db0d7')
                console.log(val, '\n')
            }
        })
    }
    return result.get(keyOrRegex)
}

Object.defineProperties(findPathBFS, {
    details: {
        get: () => {
            result.forEach((value, key) => {
                console.log('%c'+key, 'font-weight:bold;color:#5db0d7;')
                console.log(value)
            })
        }
    },
    result: {
        get: () => result
    }
})

module.exports = findPathBFS
