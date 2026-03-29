---
sidebar_position: 3
title: setTimeout & clearTimeout
---

# setTimeout & clearTimeout

## Summary

`setTimeout` schedules a callback to run after a delay (in ms). `clearTimeout` cancels a pending timer before it fires. These are Web APIs, not part of the JS engine itself.

```javascript
const id = setTimeout(() => console.log('fired!'), 1000);
clearTimeout(id); // cancelled — callback never fires
```

## Key Resources

- 📖 [MDN — setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- 📖 [javascript.info — Scheduling](https://javascript.info/settimeout-setinterval)

## My Notes

> **Advanced setTimeout & The Event Loop** — A senior-level guide to setTimeout, setInterval, the Event Loop, and Task Queues.

While `setTimeout` and `clearTimeout` seem like simple JavaScript functions, they are actually **Web APIs** (or Node.js APIs) provided by the environment, not part of the core V8 JavaScript engine itself. 

Understanding how these APIs interact with the JavaScript execution model is critical for senior-level engineering, performance optimization, and avoiding production bugs.

---

### 1. The Event Loop & Task Queues

JavaScript is single-threaded. To handle asynchronous operations without blocking the main thread, it relies on the **Event Loop** and a system of queues. 

#### The Call Stack
This is where your synchronous JavaScript code executes. The engine reads your code top-to-bottom and pushes function calls onto the stack. It must be completely empty before the Event Loop can process asynchronous callbacks.

#### The Microtask Queue
This queue is for high-priority asynchronous tasks that need to run *immediately* after the currently executing script, but before yielding back to the browser's rendering engine.
* **Examples:** Promises (`.then`, `.catch`, `.finally`), `MutationObserver`, `queueMicrotask()`.
* **The Rule:** The Event Loop will empty the *entire* Microtask Queue before moving on. If a microtask queues another microtask, it gets executed in the same cycle.

#### The Macrotask Queue (Task Queue)
This queue is for lower-priority, scheduled tasks. 
* **Examples:** `setTimeout`, `setInterval`, DOM events (clicks, keypresses), network payloads.
* **The Rule:** The Event Loop processes exactly **one** Macrotask. Then, it immediately checks the Microtask Queue again to see if any new high-priority tasks were added.

:::danger Minimum Delay, Not Exact Delay
The `delay` argument in `setTimeout` is a **minimum guaranteed delay**, not an exact execution time. If the Call Stack is blocked by heavy synchronous code, a 1000ms timer might take 3000ms to fire.
:::

---

### 2. Execution Order (The Ultimate Test)

Because of how the Event Loop prioritizes the queues, Microtasks always beat Macrotasks. Consider this code:

```javascript
console.log('1'); // Synchronous (Call Stack)

setTimeout(() => {
  console.log('2'); // Macrotask 1
  Promise.resolve().then(() => console.log('3')); // Microtask queued inside Macrotask 1
}, 0);

Promise.resolve().then(() => {
  console.log('4'); // Microtask 1
  setTimeout(() => console.log('5'), 0); // Macrotask queued inside Microtask 1
});

console.log('6'); // Synchronous (Call Stack)
```

**Output:** `1, 6, 4, 2, 3, 5`

**Why?**

1. Synchronous code runs first (`1`, `6`).
2. The Call Stack empties, so the Event Loop processes the first Microtask (`4`).
3. The Microtask queue is empty, so it processes the first Macrotask (`2`).
4. **Crucial step:** Finishing Macrotask 1 queued a new Microtask. The Event Loop checks the Microtask queue before moving to the next Macrotask. It processes the new Microtask (`3`).
5. All Microtasks are clear, so it processes the final Macrotask (`5`).

---

### 3. Advanced Limitations & Quirks

#### `setTimeout(fn, 0)` for Deferral
Setting a delay of `0ms` pushes the callback to the end of the Macrotask queue. This is heavily used to defer execution, allowing the browser to render UI updates or process user input before executing a heavy chunk of JavaScript, preventing the UI from freezing.

#### Argument Passing
Instead of creating an anonymous wrapper function to pass arguments, you can pass them directly via the API:

```javascript
// Less efficient
setTimeout(() => myVar(a, b), 1000);

// Cleaner and slightly more performant
setTimeout(myVar, 1000, a, b); 
```

#### The 32-bit Limit & The 4ms Rule
- **32-bit Integer Limit:** The delay parameter is a 32-bit signed integer. The maximum value is 2,147,483,647 ms (~24.8 days). If you pass a larger number, it overflows and triggers immediately (delay of 0).
- **Minimum Clamping (4ms):** If you nest `setTimeout` calls deeply (calling a timeout from within a timeout), modern browsers will eventually enforce a minimum delay of 4ms after 5 nested levels, per the HTML5 spec.

#### Browser vs. Node.js
- **Browser:** Returns an integer ID.
- **Node.js:** Returns a `Timeout` object.
- Node.js includes a `.unref()` method on the `Timeout` object. Calling `timeoutId.unref()` tells the Node process not to keep the application running if this timer is the only thing left in the Event Loop (useful for background daemons).

---

### 4. Recursive `setTimeout` vs. `setInterval`
For polling APIs or repeating async tasks, senior developers avoid `setInterval` and use recursive `setTimeout`.

#### The "Stacking" Problem with `setInterval`
`setInterval` guarantees a fixed time between the *starts* of each execution. If you poll a server every 2000ms, but the server hangs and takes 3000ms to respond, `setInterval` will still push callbacks into the Macrotask queue. Once the server responds, all stacked requests fire back-to-back, potentially freezing the client and DDoSing your server.

#### The Recursive Solution
Recursive `setTimeout` guarantees a fixed time between the *end* of one execution and the *start* of the next.

```javascript
async function pollData() {
  try {
    await fetch('/api/data');
  } finally {
    // Schedule the next call ONLY after the current one completes
    setTimeout(pollData, 2000); 
  }
}
pollData();
```

#### Exponential Backoff
Because recursive `setTimeout` creates a new timer every loop, you can dynamically adjust the delay based on network conditions:

```javascript
function pollWithBackoff(delay = 2000) {
  fetch('/api/data')
    .then(() => setTimeout(() => pollWithBackoff(2000), 2000))
    .catch(() => {
      // Double the delay on failure
      const nextDelay = Math.min(delay * 2, 30000); 
      setTimeout(() => pollWithBackoff(nextDelay), nextDelay);
    });
}
```

---

### 5. Avoiding Memory Leaks in SPAs
In modern frameworks (React, Vue), failing to clear timers is a primary cause of memory leaks.

If a component mounts, starts a 5-second `setTimeout`, and unmounts after 2 seconds, the timer is still ticking in the background. When it fires, it attempts to update state on an unmounted component.

Always clear timeouts in cleanup functions:

```javascript
// React Example
useEffect(() => {
  const timerId = setTimeout(() => {
    // do something
  }, 5000);

  // Cleanup function runs on unmount
  return () => clearTimeout(timerId);
}, []);
```

### 6. Gotchas from javascript.info

#### Pass a Function Reference — Don't Call It

A classic mistake is adding `()` after the function name, which *calls* the function immediately and passes its **return value** (often `undefined`) to `setTimeout` instead of the function itself:

```javascript
function sayHi() {
  alert('Hello');
}

// ❌ WRONG — sayHi() runs immediately, setTimeout gets undefined
setTimeout(sayHi(), 1000);

// ✅ CORRECT — passes the function reference
setTimeout(sayHi, 1000);
```

#### Garbage Collection & Scheduler References

When you pass a function to `setTimeout` or `setInterval`, the scheduler creates an **internal reference** to it. This prevents the function (and anything it closes over) from being garbage collected — even if no other references to it exist in your code.

For `setTimeout`, the reference is released after the callback fires. For `setInterval`, the reference persists **until `clearInterval` is called**. This is another reason to always clean up intervals.

:::tip
This is why `setInterval` without `clearInterval` is a memory leak — the scheduler keeps the callback alive forever, along with its entire closure scope.
:::

#### Timer Throttling in Background Tabs

All scheduling methods provide a *minimum* delay, not an exact one. In practice, browser timers can slow down dramatically due to:

- **CPU is overloaded** — other tasks take priority
- **Browser tab is in the background** — most browsers throttle inactive tab timers to fire at most once per second (~1000ms minimum)
- **Laptop is on battery saving mode** — the OS reduces timer resolution

This can increase the minimal timer resolution to **300ms or even 1000ms** depending on browser and OS settings. Keep this in mind when designing polling or animation logic.

#### Interview Quick-Fire: What Does `alert` Show?

```javascript
let i = 0;

setTimeout(() => alert(i), 100);

// Assume this loop takes >100ms to finish
for (let j = 0; j < 100000000; j++) {
  i++;
}
```

**Answer:** `alert` shows **100000000** (the final value of `i`).

**Why?** The `setTimeout` callback is pushed to the Macrotask queue. It cannot run until the Call Stack is empty. The `for` loop is synchronous and blocks the stack. By the time the timer fires, the loop has finished and `i` has reached its maximum value. This perfectly demonstrates that the delay is a *minimum*, not a guarantee.

---

## Key Takeaways




## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Uses setTimeout/clearTimeout to defer execution
