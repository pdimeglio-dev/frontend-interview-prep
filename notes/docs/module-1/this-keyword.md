---
sidebar_position: 2
title: this & apply/call/bind
---

# The `this` Keyword & `apply()` / `call()` / `bind()`

## Summary

In JavaScript, `this` is determined by *how* a function is called, not where it's defined. `apply()` lets you invoke a function while explicitly setting `this` and passing arguments as an array.

| Method | Syntax | Invokes immediately? |
|--------|--------|---------------------|
| `call` | `fn.call(thisArg, a, b)` | ✅ Yes |
| `apply` | `fn.apply(thisArg, [a, b])` | ✅ Yes |
| `bind` | `fn.bind(thisArg, a)` | ❌ Returns new function |

## Key Resources

- 📖 [MDN — this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- 📖 [MDN — Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- 🎥 [Web Dev Simplified — this in 8 Minutes](https://www.youtube.com/watch?v=YOlr79NaAtQ)

## My Notes

<!-- 
  - How does `this` behave differently in arrow functions vs regular functions?
  - What is `this` inside a class method?
  - Why does debounce use `apply(this, args)`?
-->



## Key Takeaways

<!-- 
  - 
  - 
  - 
-->



## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Uses `apply(this, args)` to maintain the caller's context
