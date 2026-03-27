---
sidebar_position: 3
title: "Referential Equality (===)"
---

# Referential Equality (===)

## Summary

Primitives are compared by value, but objects/arrays are compared by memory reference. `{a:1} === {a:1}` is `false` because they're two different objects in memory. This is why memoize needs a "resolver" to generate string keys.

```javascript
// Primitives: compared by value
'hello' === 'hello' // true
42 === 42           // true

// Objects: compared by reference
{a:1} === {a:1}     // false (different objects!)
const x = {a:1};
const y = x;
x === y             // true (same reference)
```

## Key Resources

- 📖 [javascript.info — Object References](https://javascript.info/object-copy#comparison-by-reference)
- 🎥 [Web Dev Simplified — Reference vs Value](https://www.youtube.com/watch?v=-hBJz2PPIVE)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — Resolver function needed to stringify complex arguments
