/**
 * Class representing a MinHeap implementation.
 * Binary tree used to efficiently get the element with the smallest value from a list of items
 *
 * Space complexity: O(log n)
 *
 */
class MinHeap {
  /**
   *
   * @param {function} getValue Function to get the comparable value from the element
   */
  constructor(getValue) {
    this.heap = [];
    this.getValue = getValue || ((element) => element);
  }

  // Get the index of the parent of the element at index i
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  // Get the index of the left child of the element at index i
  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  // Get the index of the right child of the element at index i
  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  // Swap the elements at indices i and j
  swap(i, j) {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }

  // Insert a new element into the heap
  insert(element) {
    this.heap.push(element); // Add the new element to the end of the heap
    this.heapifyUp(); // Restore the heap property by sifting the new element up
  }

  // Remove and return the minimum element from the heap
  extractMin() {
    if (this.heap.length === 0) return null; // If the heap is empty, return null
    if (this.heap.length === 1) return this.heap.pop(); // If the heap has one element, remove and return it

    const min = this.heap[0]; // The minimum element is at the root
    this.heap[0] = this.heap.pop(); // Replace the root with the last element in the heap
    this.heapifyDown(); // Restore the heap property by sifting the new root down
    return min; // Return the minimum element
  }

  // Restore the heap property by sifting an element up
  heapifyUp() {
    let index = this.heap.length - 1; // Start with the last element
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      // If the element is greater than or equal to its parent, the heap property is satisfied
      if (
        this.getValue(this.heap[index]) >= this.getValue(this.heap[parentIndex])
      ) {
        break;
      }
      this.swap(index, parentIndex); // Swap the element with its parent
      index = parentIndex; // Move up to the parent's index
    }
  }

  // Restore the heap property by sifting an element down
  heapifyDown() {
    let index = 0; // Start with the root element
    const length = this.heap.length;

    while (this.getLeftChildIndex(index) < length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      // If the right child exists and is smaller than the left child, use the right child
      if (
        rightChildIndex < length &&
        this.getValue(this.heap[rightChildIndex]) <
          this.getValue(this.heap[smallerChildIndex])
      ) {
        smallerChildIndex = rightChildIndex;
      }

      // If the element is less than or equal to the smaller child, the heap property is satisfied
      if (
        this.getValue(this.heap[index]) <=
        this.getValue(this.heap[smallerChildIndex])
      ) {
        break;
      }

      this.swap(index, smallerChildIndex); // Swap the element with its smaller child
      index = smallerChildIndex; // Move down to the smaller child's index
    }
  }
}

module.exports = MinHeap;
