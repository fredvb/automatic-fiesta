declare class MinHeap<T> {
  private heap: T[];
  private getValue: (element: T) => number;

  /**
   * 
   * @param getValue Function to get the comparable value from the element
   */
  constructor(getValue?: (element: T) => number);

  private getParentIndex(i: number): number;
  private getLeftChildIndex(i: number): number;
  private getRightChildIndex(i: number): number;
  private swap(i: number, j: number): void;

  /**
   * Insert an element in the heap.
   * Space complexity: O(log n)
   * @param element element to add
   */
  public insert(element: T): void;
  
  /**
   * Extract the element with the minimum value from the heap
   * Space complexity: O(log n)
   */
  public extractMin(): T | null;
  private heapifyUp(): void;
  private heapifyDown(): void;
}

export = MinHeap;
