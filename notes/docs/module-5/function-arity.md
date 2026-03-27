---
sidebar_position: 5
title: "Function Arity (fn.length)"
---

# Function Arity (fn.length)

## Summary

`fn.length` returns the number of formal parameters a function expects (excluding rest params and those with defaults). Currying uses this to know *when* enough arguments have been collected to invoke the original function.

```javascript
function add(a, b, c) {}
add.length; // 3

function withDefault(a, b = 0) {}
withDefault.length; // 1 (b has default, not counted)

function withRest(a, ...rest) {}
withRest.length; // 1 (rest not counted)
```

## Key Resources

- 📖 [MDN — Function.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [06-curry](http://localhost:3737/exercise/06-curry) — Compares args.length against fn.length to decide when to invoke
