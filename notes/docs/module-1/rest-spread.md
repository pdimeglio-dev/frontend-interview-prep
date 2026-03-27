---
sidebar_position: 5
title: Rest Parameters & Spread
---

# Rest Parameters & Spread Syntax

## Summary

Rest parameters (`...args`) collect all arguments into an array. Spread expands an array into individual arguments. Used in debounce to forward any arguments the original function expects.

```javascript
// Rest: collect into array
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
sum(1, 2, 3); // 6

// Spread: expand array into args
const arr = [1, 2, 3];
Math.max(...arr); // 3
```

## Key Resources

- 📖 [MDN — Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- 📖 [MDN — Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

## My Notes




## Key Takeaways




## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — `(...args)` captures and forwards caller's arguments
- 🏋️ [06-curry](http://localhost:3737/exercise/06-curry) — Spread is used to accumulate and forward arguments across calls
