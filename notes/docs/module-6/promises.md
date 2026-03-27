---
sidebar_position: 1
title: "Promises"
---

# Promises

## Summary

An object representing the eventual completion (or failure) of an async operation. A Promise is in one of three states: `pending`, `fulfilled`, or `rejected`. Chained with `.then()`, `.catch()`, and `.finally()`.

```javascript
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('done!'), 1000);
});

p.then(val => console.log(val))  // 'done!' after 1s
 .catch(err => console.error(err))
 .finally(() => console.log('always runs'));
```

## Key Resources

- 📖 [javascript.info — Promises](https://javascript.info/promise-basics)
- 📖 [MDN — Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- 🎥 [Web Dev Simplified — Promises in 10 Minutes](https://www.youtube.com/watch?v=DHvZLI7Db8E)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [07-promise-all](http://localhost:3737/exercise/07-promise-all) — Implements Promise.all from scratch
