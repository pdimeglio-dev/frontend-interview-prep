# Debounce

> **Module 1** · BFE.dev: [#6 Debounce](https://bigfrontend.dev/problem/implement-basic-debounce) · [#7 Debounce with leading & trailing](https://bigfrontend.dev/problem/implement-debounce-with-leading-and-trailing-option)

## Problem

Implement a `debounce` function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.

## Requirements

1. Return a new function that delays invoking `func` by `wait` ms after the last call
2. If called again before `wait` expires, the previous timer resets
3. Preserve `this` context and forward all arguments to the original function
4. Support an `options` object:
   - `leading` (default `false`) — invoke on the **leading** edge (immediately on first call)
   - `trailing` (default `true`) — invoke on the **trailing** edge (after `wait` ms of silence)
5. Attach a `.cancel()` method to the returned function that cancels any pending invocation

## Examples

```js
const log = debounce(console.log, 300);
log("a"); // timer starts
log("b"); // timer resets
log("c"); // timer resets → after 300ms, logs "c"

const immediate = debounce(console.log, 300, { leading: true, trailing: false });
immediate("x"); // logs "x" immediately
immediate("y"); // ignored (within 300ms window)
```

## Constraints

- Do NOT use lodash or any external library
- Your implementation should pass all tests in `index.test.ts`
