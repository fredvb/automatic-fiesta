const AsyncQueue = require('./AsyncQueue');

/**
 * Class representing a LogSource with a prefetch buffer.
 *
 * This class wraps a LogSource and prefetches items from the source into a buffer.
 * This allows for faster dequeuing of items, as the items are already available in the buffer.
 *
 * The buffer size can be dynamically adjusted based on the number of items in the buffer.
 * This helps to optimize the buffer size for the current load. (WIP)
 *
 * @param {LogSource} source The LogSource to wrap.
 * @param {number} initialBufferSize The initial size of the buffer.
 * @param {number} minBufferSize The minimum size of the buffer.
 * @param {number} maxBufferSize The maximum size of the buffer.
 */
class LogSourcePrefetchBuffer {
  constructor(source, initialBufferSize = 10, minBufferSize = 5, maxBufferSize = 40) {
    this.source = source;
    this.bufferSize = initialBufferSize;
    this.minBufferSize = minBufferSize;
    this.maxBufferSize = maxBufferSize;
    this.queue = new AsyncQueue();
    this.done = false;
    this.prefetching = false;
  }

  async popAsync() {
    const item = this.queue.dequeue();

    this.adjustBufferSize();
    this.prefetch();

    return item;
  }

  /**
   * Very basic dynamic buffer size management. Tends to pull downwards.
   *
   * Would be interesting to make adjustments based on fetch rate vs consumption rate.
   * It should be noted that most cases where a dynamic buffer will have it's biggest impact
   * is based on the fluctuations in rates. Nevertheless, it's a bit out of scope.
   *
   */
  adjustBufferSize() {
    if (this.queue.length > this.minBufferSize && this.bufferSize > this.minBufferSize) {
      this.bufferSize--;
    } else if (this.queue.length < this.minBufferSize && this.bufferSize < this.maxBufferSize) {
      this.bufferSize++;
    }
  }

  async prefetch() {
    if (this.done || this.prefetching) {
      return;
    }
    this.prefetching = true;
    // Prefetch items until the buffer is full or the source is exhausted
    while (this.queue.length < this.bufferSize && !this.done) {
      const item = await this.source.popAsync();
      // console.log("item");
      await this.queue.enqueue(item);
      if (!item) {
        this.done = true;
        // console.log('finished with bufferSize: ', this.bufferSize);
        break;
      }
    }
    this.prefetching = false;
  }
}

module.exports = LogSourcePrefetchBuffer;
