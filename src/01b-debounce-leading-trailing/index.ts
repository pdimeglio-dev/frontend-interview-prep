/**
 * Implement debounce with leading & trailing options.
 * See README.md for the full problem description.
 *
 * BFE.dev #7: https://bigfrontend.dev/problem/implement-debounce-with-leading-and-trailing-option
 */

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  // TODO: Implement here
  const debounced = function (...args: Parameters<T>) {} as DebouncedFunction<T>;
  debounced.cancel = () => {};
  return debounced;
}
