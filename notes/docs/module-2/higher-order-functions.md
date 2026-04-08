---
sidebar_position: 4
title: "Higher-Order Functions"
---

# Higher-Order Functions

## Summary

Functions that take other functions as arguments or return functions. `memoize` is a classic HOF: it takes a function and returns a new, enhanced version of it.

```javascript
// HOF that returns a function
function multiplier(factor) {
  return (x) => x * factor;
}
const double = multiplier(2);
double(5); // 10

// HOF that takes a function
[1,2,3].map(x => x * 2); // [2,4,6]
```

## Key Resources

- 📖 [MDN — First-class Functions](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)
- 📖 [javascript.info — Function Expressions](https://javascript.info/function-expressions)

---

## My Notes

### 📖 MDN — First-class Functions

Source: [MDN — First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)

> **A language has "first-class functions" when functions are treated like any other variable** — they can be assigned to variables, passed as arguments, and returned from other functions.

This is the foundation that makes Higher-Order Functions possible. JavaScript has first-class functions, which means:

```javascript
// 1. Assign a function to a variable
const greet = function() { return 'Hello'; };
greet(); // 'Hello'

// 2. Pass a function as an argument (callback)
function runCallback(fn) {
  return fn();
}
runCallback(greet); // 'Hello'

// 3. Return a function from another function
function createGreeter(name) {
  return function() { return `Hello, ${name}!`; };
}
const greetPablo = createGreeter('Pablo');
greetPablo(); // 'Hello, Pablo!'
```

> 📝 **The function passed as an argument is called a "callback function."** The function that receives or returns another function is called a **"higher-order function."**

---

### 🧩 What is a Higher-Order Function?

A **Higher-Order Function (HOF)** is a function that does at least one of these:
1. **Takes a function as an argument** (e.g., `array.map(fn)`)
2. **Returns a new function** (e.g., `memoize(fn)` → returns enhanced fn)

Or both! Many of the most important patterns in JavaScript are HOFs:

```javascript
// ─── Takes a function ───
[1, 2, 3].map(x => x * 2);         // Array.map
[1, 2, 3].filter(x => x > 1);      // Array.filter
[1, 2, 3].reduce((acc, x) => acc + x, 0); // Array.reduce
button.addEventListener('click', handler);  // DOM API

// ─── Returns a function ───
memoize(fn);        // returns a cached version of fn
debounce(fn, 300);  // returns a delayed version of fn
curry(fn);          // returns a curried version of fn

// ─── Both: takes AND returns a function ───
// All three above do both! They take fn and return a new function.
```

---

### 🔗 The HOF Pattern: Function In → Enhanced Function Out

`memoize`, `debounce`, and `curry` all follow the **exact same pattern** — they're function "wrappers" that add behavior without changing the original function:

```javascript
// THE PATTERN:
//   HOF(originalFn) → enhancedFn
//
// The enhanced function:
//   1. Does something extra (cache check, timer, arg collection)
//   2. Eventually calls the original function
//   3. Returns the original function's result

// ─── MEMOIZE: adds caching ───
function memoize(fn, resolver) {
  const cache = new Map();
  return function (...args) {           // ← new enhanced function
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) return cache.get(key);  // extra: cache check
    const result = fn.apply(this, args);        // calls original
    cache.set(key, result);                     // extra: store result
    return result;
  };
}

// ─── DEBOUNCE: adds delay ───
function debounce(fn, wait) {
  let timeoutId;
  return function (...args) {           // ← new enhanced function
    clearTimeout(timeoutId);                    // extra: cancel previous
    timeoutId = setTimeout(() => {
      fn.apply(this, args);                     // calls original (after delay)
    }, wait);
  };
}

// ─── CURRY: collects arguments one at a time ───
function curry(fn) {
  return function curried(...args) {    // ← new enhanced function
    if (args.length >= fn.length) {
      return fn.apply(this, args);              // calls original (enough args)
    }
    return (...moreArgs) => curried(...args, ...moreArgs); // extra: collect more
  };
}
```

Notice the identical structure:
1. **Outer function** receives `fn` (and maybe config like `wait` or `resolver`)
2. **Returns a new function** that wraps `fn` with extra behavior
3. **The closure** keeps `fn` and any state (cache, timeoutId) alive between calls

> 🧠 This is also why HOFs are deeply connected to **closures** — the returned function closes over `fn`, `cache`, `timeoutId`, etc. See [Closures for Caching](./closures-caching).

---

### 📊 Side-by-side: memoize vs debounce as HOFs

| | `memoize(fn)` | `debounce(fn, wait)` |
|---|---|---|
| **Takes** | A function + optional resolver | A function + wait time |
| **Returns** | A new function with caching | A new function with delay |
| **Extra behavior** | Checks cache before calling `fn` | Delays call, cancels previous |
| **Closure state** | `cache` (Map) | `timeoutId` |
| **When `fn` runs** | Only on cache miss | After `wait` ms of silence |
| **Preserves `this`** | Yes, via `fn.apply(this, args)` | Yes, via `fn.apply(this, args)` |
| **Exercise** | [02-memoize](http://localhost:3737/exercise/02-memoize) | [01-debounce](http://localhost:3737/exercise/01-debounce) |

Both use `fn.apply(this, args)` to call the original function — this preserves the `this` context (important for methods on objects).

---

### 💡 Why does this matter for interviews?

HOFs come up **everywhere** in frontend interviews:

1. **"Implement memoize"** — the classic HOF exercise (module 2)
2. **"Implement debounce"** — another classic (module 1)
3. **"Implement curry"** — advanced HOF (module 6)
4. **"What's a higher-order component (HOC) in React?"** — same pattern applied to React components:
   ```javascript
   // React HOC: same pattern!
   // Component in → Enhanced component out
   function withAuth(WrappedComponent) {
     return function AuthComponent(props) {
       if (!isLoggedIn()) return <Redirect to="/login" />;
       return <WrappedComponent {...props} />;
     };
   }
   ```

5. **Built-in HOFs you use daily:**
   ```javascript
   // Array methods
   arr.map(fn)      // takes fn, returns new array
   arr.filter(fn)   // takes fn, returns new array
   arr.reduce(fn)   // takes fn, returns accumulated value
   arr.sort(fn)     // takes fn, sorts in place
   arr.forEach(fn)  // takes fn, returns undefined

   // Promise methods
   promise.then(fn)   // takes fn, returns new promise
   promise.catch(fn)  // takes fn, returns new promise
   ```

---

## Key Takeaways

- **First-class functions** = functions treated as values (assignable, passable, returnable). This is what makes HOFs possible in JavaScript
- **HOF** = a function that takes a function as argument AND/OR returns a function
- **`memoize`, `debounce`, and `curry` are all HOFs** with the same pattern: take `fn`, return an enhanced version that wraps `fn` with extra behavior
- **The returned function forms a closure** over `fn` and any state (cache, timer, collected args)
- **`fn.apply(this, args)`** is how HOFs preserve the original `this` context and pass through arguments
- **React HOCs follow the same pattern** — component in, enhanced component out
- **Array methods are HOFs too** — `.map()`, `.filter()`, `.reduce()` all take a function as argument

### 🎯 Interview Quick Answers

> **"What is a higher-order function?"**
> A function that takes another function as an argument, returns a function, or both. Examples: `Array.map()`, `memoize()`, `debounce()`. They're possible because JavaScript has first-class functions — functions are treated as values.

> **"What's the difference between a callback and a HOF?"**
> The **callback** is the function you pass in. The **HOF** is the function that receives it. In `arr.map(fn)`, `map` is the HOF and `fn` is the callback.

> **"How is memoize a higher-order function?"**
> `memoize` takes a function and returns a new function that wraps the original with caching logic. When called, the wrapper checks the cache first, and only calls the original function on a cache miss.

## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — debounce takes a function, returns a delayed version (HOF)
- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — memoize takes a function, returns a cached version (HOF)
- 🏋️ [06-curry](http://localhost:3737/exercise/06-curry) — curry takes a function, returns a curried version (HOF)
