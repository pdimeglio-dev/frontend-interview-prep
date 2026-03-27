---
sidebar_position: 2
title: "Shallow Copy vs Deep Copy"
---

# Shallow Copy vs Deep Copy

## Summary

A shallow copy (`Object.assign`, spread `{...obj}`) duplicates only the top level — nested objects are still shared references. A deep copy recursively duplicates every nested level so the clone is completely independent.

```javascript
const original = { a: 1, nested: { b: 2 } };

// Shallow: nested is shared
const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b); // 99 — mutated!

// Deep: fully independent
const deep = deepClone(original);
deep.nested.b = 99;
console.log(original.nested.b); // 2 — safe!
```

## Key Resources

- 📖 [MDN — Shallow Copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy)
- 📖 [MDN — Deep Copy](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [04-deep-clone](http://localhost:3737/exercise/04-deep-clone) — Implements recursive deep copy
