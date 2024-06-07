const MinHeap = require("./MinHeap");

/**
 * Iterator that returns the list of entries, across all of the sources, in chronological order.
 *
 * @param {Array} sources Array of sources that will get consumed
 * @param {Function} getNextSourceItem Function to get the next element from the source
 * @param {Function} getItemValue Function to get the comparable value from the element
 */
class OrderedSourcesIterator {
  constructor(sources, getNextSourceItem, getItemValue) {
    this.sources = sources;
    this.getNextSourceItem = getNextSourceItem;
    this.minHeap = new MinHeap((item) => getItemValue(item.item));
  }
  /**
   * Returns an iterator
   */
  *[Symbol.iterator]() {
    this.initHeap();
    while (true) {
      const minElement = this.minHeap.extractMin();
      if (!minElement) break;

      yield minElement.item;

      // consume next item from source and add to minHeap.
      const nextItem = this.getNextSourceItem(
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
    const items = this.sources.map((source) => this.getNextSourceItem(source));

    // Insert the first elements into the heap
    items.forEach((item, index) => {
      if (item) {
        this.minHeap.insert({ sourceIndex: index, item });
      }
    });
  }
}
module.exports = OrderedSourcesIterator;
