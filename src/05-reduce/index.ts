/**
 * Implement Array.prototype.myReduce here.
 * See README.md for the full problem description.
 */

declare global {
  interface Array<T> {
    myReduce<U>(
      callback: (accumulator: U, currentValue: T, index: number, array: T[]) => U,
      initialValue?: U
    ): U;
  }
}

Array.prototype.myReduce = function (callback, ...rest) {
  // TODO: Implement this
  // Hint: use rest.length to detect if initialValue was passed
  throw new Error("Not implemented");
};

export {};
