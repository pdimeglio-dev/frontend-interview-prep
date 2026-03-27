# GreatFrontEnd Staff-Level Study Guide

This repository contains deep-dive explanations, prerequisite concepts, and "Level 3" implementations for the most common senior frontend interview questions (inspired by GreatFrontEnd and BFE.dev).

The goal of this guide is not just to provide the code, but to master the underlying engine mechanics of JavaScript and React.

---

## Table of Contents

1. [Module 1: The "Timer & Async" Master (Debounce & Throttle)](#-module-1-the-timer--async-master)
2. [Module 2: The "Closure & Cache" Master (Memoize & usePrevious)](#-module-2-the-closure--cache-master)
3. [Module 3: The "Pub/Sub" Architecture (EventEmitter & useClickOutside)](#-module-3-the-pubsub-architecture)
4. [Module 4: The "Reference & Recursion" Master (Deep Clone)](#-module-4-the-reference--recursion-master)
5. [Module 5: The "Functional Pipeline" Master (Reduce & Curry)](#-module-5-the-functional-pipeline-master)
6. [Module 6: The "Async Orchestrator" (Promise.all & useFetch)](#-module-6-the-async-orchestrator)
7. [Module 7: The "DOM Performance" Master (Virtual List)](#-module-7-the-dom-performance-master)
8. [Module 8: The "Data Fetching UI" Master (Auto-Complete & Infinite Scroll)](#-module-8-the-data-fetching-ui-master)

---

## 🏋️ Practice Exercises

This repo includes **10 self-contained exercises** with pre-written test suites. No GFE subscription needed — everything runs locally.

### How to Practice

```bash
# Run a specific exercise's tests
npm test -- 01-debounce

# Run all tests
npm test

# Watch mode (re-runs on save)
npm run test:watch

# Visual Storybook for React components (Modules 7-8)
npm run storybook
```

### Each exercise has 3 files:
| File | Purpose |
|------|---------|
| `README.md` | Problem statement (read first, like an interview prompt) |
| `index.ts` / `Component.tsx` | **Your implementation** — starts empty, write your code here |
| `index.test.ts` / `Component.test.tsx` | Pre-written tests — run them to verify your solution |

### Exercise Map & Free Practice Links

| # | Exercise | Folder | BFE.dev (Free) |
|---|----------|--------|----------------|
| 1 | Debounce | `src/01-debounce/` | [#6](https://bigfrontend.dev/problem/implement-basic-debounce) · [#7](https://bigfrontend.dev/problem/implement-debounce-with-leading-and-trailing-option) |
| 2 | Memoize | `src/02-memoize/` | [#14](https://bigfrontend.dev/problem/implement-general-memoization-function) |
| 3 | Event Emitter | `src/03-event-emitter/` | [#16](https://bigfrontend.dev/problem/create-an-Event-Emitter) |
| 4 | Deep Clone | `src/04-deep-clone/` | [#63](https://bigfrontend.dev/problem/create-cloneDeep) |
| 5 | Array.reduce | `src/05-reduce/` | [#146](https://bigfrontend.dev/problem/implement-Array-prototype-reduce) |
| 6 | Curry | `src/06-curry/` | [#1](https://bigfrontend.dev/problem/implement-curry) · [#2](https://bigfrontend.dev/problem/implement-curry-with-placeholder) |
| 7 | Promise.all | `src/07-promise-all/` | [#67](https://bigfrontend.dev/problem/implement-Promise-all) |
| 8 | Virtual List | `src/08-virtual-list/` | — (UI exercise, use Storybook) |
| 9 | Autocomplete | `src/09-autocomplete/` | — (UI exercise, use Storybook) |
| 10 | Infinite Scroll | `src/10-infinite-scroll/` | — (UI exercise, use Storybook) |

> **Tip:** Solve on BFE.dev first for instant feedback, then re-implement locally from memory in this repo to reinforce the pattern.

---

## ⏱️ Module 1: The "Timer & Async" Master

### 📚 Prerequisite Concepts & Resources

> **🔗 GreatFrontEnd:** [Debounce](https://www.greatfrontend.com/questions/javascript/debounce) · [Throttle](https://www.greatfrontend.com/questions/javascript/throttle)

**1. Closures** — An inner function retains access to its outer function's variables even after the outer function has returned. This is the mechanism that lets the returned debounce function "remember" the `timeoutId`.
- 📖 [javascript.info — Closures](https://javascript.info/closure) · 🎥 [Fireship — Closures in 100 Seconds](https://www.youtube.com/watch?v=vKJpN5FAeF4)

**2. The `this` Keyword & `apply()` / `call()` / `bind()`** — In JavaScript, `this` is determined by *how* a function is called, not where it's defined. `apply()` lets you invoke a function while explicitly setting `this` and passing arguments as an array.
- 📖 [MDN — this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) · 📖 [MDN — Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- 🎥 [Web Dev Simplified — this in 8 Minutes](https://www.youtube.com/watch?v=YOlr79NaAtQ)

**3. `setTimeout` & `clearTimeout`** — `setTimeout` schedules a callback to run after a delay (in ms). `clearTimeout` cancels a pending timer before it fires. These are Web APIs, not part of the JS engine itself.
- 📖 [MDN — setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) · 📖 [javascript.info — Scheduling](https://javascript.info/settimeout-setinterval)

**4. The Event Loop** — JavaScript is single-threaded. The Event Loop coordinates the Call Stack, Web APIs, Macrotask Queue (setTimeout callbacks), and Microtask Queue (Promise callbacks). Understanding this explains *why* debounce can defer execution.
- 📖 [javascript.info — Event Loop](https://javascript.info/event-loop) · 🎥 [Philip Roberts — What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) (the classic talk)
- 🎥 [Lydia Hallie — JavaScript Visualized: Event Loop](https://www.youtube.com/watch?v=eiC58R16hb8)

**5. Rest Parameters & Spread Syntax (`...args`)** — Rest parameters collect all arguments into an array. Spread expands an array into individual arguments. Used in debounce to forward any arguments the original function expects.
- 📖 [MDN — Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) · 📖 [MDN — Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

**6. React `useEffect` & Cleanup Functions** — `useEffect` runs side effects after render. Its return function is the "cleanup" — called before the effect re-runs or when the component unmounts. Critical for clearing timers to prevent memory leaks.
- 📖 [React docs — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) · 🎥 [Jack Herrington — Mastering useEffect](https://www.youtube.com/watch?v=dH6i3GurZW8)

---

### Focus Exercise: `debounce`

#### The Core Concepts

- **Execution Context:** Using `apply(this, args)` to maintain the object's identity when the debounced function is invoked.
- **Task Queue:** Understanding that `setTimeout` is a "Macrotask" that yields to the main thread. When `clearTimeout` is called, it removes the task before the Event Loop processes it.
- **React Lifecycle:** Why we **must** clean up timeouts in the `useEffect` return function to avoid memory leaks and state updates on unmounted components.

#### Level 3 Implementation (Vanilla JS)

```javascript
function debounce(func, wait, options = { leading: false, trailing: true }) {
  let timeoutId = null;

  return function (...args) {
    const context = this;
    const isInvoked = options.leading && !timeoutId;

    if (timeoutId) clearTimeout(timeoutId);

    if (isInvoked) func.apply(context, args);

    timeoutId = setTimeout(() => {
      if (options.trailing && !isInvoked) {
        func.apply(context, args);
      }
      timeoutId = null;
    }, wait);
  };
}
```

#### Pressure Tests

> **Q: How would you add a `.cancel()` method?**
>
> **A:** Attach a property to the returned function: `debounced.cancel = () => clearTimeout(timeoutId)`.

> **Q: How does this differ from `throttle`?**
>
> **A:** Debounce waits for a pause in events; Throttle ensures execution at a fixed, continuous rate, ignoring calls in between.

---

## 🧠 Module 2: The "Closure & Cache" Master

### 📚 Prerequisite Concepts & Resources

> **🔗 GreatFrontEnd:** [Memoize](https://www.greatfrontend.com/questions/javascript/memoize) · [Memoize II](https://www.greatfrontend.com/questions/javascript/memoize-ii)

**1. Closures (Caching Context)** — The returned memoized function forms a closure over the `cache` variable, keeping it alive in memory between calls. Every invocation checks the same persistent cache.
- 📖 [javascript.info — Closures](https://javascript.info/closure) · 🎥 [Akshay Saini — Closures in JS](https://www.youtube.com/watch?v=qikxEIxsXco)

**2. `Map` vs `WeakMap` vs Plain Objects** — Plain objects coerce keys to strings. `Map` preserves key types and insertion order. `WeakMap` only accepts object keys and allows garbage collection when references are lost — ideal for caches that shouldn't prevent cleanup.
- 📖 [MDN — Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) · 📖 [MDN — WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- 🎥 [Web Dev Simplified — Map vs Object](https://www.youtube.com/watch?v=hubQQ3F337A)

**3. Referential Equality (`===`)** — Primitives are compared by value, but objects/arrays are compared by memory reference. `{a:1} === {a:1}` is `false` because they're two different objects in memory. This is why memoize needs a "resolver" to generate string keys.
- 📖 [javascript.info — Object References](https://javascript.info/object-copy#comparison-by-reference) · 🎥 [Web Dev Simplified — Reference vs Value](https://www.youtube.com/watch?v=-hBJz2PPIVE)

**4. Higher-Order Functions** — Functions that take other functions as arguments or return functions. `memoize` is a classic HOF: it takes a function and returns a new, enhanced version of it.
- 📖 [MDN — Functions: First-class](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function) · 📖 [javascript.info — Function Expressions](https://javascript.info/function-expressions)

**5. React `useRef` vs `useState`** — `useState` triggers a re-render when updated. `useRef` holds a mutable `.current` value that persists across renders *without* causing re-renders. This makes `useRef` perfect for storing the "previous" value silently.
- 📖 [React docs — useRef](https://react.dev/reference/react/useRef) · 📖 [React docs — useState](https://react.dev/reference/react/useState)
- 🎥 [Web Dev Simplified — useRef in 11 Minutes](https://www.youtube.com/watch?v=t2ypzz6gJm0)

**6. React Render Cycle & Effect Timing** — React renders in two phases: Render (calculates the new UI) and Commit (updates the DOM). `useEffect` runs *after* the commit. This is why `usePrevious` works — the ref update happens after the new value is already rendered.
- 📖 [React docs — Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects) · 🎥 [Jack Herrington — React Render Cycle Explained](https://www.youtube.com/watch?v=iYhVQPQ9WHI)

---

### Focus Exercises: `memoize` & `usePrevious`

#### The Core Concepts

- **Hash Maps vs Objects:** Objects in JS have prototype chains and only support string/symbol keys. `Map` allows any data type as a key, making it ideal for caching.
- **Referential Equality:** `{} === {}` is `false`. A "Resolver" function is often needed to stringify complex arguments to prevent cache misses.
- **React Render Phases:** `useEffect` runs after the render is committed to the screen. Saving a value to a `useRef` inside an effect stores the "old" value for the next render cycle.

#### Level 3 Implementations

**Vanilla `memoize`:**

```javascript
function memoize(func, resolver) {
  const cache = new Map();

  return function (...args) {
    const key = resolver ? resolver(...args) : args[0];

    if (cache.has(key)) return cache.get(key);

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

**React `usePrevious`:**

```javascript
import { useEffect, useRef } from "react";

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
```

#### Pressure Tests

> **Q: How would you prevent `memoize` from causing a memory leak?**
>
> **A:** Implement an LRU (Least Recently Used) cache strategy, or use a `WeakMap` if the keys are objects, allowing the garbage collector to clear them when references are lost.

> **Q: Why use `useRef` instead of `useState` for `usePrevious`?**
>
> **A:** `useState` triggers a re-render. Updating state to track previous state would cause an infinite render loop.

---

## 📡 Module 3: The "Pub/Sub" Architecture

### 📚 Prerequisite Concepts & Resources

> **🔗 GreatFrontEnd:** [Event Emitter](https://www.greatfrontend.com/questions/javascript/event-emitter) · [Event Emitter II](https://www.greatfrontend.com/questions/javascript/event-emitter-ii)

**1. The Observer / Pub-Sub Pattern** — A design pattern where "publishers" emit named events and "subscribers" register callbacks for those events. Neither side needs to know about the other, creating loose coupling between components.
- 📖 [Refactoring Guru — Observer Pattern](https://refactoring.guru/design-patterns/observer) · 📖 [javascript.info — Custom Events](https://javascript.info/dispatch-events)
- 🎥 [Fireship — 10 Design Patterns in 10 Minutes](https://www.youtube.com/watch?v=tv-_1er1mWI) (Observer at ~4:00)

**2. JavaScript Classes** — ES6 `class` syntax is sugar over prototypal inheritance. A `constructor` initializes instance properties, and methods defined in the class body are added to the prototype. `this` inside methods refers to the instance.
- 📖 [javascript.info — Classes](https://javascript.info/class) · 📖 [MDN — Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- 🎥 [Web Dev Simplified — JS Classes in 1 Hour](https://www.youtube.com/watch?v=2ZphE5HGQaA)

**3. `Map` and `Set` Data Structures** — `Map` stores key-value pairs with any key type and maintains insertion order. `Set` stores unique values only. Together they make an ideal data structure for an event registry: Map of event names → Set of callbacks.
- 📖 [MDN — Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) · 📖 [MDN — Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

**4. DOM Event Bubbling & Capturing** — When a DOM event fires, it first travels *down* from `document` to the target (capturing phase), then *up* from the target back to `document` (bubbling phase). Most listeners fire during the bubbling phase by default.
- 📖 [javascript.info — Bubbling and Capturing](https://javascript.info/bubbling-and-capturing) · 🎥 [Web Dev Simplified — Event Bubbling & Capturing](https://www.youtube.com/watch?v=XF1_MlZ5l6M)

**5. `event.target` vs `event.currentTarget`** — `event.target` is the actual element that was clicked (the deepest node). `event.currentTarget` is the element the listener is attached to. This distinction is key in `useClickOutside` to determine *where* the click landed.
- 📖 [MDN — Event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target) · 📖 [MDN — Event.currentTarget](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget)

**6. `Node.contains()` & Event Listener Management** — `node.contains(otherNode)` returns `true` if `otherNode` is a descendant of `node`. Combined with `addEventListener`/`removeEventListener`, this is how `useClickOutside` checks if a click happened inside or outside a component.
- 📖 [MDN — Node.contains()](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains) · 📖 [MDN — addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

**7. Memory Leaks from Event Listeners** — Every `addEventListener` call creates a reference. If you don't `removeEventListener` on cleanup (or component unmount), those listeners persist, holding references to DOM nodes and closures that can't be garbage collected.
- 📖 [web.dev — Memory Leaks](https://web.dev/articles/fix-memory-problems) · 🎥 [Jack Herrington — React Memory Leaks](https://www.youtube.com/watch?v=ZKJh7mDBVS8)

---

### Focus Exercises: `EventEmitter` & `useClickOutside`

#### The Core Concepts

- **The Observer Pattern:** Decouples the code that triggers an event from the code that reacts to it.
- **Event Bubbling:** DOM events like clicks bubble up to the `document`. `useClickOutside` listens globally and checks if the `event.target` was inside a specific component's `ref`.
- **Memory Management:** Failing to unsubscribe or remove event listeners leads to dangling references, causing memory leaks and unexpected behavior.

#### Level 3 Implementations

**Vanilla `EventEmitter`:**

```javascript
class EventEmitter {
  constructor() {
    this.subscriptions = new Map();
  }

  subscribe(eventName, callback) {
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, new Set());
    }
    const callbacks = this.subscriptions.get(eventName);
    callbacks.add(callback);

    return {
      release: () => {
        callbacks.delete(callback);
        if (callbacks.size === 0) this.subscriptions.delete(eventName);
      },
    };
  }

  emit(eventName, ...args) {
    const callbacks = this.subscriptions.get(eventName);
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args));
    }
  }
}
```

**React `useClickOutside`:**

```javascript
import { useEffect, useRef } from "react";

function useClickOutside(handler) {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      // Ignore clicks inside the referenced element
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener); // Cleanup
  }, [handler]);

  return ref;
}
```

#### Pressure Tests

> **Q: How would you implement a `.once()` method for `EventEmitter`?**
>
> **A:** Create a wrapper function that calls the callback and then immediately calls its own unsubscribe/release method from within the wrapper.

---

## 🧬 Module 4: The "Reference & Recursion" Master

### 📚 Prerequisite Concepts & Resources

> **🔗 GreatFrontEnd:** [Deep Clone](https://www.greatfrontend.com/questions/javascript/deep-clone) · [Deep Clone II](https://www.greatfrontend.com/questions/javascript/deep-clone-ii)

**1. Primitive Types vs Reference Types** — Primitives (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) are stored directly in the variable. Objects, arrays, and functions are stored as a *reference* (pointer) to a location in memory. Copying a reference doesn't copy the data — both variables point to the same object.
- 📖 [javascript.info — Object References and Copying](https://javascript.info/object-copy) · 🎥 [Web Dev Simplified — Reference vs Value](https://www.youtube.com/watch?v=-hBJz2PPIVE)

**2. Shallow Copy vs Deep Copy** — A shallow copy (`Object.assign`, spread `{...obj}`) duplicates only the top level — nested objects are still shared references. A deep copy recursively duplicates every nested level so the clone is completely independent.
- 📖 [MDN — Shallow Copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy) · 📖 [MDN — Deep Copy](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy)

**3. Recursion & The Call Stack** — A recursive function calls itself with a smaller sub-problem until hitting a base case. Each call adds a frame to the Call Stack. Deeply nested structures can cause "Maximum call stack size exceeded" errors.
- 📖 [javascript.info — Recursion](https://javascript.info/recursion) · 🎥 [Fireship — Recursion in 100 Seconds](https://www.youtube.com/watch?v=rf60MejMz3E)

**4. `typeof` & `instanceof` Operators** — `typeof` returns a string identifying a primitive's type (but returns `"object"` for both objects and `null`). `instanceof` checks if an object's prototype chain includes a specific constructor — used to distinguish `Date`, `RegExp`, `Array`, etc.
- 📖 [MDN — typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) · 📖 [MDN — instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)

**5. `WeakMap` for Circular Reference Tracking** — A `WeakMap` maps objects to values but holds "weak" references — if the key object has no other references, it can be garbage collected. In deep clone, it tracks already-visited objects to break infinite loops caused by circular references.
- 📖 [MDN — WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) · 📖 [javascript.info — WeakMap and WeakSet](https://javascript.info/weakmap-weakset)

**6. `for...in`, `hasOwnProperty` & `JSON.parse(JSON.stringify())` Limitations** — `for...in` iterates over *all* enumerable properties including inherited ones, so `hasOwnProperty` filters to own keys only. `JSON.parse(JSON.stringify())` is a quick deep clone hack but silently drops `undefined`, functions, `Date` (becomes string), `RegExp`, and crashes on circular references.
- 📖 [MDN — for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) · 📖 [MDN — hasOwnProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)
- 🎥 [Web Dev Simplified — Structured Clone](https://www.youtube.com/watch?v=dSiAQOaCHWE)

---

### Focus Exercise: `Deep Clone`

#### The Core Concepts

- **Pass by Value vs. Reference:** Mutating a copied reference of an Object or Array mutates the original data.
- **Circular References:** An object pointing to itself (e.g., `obj.self = obj`) will crash a naive recursive clone or `JSON.stringify()`.
- **The Call Stack:** Deeply nested structures can exceed the browser's maximum call stack size during recursion.

#### Level 3 Implementation (Vanilla JS)

```javascript
function deepClone(value, map = new WeakMap()) {
  // Handle primitives
  if (value === null || typeof value !== "object") return value;

  // Handle circular references
  if (map.has(value)) return map.get(value);

  // Handle specific object types
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value);

  const clone = Array.isArray(value) ? [] : {};
  map.set(value, clone); // Store reference before iterating

  for (let key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      clone[key] = deepClone(value[key], map);
    }
  }

  return clone;
}
```

#### Pressure Tests

> **Q: Why use `WeakMap` instead of `Map` here?**
>
> **A:** `WeakMap` allows the garbage collector to free up the cloned objects after the operation finishes, preventing memory leaks during heavy cloning operations.

---

## ⚙️ Module 5: The "Functional Pipeline" Master

### 📚 Prerequisite Concepts & Resources

> **🔗 GreatFrontEnd:** [Array.prototype.reduce](https://www.greatfrontend.com/questions/javascript/array-reduce) · [Curry](https://www.greatfrontend.com/questions/javascript/curry) · [Curry II](https://www.greatfrontend.com/questions/javascript/curry-ii)

**1. Higher-Order Functions** — Functions that accept other functions as arguments (`map`, `filter`, `reduce`) or return new functions. This is foundational to functional programming in JS and is the pattern both `reduce` and `curry` rely on.
- 📖 [javascript.info — Function Expressions](https://javascript.info/function-expressions) · 📖 [Eloquent JavaScript — Higher-Order Functions](https://eloquentjavascript.net/05_higher_order.html)
- 🎥 [Fun Fun Function — Higher-order Functions](https://www.youtube.com/watch?v=BMUiFMZr7vk)

**2. The Accumulator Pattern** — A loop that carries forward a running result. `reduce` formalizes this: on each iteration, the callback receives the accumulated value so far plus the current element, and returns the new accumulated value. If no initial value is provided, the first element is used.
- 📖 [MDN — Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- 🎥 [Web Dev Simplified — Reduce in 10 Minutes](https://www.youtube.com/watch?v=s1XVfm5mIuU)

**3. `Array.prototype` & The Prototype Chain** — Every array inherits methods from `Array.prototype`. When you add `Array.prototype.myReduce`, all arrays gain access to it. Understanding the prototype chain is key to knowing *how* polyfills work.
- 📖 [javascript.info — Prototypes](https://javascript.info/prototype-inheritance) · 📖 [MDN — Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

**4. The `arguments` Object** — A legacy array-like object available in non-arrow functions that contains all passed arguments. Unlike rest parameters, it's not a real array. Used in `reduce` to detect whether an initial value was actually provided via `arguments.length`.
- 📖 [MDN — arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)

**5. Function Arity (`Function.length`)** — `fn.length` returns the number of formal parameters a function expects (excluding rest params and those with defaults). Currying uses this to know *when* enough arguments have been collected to invoke the original function.
- 📖 [MDN — Function.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

**6. Partial Application & Closures in Currying** — Partial application fixes some arguments of a function, producing a new function that takes the rest. Currying is a special case where each call takes exactly one argument. The accumulated arguments are stored via closures across each returned function.
- 📖 [javascript.info — Currying](https://javascript.info/currying-partials) · 🎥 [Fun Fun Function — Currying](https://www.youtube.com/watch?v=iZLP4qOwY8I)

**7. Sparse Arrays** — Arrays can have "holes" (e.g., `[1, , 3]`). `for...in` and `forEach` skip holes, but a regular `for` loop does not. A proper `reduce` implementation must check `Object.hasOwn(array, index)` to skip empty slots.
- 📖 [MDN — Array: Sparse Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Indexed_collections#sparse_arrays)

---

### Focus Exercises: `Array.prototype.reduce` & `curry`

#### The Core Concepts

- **Higher-Order Functions:** Functions that accept or return other functions.
- **The Accumulator Pattern:** Iterating over data while carrying forward state. If no initial value is provided, the first array element becomes the initial state.
- **Arity (`Function.length`):** Currying relies on comparing the number of arguments received so far against the original function's expected argument count.

#### Level 3 Implementations

**Vanilla `myReduce`:**

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  if (this.length === 0 && arguments.length < 2) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let accumulator = arguments.length >= 2 ? initialValue : this[0];
  let startIndex = arguments.length >= 2 ? 0 : 1;

  for (let i = startIndex; i < this.length; i++) {
    // Skip sparse array holes
    if (Object.hasOwn(this, i)) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};
```

**Vanilla `curry`:**

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, [...args, ...nextArgs]);
      };
    }
  };
}
```

#### Pressure Tests

> **Q: Why check `arguments.length >= 2` instead of `initialValue !== undefined`?**
>
> **A:** A user might explicitly pass `undefined` as the initial value. Checking `arguments.length` safely determines if a second argument was actually provided.

---

## ⚡ Module 6: The "Async Orchestrator"

### 📚 Prerequisite Concepts & Resources

> **🔗 GreatFrontEnd:** [Promise.all](https://www.greatfrontend.com/questions/javascript/promise-all) · [Promise.race](https://www.greatfrontend.com/questions/javascript/promise-race) · [Promise.any](https://www.greatfrontend.com/questions/javascript/promise-any)

**1. Promises** — An object representing the eventual completion (or failure) of an async operation. A Promise is in one of three states: `pending`, `fulfilled`, or `rejected`. Chained with `.then()` (success), `.catch()` (error), and `.finally()` (always runs).
- 📖 [javascript.info — Promises](https://javascript.info/promise-basics) · 📖 [MDN — Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- 🎥 [Web Dev Simplified — Promises in 10 Minutes](https://www.youtube.com/watch?v=DHvZLI7Db8E)

**2. `Promise.resolve()` & Wrapping Values** — `Promise.resolve(value)` wraps any value in a resolved promise. This is crucial in `Promise.all` because the input array may contain non-promise values (plain numbers, strings, etc.) that still need to be handled uniformly.
- 📖 [MDN — Promise.resolve()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

**3. Microtask Queue vs Macrotask Queue** — Promise callbacks (`.then`, `.catch`) are queued as *microtasks*, which execute before macrotasks (`setTimeout`, `setInterval`). This means promise resolution always happens before the next timer callback in the same cycle.
- 📖 [javascript.info — Microtasks](https://javascript.info/microtask-queue) · 🎥 [Lydia Hallie — JavaScript Visualized: Promises & Async/Await](https://www.youtube.com/watch?v=Xs1EMmBLpn4)

**4. `async`/`await` Syntax** — Syntactic sugar for promise chains. `async` functions always return a promise. `await` pauses execution until a promise settles, making async code read like synchronous code. Under the hood, it's still promises.
- 📖 [javascript.info — Async/Await](https://javascript.info/async-await) · 🎥 [Fireship — Async/Await in 100 Seconds](https://www.youtube.com/watch?v=vn3tm0quoqE)

**5. The Fetch API & HTTP Basics** — `fetch(url)` returns a promise that resolves to a `Response` object. `response.ok` is `true` for 200-299 status codes. `response.json()` returns another promise with the parsed body. Fetch does *not* reject on 404/500 — only on network errors.
- 📖 [MDN — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) · 📖 [javascript.info — Fetch](https://javascript.info/fetch)

**6. `AbortController` & `AbortSignal`** — `AbortController` creates a signal that can be passed to `fetch`. Calling `controller.abort()` cancels the request and causes fetch to reject with an `AbortError`. Essential in React to cancel stale requests when a component unmounts or dependencies change.
- 📖 [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) · 🎥 [Web Dev Simplified — AbortController](https://www.youtube.com/watch?v=4mPkigmVsHs)

**7. Race Conditions in Async React** — When a component re-renders with new props before a previous fetch completes, the old response may overwrite the new one. The `AbortController` pattern (or an `isMounted` boolean flag in the cleanup) prevents stale data from updating state.
- 📖 [React docs — You Might Not Need an Effect (fetching data)](https://react.dev/learn/you-might-not-need-an-effect#fetching-data) · 🎥 [Jack Herrington — Race Conditions in React](https://www.youtube.com/watch?v=T8TpiGp4xm0)

---

### Focus Exercises: `Promise.all` & Custom `useFetch`

#### The Core Concepts

- **Concurrency:** `Promise.all` kicks off tasks concurrently and resolves when the Microtask Queue confirms all have completed.
- **Order Preservation:** Regardless of which promise resolves first, the final array must match the order of the input array.
- **Race Conditions:** Using an `AbortController` (or an `isMounted` flag) to cancel stale fetch requests in React when dependencies change.

#### Level 3 Implementations

**Vanilla `myPromiseAll`:**

```javascript
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completedCount = 0;

    if (promises.length === 0) return resolve(results);

    promises.forEach((promise, index) => {
      // Wrap in Promise.resolve to handle non-promise values
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value; // Preserve order
          completedCount += 1;
          if (completedCount === promises.length) resolve(results);
        })
        .catch(reject); // Fail-fast on first error
    });
  });
}
```

**React `useFetch`:**

```javascript
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // Ignore intentional aborts
        setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort(); // Cancel request on cleanup
  }, [url]);

  return { data, error, loading };
}
```

#### Pressure Tests

> **Q: In `myPromiseAll`, why use `results[index] = value` instead of `results.push(value)`?**
>
> **A:** Promises resolve at different times. If Promise 2 finishes before Promise 1, `.push()` would put Promise 2's result at index 0, ruining the order.

---

## 🖼️ Module 7: The "DOM Performance" Master

### 📚 Prerequisite Concepts & Resources

> **🔗 GreatFrontEnd:** [Virtual List (UI)](https://www.greatfrontend.com/questions/user-interface/virtual-list) — GreatFrontEnd also covers this concept in their [Front End System Design](https://www.greatfrontend.com/system-design) section.

**1. The Browser Rendering Pipeline** — When the browser receives HTML/CSS, it builds the DOM tree → CSSOM tree → Render tree → Layout (calculating positions) → Paint (drawing pixels) → Composite (layering). Adding/removing many DOM nodes forces expensive Layout and Paint recalculations.
- 📖 [web.dev — How Browsers Work](https://web.dev/articles/howbrowserswork) · 📖 [web.dev — Rendering Performance](https://web.dev/articles/rendering-performance)
- 🎥 [Fireship — 10 Browser Concepts Every Dev Should Know](https://www.youtube.com/watch?v=5-JBHoVlEco)

**2. Reflow & Layout Thrashing** — A "reflow" recalculates the geometry of elements. Reading a layout property (like `offsetHeight`) right after writing one (like `style.height`) forces the browser to reflow synchronously. Doing this in a loop is "layout thrashing" — a major performance killer.
- 📖 [web.dev — Avoid Large, Complex Layouts](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing) · 📖 [Paul Irish — What Forces Layout/Reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

**3. CSS `position: absolute` vs `relative`** — `position: relative` establishes a positioning context without removing the element from flow. `position: absolute` removes the element from document flow and positions it relative to the nearest positioned ancestor. Virtual lists use absolute positioning to place items at exact pixel offsets.
- 📖 [MDN — position](https://developer.mozilla.org/en-US/docs/Web/CSS/position) · 🎥 [Web Dev Simplified — CSS Position in 12 Minutes](https://www.youtube.com/watch?v=jx5jmI0UlXU)

**4. Scroll Events & `scrollTop`** — The `scroll` event fires when a scrollable element is scrolled. `element.scrollTop` gives the number of pixels scrolled from the top. Virtual lists use this value to calculate which items are currently visible in the viewport.
- 📖 [MDN — Element.scrollTop](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop) · 📖 [MDN — scroll event](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event)

**5. Core Web Vitals (LCP, CLS, INP)** — Google's metrics for real-world user experience. **LCP** (Largest Contentful Paint) = how fast the main content loads. **CLS** (Cumulative Layout Shift) = visual stability. **INP** (Interaction to Next Paint) = responsiveness. Rendering 10,000 DOM nodes destroys all three.
- 📖 [web.dev — Core Web Vitals](https://web.dev/articles/vitals) · 🎥 [Google Chrome Developers — Core Web Vitals](https://www.youtube.com/watch?v=AQqFZ5t8uNc)

**6. `ResizeObserver` API** — Asynchronously observes changes to an element's dimensions. Unlike `window.resize`, it works on individual elements. Used in advanced virtual lists to measure actual rendered item heights for variable-height windowing.
- 📖 [MDN — ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) · 🎥 [Web Dev Simplified — ResizeObserver](https://www.youtube.com/watch?v=M2c37drnnOA)

**7. `Array.prototype.slice()` & Index Math** — `slice(start, end)` extracts a sub-array without mutating the original. In virtual lists, you calculate `startIndex` and `endIndex` from `scrollTop` and `itemHeight`, then slice only the visible items from the full data array.
- 📖 [MDN — Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)

---

### Focus Exercise: `Virtual List`

#### The Core Concepts

- **DOM Limitations:** Rendering thousands of nodes simultaneously causes layout thrashing and poor Core Web Vitals.
- **Windowing:** Only render the items currently visible in the viewport, plus a small buffer ("overscanning").
- **Absolute Positioning:** Use mathematical offsets (`top: index * height`) inside a large container to position elements dynamically as the user scrolls.

#### Level 3 Implementation (React)

```javascript
import { useState } from "react";

export function VirtualList({ items, itemHeight, windowHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleItemCount = Math.ceil(windowHeight / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemCount + 2
  ); // +2 for buffer

  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      style={{ height: windowHeight, overflowY: "auto", position: "relative" }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: totalHeight }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: "absolute",
                top: actualIndex * itemHeight,
                height: itemHeight,
                width: "100%",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

#### Pressure Tests

> **Q: How would you handle variable height items?**
>
> **A:** I'd need an array of cached measurements. As items render, a `ResizeObserver` measures their actual height, updates the cache, and forces a recalculation of all subsequent `top` offsets.

---

## 🌍 Module 8: The "Data Fetching UI" Master

### 📚 Prerequisite Concepts & Resources

> **🔗 GreatFrontEnd:** [Autocomplete (UI)](https://www.greatfrontend.com/questions/user-interface/autocomplete) · [Tweet (UI)](https://www.greatfrontend.com/questions/user-interface/tweet) — Infinite scroll concepts also appear in the [Front End System Design](https://www.greatfrontend.com/system-design) section (e.g., News Feed design).

**1. Controlled Components in React** — An input whose value is driven by React state (`value={query}` + `onChange`). Every keystroke updates state, which re-renders the input with the new value. This gives React full control over the form data.
- 📖 [React docs — Responding to Input with State](https://react.dev/learn/reacting-to-input-with-state) · 🎥 [Web Dev Simplified — Controlled vs Uncontrolled](https://www.youtube.com/watch?v=IkMND33x0qQ)

**2. Debouncing User Input (cross-ref Module 1)** — Without debouncing, every keystroke fires an API call. Debouncing waits for the user to *stop* typing before sending the request. This drastically reduces network traffic and prevents UI flicker.
- 📖 See [Module 1 Prerequisites](#-module-1-the-timer--async-master) · 📖 [CSS-Tricks — Debouncing & Throttling Explained](https://css-tricks.com/debouncing-throttling-explained-examples/)

**3. Race Conditions & Stale Closures** — If a user types "ab", then "abc" quickly, two fetches fire. If "ab"'s response arrives *after* "abc"'s, the UI shows wrong results. The `isMounted` flag pattern (or `AbortController`) in the cleanup function prevents stale responses from updating state.
- 📖 [React docs — Fetching Data in Effects](https://react.dev/learn/synchronizing-with-effects#fetching-data) · 🎥 [Jack Herrington — Race Conditions in React](https://www.youtube.com/watch?v=T8TpiGp4xm0)

**4. `IntersectionObserver` API** — A browser API that asynchronously detects when an element enters or exits the viewport. Far more performant than listening to scroll events. In Infinite Scroll, a "sentinel" element at the bottom triggers the next page fetch when it becomes visible.
- 📖 [MDN — IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) · 🎥 [Web Dev Simplified — Intersection Observer in 15 Minutes](https://www.youtube.com/watch?v=2IbRtjez6ag)

**5. Pagination: Offset vs Cursor-based** — **Offset-based** (`?page=2&limit=20`) is simple but breaks when items are added/deleted between requests. **Cursor-based** (`?after=abc123&limit=20`) uses a pointer to the last item, providing stable pagination even with live data.
- 📖 [Slack Engineering — Evolving API Pagination](https://slack.engineering/evolving-api-pagination-at-slack/) · 📖 [Apollo GraphQL — Cursor-based Pagination](https://www.apollographql.com/docs/react/pagination/cursor-based)

**6. React `useCallback` & Stable References** — `useCallback(fn, deps)` returns a memoized version of the callback that only changes when its dependencies change. Without it, functions are recreated every render, causing `useEffect` (which depends on them) to re-run unnecessarily.
- 📖 [React docs — useCallback](https://react.dev/reference/react/useCallback) · 🎥 [Jack Herrington — useMemo & useCallback](https://www.youtube.com/watch?v=MxIPQZ64x0I)

**7. Functional State Updates (`setState(prev => ...)`)** — When appending data (like new pages), use the functional form of `setState` to safely access the previous state. This avoids stale closure bugs where the callback captures an outdated snapshot of state.
- 📖 [React docs — Updating state based on previous state](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Focus Exercises: `Auto-Complete` & `Infinite Scroll`

#### The Core Concepts

- **Race Conditions:** If rapid API calls resolve out of order, the UI might display stale data.
- **Pagination & Cursors:** Managing state across multiple chunks of data without losing the previous chunks.
- **Intersection Observer:** A performant API for detecting when an element enters the viewport, replacing expensive scroll event listeners.

#### Level 3 Implementations

**React `AutoComplete`:**

```javascript
import { useState, useEffect } from "react";

export function AutoComplete({ fetchResults, useDebounce }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let isMounted = true;

    fetchResults(debouncedQuery)
      .then((data) => {
        if (isMounted) setResults(data);
      })
      .catch(console.error);

    // Cleanup: Mark stale requests as unmounted
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, fetchResults]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

**React `InfiniteFeed`:**

```javascript
import { useState, useEffect, useRef, useCallback } from "react";

export function InfiniteFeed({ fetchPage }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loaderRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      // Prevent fetching if already loading or no more data
      if (target.isIntersecting && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    setIsLoading(true);
    fetchPage(page).then((newData) => {
      setItems((prev) => [...prev, ...newData]); // Append data
      setHasMore(newData.length > 0);
      setIsLoading(false);
    });
  }, [page, fetchPage]);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
      <div ref={loaderRef}>{isLoading && <p>Loading more...</p>}</div>
    </div>
  );
}
```

#### Pressure Tests

> **Q: In the Infinite Scroll, why wrap `handleObserver` in `useCallback`?**
>
> **A:** Because it relies on `isLoading` and `hasMore`. If it wasn't stable, the `useEffect` that sets up the `IntersectionObserver` would tear down and recreate the observer on every render, causing performance issues and potential bugs.
