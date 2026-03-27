---
sidebar_position: 6
title: "Partial Application & Currying"
---

# Partial Application & Currying

## Summary

Partial application fixes some arguments of a function, producing a new function that takes the rest. Currying is a special case where each call takes exactly one argument. The accumulated arguments are stored via closures.

```javascript
// Curried function
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);    // 6
add(1, 2)(3);    // 6
add(1)(2, 3);    // 6
```

## Key Resources

- 📖 [javascript.info — Currying](https://javascript.info/currying-partials)
- 🎥 [Fun Fun Function — Currying](https://www.youtube.com/watch?v=iZLP4qOwY8I)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [06-curry](http://localhost:3737/exercise/06-curry) — Implements curry with closure-based argument accumulation
