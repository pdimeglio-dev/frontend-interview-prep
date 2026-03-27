---
sidebar_position: 2
title: "The Accumulator Pattern"
---

# The Accumulator Pattern

## Summary

A loop that carries forward a running result. `reduce` formalizes this: on each iteration, the callback receives the accumulated value so far plus the current element, and returns the new accumulated value.

```javascript
// Manual accumulator
let sum = 0;
for (const n of [1,2,3]) sum += n; // sum = 6

// reduce formalizes the pattern
[1,2,3].reduce((acc, n) => acc + n, 0); // 6
```

## Key Resources

- 📖 [MDN — Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- 🎥 [Web Dev Simplified — Reduce in 10 Minutes](https://www.youtube.com/watch?v=s1XVfm5mIuU)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [05-reduce](http://localhost:3737/exercise/05-reduce) — Implements the accumulator pattern from scratch
