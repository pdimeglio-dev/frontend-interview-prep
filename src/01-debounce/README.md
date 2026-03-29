# Debounce (Basic)

> **Module 1** · BFE.dev: [#6 Implement basic debounce](https://bigfrontend.dev/problem/implement-basic-debounce)

## Problem

Implement a `debounce` function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.

## Requirements

1. Return a new function that delays invoking `func` by `wait` ms after the last call
2. If called again before `wait` expires, the previous timer resets
3. Preserve `this` context and forward all arguments to the original function
4. Use the **last call's arguments** when the timer finally fires

## Examples

```js
const log = debounce(console.log, 300);
log("a"); // timer starts
log("b"); // timer resets
log("c"); // timer resets → after 300ms of silence, logs "c"
```

## Constraints

- Do NOT use lodash or any external library
- Your implementation should pass all tests in `index.test.ts`

## Next Step

Once you've solved this, try the advanced version with leading/trailing options:
→ [01b-debounce-leading-trailing](/exercise/01b-debounce-leading-trailing)
