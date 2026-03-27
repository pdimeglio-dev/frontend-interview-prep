# Array.prototype.reduce

> **Module 5** · BFE.dev: [#146 Implement Reduce](https://bigfrontend.dev/problem/implement-Array-prototype-reduce)

## Problem

Implement `Array.prototype.myReduce` — a polyfill for the native `reduce` method.

## Requirements

1. Accept a `callback(accumulator, currentValue, index, array)` and optional `initialValue`
2. If `initialValue` is provided, start from index 0 with it as the accumulator
3. If `initialValue` is NOT provided, use the first element as the accumulator and start from index 1
4. Throw `TypeError` if the array is empty and no initial value is provided
5. Skip sparse array holes (empty slots)
6. Detect whether `initialValue` was passed using `arguments.length`, NOT by checking `undefined`

## Examples

```js
[1, 2, 3].myReduce((acc, val) => acc + val, 0); // 6
[1, 2, 3].myReduce((acc, val) => acc + val);     // 6 (no initial value)
[].myReduce((acc, val) => acc + val);             // TypeError!
```

## Constraints

- Do NOT use the native `.reduce()` method
- Your implementation should pass all tests in `index.test.ts`
