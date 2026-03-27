---
sidebar_position: 3
title: "Microtask vs Macrotask Queue"
---

# Microtask vs Macrotask Queue

## Summary

Promise callbacks (`.then`, `.catch`) are queued as *microtasks*, which execute before macrotasks (`setTimeout`). This means promise resolution always happens before the next timer callback.

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);   // macrotask
Promise.resolve().then(() => console.log('3')); // microtask
console.log('4');

// Output: 1, 4, 3, 2
// Microtask (3) runs before macrotask (2)!
```

## Key Resources

- 📖 [javascript.info — Microtasks](https://javascript.info/microtask-queue)
- 🎥 [Lydia Hallie — Promises & Async/Await Visualized](https://www.youtube.com/watch?v=Xs1EMmBLpn4)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [07-promise-all](http://localhost:3737/exercise/07-promise-all) — Promise resolution order matters for correctness
