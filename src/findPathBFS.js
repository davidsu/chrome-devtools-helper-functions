const Dequeue = require('./bfsQueueLikeStructure')//require('double-ended-queue')
const {isMatch, _getPath} = require('./utils')
const take_ = require('lodash/take') 

let result
let initialPath = ''
const objOrFuncRegex = /(?:function|object)/
let findcount = 0
let queueLike
let nonExtensibleVisitedSet
let maxDepthLookedInto
const _limit = 300000

function isDomNode(node) {
   if( typeof node !== "object") {
       return false
   }
   try{
       return typeof node.nodeType === "number" && typeof node.nodeName==="string"
   }catch(e) {
       //avoid error of type `Blocked a frame with origin "https://editor.wix.com" from accessing a cross-origin frame.`
       return true
   }
}
function shouldProcessNext(node, parent) {
    if (!node) {
        return false
    }
    if (!Object.isExtensible(node)) {
        return !nonExtensibleVisitedSet.has(node)
    }
    return objOrFuncRegex.test(typeof node) && !isDomNode(node) && !node.__visited
}
function unmark(){
    let node
    while(node = queueLike.pop()){
        delete node.__parent
        delete node.__visited
        delete node.__depth
        delete node.__key
    }
}
function processNode(prop, parent, node, key) {
    if(Object.isExtensible(node)){
        node.__key = key
        node.__visited = 1
        node.__depth = parent.__depth + 1
        node.__parent = parent
    } else {
        nonExtensibleVisitedSet.add(node)
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
        --findcount
        findcount % 2 ? 
            console.log(`%c${path}`, 'background-color:#242424;color:#bdc6cf') :
            console.log(`%c${path}`, 'background-color:#242424;color:#bcb2a2')
        // console.log(path)
        result.set(path, node)
    }
    queueLike.enqueue(node)
}

function processNodeIfNeeded(prop, parent, key) {
    if (key === 's' && parent.__key === 'require') {
        return
    }
    if(!(/(?:^requirejs$|_renderedComponent|_reactBoundContext|_reactInternalInstance|__key|__visited|__parent|__depth)/.test(key))){
        const originalNode = parent.__original || parent
        let node = originalNode[key]
        if(shouldProcessNext(node, originalNode)){
            processNode(prop, parent, node, key)
            return true
        }
    }
}

function findPath(node, limit, prop) {
    let iterations = 0
    while ( node && ++iterations < limit && findcount > 0){
        const originalNode = node.__original || node
        maxDepthLookedInto = node.__depth
        for(var k in originalNode) {
            processNodeIfNeeded(prop, node, k) && iterations++
        }
        node = queueLike.dequeue()
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
    nonExtensibleVisitedSet = new Set()
    maxDepthLookedInto = 0
    queueLike = new Dequeue()
    const root = extractRoot(rootArg)
    queueLike.enqueue(root)
    root.__visited = 1
    root.__depth = 1
    return {root}
}

function getArguments(){
    findcount = 1000000
    let limit = _limit
    if(arguments.length === 1 ){
        findcount = 20
        return {
            prop: arguments[0],
            rootArg: 'rendered',
            limit
        }
    }
    if((arguments.length === 2 && typeof arguments[1] === 'number')){
        let limit
        if(arguments[1] < 150){
            findcount = arguments[1]
            limit = 1000000
        } else {
            limit = arguments[1]
        }
        return {
            prop: arguments[0],
            rootArg: 'rendered',
            limit,
        }
    }
    return {
        rootArg: arguments[0],
        prop: arguments[1],
        limit: arguments[2] || _limit
    }
}
function findPathBFS(...args){
    const {rootArg, prop, limit, maxFound} = getArguments(...args) 
    console.time('fpBFS')
    const {root} = setup(rootArg)
    const {lastProcessedObj} = findPath(root, limit, prop)
    console.log('max depth looked into = ', maxDepthLookedInto)
    unmark()
    console.timeEnd('fpBFS')
}

findPathBFS.get = keyOrRegex => {
    if (typeof keyOrRegex === 'string') keyOrRegex = new RegExp(keyOrRegex)
    if (keyOrRegex instanceof RegExp) {
        result.forEach((val, key) => {
            if(keyOrRegex.test(key)){
                console.log(`%c${key}`, 'color:#5db0d7')
                console.log(val, '\n')
            }
        })
    }
}
findPathBFS.filter = keyOrRegex => {
    if (typeof keyOrRegex === 'string') keyOrRegex = new RegExp(keyOrRegex)
    let arr = []
    if (keyOrRegex instanceof RegExp) {
        for (let [key] of result.entries()) {
            if(keyOrRegex.test(key))
                arr.push(key)
        }
        logArr(arr)
    }
}

findPathBFS.take = (val = 10) => {
    let i = 0
    let arr = []
    for (let [key] of result.entries()) {
        if(++i > val) break
        arr.push(key)
    }
    logArr(arr)
}

const logArr = arr => {
    arr.forEach(a => console.log(a))
}

findPathBFS.reverse = () => {
    const arr = []
    for (let [key] of result.entries()) {
        arr.push(key)
    }
    logArr(arr)
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
    },
    reverse: {
        get: () => {
            let res = []
            for (let key of result.keys()) {
                res.push(key)
            }
            logArr(res.reverse())
        }
    }
})

module.exports = findPathBFS
