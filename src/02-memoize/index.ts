/**
 * Implement memoize here.
 * See README.md for the full problem description.
 */

export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => any
): T {
  // TODO: Implement this
  return func;
}
