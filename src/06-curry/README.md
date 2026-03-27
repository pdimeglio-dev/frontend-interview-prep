# Curry

> **Module 5** · BFE.dev: [#1 Implement Curry](https://bigfrontend.dev/problem/implement-curry) · [#2 Curry with Placeholder](https://bigfrontend.dev/problem/implement-curry-with-placeholder)

## Problem

Implement a `curry` function that transforms a function so it can be called with fewer arguments than expected, returning a new function that takes the remaining arguments.

## Requirements

1. `curry(fn)` returns a curried version of `fn`
2. If enough arguments are provided, invoke `fn` immediately
3. If fewer arguments are provided, return a new function that accepts the remaining ones
4. Support multiple partial applications: `curried(1)(2)(3)` and `curried(1, 2)(3)` and `curried(1)(2, 3)`
5. Preserve `this` context
6. Use `fn.length` to determine when enough arguments have been collected

## Examples

```js
function add(a, b, c) { return a + b + c; }
const curriedAdd = curry(add);

curriedAdd(1, 2, 3);    // 6
curriedAdd(1)(2)(3);     // 6
curriedAdd(1, 2)(3);     // 6
curriedAdd(1)(2, 3);     // 6
```

## Constraints

- Do NOT use lodash or any external library
- Your implementation should pass all tests in `index.test.ts`
