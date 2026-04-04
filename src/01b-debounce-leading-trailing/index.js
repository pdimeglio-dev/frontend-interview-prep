/**
 * Implement debounce with leading & trailing options.
 * See README.md for the full problem description.
 *
 * BFE.dev #7: https://bigfrontend.dev/problem/implement-debounce-with-leading-and-trailing-option
 *
 * @param {(...args: any[]) => any} func
 * @param {number} wait
 * @param {{ leading?: boolean, trailing?: boolean }} options
 * @returns {(...args: any[]) => any}
 */
export function debounce(func, wait, options = {}) {
  let timeOutId = undefined;

  const debouncedFunction = function(...args) {
    let context = this;

    // if there is a defined timeoutId, that means we ran at least once and then started the timeout.
    let isFirstCall = !timeOutId;

    //everytime a new call comes in, we clear the timeout and start a new one. like elevator door and regular debounce.
    
    // I will just implement regular debounce first, and then add leading and trailing options
    clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      // so when timeout is done, we are able to run another debounce, the isFirstCall will be true again and we will execute.
      timeOutId = undefined;
      if (options.trailing !== false) {
        // (options.trailing) this would execute only when trailing is true. which is wrong. When undefined we should execute as well, default is trailing
        func.apply(context, args);
      }
    }, wait);

    // if options is leding, we run the function when is First call.
    if (isFirstCall && options.leading) {
      func.apply(context, args);
    }
  }

  debouncedFunction.cancel = function() {
    // on cancel we should clear the timeout to prevent any future call.
    clearTimeout(timeOutId);
    timeOutId = undefined;
  }

  return debouncedFunction;
}
