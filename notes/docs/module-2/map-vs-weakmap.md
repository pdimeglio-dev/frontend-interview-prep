---
sidebar_position: 2
title: "Map vs WeakMap vs Objects"
---

# Map vs WeakMap vs Objects

## Summary

Plain objects coerce keys to strings. `Map` preserves key types and insertion order. `WeakMap` only accepts object keys and allows garbage collection when references are lost — ideal for caches that shouldn't prevent cleanup.

```javascript
// Object: keys become strings
const obj = {}; obj[{a:1}] = 'val'; // key is "[object Object]"

// Map: preserves key types
const map = new Map(); map.set({a:1}, 'val'); // object as key

// WeakMap: allows GC of keys
const wm = new WeakMap();
let key = {a:1}; wm.set(key, 'val');
key = null; // value can now be garbage collected
```

## Key Resources

- 📖 [MDN — Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- 📖 [MDN — WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- 🎥 [Web Dev Simplified — Map vs Object](https://www.youtube.com/watch?v=hubQQ3F337A)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — Uses Map for the memoization cache
