/**
 * Class representing an asynchronous queue.
 *
 * This queue allows for asynchronous enqueuing and dequeuing of items.
 * When an item is enqueued, it is either immediately passed to a waiting dequeue
 * call, or it is added to the queue if no dequeue calls are waiting.
 *
 * When an item is dequeued, it is either immediately returned from the queue,
 * or a promise is returned that will be resolved when an item is enqueued.
 *
 * This queue is useful for situations where you need to process items asynchronously
 * and ensure that they are processed in the order they are enqueued.
 *
 */
class AsyncQueue {
  constructor() {
    this.queue = [];
    this.resolvers = [];
  }

  /**
   * Enqueues an item into the queue.
   *
   * If a dequeue call is waiting, the item is passed to the dequeue call.
   * Otherwise, the item is added to the queue.
   */
  async enqueue(item) {
    if (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      resolve(item);
    } else {
      this.queue.push(item);
    }
  }

  /**
   * Dequeues an item from the queue.
   *
   * If the queue is empty, a promise is returned that will be resolved
   * when an item is enqueued.
   *
   * @returns {Promise<any>} A promise that resolves with the dequeued item.
   */
  async dequeue() {
    if (this.queue.length > 0) {
      return this.queue.shift();
    } else {
      return new Promise((resolve) => this.resolvers.push(resolve));
    }
  }

  /**
   * Returns the length of the queue.
   *
   * @returns {number} The length of the queue.
   */
  get length() {
    return this.queue.length;
  }
}

module.exports = AsyncQueue;
