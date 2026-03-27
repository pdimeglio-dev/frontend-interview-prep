---
sidebar_position: 5
title: "WeakMap for Circular References"
---

# WeakMap for Circular References

## Summary

A `WeakMap` maps objects to values but holds "weak" references. In deep clone, it tracks already-visited objects to break infinite loops caused by circular references.

```javascript
// Circular reference problem
const obj = { a: 1 };
obj.self = obj; // obj → obj → obj → ...

// Solution: track visited objects
function deepClone(value, seen = new WeakMap()) {
  if (seen.has(value)) return seen.get(value); // break cycle!
  const clone = {};
  seen.set(value, clone);
  // ... recurse
}
```

## Key Resources

- 📖 [MDN — WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- 📖 [javascript.info — WeakMap and WeakSet](https://javascript.info/weakmap-weakset)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [04-deep-clone](http://localhost:3737/exercise/04-deep-clone) — Uses WeakMap to handle circular references
