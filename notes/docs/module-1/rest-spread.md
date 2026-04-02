---
sidebar_position: 5
title: Rest Parameters & Spread
---

# Rest Parameters & Spread Syntax

## Summary

Rest and spread both use the `...` syntax but do **opposite** things:

| | Rest (`...args`) | Spread (`...iterable`) |
|---|---|---|
| **Direction** | Collects many → into one array/object | Expands one array/object → into many |
| **Where** | Function params, destructuring | Function calls, array/object literals |

```javascript
// Rest: collect into array
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
sum(1, 2, 3); // 6

// Spread: expand array into args
const arr = [1, 2, 3];
Math.max(...arr); // 3
```

## Key Resources

- 📖 [MDN — Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- 📖 [MDN — Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

---

## Rest Parameters (`...args`)

Rest collects **remaining** arguments into a real `Array`. It must be the **last** parameter.

### In function parameters

```javascript
function log(level, ...messages) {
  messages.forEach(msg => console.log(`[${level}]`, msg));
}
log('WARN', 'disk full', 'retry in 5s');
// [WARN] disk full
// [WARN] retry in 5s
```

### In array destructuring

```javascript
const [first, second, ...rest] = [10, 20, 30, 40, 50];
// first = 10, second = 20, rest = [30, 40, 50]
```

### In object destructuring

```javascript
const { id, ...others } = { id: 1, name: 'Alice', role: 'admin' };
// id = 1, others = { name: 'Alice', role: 'admin' }
```

### Rest vs the `arguments` object

Before ES6 introduced rest parameters, JavaScript provided a built-in **`arguments` object** — a special array-*like* object that is automatically available inside every regular (non-arrow) function. It holds all the arguments passed to the call, regardless of declared parameters:

```javascript
function oldSchool() {
  console.log(arguments[0]);     // first arg
  console.log(arguments.length); // total args passed
  // But arguments is NOT a real array:
  // arguments.map(...)  ❌ TypeError
  // Array.from(arguments).map(...)  ✅ workaround
}
oldSchool('hello', 42);
// 'hello'
// 2
```

Rest parameters (`...args`) are the **modern replacement**:

| | `...args` (rest) | `arguments` |
|---|---|---|
| Type | Real `Array` — has `.map()`, `.filter()`, etc. | Array-*like* object — only has `.length` and index access |
| Arrow functions | ✅ works | ❌ not available (inherits from outer scope) |
| Named subset | ✅ `(first, ...rest)` skips first | ❌ all-or-nothing, must manually slice |
| Modern usage | ✅ preferred | Legacy — you'll still see it in older code |

> 💡 **Bottom line:** Always use rest parameters in new code. You'll only encounter `arguments` in legacy code or in specific tricks like checking `arguments.length` to detect if an optional parameter was actually passed (see the [reduce exercise](/docs/module-5/arguments-object)).

---

## Spread Syntax (`...iterable`)

Spread **expands** an iterable (array, string, object) into individual elements.

### In function calls

```javascript
const nums = [3, 1, 4, 1, 5];
Math.max(...nums); // 5

// Equivalent to: Math.max(3, 1, 4, 1, 5)
```

### In array literals — clone & merge

```javascript
const a = [1, 2];
const b = [3, 4];

const clone = [...a];           // [1, 2]  (shallow copy)
const merged = [...a, ...b];    // [1, 2, 3, 4]
const prepend = [0, ...a];      // [0, 1, 2]
```

### In object literals — clone & merge

```javascript
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };

const config = { ...defaults, ...userPrefs };
// { theme: 'dark', lang: 'en' }
// Later spreads win on duplicate keys
```

### ⚠️ Spread creates shallow copies only!

Spread duplicates the **top-level** properties, but nested objects/arrays are still **shared references**. Mutating a nested value in the "copy" will mutate the original too:

```javascript
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };

shallow.a = 99;
console.log(original.a);          // 1 ✅ top-level is independent

shallow.nested.b = 99;
console.log(original.nested.b);   // 99 ❌ nested is shared!
```

This is because spread copies **property values**, and for objects/arrays those values are **references** (memory addresses), not the data itself. See [Primitive vs Reference Types](/docs/module-4/primitive-vs-reference) for why.

**When you need a fully independent copy (deep clone), you have options:**

| Method | Pros | Cons |
|---|---|---|
| `structuredClone(obj)` | Built-in, handles cycles, Date, Map, Set, etc. | Not available in older environments; can't clone functions |
| `JSON.parse(JSON.stringify(obj))` | Simple one-liner | Loses `undefined`, functions, `Date` (→ string), `RegExp`, circular refs throw |
| Custom recursive `deepClone()` | Full control, handles edge cases | You have to write it — common interview question! |

```javascript
// structuredClone — the modern built-in (preferred when available)
const deep = structuredClone(original);
deep.nested.b = 99;
console.log(original.nested.b); // 2 ✅ fully independent

// JSON round-trip — quick & dirty (watch the limitations)
const deep2 = JSON.parse(JSON.stringify(original));

// Custom deepClone — what interviewers ask you to implement
// See exercise 04-deep-clone for the full challenge
```

> 📝 The [04-deep-clone exercise](http://localhost:3737/exercise/04-deep-clone) asks you to build a recursive `deepClone` that handles primitives, nested objects/arrays, `Date`, `RegExp`, and circular references — without using `structuredClone` or `JSON.parse(JSON.stringify())`. See [Shallow vs Deep Copy](/docs/module-4/shallow-vs-deep-copy) for the full notes.

---

## Most Common Use Cases

### 1. Forwarding arguments (decorators, wrappers)

This is the **#1 pattern** in interview exercises — debounce, throttle, memoize, curry all use it:

```javascript
function debounce(fn, delay) {
  let timer;
  return function (...args) {          // REST: collect whatever args are passed
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);            // forward them
      // or: fn(...args)               // SPREAD: expand back into individual args
    }, delay);
  };
}
```

### 2. Immutable state updates (React)

```jsx
// Adding to array without mutation
setItems(prev => [...prev, newItem]);

// Updating one field in object state
setState(prev => ({ ...prev, count: prev.count + 1 }));
```

### 3. Converting iterables to arrays

```javascript
const nodeList = document.querySelectorAll('div');
const divArray = [...nodeList];  // now a real Array, can use .map(), .filter(), etc.

const chars = [...'hello'];      // ['h', 'e', 'l', 'l', 'o']
```

### 4. Merging configs / defaults

```javascript
function createServer(options) {
  const config = {
    port: 3000,
    host: 'localhost',
    ...options,  // user overrides win
  };
}
```

### 5. Immutable array operations

```javascript
// Remove at index (no splice mutation)
const without = [...arr.slice(0, i), ...arr.slice(i + 1)];

// Insert at index
const withInsert = [...arr.slice(0, i), newItem, ...arr.slice(i)];
```

---

## Interview Questions Where Rest/Spread Appears

| Question | How `...` is used |
|---|---|
| **"Implement debounce / throttle"** | `...args` to capture caller's arguments, spread to forward them |
| **"Implement curry"** | Spread to accumulate args across calls: `[...collected, ...newArgs]` |
| **"Implement memoize"** | Rest to capture args, then use as cache key |
| **"Implement `Function.prototype.bind`"** | Rest/spread for partial application of arguments |
| **"Deep clone vs shallow clone"** | Spread creates shallow copies — interviewer tests if you know the limitation |
| **"Merge two objects without mutating"** | Object spread: `{ ...a, ...b }` |
| **"`arguments` vs rest parameters"** | Direct comparison question — know the differences |
| **React: "Why spread props? What's `{...props}`?"** | JSX spread passes all props to a child component |
| **"Implement `Array.prototype.flat`"** | Spread with concat: `[].concat(...arr)` for one-level flatten |

---

## Key Takeaways

- **Rest** collects, **Spread** expands — same syntax, opposite directions
- Rest params give you a **real array** (unlike `arguments`)
- Rest must be the **last** parameter; `fn.length` does **not** count rest params
- Spread only creates **shallow copies** — nested refs are shared
- The `...args` → `fn(...args)` pattern (collect then forward) is the backbone of debounce, throttle, memoize, curry, and any function wrapper
- In React, object spread is how you do immutable state updates

## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — `(...args)` captures and forwards caller's arguments
- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — Rest params capture args for cache key generation
- 🏋️ [06-curry](http://localhost:3737/exercise/06-curry) — Spread accumulates and forwards arguments across calls

## Related Notes

- 📝 [The arguments Object](/docs/module-5/arguments-object) — Legacy alternative to rest params
- 📝 [Function Arity (fn.length)](/docs/module-5/function-arity) — `fn.length` excludes rest params
- 📝 [Shallow vs Deep Copy](/docs/module-4/shallow-vs-deep-copy) — Why spread is only shallow
- 📝 [Closures](/docs/module-1/closures) — How forwarded args are captured in wrapper functions
