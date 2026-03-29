# Debounce with Leading & Trailing

> **Module 1** · BFE.dev: [#7 Debounce with leading & trailing](https://bigfrontend.dev/problem/implement-debounce-with-leading-and-trailing-option)

## Problem

Enhance your basic debounce with `leading` and `trailing` options, plus a `.cancel()` method — just like Lodash's `_.debounce`.

## Prerequisites

Make sure you've completed the basic debounce first:
→ [01-debounce](/exercise/01-debounce)

## Requirements

1. All basic debounce behavior (delay, reset, forward args, preserve `this`)
2. Support an `options` object:
   - `leading` (default `false`) — invoke on the **leading** edge (immediately on first call)
   - `trailing` (default `true`) — invoke on the **trailing** edge (after `wait` ms of silence)
3. When both `leading` and `trailing` are `true`, the function fires immediately on the first call AND again after `wait` ms of silence (if called more than once)
4. Attach a `.cancel()` method to the returned function that cancels any pending invocation
5. After `.cancel()`, new calls should still work normally

## Examples

```js
// Trailing only (default) — same as basic debounce
const log = debounce(console.log, 300);
log("a"); // timer starts
log("b"); // timer resets → after 300ms, logs "b"

// Leading only — fires immediately, ignores calls within the wait window
const immediate = debounce(console.log, 300, { leading: true, trailing: false });
immediate("x"); // logs "x" immediately
immediate("y"); // ignored (within 300ms window)

// Both leading and trailing
const both = debounce(console.log, 300, { leading: true, trailing: true });
both("first");  // logs "first" immediately
both("second"); // after 300ms, logs "second"

// Cancel
const d = debounce(console.log, 300);
d("hello");
d.cancel(); // pending invocation cancelled
```

## Constraints

- Do NOT use lodash or any external library
- Your implementation should pass all tests in `index.test.ts`
