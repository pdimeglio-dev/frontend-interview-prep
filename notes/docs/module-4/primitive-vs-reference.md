---
sidebar_position: 1
title: "Primitive vs Reference Types"
---

# Primitive vs Reference Types

## Summary

Primitives (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) are stored directly in the variable. Objects, arrays, and functions are stored as a *reference* (pointer) to a location in memory.

```javascript
// Primitive: copied by value
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 (unchanged)

// Reference: copied by reference (pointer)
let obj1 = { x: 1 };
let obj2 = obj1;
obj2.x = 99;
console.log(obj1.x); // 99 (mutated!)
```

## Key Resources

- 📖 [javascript.info — Object References and Copying](https://javascript.info/object-copy)
- 🎥 [Web Dev Simplified — Reference vs Value](https://www.youtube.com/watch?v=-hBJz2PPIVE)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [04-deep-clone](http://localhost:3737/exercise/04-deep-clone) — Deep clone creates independent copies of reference types
