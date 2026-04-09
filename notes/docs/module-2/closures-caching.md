---
sidebar_position: 1
title: "Closures for Caching"
---

# Closures for Caching

## Summary

The returned memoized function forms a closure over the `cache` variable, keeping it alive in memory between calls. Every invocation checks the same persistent cache.

## Key Resources

- 📖 [javascript.info — Closures](https://javascript.info/closure)
- 🎥 [Akshay Saini — Closures in JS](https://www.youtube.com/watch?v=qikxEIxsXco)

---

## My Notes

### What is a closure?

A **closure** is when a function "remembers" variables from its outer scope, even after that outer function has finished running. The inner function **closes over** those variables — they stay alive in memory.

```javascript
function createCounter() {
  let count = 0; // this variable lives on after createCounter returns!

  return function () {
    count += 1;  // the returned function still has access to count
    return count;
  };
}

const counter = createCounter(); // createCounter is done, but count isn't gone
counter(); // 1
counter(); // 2 — count persists between calls!
counter(); // 3
```

> 🧠 **Why does `count` survive?** Because the returned function holds a reference to it. JavaScript's garbage collector won't clean up a variable as long as something still references it. The closure IS that reference.

---

### 🏋️ Exercise Walkthrough: Implementing Memoize

Here's the final solution with annotations on every decision:

```javascript
export function memoize(func, resolver) {
    const cache = new Map();  // ① Closure: persists across all calls

    const memoizedFunction = function (...args) {  // ② function keyword, NOT arrow
        const key = resolver ? resolver(...args) : args[0]; // ③ Key generation

        if (cache.has(key)) return cache.get(key); // ④ Cache check

        const resultValue = func.apply(this, args); // ⑤ Call original with this
        cache.set(key, resultValue); // ⑥ Store result

        return resultValue;
    };

    return memoizedFunction; // ⑦ Return the enhanced function (HOF pattern)
}
```

Let's break down each numbered decision:

#### ① `const cache = new Map()` — the closure

This is the heart of the exercise. `cache` is declared in the outer `memoize` function, but used by the inner `memoizedFunction`. When `memoize` returns, `cache` doesn't get garbage collected — the returned function closes over it.

**Why `Map` and not `{}`?** See [Map vs WeakMap notes](./map-vs-weakmap):
- Map accepts any key type (not just strings)
- No prototype pollution risk (`"constructor"` is a safe key)
- Better performance for frequent add/delete

#### ② `function (...args)` — NOT an arrow function

**This is critical.** Arrow functions don't have their own `this` — they inherit `this` from where they're defined (the module scope). If you used an arrow function, the `this` context test would fail:

```javascript
// ❌ Arrow function: `this` is the module scope, NOT the caller
const memoizedFunction = (...args) => {
  func.apply(this, args); // `this` is wrong!
};

// ✅ Regular function: `this` is whatever the caller provides
const memoizedFunction = function (...args) {
  func.apply(this, args); // `this` is the caller's context
};
```

Test that catches this:
```javascript
const obj = {
  multiplier: 3,
  compute: memoize(function (n) {
    return n * this.multiplier; // needs this = obj
  }),
};
obj.compute(5); // should be 15, not NaN
```

#### ③ `resolver ? resolver(...args) : args[0]` — key generation

- **Without resolver:** use the first argument as the key (default behavior, like lodash)
- **With resolver:** call it with the **same arguments** the memoized function received

**Important: `resolver(...args)` not `resolver(args)`!**
- `...args` collects separate arguments into an array: `memoized(1, 2)` → `args = [1, 2]`
- `resolver(...args)` spreads them back: `resolver(1, 2)` — the resolver gets separate params
- `resolver(args)` would pass one array: `resolver([1, 2])` — breaks the resolver's expectation

This is the same reason `.apply()` exists: it takes an array and spreads it into separate arguments for the function call.

#### ④ `cache.has(key)` — not `cache.get(key)`

Why `has` instead of `get`? Because **falsy return values** must be cached correctly:

```javascript
const fn = () => 0;
const memoized = memoize(fn);
memoized("key"); // returns 0, caches it

// If we used: if (cache.get(key)) → 0 is falsy → cache MISS! Bug!
// With:       if (cache.has(key)) → true → cache HIT! Correct!
```

Same for `null`, `undefined`, `false`, `""` — all falsy values that should be cacheable.

#### ⑤ `func.apply(this, args)` — preserving context

`.apply()` does two things at once:
1. Sets `this` inside `func` to whatever `this` is in the memoized function (the caller's context)
2. Spreads the `args` array into individual arguments

**Why not `func(...args)`?** That would lose `this`:
```javascript
func(...args);           // this = undefined (or window in non-strict)
func.apply(this, args);  // this = the caller's context ✅
```

#### ⑥ `cache.set(key, resultValue)` — store AFTER computing

The order matters: compute first, then cache. If `func` throws an error, we don't want to cache a failed result.

#### ⑦ `return memoizedFunction` — the HOF pattern

`memoize` is a [higher-order function](./higher-order-functions): it takes `func`, returns `memoizedFunction`. The caller uses the returned function as a drop-in replacement for the original.

---

### 🧩 Concepts used in this exercise

| Concept | Where it appears | Notes link |
|---|---|---|
| **Closure** | `cache` persists across calls | This page |
| **Map** | Cache data structure | [Map vs WeakMap](./map-vs-weakmap) |
| **Referential equality** | Why resolver is needed for object args | [Referential Equality](./referential-equality) |
| **Higher-order function** | memoize takes fn, returns fn | [Higher-Order Functions](./higher-order-functions) |
| **`this` context** | `func.apply(this, args)` | Module 1: [this keyword](/docs/module-1/this-keyword) |
| **Rest/spread** | `...args` collects then `...args` spreads | Module 1: [Rest & Spread](/docs/module-1/rest-spread) |

---

### 🔷 TypeScript Version: Building the Types Step by Step

The TypeScript version looks scary at first, but it's just the JS version with **labels that describe what goes in and comes out**. Let's build it incrementally.

#### Step 1: Start with no types (our JS version)

```javascript
function memoize(func, resolver) {
  const cache = new Map();
  const memoizedFunction = function (...args) {
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) return cache.get(key);
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
  return memoizedFunction;
}
```

#### Step 2: What types do we actually need to figure out?

There are only **3 questions** TypeScript needs answered:

1. **What type is `func`?** → Some function. We don't know which one — the caller decides.
2. **What type are `args`?** → Whatever `func` accepts.
3. **What does the memoized function return?** → Whatever `func` returns.

#### Step 3: The generic `T` — "I don't know the exact function yet"

```typescript
function memoize<T>(func: T): T {
  // ...
}
```

`<T>` means: "The caller will tell me what type `T` is when they use `memoize`." When someone writes:

```typescript
const fn = (a: number) => a * 2;  // fn is (a: number) => number
const memoized = memoize(fn);      // T becomes (a: number) => number
```

TypeScript fills in `T = (a: number) => number` automatically. Now it knows `memoized` has the same signature as `fn`.

#### Step 4: Constrain T — "it must be a function"

Right now `T` could be **anything** — a string, a number, an object. TypeScript has no idea it's supposed to be a function:

```typescript
// Without extends:
function memoize<T>(func: T): T { ... }

memoize(42);          // T = number    ← TypeScript allows this! 😱
memoize("hello");     // T = string    ← Also allowed!
memoize({ a: 1 });    // T = object    ← Also allowed!
```

And when you try to **use** `func` as a function inside the body, TypeScript won't let you:

```typescript
function memoize<T>(func: T): T {
  return function (...args) {
    func.apply(this, args);
    // ❌ ERROR: Property 'apply' does not exist on type 'T'
    //    T could be a number! Numbers don't have .apply()
  };
}
```

> 🔍 **`extends` is a filter.** It tells TypeScript: "only allow `T` if it passes this check." Think of it like a bouncer at the door — only functions get in.

```typescript
function memoize<T extends (...args: any[]) => any>(func: T): T {
  // Now TypeScript KNOWS:
  // ✅ func is callable (it's a function)
  // ✅ func has .apply(), .call(), .bind()
  // ✅ Parameters<T> and ReturnType<T> work (T is guaranteed to be a function)

  return function (...args) {
    func.apply(this, args);  // ✅ No error — T is definitely a function
  };
}

memoize(42);         // ❌ ERROR: number doesn't extend (...args: any[]) => any
memoize((x) => x);  // ✅ This IS a function — allowed through the filter
```

Breaking down `T extends (...args: any[]) => any`:
- `extends` = "T must pass this filter" (a constraint)
- `(...args: any[]) => any` = "any function that takes any arguments and returns anything"
- So `T` can be `(a: number) => number` or `(x: string, y: boolean) => void` — any function shape, but it MUST be a function

> 🧠 **The progression:** `<T>` = "T can be anything" → `<T extends Function>` = "T must be a function" → `<T extends (...args: any[]) => any>` = "T must be a function, spelled out so TS can extract args and return type with `Parameters<T>` and `ReturnType<T>`"

#### Step 5: Extract the argument types with `Parameters<T>`

TypeScript has a built-in utility called `Parameters<T>` that extracts the argument types from a function type:

```typescript
type T = (a: number, b: string) => boolean;
type Args = Parameters<T>;  // [number, string]
```

We use this for `...args` so TypeScript knows what arguments the memoized function accepts:

```typescript
const memoizedFunction = function (...args: Parameters<T>) {
  // args is typed as whatever T's arguments are
};
```

#### Step 6: Extract the return type with `ReturnType<T>`

Similarly, `ReturnType<T>` extracts what the function returns:

```typescript
type T = (a: number) => string;
type R = ReturnType<T>;  // string
```

#### Step 7: Type the resolver

The resolver receives the **same arguments** as `func` and returns **any** value (the cache key):

```typescript
resolver?: (...args: Parameters<T>) => any
//  ?  = optional parameter
//  (...args: Parameters<T>) = same args as func
//  => any = can return anything (string, number, etc.) as the key
```

#### Step 8: The complete TypeScript version

```typescript
function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => any
): T {
  const cache = new Map();

  const memoizedFunction = function (
    this: ThisParameterType<T>,   // preserves `this` type from func
    ...args: Parameters<T>        // same argument types as func
  ): ReturnType<T> {              // same return type as func
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) return cache.get(key);
    const result = func.apply(this, args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  };

  return memoizedFunction as unknown as T;
}
```

#### Why `as ReturnType<T>` and `as unknown as T`?

TypeScript can't always figure out that `func.apply(this, args)` returns the same type as `func(args)`. The `as` keyword tells TypeScript "trust me, I know the type":

- `func.apply(this, args) as ReturnType<T>` — "the result of apply is the function's return type"
- `return memoizedFunction as unknown as T` — "the memoized function has the same type as the original"

We need `as unknown as T` (double cast) because TypeScript sees `memoizedFunction` as a slightly different shape than `T`, even though it behaves identically. The `unknown` is a safe "bridge" between the two types.

#### 🗺️ Cheat Sheet: TypeScript Utilities for Functions

| Utility | What it does | Example |
|---|---|---|
| `Parameters<T>` | Extracts argument types as a tuple | `Parameters<(a: number, b: string) => void>` = `[number, string]` |
| `ReturnType<T>` | Extracts the return type | `ReturnType<(a: number) => string>` = `string` |
| `ThisParameterType<T>` | Extracts the `this` type | `ThisParameterType<(this: Obj) => void>` = `Obj` |
| `T extends X` | Constrains a generic | `T extends Function` = "T must be a function" |
| `as` | Type assertion ("trust me") | `value as string` = "I know this is a string" |

---

### ⚠️ Gotchas I learned

1. **Arrow function for the returned function = broken `this`** — always use `function` keyword when you need dynamic `this`
2. **`resolver(args)` vs `resolver(...args)`** — forgetting the spread passes an array instead of individual arguments. Tests may pass by coincidence (array coercion)!
3. **`cache.get(key)` vs `cache.has(key)`** — using `get` as a truthiness check breaks caching for `0`, `null`, `undefined`, `false`, `""`
4. **Default key is `args[0]`, not `JSON.stringify(args)`** — this is a deliberate design choice matching lodash. It means `memoize(fn)(1, 2)` and `memoize(fn)(1, 99)` share the same cache entry!

---

## Key Takeaways

- **A closure is a function + its remembered outer variables** — the inner function keeps the outer scope alive
- **Memoize uses closure to persist the cache** — every call to the memoized function checks the same `Map`
- **Always use `function` keyword when `this` matters** — arrow functions inherit `this` from definition scope
- **`cache.has()` handles falsy values; `cache.get()` doesn't** — 0, null, false are valid cached results
- **`...args` collects; `...args` spreads** — the same syntax does opposite things depending on position (parameter vs argument)
- **`.apply(this, args)`** preserves both `this` context and spreads the args array

## Related Exercises

- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — The memoized function closes over the cache Map
