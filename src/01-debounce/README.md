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

## Solution Walkthrough

<details>
<summary>🔍 Click to reveal the solution</summary>

```js
export function debounce(func, wait) {
  let timeOutId = undefined;

  return function (...args) {
    let context = this;
    clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      func.apply(context, [...args]);
    }, wait);
  };
}
```

</details>

### Key Concepts Used

#### 1. Closure — Remembering `timeOutId`

The returned function **closes over** the `timeOutId` variable declared in the outer scope. This is what allows the debounced function to "remember" the pending timer across multiple calls. Every call sees the same `timeOutId` and can cancel or replace it.

```js
let timeOutId = undefined;  // ← lives in the closure's "backpack"

return function (...args) {
  clearTimeout(timeOutId);  // ← can access it on every call
  timeOutId = setTimeout(/* ... */);  // ← can update it
};
```

> 📖 See notes: [Closures](/docs/module-1/closures)

#### 2. `clearTimeout` + `setTimeout` — The Reset Mechanism

This is the core of debouncing: **cancel the previous timer, then start a new one**.

- `clearTimeout(timeOutId)` — If there's a pending timer, cancel it. Safe to call even if `timeOutId` is `undefined`.
- `setTimeout(() => { ... }, wait)` — Schedule a new execution after `wait` ms of silence.

This two-step dance is what guarantees the function only fires after the caller has stopped calling for `wait` milliseconds.

> 📖 See notes: [setTimeout & clearTimeout](/docs/module-1/settimeout-cleartimeout)

#### 3. Preserving `this` Context

`this` is determined by **how the debounced function is called**. Our implementation captures it and forwards it to the original `func` via `apply`. Here's what `this` would be in different real-world scenarios:

##### Scenario A: As an object method

```js
function logName() { console.log(this.name); }
const debouncedLog = debounce(logName, 100);

const user = { name: "Pablo", log: debouncedLog };
user.log();
// → this = user → logs "Pablo"
// Because: user.log() → the dot syntax makes `this` = user
```

##### Scenario B: As a DOM event handler

```js
function handleInput() { console.log(this.value); }
const debouncedHandler = debounce(handleInput, 300);

input.addEventListener("input", debouncedHandler);
// → this = the <input> element → logs the input's value
// Because: the browser calls the handler with `this` = the element
```

##### Scenario C: Standalone call (no object)

```js
function showThis() { console.log(this); }
const debounced = debounce(showThis, 100);

debounced();
// → this = undefined (strict mode) or window (sloppy mode)
// Because: no object before the dot → no context
```

##### Scenario D: Explicit binding with `.call()` / `.apply()`

```js
function greet() { console.log(`Hi, ${this.name}`); }
const debouncedGreet = debounce(greet, 100);

const ctx = { name: "World" };
debouncedGreet.call(ctx);
// → this = ctx → logs "Hi, World"
// Because: .call() explicitly sets `this`
```

##### Why it works: two function styles

```js
//                 regular function → `this` is dynamic, set by the caller
return function (...args) {
  let context = this;         // capture the caller's `this`
  clearTimeout(timeOutId);
  timeOutId = setTimeout(() => {   // arrow function → inherits `context` from closure
    func.apply(context, [...args]);  // forward it to the original func
  }, wait);
};
```

- **Outer = regular function** — so `this` is determined by how the debounced function is called (scenarios above).
- **Inner setTimeout = arrow function** — so it inherits `context` from the closure instead of getting `window`/`undefined` from `setTimeout`.

If the outer were an arrow function, `this` would always be the scope where `debounce()` was defined — ignoring the caller entirely.

##### Why do we need `apply` at all?

You might think: "isn't `setTimeout` a browser API that loses `this`?" That's a common explanation, but it's not quite right here. Since we're using an **arrow function** inside `setTimeout`, the arrow already inherits the closure's scope — `setTimeout` being a browser API doesn't matter.

The real reason we need `apply` is simpler: **`func` is a standalone variable**, not attached to any object. Calling `func(...args)` is a plain function call, and in JavaScript, a plain call always sets `this` to `undefined` (strict) or `window` (sloppy) — regardless of where it happens:

```js
// Even outside setTimeout, this loses context:
const func = logName;
func();        // → this = undefined  ❌ (plain call, no object)
user.logName(); // → this = user      ✅ (method call)

// Inside our debounce, same problem:
setTimeout(() => {
  func(...args);                    // ❌ this = undefined (plain call)
  func.apply(context, [...args]);   // ✅ this = context (explicitly set)
}, wait);
```

So `apply` isn't about `setTimeout` — it's about the fact that `func` is just a reference to a function, and calling a reference directly is always a "plain call" with no `this`. We use `apply` to explicitly say: "call this function, but pretend it was called on `context`."

> 📖 See notes: [The `this` Keyword](/docs/module-1/this-keyword)

#### 4. Rest Parameters & `Function.prototype.apply`

- **`...args`** (rest parameter) — Collects all arguments into an array, regardless of how many are passed. This makes the debounced function work with any function signature.
- **`func.apply(context, [...args])`** — Calls `func` with a specific `this` value and an array of arguments. This forwards both the context and arguments captured at call time.

> 📖 See notes: [Rest & Spread](/docs/module-1/rest-spread)

### How the Tests Verify Each Concept

| Test | What it checks | Concept |
|------|---------------|---------|
| *should delay invocation by wait ms* | `fn` isn't called until `wait` elapses | `setTimeout` scheduling |
| *should reset timer on subsequent calls* | Rapid calls push the execution forward | `clearTimeout` + new `setTimeout` |
| *should forward arguments* | Arguments arrive at the original function | Rest params + `apply` |
| *should use the last call's arguments* | Only the final call's args are used | Closure overwrites `args` each call |
| *should preserve this context* | `this` inside `func` matches the caller | Regular function + `apply(context)` |

## Next Step

Once you've solved this, try the advanced version with leading/trailing options:
→ [01b-debounce-leading-trailing](/exercise/01b-debounce-leading-trailing)
