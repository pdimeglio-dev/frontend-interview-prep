---
sidebar_position: 2
title: this & apply/call/bind
---

# The `this` Keyword & `apply()` / `call()` / `bind()`

## Summary

In JavaScript, `this` is determined by *how* a function is called, not where it's defined. `apply()` lets you invoke a function while explicitly setting `this` and passing arguments as an array.

| Method | Syntax | Invokes immediately? |
|--------|--------|---------------------|
| `call` | `fn.call(thisArg, a, b)` | ✅ Yes |
| `apply` | `fn.apply(thisArg, [a, b])` | ✅ Yes |
| `bind` | `fn.bind(thisArg, a)` | ❌ Returns new function |

## Key Resources

- 📖 [MDN — this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- 📖 [MDN — Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- 🎥 [Web Dev Simplified — this in 8 Minutes](https://www.youtube.com/watch?v=YOlr79NaAtQ)

## My Notes

In JavaScript, the `this` keyword is the most common way interviewers test if you understand how the JavaScript engine works under the hood.

:::tip The Golden Rule
The value of `this` is **not** determined by where a function is written, but by **HOW the function is called** (its execution context).
:::

### The "this" Cheat Sheet

If you need to figure out what `this` is, ask yourself these questions in this exact order:

| Scenario | What `this` refers to | Example |
| :--- | :--- | :--- |
| **1. Arrow Functions** | The `this` of the surrounding (parent) code. They don't have their own! | `() => console.log(this)` |
| **2. Constructor (`new`)** | The brand-new object being created. | `new User('Sina')` |
| **3. Explicit Binding** | The object explicitly passed in via `call`, `apply`, or `bind`. | `greet.call(user)` |
| **4. Method Call** | The object "to the left of the dot". | `user.greet()` |
| **5. Global / Free Call** | The global object (`window` or `global`), or `undefined` in Strict Mode. | `greet()` |

---

### 1. Context Examples

#### Global Scope & Free Function Calls
Without an object attached, `this` defaults to the global environment.

```javascript
// In a browser, this outputs the Window object.
// In Node.js, this outputs the Global object.
console.log(this); 

function sayHi() {
  console.log(this);
}
sayHi(); // Also Window/Global (or undefined in 'use strict')
```

#### Methods (Implicit Binding)
When a function is called as a method of an object, `this` refers to the object to the left of the dot.

```javascript
const user = {
  name: 'Sina',
  greet: function() {
    console.log(`Hello, my name is ${this.name}`);
  }
};

user.greet(); // "Hello, my name is Sina"
```

#### Arrow Functions (Lexical Binding)
Arrow functions do not create their own `this`. They inherit it from the scope in which they were defined, ignoring how they are executed.

```javascript
const user = {
  name: 'Sina',
  greet: function() {
    // Inherits "this" from the greet method (which is the user object)
    setTimeout(() => {
      console.log(`Hello, ${this.name}`);
    }, 1000);
  }
};

user.greet(); // "Hello, Sina"
```

#### ⚠️ The Event Listener Problem with Arrow Functions
Because arrow functions use lexical scoping, they can cause major issues when used as DOM event handlers. They completely ignore the HTML element that triggered the event and instead bind to where they were declared (often the global `Window`).

**The Regular Function (Works as expected):**

```javascript
const myButton = document.getElementById('my-btn');

myButton.addEventListener('click', function() {
  // The browser binds "this" to the element that triggered the event.
  console.log(this); // Output: <button id="my-btn">...</button>
  this.classList.add('clicked'); // Success!
});
```

**The Arrow Function (Breaks):**

```javascript
myButton.addEventListener('click', () => {
  // Looks up to the global scope where it was defined.
  console.log(this); // Output: Window {...}
  this.classList.add('clicked'); // ERROR! Window doesn't have classList.
});
```

:::tip The Modern Workaround
Developers love arrow functions for their concise syntax. To use them safely in event listeners without breaking your code, avoid `this` entirely and use the event object instead:

```javascript
myButton.addEventListener('click', (event) => {
  // event.currentTarget gives you the exact element the listener is attached to!
  event.currentTarget.classList.add('clicked');
});
```
:::

---

### 2. The Callback "Gotcha" (References vs. Snapshots)
Passing methods as callbacks (like into `setTimeout`) often breaks the `this` context or leads to unexpected reference bugs.

:::caution The Mutation Trap
If an arrow function waits in a `setTimeout`, it holds a **reference** to the object, not a snapshot. If the object changes before the timeout finishes, the output changes!
:::

```javascript
const user = {
  name: 'Sina',
  greet: function() {
    setTimeout(() => console.log(`Hello, ${this.name}`), 1000);
  }
};

user.greet(); 
user.name = 'John'; // We change the name before the timer finishes
// Output 1 second later: "Hello, John"
```

#### The Fix: Using Closures for a "Snapshot"
To capture the value at the exact moment the function is called, save it to a variable outside the callback.

```javascript
const user = {
  name: 'Sina',
  greet: function() {
    let snappedName = this.name; // Snapshot taken immediately!

    setTimeout(() => {
      console.log(`Hello, ${snappedName}`); 
    }, 1000);
  }
};

user.greet(); 
user.name = 'John'; 
// Output 1 second later: "Hello, Sina"
```

---

### 3. Explicit Binding (`call`, `apply`, `bind`)
You can manually force `this` to point to a specific object.

- **`call(thisArg, arg1, arg2)`**: Executes immediately. Passes arguments **C**omma-separated.
- **`apply(thisArg, [arg1, arg2])`**: Executes immediately. Passes arguments as an **A**rray.
- **`bind(thisArg, arg1)`**: Returns a new function to be executed later.

```javascript
const user = {
  name: 'Sina',
};

function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

// call — arguments passed individually (Comma-separated)
greet.call(user, 'Hello', '!');       // "Hello, Sina!"

// apply — arguments passed as an Array
greet.apply(user, ['Hey', '...']);     // "Hey, Sina..."

// bind — returns a NEW function with "this" locked in (does NOT execute)
const greetSina = greet.bind(user, 'Hi');
greetSina('?');                        // "Hi, Sina?"
greetSina('!!!');                      // "Hi, Sina!!!"
```

#### `bind` in Action — Fixing Lost Context

`bind` shines when you need to pass a method as a callback without losing `this`:

```javascript
const user = {
  name: 'Sina',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

// ❌ Passing the method directly — "this" is lost
setTimeout(user.greet, 1000); // "Hello, I'm undefined"

// ✅ Using bind — "this" is locked to user
setTimeout(user.greet.bind(user), 1000); // "Hello, I'm Sina"

// ✅ bind also works for event listeners
const button = document.getElementById('my-btn');
button.addEventListener('click', user.greet.bind(user)); // "Hello, I'm Sina"
```

:::tip When to use which?
- Use **`call`** when you know the arguments upfront and want to invoke immediately.
- Use **`apply`** when your arguments are already in an array (e.g., `Math.max.apply(null, numbers)`).
- Use **`bind`** when you need to pass a method as a callback but keep the right `this` (e.g., event handlers, `setTimeout`).
:::

---

### 4. Building `bind` from Scratch (Polyfill)
A classic senior-level interview question is implementing `Function.prototype.bind`.

```javascript
Function.prototype.myBind = function(context, ...boundArgs) {
  // 1. Capture the original function (the method calling .myBind)
  const originalFunction = this; 

  // Edge case protection
  if (typeof originalFunction !== 'function') {
    throw new TypeError('myBind must be called on a function');
  }

  // 2. Return a brand new function (Higher-Order Function)
  return function(...callArgs) {
    // 3. Execute the original function using .apply()
    // Merge the initial arguments with the new arguments
    return originalFunction.apply(context, [...boundArgs, ...callArgs]);
  };
};
```

#### Step-by-Step Explanation
1. **`originalFunction = this`**: Grabs the function that needs to be bound (e.g., `user.greet`).
2. **`...boundArgs`**: Captures any preset arguments passed during the binding setup.
3. **`return function(...callArgs)`**: Creates a closure. It remembers the `originalFunction`, the `context`, and the `boundArgs`. `callArgs` are the arguments provided when this new function is finally executed.
4. **`apply()`**: Runs the original function using the locked `context` and merges both arrays of arguments.

#### Functional Programming Concepts Used Here
Implementing `bind` touches on several advanced functional programming concepts:

- **Higher-Order Function (HOF):** `myBind` is an HOF because it returns a brand new function.
- **Partial Application:** `myBind` allows you to lock in some arguments now (`boundArgs`) and wait for the rest later (`callArgs`).

> **Note:** This is **not** Currying. Currying strictly transforms a function to take exactly one argument at a time (e.g., `func(a)(b)(c)`). Partial application bundles arguments flexibly.

## Key Takeaways

<!-- 
  - 
  - 
  - 
-->



## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Uses `apply(this, args)` to maintain the caller's context
