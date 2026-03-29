/**
 * Implement a basic debounce function.
 * See README.md for the full problem description.
 *
 * BFE.dev #6: https://bigfrontend.dev/problem/implement-basic-debounce
 */

/**
 * @param {(...args: any[]) => any} func
 * @param {number} wait
 * @returns {(...args: any[]) => any}
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // TODO: Implement here
  return function (...args: Parameters<T>) {};
}
