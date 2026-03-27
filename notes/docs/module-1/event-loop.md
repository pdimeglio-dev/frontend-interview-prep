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




## Key Takeaways




## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — setTimeout is a macrotask; clearTimeout removes it before the event loop processes it
- 🏋️ [07-promise-all](http://localhost:3737/exercise/07-promise-all) — Promise callbacks use the microtask queue
