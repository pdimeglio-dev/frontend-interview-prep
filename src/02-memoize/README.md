# Memoize

> **Module 2** · BFE.dev: [#14 Implement Memo](https://bigfrontend.dev/problem/implement-general-memoization-function)

## Problem

Implement a `memoize` function that caches the result of a function call based on its arguments. If the same arguments are passed again, return the cached result instead of re-executing the function.

## Requirements

1. Return a new function that caches results
2. Use the **first argument** as the cache key by default
3. Accept an optional `resolver` function that generates a custom cache key from the arguments
4. Preserve `this` context when invoking the original function
5. Use a `Map` for the cache (not a plain object)

## Examples

```js
const add = (a, b) => a + b;
const memoizedAdd = memoize(add);

memoizedAdd(1, 2); // computes: 3
memoizedAdd(1, 2); // cached: 3 (function not called again)
memoizedAdd(2, 3); // computes: 5

// With resolver
const memoizedAdd2 = memoize(add, (a, b) => `${a}-${b}`);
memoizedAdd2(1, 2); // computes: 3
memoizedAdd2(1, 3); // computes: 4 (different key "1-3")
```

## Constraints

- Do NOT use lodash or any external library
- Your implementation should pass all tests in `index.test.ts`
