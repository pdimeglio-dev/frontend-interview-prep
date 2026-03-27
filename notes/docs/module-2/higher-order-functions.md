---
sidebar_position: 4
title: "Higher-Order Functions"
---

# Higher-Order Functions

## Summary

Functions that take other functions as arguments or return functions. `memoize` is a classic HOF: it takes a function and returns a new, enhanced version of it.

```javascript
// HOF that returns a function
function multiplier(factor) {
  return (x) => x * factor;
}
const double = multiplier(2);
double(5); // 10

// HOF that takes a function
[1,2,3].map(x => x * 2); // [2,4,6]
```

## Key Resources

- 📖 [MDN — First-class Functions](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)
- 📖 [javascript.info — Function Expressions](https://javascript.info/function-expressions)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — memoize takes a function, returns an enhanced version
- 🏋️ [06-curry](http://localhost:3737/exercise/06-curry) — curry takes a function, returns a curried version
