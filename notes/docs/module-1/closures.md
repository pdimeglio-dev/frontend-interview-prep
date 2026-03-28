---
sidebar_position: 1
title: Closures
---

# Closures

## Summary

An inner function retains access to its outer function's variables even after the outer function has returned. This is the mechanism that lets the returned debounce function "remember" the `timeoutId`.

```javascript
function outer() {
  let count = 0; // this variable is "closed over"
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
counter(); // 1
counter(); // 2 — count persists!
```

## Key Resources

- 📖 [javascript.info — Closures](https://javascript.info/closure)
- 🎥 [Fireship — Closures in 100 Seconds](https://www.youtube.com/watch?v=vKJpN5FAeF4)
- 🎥 [ColorCode — Javascript Closures in Depth](https://youtu.be/aHrvi2zTlaU?si=NImVG8totPGk7bec)

## My Notes

These notes synthesize concepts from [JavaScript.info: Variable scope, closure](https://javascript.info/closure), [Fireship's "Closures Explained in 100 Seconds"](https://www.youtube.com/watch?v=vKJpN5FAeF4), [ColorCode's "JavaScript Closures Tutorial"](https://www.youtube.com/watch?v=aHrvi2zTlaU), and practical coding exercises.

---

### 1. Core Concept: What is a Closure?

A **Closure** is a function that remembers its outer variables and can access them even after the outer function has finished executing. In JavaScript, **all functions are naturally closures** (with the rare exception of the `new Function` syntax).

#### The "Backpack" Analogy
Think of a function in JavaScript as a block of code carrying a hidden **backpack**. Inside that backpack are all the variables that existed in the environment where the function was born. When a function is returned from another function, it takes this backpack with it.

#### Under the Hood: Lexical Environments
According to *JavaScript.info*, every running function, code block, and script has an internal, hidden object called the **Lexical Environment**. It consists of two parts:
1. **Environment Record:** An object storing all local variables.
2. **Outer Reference:** A reference to the outer lexical environment.

When a function is created, it receives a hidden `[[Environment]]` property that references the Lexical Environment where it was created. This is exactly how the "backpack" stays tied to the function forever.

:::info Garbage Collection
Usually, when a function finishes running, its local variables are destroyed by the garbage collector to save memory. However, **if a nested function is returned and still reachable**, its `[[Environment]]` property keeps the outer Lexical Environment alive in memory.
:::

---

### 2. Practical Uses of Closures

#### A. Higher-Order Functions & Functional Composition
A Higher-Order Function (HOF) is a function that either takes functions as arguments or **returns a function**. We can use closures to build "Function Factories" that generate specialized tools.

**Exercise: The `inBetween` Filter**

```javascript
// Function Factory
function inBetween(a, b) {
  // Returns a closure that remembers 'a' and 'b'
  return function(x) {
    return x >= a && x <= b;
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
// Declarative functional composition:
console.log(arr.filter(inBetween(3, 6))); // Output: [3, 4, 5, 6]
```

#### B. Encapsulation & Private Variables
JavaScript traditionally lacked private properties. Closures allow us to hide data so it cannot be modified directly from the outside.

**Exercise: Private Counter**

```javascript
function createCounter() {
  let count = 0; // Hidden inside the closure's "backpack"
  return {
    increment: function() { count++; },
    getValue: function() { return count; }
  };
}

const myCounter = createCounter();
myCounter.increment();
console.log(myCounter.getValue()); // 1
console.log(myCounter.count); // undefined (Data is hidden!)
```

> **Note:** As seen in the ColorCode tutorial, this pattern is also heavily used to maintain state in practical scenarios like UI click handlers!

---

### 3. The Classic Interview Trap: The Loop Problem
Highlighted in Fireship's interview prep video, this is the most common closure "gotcha."

**The Trap:** Predict the output of this code.

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function() { console.log(i); }, 1000);
}
```

Most people guess: `0, 1, 2`

**Reality:** `3, 3, 3`

**Why?** `var` is function-scoped (or globally scoped here). There is only one shared variable `i`. By the time the 1-second timeouts finish, the loop is over and `i` is `3`. The closures all look at the same `i`.

#### The Modern Fix (`let`)
`let` is block-scoped. In a `for` loop, `let` magically creates a brand new variable for every single iteration. Each timeout gets its own separate `i` in its backpack.

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(function() { console.log(i); }, 1000); // Output: 0, 1, 2
}
```

#### The Old-School Fix (IIFE)
Before `let`, developers had to force a new scope by wrapping the inside of the loop in an Immediately Invoked Function Expression (IIFE).

```javascript
for (var i = 0; i < 3; i++) {
  (function(j) { 
    setTimeout(function() { console.log(j); }, 1000);
  })(i); // Pass the current 'i' to be locked in as 'j' for this specific spin
}
```

---

### 4. Currying Exercises
Currying is translating a function from `f(a, b)` into `f(a)(b)`. You give it configuration first, and data later.

#### Level 1: Basic Currying
**Prompt:** Write a function that makes `sum(2)(3)` return `5`.

```javascript
function sum(a) {
  return function(b) {
    return a + b; // Closure remembers 'a'
  };
}
```

#### Level 2: Infinite Currying (Recursion)
**Prompt:** Write a function that chains infinitely `sum(1)(2)(3)(4)()` and returns the total when empty parentheses are called.

```javascript
function sum(a) {
  return function(b) {
    if (b === undefined) return a; // Stop condition
    return sum(a + b);             // Recursive call: return a new configured function
  };
}
console.log(sum(1)(2)(3)(4)()); // Output: 10
```

#### Level 3: Variadic Currying (Rest vs. Spread)
**Prompt:** Make it work for `sum(1, 2)(3)()` using modern ES6 syntax.

:::note Rest vs. Spread: The Packer and Unpacker
- **Rest Parameter** (`...args` in definition): Acts as a vacuum. Packs loose arguments into an array.
- **Spread Syntax** (`...args` in execution): Acts as an unpacker. Blows an array open into separate comma-separated items.
:::

```javascript
// 1. Rest Parameter: Packs all passed arguments into an array
function sum(...args) { 
  
  // Add up the current arguments
  const currentTotal = args.reduce((total, num) => total + num, 0);

  // Return function waiting for the next set of arguments
  return function(...nextArgs) {
    if (nextArgs.length === 0) {
      return currentTotal; // Empty brackets trigger the final return
    }
    
    // 2. Spread Syntax: Unpacks the arrays back into individual arguments 
    // to feed recursively back into sum()
    return sum(currentTotal, ...nextArgs); 
  };
}

console.log(sum(1, 2)(3)()); // Output: 6
console.log(sum(10, 5, 5)()); // Output: 20
```

---

### References & Further Learning

- 📖 [JavaScript.info - Variable scope, closure](https://javascript.info/closure)
- 🎥 [Fireship - Closures Explained in 100 Seconds](https://www.youtube.com/watch?v=vKJpN5FAeF4) — Great for interview prep and setTimeout loop tricks.
- 🎥 [ColorCode - JavaScript Closures Tutorial](https://www.youtube.com/watch?v=aHrvi2zTlaU) — Great for deep-dive theory and DOM click-handler application.

## Key Takeaways

<!-- 
  Bullet points you want to remember:
  - 
  - 
  - 
-->



## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Closures let the debounced function "remember" the `timeoutId`
- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — The memoized function closes over the `cache` variable
