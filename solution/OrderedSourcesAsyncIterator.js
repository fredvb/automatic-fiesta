const MinHeap = require("./MinHeap");

/**
 * AsyncIterator that returns the list of entries, across all of the sources, in chronological order.
 *
 * @param {Array} sources Array of sources that will get consumed
 * @param {Function} getNextSourceItem Function to get the next element from the source
 * @param {Function} getItemValue Function to get the comparable value from the element
 */
class OrderedSourcesAsyncIterator {
  constructor(sources, getNextSourceItem, getItemValue) {
    this.sources = sources;
    this.getNextSourceItem = getNextSourceItem;
    this.minHeap = new MinHeap((item) => getItemValue(item.item));
  }
  /**
   * Returns an async iterator
   */
  async *[Symbol.asyncIterator]() {
    await this.initHeap();
    while (true) {
      const minElement = this.minHeap.extractMin();
      if (!minElement) break;

      yield minElement.item;

      // consume next item from source and add to minHeap.
      const nextItem = await this.getNextSourceItem(
        this.sources[minElement.sourceIndex]
      );
      if (nextItem) {
        this.minHeap.insert({
          sourceIndex: minElement.sourceIndex,
          item: nextItem,
        });
      }
    }
  }
  /**
   * Initializes the heap with an item from each source.
   */
  async initHeap() {
    // Leverage Promise.all to fetch all the first elements quickly.
    const items = await Promise.all(
      this.sources.map(async (source) => await this.getNextSourceItem(source))
    );
    items.forEach((item, index) => {
      if (item) {
        this.minHeap.insert({ sourceIndex: index, item });
      }
    });
  }
}
module.exports = OrderedSourcesAsyncIterator;
