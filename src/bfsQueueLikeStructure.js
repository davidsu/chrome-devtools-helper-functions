class QueueLike {
    constructor() {
        this.queue = []
        this.front = 0
    }

    enqueue(obj) {
        this.queue.push(obj)
    }

    dequeue() {
        return this.queue[++this.front]
    }

    pop() {
        return this.queue.pop()
    }
}

module.exports = QueueLike
