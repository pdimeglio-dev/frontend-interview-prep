---
sidebar_position: 4
title: "async/await Syntax"
---

# async/await Syntax

## Summary

Syntactic sugar for promise chains. `async` functions always return a promise. `await` pauses execution until a promise settles, making async code read like synchronous code.

```javascript
// Promise chain
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data));

// Same with async/await
async function getData() {
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
}
```

## Key Resources

- 📖 [javascript.info — Async/Await](https://javascript.info/async-await)
- 🎥 [Fireship — Async/Await in 100 Seconds](https://www.youtube.com/watch?v=vn3tm0quoqE)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [07-promise-all](http://localhost:3737/exercise/07-promise-all) — Understanding async patterns is fundamental
