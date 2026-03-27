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

## My Notes

<!-- 
  Write your own notes here as you study closures.
  Some prompts to get you started:
  - What is the "lexical environment"?
  - How does the garbage collector interact with closures?
  - When have you seen closures cause bugs?
-->



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
