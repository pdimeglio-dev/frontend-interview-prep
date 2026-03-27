---
sidebar_position: 4
title: "The arguments Object"
---

# The arguments Object

## Summary

A legacy array-like object available in non-arrow functions that contains all passed arguments. Unlike rest parameters, it's not a real array. Used in `reduce` to detect whether an initial value was actually provided.

```javascript
function example() {
  console.log(arguments.length); // how many args passed
  console.log(arguments[0]);     // first arg
  // arguments is NOT an array — no .map(), .filter(), etc.
}

// Why it matters for reduce:
Array.prototype.myReduce = function(cb, initialValue) {
  // arguments.length >= 2 means initialValue was provided
  // Even if initialValue === undefined!
};
```

## Key Resources

- 📖 [MDN — arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [05-reduce](http://localhost:3737/exercise/05-reduce) — Uses arguments.length to detect if initialValue was provided
