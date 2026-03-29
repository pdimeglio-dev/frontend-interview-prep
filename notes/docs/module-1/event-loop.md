---
sidebar_position: 4
title: The Event Loop
---

# The Event Loop

## Summary

JavaScript is single-threaded. The Event Loop coordinates the Call Stack, Web APIs, Macrotask Queue (setTimeout callbacks), and Microtask Queue (Promise callbacks). Understanding this explains *why* debounce can defer execution.

```
┌──────────────┐     ┌──────────────┐
│  Call Stack   │     │   Web APIs   │
│  (sync code)  │────→│ (setTimeout, │
│              │     │  fetch, DOM) │
└──────┬───────┘     └──────┬───────┘
       │                     │
       │              ┌──────▼───────┐
       │              │  Task Queues │
       │              │  • Microtask │ ← Promises (.then)
       │              │  • Macrotask │ ← setTimeout
       │              └──────┬───────┘
       │                     │
       └─────────────────────┘
         Event Loop picks next task
```

## Key Resources

- 📖 [javascript.info — Event Loop](https://javascript.info/event-loop)
- 🎥 [Philip Roberts — What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- 🎥 [Lydia Hallie — JavaScript Visualized: Event Loop](https://www.youtube.com/watch?v=eiC58R16hb8)

## My Notes

These notes synthesize concepts from [javascript.info: Event loop](https://javascript.info/event-loop), [Philip Roberts' JSConf EU talk](https://www.youtube.com/watch?v=8aGhZQkoFbQ), and [Lydia Hallie's JavaScript Visualized](https://www.youtube.com/watch?v=eiC58R16hb8).

---

### 1. The JavaScript Runtime Architecture (The Big Picture)

JavaScript is **single-threaded** — it can only do one thing at a time. But the browser is not! The JavaScript *runtime environment* is made up of several moving parts that work together to give the illusion of concurrency.

#### The V8 Engine (or SpiderMonkey, JavaScriptCore, etc.)
The JS engine itself only has two things:
- **Memory Heap** — where object allocation happens
- **Call Stack** — where your code actually executes

That's it. There is no `setTimeout` inside V8. There are no DOM methods. There is no `fetch`. These are all provided by the *environment*.

#### The Browser Environment
The browser wraps the engine and adds:
- **Web APIs** — `setTimeout`, `setInterval`, `fetch`, DOM events, `requestAnimationFrame`, Geolocation, etc.
- **The Macrotask Queue** (a.k.a. Task Queue / Callback Queue)
- **The Microtask Queue**
- **The Event Loop** — the coordinator that ties everything together

> *"V8 is like a chef that can only cook one dish at a time. The Web APIs are like kitchen assistants — they prep ingredients in the background. The Event Loop is the waiter who brings finished plates from the kitchen to the table (the Call Stack) in the right order."*

:::info Philip Roberts' Key Insight
The JS engine itself has no concept of time. `setTimeout` is not a JS feature — it's a **Web API** provided by the browser. The engine simply executes code; the browser manages the scheduling.
:::

---

### 2. The Call Stack — Where Synchronous Code Executes

The Call Stack is a **LIFO** (Last In, First Out) data structure. Every time a function is called, a new **stack frame** is pushed onto the top. When the function returns, the frame is popped off.

```javascript
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function printSquare(n) {
  const result = square(n);
  console.log(result);
}

printSquare(4);
```

The call stack grows and shrinks like this:

```
Step 1: [printSquare]
Step 2: [printSquare, square]
Step 3: [printSquare, square, multiply]
Step 4: [printSquare, square]           ← multiply returns
Step 5: [printSquare]                   ← square returns
Step 6: [printSquare, console.log]
Step 7: [printSquare]                   ← console.log returns
Step 8: []                              ← printSquare returns
```

#### "Blowing the Stack" — Stack Overflow

```javascript
function recurse() {
  recurse(); // no base case!
}
recurse(); // ❌ RangeError: Maximum call stack size exceeded
```

#### Why Blocking the Stack is Catastrophic (Philip Roberts)

While the Call Stack has code running, **the browser cannot do ANYTHING else**:
- ❌ Can't render UI updates
- ❌ Can't respond to user clicks
- ❌ Can't process network responses
- ❌ Can't run any callbacks

This is why a heavy synchronous loop freezes the entire page. The browser *wants* to repaint every ~16ms (60fps), but it can't do so until the stack is empty.

:::danger Don't Block the Event Loop
If your synchronous code takes 3 seconds to run, the page is completely frozen for 3 seconds — no scrolling, no clicking, no animations. This is the "Page Unresponsive" dialog you sometimes see.
:::

---

### 3. Web APIs — The Browser's Async Helpers

When you call an asynchronous function, V8 doesn't handle it — it **delegates** it to the browser's Web APIs. The browser runs it in a separate thread, and when the result is ready, it pushes the callback into one of the task queues.

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timer done');
}, 2000);

console.log('End');
```

**What happens step-by-step:**

1. `console.log('Start')` → pushed onto Call Stack, executes, popped. Output: `Start`
2. `setTimeout(cb, 2000)` → pushed onto Call Stack. V8 sees it's a Web API and **hands it off to the browser**. The stack frame is popped immediately.
3. `console.log('End')` → pushed onto Call Stack, executes, popped. Output: `End`
4. The browser counts 2000ms in the background. Meanwhile JS is free.
5. Timer expires → browser pushes the callback `() => console.log('Timer done')` into the **Macrotask Queue**.
6. The Event Loop sees the Call Stack is empty, picks up the callback, pushes it onto the stack. Output: `Timer done`

**Common Web APIs that delegate to the browser:**

| Web API | What it does in the background |
|---|---|
| `setTimeout` / `setInterval` | Browser manages a timer |
| `fetch` / `XMLHttpRequest` | Browser makes the network request |
| `addEventListener` | Browser listens for DOM events |
| `requestAnimationFrame` | Browser schedules before next repaint |
| `MutationObserver` | Browser watches for DOM changes |
| `Geolocation API` | Browser queries device location |

---

### 4. The Two Queues — What Goes Where?

This is the most critical section for interviews. There are **two separate queues** with different priority levels.

#### Microtask Queue (🔴 High Priority)

Microtasks are for things that need to happen **immediately** after the current operation, before *anything* else (including rendering).

| What goes here | Source |
|---|---|
| `.then()`, `.catch()`, `.finally()` callbacks | Promise reactions |
| Code after `await` (the continuation) | async/await (sugar for Promises) |
| `queueMicrotask(fn)` | Explicit microtask scheduling |
| `MutationObserver` callbacks | DOM mutation watching |

#### Macrotask Queue (🟡 Lower Priority)

Macrotasks are for scheduled work that can wait until the browser has had a chance to render and process microtasks.

| What goes here | Source |
|---|---|
| `setTimeout` / `setInterval` callbacks | Timer APIs |
| DOM event handlers (click, scroll, keypress) | User interaction |
| `MessageChannel` / `postMessage` | Cross-context messaging |
| I/O callbacks (Node.js) | File system, network |
| The initial `<script>` execution | Page load |

:::tip Key Mental Model (Lydia Hallie)
Think of it like a theme park ride. **Microtask passengers have a FastPass** — they always cut to the front of the line. The Event Loop will let *every single FastPass holder* (microtask) ride before letting the next regular ticket holder (macrotask) on.
:::

#### `async/await` — It's Just Promises Under the Hood

```javascript
async function foo() {
  console.log('A');       // Synchronous — runs on the call stack
  const result = await bar(); // Pauses here — everything BELOW becomes a microtask
  console.log('B');       // This is a microtask (like .then())
}
```

:::caution The Golden Rule of `await` — Two Phases
When the engine hits a line like `await someFunction()`, it happens in **two distinct phases**:

1. **Phase 1 (Synchronous):** The expression to the RIGHT of `await` is evaluated **immediately on the call stack**. `someFunction()` is called synchronously — it is NOT added to any queue.
2. **Phase 2 (Microtask):** After `someFunction()` returns a Promise, `await` **pauses** the current `async` function and puts everything BELOW the `await` line into the **microtask queue**. Execution jumps back to wherever `foo()` was called from.
:::

In other words, `await` is the dividing line:
- **Everything above `await`** (including the function call itself) = **synchronous**
- **Everything below `await`** = **microtask** (equivalent to `.then()`)

```javascript
// This async/await code:
async function foo() {
  console.log('A');
  const result = await bar();  // bar() is called SYNCHRONOUSLY (Phase 1)
  console.log('B');            // This becomes a microtask (Phase 2)
}

// ...is roughly equivalent to this Promise code:
function foo() {
  console.log('A');
  return bar().then((result) => {   // bar() called synchronously, .then() is microtask
    console.log('B');
  });
}
```

---

### 5. The Event Loop Algorithm (Step by Step)

From javascript.info, the complete algorithm (simplified from the HTML spec):

```
┌─────────────────────────────────────────────────┐
│                  EVENT LOOP                      │
│                                                  │
│  1. Pick the OLDEST macrotask from the queue     │
│     (e.g., <script>, setTimeout callback)        │
│     and execute it on the Call Stack              │
│                       │                          │
│                       ▼                          │
│  2. Execute ALL microtasks                       │
│     (drain the entire microtask queue)           │
│     ⚠️  If a microtask queues another            │
│        microtask, it runs in the same cycle!     │
│                       │                          │
│                       ▼                          │
│  3. Render (if needed)                           │
│     → Calculate styles                           │
│     → Layout                                     │
│     → Paint                                      │
│                       │                          │
│                       ▼                          │
│  4. If macrotask queue is empty → SLEEP          │
│     Wait for a new macrotask to appear.          │
│                       │                          │
│                       ▼                          │
│  5. Go to step 1                                 │
└─────────────────────────────────────────────────┘
```

#### The Critical Rules

1. **One macrotask at a time.** The event loop picks exactly ONE macrotask, executes it, then checks for microtasks.
2. **ALL microtasks between each macrotask.** The entire microtask queue is drained. If a microtask schedules another microtask, that runs too — before the next macrotask or render.
3. **Rendering happens between macrotasks.** The browser gets a chance to repaint after microtasks are done, before the next macrotask.

:::danger Microtask Starvation
If a microtask keeps queuing more microtasks in an infinite loop, the browser **never** reaches step 3 (render). The page freezes — even though you're using "async" code!

```javascript
// ❌ This freezes the browser!
function bad() {
  queueMicrotask(bad);
}
bad(); // Infinite microtask loop — render is starved
```
:::

---

### 6. Execution Order Puzzles (Interview-Ready)

#### Puzzle 1: The Classic Warmup

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```

<details>
<summary><strong>Answer (click to reveal)</strong></summary>

**Output:** `1, 4, 3, 2`

| Step | What happens | Queue state |
|---|---|---|
| 1 | `console.log('1')` → sync, runs immediately | — |
| 2 | `setTimeout(cb, 0)` → handed to Web API → macrotask queue | Macro: `[2]` |
| 3 | `Promise.resolve().then(cb)` → microtask queue | Macro: `[2]`, Micro: `[3]` |
| 4 | `console.log('4')` → sync, runs immediately | Macro: `[2]`, Micro: `[3]` |
| 5 | Stack empty → drain microtasks → `console.log('3')` | Macro: `[2]` |
| 6 | Microtask queue empty → pick next macrotask → `console.log('2')` | — |

</details>

#### Puzzle 2: Nested Promises and Timeouts

```javascript
console.log(1);

setTimeout(() => console.log(2));

Promise.resolve().then(() => console.log(3));

Promise.resolve().then(() => setTimeout(() => console.log(4)));

Promise.resolve().then(() => console.log(5));

setTimeout(() => console.log(6));

console.log(7);
```

<details>
<summary><strong>Answer (click to reveal)</strong></summary>

**Output:** `1, 7, 3, 5, 2, 6, 4`

**Walkthrough:**

**Phase 1 — Synchronous code:**
- `console.log(1)` → **1**
- `setTimeout(() => log(2))` → macrotask queue
- Three `Promise.resolve().then(...)` → microtask queue
- `setTimeout(() => log(6))` → macrotask queue
- `console.log(7)` → **7**

**Phase 2 — Drain microtask queue:**
- `console.log(3)` → **3**
- `setTimeout(() => log(4))` → *schedules a new macrotask* (goes to the END of the macrotask queue)
- `console.log(5)` → **5**

**Phase 3 — Macrotasks (one at a time):**
- `console.log(2)` → **2** *(check microtasks — empty)*
- `console.log(6)` → **6** *(check microtasks — empty)*
- `console.log(4)` → **4** *(this was scheduled LAST by the microtask)*

</details>

#### Puzzle 3: async/await vs. Promises

> ⚠️ **The trap:** Most people think `bar()` is asynchronous because it's after `await`. It's NOT — `bar()` is called **synchronously** (Phase 1). Only the code *below* `await` is deferred.

```javascript
async function foo() {
  console.log('foo start');    // SYNC — runs on the call stack
  await bar();                 // Phase 1: bar() called SYNCHRONOUSLY right now
                               // Phase 2: everything below becomes a MICROTASK
  console.log('foo end');      // ← MICROTASK — waits in the microtask queue!
}

async function bar() {
  console.log('bar');          // SYNC — bar() runs immediately when called
}

console.log('script start');   // SYNC
foo();                         // enters foo, runs until await yields
console.log('script end');     // SYNC — runs after await yields control back here
```

<details>
<summary><strong>Answer (click to reveal)</strong></summary>

**Output:** `script start, foo start, bar, script end, foo end`

**Step-by-step walkthrough:**

1. `console.log('script start')` → sync, runs on the call stack → **script start**
2. `foo()` is called → execution enters `foo`
3. `console.log('foo start')` → sync, runs immediately → **foo start**
4. `await bar()` is reached. **Phase 1 (Synchronous):** The engine evaluates `bar()` — it calls `bar` right now on the call stack
5. Inside `bar()`, `console.log('bar')` → sync, runs immediately → **bar**
6. `bar()` returns an (implicitly) resolved Promise. **Phase 2 (Microtask):** `await` sees the Promise, pauses `foo`, and puts the rest of `foo` (`console.log('foo end')`) into the **microtask queue**
7. Execution **jumps back** to where `foo()` was called from (the main script)
8. `console.log('script end')` → sync, runs immediately → **script end**
9. The Call Stack is now empty. The Event Loop drains the microtask queue.
10. `console.log('foo end')` → **foo end**

**The key takeaway:** `bar()` was never in any queue. It ran synchronously as part of evaluating the `await` expression. Only the *continuation* (code after `await`) became a microtask.

</details>

---

### 7. Practical Patterns

#### Splitting CPU-Heavy Tasks (javascript.info)

A synchronous loop that counts to 1 billion will freeze the page. Solution: split it into chunks using `setTimeout(fn, 0)` to yield to the browser between chunks.

```javascript
let i = 0;

function countChunk() {
  // Process 1 million at a time
  do {
    i++;
  } while (i % 1e6 !== 0);

  if (i < 1e9) {
    // Yield to the browser — allows rendering and event handling
    setTimeout(countChunk, 0);
  } else {
    console.log('Done!');
  }
}

countChunk();
```

**Why this works:** Each `setTimeout` creates a new macrotask. Between macrotasks, the browser can render (step 3 of the event loop algorithm) and process user events.

#### Progress Indication

A progress bar won't update inside a synchronous loop because the browser can't render until the stack is clear:

```javascript
// ❌ Progress bar stays at 0% until the loop finishes, then jumps to 100%
for (let i = 0; i < total; i++) {
  progressBar.style.width = (i / total * 100) + '%';
  doHeavyWork(i);
}
```

```javascript
// ✅ Splitting into macrotasks lets the browser repaint between chunks
function processChunk(i) {
  progressBar.style.width = (i / total * 100) + '%';
  doHeavyWork(i);
  
  if (i < total) {
    setTimeout(() => processChunk(i + 1), 0);
  }
}
processChunk(0);
```

#### `queueMicrotask` — Scheduling Without Yielding

Sometimes you want to defer execution but **don't** want to yield to the browser (no render step, no macrotask processing). `queueMicrotask` is perfect for this:

```javascript
// Ensures cleanup runs after current code but before anything else
queueMicrotask(() => {
  // This runs before the next render or macrotask
  cleanupTemporaryState();
});
```

#### `requestAnimationFrame` — The Render-Aligned API

`requestAnimationFrame` (rAF) is special — it's not in the macrotask or microtask queue. It runs **right before the browser paints** (step 3 of the event loop):

```javascript
function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 2;

  if (position < 500) {
    requestAnimationFrame(animate); // Synced to ~60fps
  }
}
requestAnimationFrame(animate);
```

:::tip When to Use What
- **Need to run ASAP, before render?** → `queueMicrotask()` or Promises
- **Need to run before next paint?** → `requestAnimationFrame()`
- **Need to yield to the browser (let it render and handle events)?** → `setTimeout(fn, 0)`
:::

---

### 8. Web Workers — True Parallelism

For truly heavy calculations that shouldn't block the event loop at all, the browser provides **Web Workers**. A worker runs in a completely separate thread with its own event loop.

- ✅ Own thread, own Call Stack, own Event Loop
- ✅ Useful for CPU-intensive calculations (image processing, data parsing)
- ❌ No access to the DOM
- ❌ Communication with main thread only via `postMessage` (serialized data)

```javascript
// main.js
const worker = new Worker('heavy-calc.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => console.log('Result:', e.data);

// heavy-calc.js
self.onmessage = (e) => {
  const result = crunchNumbers(e.data);
  self.postMessage(result); // Send back to main thread
};
```

---

## Key Takeaways

- JavaScript is **single-threaded** — the V8 engine only has a Call Stack and Memory Heap. Everything async comes from the **browser environment** (Web APIs).
- The Event Loop algorithm: **1 macrotask → ALL microtasks → render → repeat**.
- **Microtask queue has higher priority** than the macrotask queue. Microtasks are drained completely before the next macrotask.
- **Promise callbacks** (`.then`, `.catch`, `.finally`), **async/await continuations**, and `queueMicrotask()` go into the **microtask queue**.
- **setTimeout**, **setInterval**, **DOM events**, and **I/O callbacks** go into the **macrotask queue**.
- **Rendering can only happen between macrotasks**, after microtasks are drained. Blocking the stack = frozen UI.
- **Microtasks can starve rendering** — an infinite microtask loop is just as bad as a synchronous infinite loop.
- Use `setTimeout(fn, 0)` to yield to the browser; use `requestAnimationFrame` for animations; use `queueMicrotask` for immediate async without yielding.

## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — setTimeout is a macrotask; clearTimeout removes it before the event loop processes it
- 🏋️ [07-promise-all](http://localhost:3737/exercise/07-promise-all) — Promise callbacks use the microtask queue
