---
sidebar_position: 3
title: "Referential Equality (===)"
---

# Referential Equality (===)

## Summary

Primitives are compared by value, but objects/arrays are compared by memory reference. `{a:1} === {a:1}` is `false` because they're two different objects in memory. This is why memoize needs a "resolver" to generate string keys.

```javascript
// Primitives: compared by value
'hello' === 'hello' // true
42 === 42           // true

// Objects: compared by reference
{a:1} === {a:1}     // false (different objects!)
const x = {a:1};
const y = x;
x === y             // true (same reference)
```

## Key Resources

- 📖 [javascript.info — Object References](https://javascript.info/object-copy#comparison-by-reference)
- 🎥 [Web Dev Simplified — Reference vs Value](https://www.youtube.com/watch?v=-hBJz2PPIVE)

---

## My Notes

### 📖 javascript.info — Object References & Comparison

Source: [javascript.info/object-copy](https://javascript.info/object-copy#comparison-by-reference)

The fundamental rule in JavaScript:

> **A variable assigned to an object stores not the object itself, but its "address in memory" — in other words, "a reference" to it.**

Think of it like a **sheet of paper with an address written on it**. The variable holds the address, not the house. When you copy the variable, you copy the address — now two pieces of paper point to the same house:

```javascript
let user = { name: 'John' };  // variable holds ADDRESS of the object
let admin = user;              // copy the ADDRESS, not the object

admin.name = 'Pete';           // change via the "admin" address
alert(user.name);              // 'Pete' — same object, same house!
```

#### Primitives vs Objects — the two worlds

JavaScript has two categories of values, and they behave **completely differently** when compared or copied:

```javascript
// ─── PRIMITIVES: compared by VALUE ───
// Each variable holds its own independent copy of the value.
// When you compare, JS checks: "are the values the same?"

let a = 'hello';
let b = 'hello';
a === b;  // true ✅ — same value, doesn't matter they're separate variables

let x = 42;
let y = 42;
x === y;  // true ✅ — same value


// ─── OBJECTS: compared by REFERENCE (address) ───
// Variables hold an address pointing to memory.
// When you compare, JS checks: "do they point to the SAME object in memory?"

let obj1 = { a: 1 };
let obj2 = { a: 1 };
obj1 === obj2;  // false ❌ — different objects, different addresses!
                //            Even though they LOOK identical.

let obj3 = obj1;
obj1 === obj3;  // true ✅ — same address, same object
```

> 🏠 **The house analogy:** Two identical-looking houses at different addresses are NOT the same house. `{ a: 1 }` and `{ a: 1 }` are two different "houses" that happen to look the same. Only when two variables hold the same address (`obj3 = obj1`) are they truly equal.

#### This applies to ALL non-primitive types

Arrays, functions, dates, regex — they're all objects under the hood:

```javascript
[1, 2, 3] === [1, 2, 3]           // false — different arrays
(() => {}) === (() => {})          // false — different functions
new Date(0) === new Date(0)       // false — different Date objects

// Only same reference is true:
const arr = [1, 2, 3];
const same = arr;
arr === same;                      // true — same array
```

---

### 🔗 Why This Matters for Memoization

This is **the single most important concept** for understanding why memoize needs a `resolver` function. Here's the problem:

#### The Problem: Object arguments break simple caching

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = args[0]; // use first argument as cache key
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const processUser = memoize((user) => {
  console.log('Computing...');
  return user.name.toUpperCase();
});

const user = { name: 'Pablo' };

processUser(user);  // "Computing..." → "PABLO" (cached with user's reference)
processUser(user);  // cache hit! ✅ Same reference → same key

// BUT:
processUser({ name: 'Pablo' });  // "Computing..." again! ❌
// A NEW object { name: 'Pablo' } is a DIFFERENT reference,
// even though it has the same content!
```

**Map uses SameValueZero to compare keys** (see [Map vs WeakMap notes](./map-vs-weakmap)), which compares objects by reference. So `{ name: 'Pablo' } !== { name: 'Pablo' }` as Map keys — they're two different objects.

#### The Solution: A resolver that converts objects to strings

The `memoize` function itself changes — it checks if a `resolver` was provided and uses it to generate the key instead of defaulting to `args[0]`:

```javascript
function memoize(fn, resolver) {
  const cache = new Map();

  return function (...args) {
    // 👇 THIS is the key line — resolver changes how the key is generated
    const key = resolver ? resolver(...args) : args[0];
    //          ↑ if resolver exists     ↑ otherwise, default to first arg

    if (cache.has(key)) return cache.get(key);

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

Now when you provide a resolver, the key becomes a **primitive** that can be compared by value:

```javascript
const processUser = memoize(
  (user) => user.name.toUpperCase(),
  (user) => user.name  // resolver: generate a STRING key from the object
);

processUser({ name: 'Pablo' });  // resolver('Pablo') → key = "Pablo" → cache miss → compute
processUser({ name: 'Pablo' });  // resolver('Pablo') → key = "Pablo" → cache HIT! ✅
```

The `resolver` function transforms object arguments into **primitive values** (strings/numbers) that can be compared by value, not reference.

> ⚠️ **Important: the resolver ONLY affects the cache key, NOT the cached value.** The cache stores the **full return value** of the original function. No data is lost. Here's what the cache actually looks like:

```javascript
// cache internals (Map):
//
//   KEY (from resolver)    →    VALUE (full fn result)
//   "Pablo"                →    "PABLO"
//
// The resolver just decides HOW TO LOOK UP the cache entry.
// The function still runs with the FULL original arguments.

const processUser = memoize(
  (user) => {
    // This receives the FULL object: { name: 'Pablo', age: 30, role: 'dev' }
    // It can use ALL fields — nothing is lost
    return { uppercase: user.name.toUpperCase(), role: user.role };
  },
  (user) => user.name  // resolver: only uses `name` to generate the KEY
);

processUser({ name: 'Pablo', age: 30, role: 'dev' });
// cache: Map { "Pablo" → { uppercase: "PABLO", role: "dev" } }
//              ↑ key            ↑ full result (nothing lost!)

processUser({ name: 'Pablo', age: 31, role: 'dev' });
// cache hit! Returns { uppercase: "PABLO", role: "dev" }
// ⚠️ BUT: age changed from 30→31, and we still get the old result!
//    The resolver only checks `name`, so it thinks it's the same input.
```

> 🧠 **The tradeoff:** The resolver controls cache granularity. If you pick too few fields for the key, you might get **stale results** when un-keyed fields change. If you pick too many fields (or use `JSON.stringify`), you get fewer cache hits but more correctness. **You must choose which fields actually affect the output.**

#### Why primitives work but objects don't (as Map keys)

```javascript
const cache = new Map();

// Primitives as keys — works great:
cache.set('hello', 1);
cache.get('hello');    // 1 ✅ — 'hello' === 'hello' (same value)

cache.set(42, 2);
cache.get(42);         // 2 ✅ — 42 === 42 (same value)

// Objects as keys — only works with the SAME reference:
const key = { id: 1 };
cache.set(key, 3);
cache.get(key);        // 3 ✅ — same reference
cache.get({ id: 1 });  // undefined ❌ — different object, different reference!
```

#### Real-world patterns

```javascript
// Pattern 1: JSON.stringify as a resolver (simple but expensive)
const memoizedFetch = memoize(
  (params) => fetchData(params),
  (params) => JSON.stringify(params)
);

// Pattern 2: Pick specific fields for the key
const memoizedQuery = memoize(
  (query) => runQuery(query),
  (query) => `${query.table}:${query.id}`
);

// Pattern 3: Multiple arguments — combine into a single key
const memoizedAdd = memoize(
  (a, b) => a + b,
  (a, b) => `${a},${b}`
);
```

---

## Key Takeaways

- **Primitives are compared by value** — `'hello' === 'hello'` is `true` because JS checks the content
- **Objects are compared by reference (address)** — `{} === {}` is `false` because they're at different memory addresses, even if they look identical
- **A variable holding an object is like a piece of paper with an address** — copying the variable copies the address, not the object
- **Map compares keys by reference for objects** — so `{ a: 1 }` and `{ a: 1 }` are two different keys in a Map
- **This is why memoize needs a `resolver`** — to convert object arguments into primitive keys (strings) that can be compared by value
- **Same reference = same object** — if you pass the exact same variable, the cache hit works. But if you create a new object with the same shape, it's a cache miss
- **All non-primitives behave this way** — arrays, functions, dates, regex — they're all objects under the hood

### 🎯 Interview Quick Answers

> **"Why does `{} === {}` return false?"**
> Because objects are compared by reference (memory address), not by value. Two separate `{}` create two different objects at different addresses. Only when two variables point to the exact same object does `===` return `true`.

> **"How does referential equality affect memoization?"**
> If a memoized function receives object arguments, each new object (even with identical content) will be a cache miss because Map compares object keys by reference. That's why you need a resolver function to convert arguments to primitive cache keys.

> **"What's the difference between 'by value' and 'by reference'?"**
> Primitives (strings, numbers, booleans) are compared/copied by value — each variable gets its own independent copy. Objects are compared/copied by reference — variables hold a pointer to the same object in memory, so mutations through one variable are visible through the other.

## Related Exercises

- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — Resolver function needed to stringify complex arguments
