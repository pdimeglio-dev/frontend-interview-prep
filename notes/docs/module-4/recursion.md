---
sidebar_position: 3
title: "Recursion & The Call Stack"
---

# Recursion & The Call Stack

## Summary

A recursive function calls itself with a smaller sub-problem until hitting a base case. Each call adds a frame to the Call Stack. Deeply nested structures can cause "Maximum call stack size exceeded" errors.

```javascript
function factorial(n) {
  if (n <= 1) return 1;    // base case
  return n * factorial(n - 1); // recursive case
}
// Call stack: factorial(4) → factorial(3) → factorial(2) → factorial(1)
```

## Key Resources

- 📖 [javascript.info — Recursion](https://javascript.info/recursion)
- 🎥 [Fireship — Recursion in 100 Seconds](https://www.youtube.com/watch?v=rf60MejMz3E)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [04-deep-clone](http://localhost:3737/exercise/04-deep-clone) — Recursively walks nested objects/arrays
