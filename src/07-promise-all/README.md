# Promise.all

> **Module 6** · BFE.dev: [#67 Promise.all](https://bigfrontend.dev/problem/implement-Promise-all) · [#68 Promise.allSettled](https://bigfrontend.dev/problem/implement-Promise-allSettled) · [#69 Promise.race](https://bigfrontend.dev/problem/implement-Promise-race)

## Problem

Implement `promiseAll` — a function that behaves like `Promise.all()`.

## Requirements

1. Accept an array of values (promises or non-promises)
2. Return a Promise that resolves with an array of all resolved values
3. Preserve the order of results to match the input array order
4. If **any** promise rejects, immediately reject with that error (fail-fast)
5. Non-promise values should be treated as resolved promises
6. An empty array should resolve immediately with `[]`

## Examples

```js
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

promiseAll([p1, p2, p3]).then(console.log); // [1, 2, 3]
promiseAll([p1, 42, p3]).then(console.log); // [1, 42, 3]
promiseAll([]).then(console.log);           // []

const failing = Promise.reject(new Error("fail"));
promiseAll([p1, failing]).catch(console.log); // Error: fail
```

## Constraints

- Do NOT use `Promise.all()` in your implementation
- Your implementation should pass all tests in `index.test.ts`
