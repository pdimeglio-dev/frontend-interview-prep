/**
 * Implement memoize here.
 * See README.md for the full problem description.
 *
 * @param {(...args: any[]) => any} func
 * @param {(...args: any[]) => any} [resolver]
 * @returns {(...args: any[]) => any}
 */
export function memoize(func, resolver) {
    const cache = new Map();

    const memoizedFunction = function (...args) {
        // by default we use args[0] as the key, will add the resolver to generate the key later
        const key = resolver ? resolver(...args) : args[0];

        if (cache.has(key)) return cache.get(key);

        const resultValue = func.apply(this, args); // we pass this as the this for the current call, the one where memoized was called
        cache.set(key, resultValue);

        return resultValue;
    };

    return memoizedFunction;
}
