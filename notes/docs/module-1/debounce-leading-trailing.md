---
sidebar_position: 7
title: "Debounce: Leading & Trailing"
---

# Debounce with Leading & Trailing Options

## Summary

Extend basic debounce with `leading` and `trailing` options plus a `.cancel()` method — just like Lodash's `_.debounce`. This exercise builds on the concepts from the basic debounce and layers in option handling, default values, and attaching methods to function objects.

> **Exercise:** [01b-debounce-leading-trailing](http://localhost:3737/exercise/01b-debounce-leading-trailing)  
> **BFE.dev:** [#7 — Implement debounce with leading & trailing option](https://bigfrontend.dev/problem/implement-debounce-with-leading-and-trailing-option)

---

## Phase-by-Phase Implementation

This walkthrough mirrors the actual step-by-step process of building the solution, starting from a basic debounce skeleton and progressively adding features.

---

### Phase 1: Basic Debounce Skeleton (Trailing Only)

Start with just the core debounce behavior — delay execution until after a quiet period. No options yet.

```javascript
export function debounce(func, wait, options = {}) {
  let timeOutId = undefined;

  return function (...args) {
    let context = this;

    // Reset the timer on every call (elevator door analogy)
    clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      timeOutId = undefined;
    }, wait);
  }
}
```

#### What's happening here

- **Closure:** `timeOutId` is enclosed — the returned function "remembers" it across calls.
- **`this` preservation:** Captured with `let context = this` so we can later use `func.apply(context, args)`.
- **Rest parameters:** `...args` packs all arguments into a proper `Array` — no need to spread it again later. Writing `func.apply(context, [...args])` is redundant; `func.apply(context, args)` is sufficient.
- **Timer reset:** `clearTimeout` + new `setTimeout` on every call means only the **last** call's timer survives — the "elevator door" pattern.

:::tip Rest Parameters
`(...args)` in a function signature uses **rest parameters** which already collects arguments into an array. So `args` is an array — no need to do `[...args]` when passing to `.apply()`. Small thing, but in an interview it shows you understand the distinction.
:::

At this point the timeout callback is empty — it just resets `timeOutId`. The function never actually fires. That's intentional: we're building the skeleton first.

---

### Phase 2: Adding the Leading Option

**Goal:** When `leading: true`, fire the function immediately on the first call, then block further calls until the wait period expires.

The key insight: **`timeOutId` itself is the "cooldown" flag.** If it's `undefined`, no timer is running and we're ready for a fresh leading call.

```javascript
export function debounce(func, wait, options = {}) {
  let timeOutId = undefined;

  return function (...args) {
    let context = this;

    // If timeOutId is undefined → no active cooldown → this is a "first call"
    let isFirstCall = !timeOutId;

    // Reset timer on every call
    clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      timeOutId = undefined; // Unlock for next leading call
    }, wait);

    // Leading: fire immediately on first call
    if (isFirstCall && options.leading) {
      func.apply(context, args);
    }
  }
}
```

#### How leading works — trace through

Given `debounce(fn, 100, { leading: true, trailing: false })`:

| Call | `isFirstCall` | `timeOutId` | Action |
|------|--------------|-------------|--------|
| `debounced()` (1st) | `true` | was `undefined` | ✅ Calls `fn` immediately, starts timer |
| `debounced()` (2nd, within 100ms) | `false` | has a value | ❌ Skipped — timer reset |
| `debounced()` (3rd, within 100ms) | `false` | has a value | ❌ Skipped — timer reset |
| *100ms of silence…* | — | `undefined` again | Ready for next burst |

The timeout callback only resets `timeOutId = undefined` — it doesn't call the function. This "unlocks" the gate for the next leading invocation.

---

### Phase 3: Adding the Trailing Option

**Goal:** After the wait period expires (no more calls), fire the function with the **last** arguments. This is the default debounce behavior.

The trailing call goes inside the `setTimeout` callback:

```javascript
timeOutId = setTimeout(() => {
  timeOutId = undefined;
  if (options.trailing !== false) {
    func.apply(context, args);
  }
}, wait);
```

#### Why `!== false` instead of just checking truthiness?

This is a critical detail:

| `options.trailing` | `if (options.trailing)` | `if (options.trailing !== false)` |
|---|---|---|
| `true` | ✅ fires | ✅ fires |
| `false` | ❌ doesn't fire | ❌ doesn't fire |
| `undefined` (no option passed) | ❌ **doesn't fire!** | ✅ **fires!** |

Per the spec, `trailing` **defaults to `true`**. When someone calls `debounce(fn, 100)` with no options, `options.trailing` is `undefined` — which is falsy. Using `options.trailing !== false` means: "fire unless explicitly told not to."

#### Which args does the trailing call use?

Since we `clearTimeout` + create a new `setTimeout` on every call, only the **last** timeout survives. Each timeout's closure captures the `args` and `context` from that specific invocation. So the surviving timeout naturally has the last call's arguments. Closures do the work for free.

#### Full code after Phase 3

```javascript
export function debounce(func, wait, options = {}) {
  let timeOutId = undefined;

  return function (...args) {
    let context = this;
    let isFirstCall = !timeOutId;

    clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      timeOutId = undefined;
      if (options.trailing !== false) {
        func.apply(context, args);
      }
    }, wait);

    if (isFirstCall && options.leading) {
      func.apply(context, args);
    }
  }
}
```

#### Both leading AND trailing — trace through

Given `debounce(fn, 100, { leading: true, trailing: true })`:

```
debounced("first")  → isFirstCall=true  → leading fires with "first"
                      → timeout set (will fire trailing with "first" if no more calls)

debounced("second") → isFirstCall=false → no leading
                      → clearTimeout, new timeout captures "second"

...100ms of silence...
                      → trailing fires with "second" ✅
```

Result: `fn` called **2 times** — first with `"first"` (leading), then with `"second"` (trailing). The trailing call uses the args from the **last** invocation during the wait window.

---

### Phase 4: Adding `.cancel()`

**Goal:** Attach a `.cancel()` method that kills any pending invocation, but lets the debounced function continue working normally for future calls.

#### Key concept: Functions are objects

In JavaScript, functions are first-class objects — you can attach properties to them:

```javascript
const myFn = function() {};
myFn.cancel = function() { /* ... */ };
// Both myFn() and myFn.cancel() work!
```

This is how the test uses it:
```javascript
const debounced = debounce(fn, 100);
debounced();        // call the debounced function
debounced.cancel(); // call a method ON the function
```

#### What `.cancel()` needs to do

1. **`clearTimeout(timeOutId)`** — kill the pending timer so the trailing call never fires
2. **`timeOutId = undefined`** — reset state so the next call is treated as a fresh "first call"

:::caution Cancel ≠ Disable
`.cancel()` does NOT permanently disable the debounce. It just resets to a clean state — as if the debounced function was never called. New calls after cancel go through the full debounce flow normally.
:::

#### Final complete implementation

```javascript
export function debounce(func, wait, options = {}) {
  let timeOutId = undefined;

  const debouncedFunction = function(...args) {
    let context = this;
    let isFirstCall = !timeOutId;

    clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      timeOutId = undefined;
      if (options.trailing !== false) {
        func.apply(context, args);
      }
    }, wait);

    if (isFirstCall && options.leading) {
      func.apply(context, args);
    }
  }

  debouncedFunction.cancel = function() {
    clearTimeout(timeOutId);
    timeOutId = undefined;
  }

  return debouncedFunction;
}
```

---

## Key Concepts Used

| Concept | How it's used |
|---------|--------------|
| **Closures** | `timeOutId` persists across calls via closure |
| **`this` keyword** | Captured with `let context = this` and forwarded with `.apply()` |
| **Rest parameters** | `...args` collects arguments into an array |
| **`setTimeout` / `clearTimeout`** | Timer reset pattern — the core of debounce |
| **Functions as objects** | Attaching `.cancel()` as a property on the returned function |
| **Truthy/falsy vs explicit checks** | `!== false` to default `trailing` to `true` |

## Edge Case: Closure vs `lastArgs` Pattern

Our implementation creates a **new closure** for each `setTimeout` callback, capturing `args` and `context` from that specific call. An alternative pattern used in Lodash-style implementations saves args to **outer variables**:

```javascript
// Alternative: outer variables approach
let lastArgs, lastContext;
return function(...args) {
  lastArgs = args;
  lastContext = this;
  clearTimeout(timeOutId);
  timeOutId = setTimeout(() => {
    func.apply(lastContext, lastArgs);
    lastArgs = lastContext = null;  // explicit cleanup
  }, wait);
}
```

**Why does this matter?** Consider `{ leading: true, trailing: true }` with a **single call**:

```
debounced("only");    // leading fires with "only"
// ...100ms of silence...
// trailing ALSO fires with "only" again! 💥 Double call!
```

With our closure approach, the trailing timeout still has `"only"` in its closure and fires — resulting in **2 calls** with the same args. With the `lastArgs` pattern, you can set `lastArgs = null` after the leading call, and the trailing callback checks `if (lastArgs)` before firing — so it only fires if there were **new calls** during the wait window.

:::note Our tests don't catch this
The "both leading and trailing" test always makes 2 calls (`debounced("first")` then `debounced("second")`), so this edge case doesn't surface. But an interviewer might ask: *"What happens if both are enabled and there's only one call?"*
:::

#### Fixed implementation using `lastArgs`

To handle this correctly, use outer variables to track whether there were new calls after the leading fired. After leading executes, set `lastArgs = null` — then trailing only fires `if (lastArgs)`:

```javascript
export function debounce(func, wait, options = {}) {
  let timeOutId = undefined;
  let lastArgs = null;
  let lastContext = null;

  const debouncedFunction = function(...args) {
    lastArgs = args;
    lastContext = this;

    let isFirstCall = !timeOutId;

    clearTimeout(timeOutId);

    timeOutId = setTimeout(() => {
      timeOutId = undefined;
      // Only fire trailing if there are pending args
      // (lastArgs is null if leading already consumed the only call)
      if (options.trailing !== false && lastArgs) {
        func.apply(lastContext, lastArgs);
      }
      lastArgs = lastContext = null; // cleanup
    }, wait);

    if (isFirstCall && options.leading) {
      func.apply(lastContext, lastArgs);
      lastArgs = null; // mark as consumed — prevents redundant trailing
    }
  }

  debouncedFunction.cancel = function() {
    clearTimeout(timeOutId);
    timeOutId = undefined;
    lastArgs = lastContext = null;
  }

  return debouncedFunction;
}
```

**How it fixes the edge case:**
- `debounced("only")` → `lastArgs = ["only"]`, leading fires, then `lastArgs = null`
- *...100ms...* → trailing checks `if (lastArgs)` → `null` → **skips!** ✅ No double fire.

**When there ARE subsequent calls:**
- `debounced("first")` → leading fires, `lastArgs = null`
- `debounced("second")` → `lastArgs = ["second"]` (populated again!)
- *...100ms...* → trailing checks `if (lastArgs)` → `["second"]` → **fires with "second"** ✅

---

## Common Interview Gotchas

1. **Forgetting the default for `trailing`:** Using `if (options.trailing)` instead of `if (options.trailing !== false)` breaks the default behavior when no options are passed.

2. **Redundant spread:** `func.apply(context, [...args])` — the `[...args]` spread is unnecessary since rest params already produce an array.

3. **Thinking `.cancel()` disables debounce permanently:** It just resets state. The function continues to work normally after cancel.

4. **Not resetting `timeOutId` in cancel:** If you only `clearTimeout` but don't set `timeOutId = undefined`, the `isFirstCall` check will be wrong on the next invocation.

## Key Takeaways

- Build complex functions **incrementally** — skeleton first, then layer features one at a time
- `timeOutId` does double duty: it's the timer handle AND the "am I in cooldown?" flag
- The `!== false` pattern is a clean way to handle "default true" options in JavaScript
- Closures capture variables by reference — when the last timeout fires, it naturally has the last call's args because each new call creates a new closure over its own args

## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Basic debounce (trailing only)
- 🏋️ [01b-debounce-leading-trailing](http://localhost:3737/exercise/01b-debounce-leading-trailing) — This exercise
