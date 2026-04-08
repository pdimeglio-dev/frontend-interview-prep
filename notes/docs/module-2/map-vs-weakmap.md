---
sidebar_position: 2
title: "Map vs WeakMap vs Objects"
---

# Map vs WeakMap vs Objects

## Summary

Plain objects coerce keys to strings. `Map` preserves key types and insertion order. `WeakMap` only accepts object keys and allows garbage collection when references are lost — ideal for caches that shouldn't prevent cleanup.

> 📝 **"Coerce" = JavaScript silently converts a value from one type to another without you asking.** You pass a number `1` as an object key, JS quietly turns it into the string `"1"` behind your back. You never see an error — the conversion just happens. This silent behavior is called **type coercion**, and it's a major source of bugs. The `==` operator also coerces (e.g., `0 == ""` is `true` because `""` is coerced to `0`), which is why we prefer `===`.

```javascript
// Object: keys become strings (coercion in action)
const obj = {}; obj[{a:1}] = 'val'; // key is "[object Object]"

// Map: preserves key types
const map = new Map(); map.set({a:1}, 'val'); // object as key

// WeakMap: allows GC of keys
const wm = new WeakMap();
let key = {a:1}; wm.set(key, 'val');
key = null; // value can now be garbage collected
```

## Key Resources

- 📖 [MDN — Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- 📖 [MDN — WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- 🎥 [Web Dev Simplified — Map vs Object](https://www.youtube.com/watch?v=hubQQ3F337A)
- 📖 [Builder.io — Use Maps More and Objects Less](https://www.builder.io/blog/maps)

---

## My Notes

### 📖 MDN — Map

The `Map` object holds key-value pairs and **remembers the original insertion order** of the keys. Any value — both objects and primitives — may be used as either a key or a value.

**Key equality** — Map uses an internal comparison called **SameValueZero**. You never call it directly — it's the spec name for how `Map`, `Set`, and `.includes()` compare things under the hood. The reason you should know about it: **it explains why these built-in methods behave slightly differently than `===`.**

#### The one thing `===` gets wrong for data structures

`===` (strict equality) is your everyday default and the right choice 99% of the time. But it has one quirk that would break Map:

```javascript
// The NaN problem with ===
NaN === NaN  // false 😱 — the only value in JS not equal to itself!

// This means indexOf (which uses ===) can't find NaN:
[NaN].indexOf(NaN) // -1 — "not found" because NaN !== NaN
```

If Map used `===` internally, you could do `map.set(NaN, 'hello')` but never `map.get(NaN)` it back — the key would be permanently inaccessible! So Map uses SameValueZero instead, which is **`===` but with NaN fixed:**

```javascript
const map = new Map();
map.set(NaN, 'works!');
map.get(NaN); // 'works!' ✅ — Map treats NaN as equal to NaN

// Same fix in .includes() (ES2016):
[NaN].includes(NaN); // true ✅ — uses SameValueZero internally
[NaN].indexOf(NaN);  // -1   ❌ — uses === internally
```

#### All 4 equality styles in JS (interview knowledge)

You only ever **write** `===`, `==`, or `Object.is()` in your code. SameValueZero is purely internal — you "use" it by choosing `Map`/`Set`/`.includes()`:

| Algorithm | How you use it | NaN = NaN? | +0 = -0? | Silently converts types? |
|---|---|:---:|:---:|:---:|
| `==` | Write `a == b` | ❌ | ✅ | ✅ Yes — avoid! |
| `===` | Write `a === b` | ❌ | ✅ | ❌ No coercion |
| **SameValueZero** | Use `Map`/`Set`/`.includes()` — they apply it for you | ✅ | ✅ | ❌ No coercion |
| `Object.is()` | Write `Object.is(a, b)` | ✅ | ❌ | ❌ No coercion |

```javascript
// You write ===, your default:
1 === 1          // true
'a' === 'a'      // true
NaN === NaN      // false (the one quirk)

// You use Object.is() when you need max precision (rare):
Object.is(NaN, NaN)  // true
Object.is(+0, -0)    // false (distinguishes signed zeros)

// You DON'T write SameValueZero — you just use Map/Set/.includes()
// and they handle it internally:
new Map().set(NaN, 'val').get(NaN)  // 'val' — SameValueZero at work
new Set([NaN, NaN]).size            // 1     — deduplicates NaN
[NaN].includes(NaN)                 // true  — finds NaN
```

> 🚫 **`==` (loose equality)** — almost never use. It coerces types: `0 == ''` is `true`, `[] == false` is `true`. The only semi-acceptable use: `x == null` to check both `null` and `undefined`.

**For Map keys specifically:**
- Object keys are compared by **reference**, not by value
- `NaN` can be used as a key (SameValueZero fixes the `===` quirk)
- `+0` and `-0` are treated as the same key

```javascript
const map = new Map();

// Objects: compared by reference
const obj1 = { a: 1 };
const obj2 = { a: 1 };
map.set(obj1, 'first');
map.get(obj2); // undefined — different reference, even though same shape!
```

**Performance guarantee from the spec:** access times must be **sublinear** on the number of elements (i.e., better than O(N)). Typically implemented as a hash table → effectively **O(1)** for `get`, `set`, `has`, `delete`.

**Core API:**

| Method / Property | What it does |
|---|---|
| `map.set(key, value)` | Adds/updates. Returns the Map (chainable!) |
| `map.get(key)` | Returns value or `undefined` |
| `map.has(key)` | Returns `boolean` |
| `map.delete(key)` | Returns `boolean` (was it there?) |
| `map.clear()` | Removes all entries |
| `map.size` | Number of entries (it's a **property**, not a method!) |
| `map.forEach(cb)` | Iterates in insertion order |
| `map.keys()` / `map.values()` / `map.entries()` | Returns iterators |

**Maps are directly iterable:**
```javascript
const map = new Map([['a', 1], ['b', 2]]);

for (const [key, value] of map) {
  console.log(key, value); // 'a' 1, then 'b' 2
}

// Destructuring works because for...of on Map yields [key, value] pairs
```

---

### 📖 Builder.io — Use Maps More and Objects Less

The article by Steve Sewell argues that **developers should default to `Map` instead of `{}` for key-value stores**. The key arguments:

#### 1. Performance: Map wins for add/delete operations

Benchmark results (Chrome v109): **Map ~50,038 ops/s** vs **Object ~13,468 ops/s** for frequent add/delete — **Map is ~3.7x faster**.

> Why? JS VMs optimize objects with "hidden classes" / "shapes" that assume a fixed structure. Adding/removing keys forces the engine to de-optimize (transition to "dictionary mode"). Maps are designed from the ground up for dynamic key operations.

#### 2. Built-in keys problem (prototype pollution)

```javascript
const myMap = {};
// Looks empty, but it already has:
myMap.constructor       // → [Function: Object]
myMap.hasOwnProperty    // → [Function: hasOwnProperty]
myMap.toString          // → [Function: toString]
myMap.isPrototypeOf     // → [Function: isPrototypeOf]
// ...and many more inherited from Object.prototype
```

**A `Map` starts truly empty** — no inherited keys to collide with. This matters for caches where user input could be a key like `"constructor"` or `"__proto__"`.

> 💡 **For memoization**: if you use a plain `{}` as cache and someone calls `memoizedFn("constructor")`, you'd get a collision with the inherited `constructor` property!

#### 3. Iteration is clean

```javascript
// Object: awkward, needs guard
for (const key in myObject) {
  if (Object.hasOwn(myObject, key)) { // must filter inherited keys
    // ...
  }
}

// Map: just works
for (const [key, value] of myMap) {
  // clean, no inherited key issues
}
```

#### 4. Key types — not just strings

Objects coerce (silently convert) all keys to strings. Map keeps the original type:

```javascript
const map = new Map();
map.set(1, 'number one');
map.set('1', 'string one');
map.get(1);   // 'number one'
map.get('1'); // 'string one'  — they're different keys!

// Object:
const obj = {};
obj[1] = 'number one';
obj['1'] = 'string one';
obj[1]; // 'string one' — 1 was coerced to '1', overwritten!
```

#### 5. Size is a property

```javascript
map.size;                    // O(1), built-in
Object.keys(obj).length;    // O(n), creates a temporary array
```

---

### 📖 MDN — WeakMap

A `WeakMap` is a collection of key/value pairs whose **keys must be objects** (or non-registered symbols), and which **does not create strong references** to its keys.

**The key insight:** An object used as a key in a `WeakMap` **does not prevent that object from being garbage collected.** Once the key object has no other references, both the key and its associated value become candidates for GC.

```javascript
const cache = new WeakMap();

let user = { name: 'Pablo' };
cache.set(user, computeExpensiveData(user));

// Later, when user is no longer needed:
user = null;
// The entry in the WeakMap is now eligible for GC!
// No memory leak, even though we never called cache.delete()
```

**What WeakMap does NOT have (and why):**

| Feature | Map | WeakMap | Why WeakMap can't have it |
|---|:---:|:---:|---|
| `.size` | ✅ | ❌ | Size depends on GC state (non-deterministic) |
| `.keys()` / `.values()` / `.entries()` | ✅ | ❌ | Enumerating keys would reveal GC state |
| `.forEach()` | ✅ | ❌ | Same reason |
| `.clear()` | ✅ | ❌ | Removed in ES2015 (was in drafts) |
| `for...of` | ✅ | ❌ | Not iterable at all |

**WeakMap only has 4 methods:** `get`, `set`, `has`, `delete`.

> 🧠 **Why can't WeakMap expose its keys?** Because the list of keys would depend on _when_ the garbage collector last ran. If you could enumerate keys, your code's behavior would depend on GC timing — that's non-determinism, which the spec avoids.

---

### 🎥 Web Dev Simplified — Map vs Object

Key points from the video:

1. **Use Map when keys are dynamic / unknown at write time** (e.g., caching function results where you don't know what arguments will come in)
2. **Use Object when the structure is known at compile time** (e.g., `{ name: 'Pablo', age: 30 }` — fixed shape, static keys)
3. **Maps maintain insertion order guaranteed.** Objects mostly do, but numeric keys get sorted first: `{ 2: 'b', 1: 'a' }` iterates as `1, 2`
4. **Maps have a clean API** — no need for `Object.keys()`, `Object.entries()`, `hasOwnProperty` checks, etc.
5. **JSON.stringify does NOT work on Maps** — you need to convert to array first: `JSON.stringify([...map])`

---

### 🔗 How This All Connects to Memoization

In our `memoize` exercise, we need a cache to store previously computed results. Here's why **Map is the right choice**:

```javascript
function memoize(fn, resolver) {
  const cache = new Map(); // ← NOT a plain object!

  return function (...args) {
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) return cache.get(key);

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

| Concern | `{}` (Object) | `Map` | `WeakMap` |
|---|---|---|---|
| Key types | Strings only | Any type ✅ | Objects only |
| Prototype collision (`"constructor"`, `"__proto__"`) | Vulnerable ❌ | Safe ✅ | Safe ✅ |
| Performance for add/delete | Slower | ~3.7x faster ✅ | Fast |
| Can check `.size` of cache | No (O(n)) | Yes (O(1)) ✅ | No |
| Can iterate cache entries | Awkward | Clean ✅ | Impossible |
| Auto-cleanup of unused entries | No ❌ | No ❌ | Yes ✅ |

**When would you use WeakMap for memoization?**

When the function arguments are **objects** and you want the cache to automatically clean up when those objects are no longer referenced elsewhere:

```javascript
// WeakMap-based memoize (for object arguments only)
function memoizeWeak(fn) {
  const cache = new WeakMap();

  return function (obj) {
    if (cache.has(obj)) return cache.get(obj);
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}

// Example: memoizing a function that processes DOM nodes
const getRect = memoizeWeak((element) => element.getBoundingClientRect());
// When the DOM element is removed and GC'd, the cache entry is auto-cleaned
```

---

## Key Takeaways

- **Map is the right default for memoization caches** — it handles any key type, has no prototype pollution, and performs well with frequent add/delete
- **Objects coerce all keys to strings** — `obj[1]` and `obj['1']` are the same slot. Map keeps them separate
- **Map uses SameValueZero for key equality** — like `===` but `NaN === NaN` is `true`
- **Object keys for Map are compared by reference, not structure** — `{a:1} !== {a:1}`, so you need a `resolver` function to generate string keys for object arguments
- **WeakMap allows GC of its keys** — perfect when you want a cache that auto-cleans (e.g., caching data keyed by DOM elements or React component instances)
- **WeakMap is NOT iterable and has no `.size`** — you can never ask "what's in the cache?" because that depends on GC timing
- **Performance: Map is ~3.7x faster than Object** for scenarios with frequent key additions and deletions (benchmark from Builder.io)
- **Prototype pollution is a real risk with objects** — `{}` already has keys like `constructor`, `toString`, `hasOwnProperty` inherited from `Object.prototype`

### 🎯 Interview Quick Answers

> **"Why use Map instead of an object for a cache?"**
> Map accepts any key type (not just strings), has no prototype pollution risk, has a built-in `.size` property, is iterable, and performs better for frequent add/delete operations.

> **"When would you use WeakMap?"**
> When you want to associate data with objects without preventing their garbage collection. Common use cases: memoization with object keys, private data on class instances, caching metadata for DOM elements.

> **"Can you iterate a WeakMap?"**
> No. WeakMap is not iterable because its contents depend on garbage collection state, which is non-deterministic. It only has `get`, `set`, `has`, and `delete`.

## Related Exercises

- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — Uses Map for the memoization cache
