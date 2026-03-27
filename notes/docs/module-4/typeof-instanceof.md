---
sidebar_position: 4
title: "typeof & instanceof"
---

# typeof & instanceof

## Summary

`typeof` returns a string identifying a primitive's type (but returns `"object"` for both objects and `null`). `instanceof` checks if an object's prototype chain includes a specific constructor.

```javascript
typeof 42          // "number"
typeof "hello"     // "string"
typeof null        // "object" (historical bug!)
typeof {}          // "object"
typeof []          // "object"

[] instanceof Array     // true
new Date() instanceof Date // true
```

## Key Resources

- 📖 [MDN — typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- 📖 [MDN — instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [04-deep-clone](http://localhost:3737/exercise/04-deep-clone) — Uses typeof/instanceof to handle Date, RegExp, Array separately
