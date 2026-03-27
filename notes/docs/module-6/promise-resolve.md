---
sidebar_position: 2
title: "Promise.resolve() & Wrapping Values"
---

# Promise.resolve() & Wrapping Values

## Summary

`Promise.resolve(value)` wraps any value in a resolved promise. Crucial in `Promise.all` because the input array may contain non-promise values that need to be handled uniformly.

```javascript
Promise.resolve(42).then(v => console.log(v)); // 42
Promise.resolve('hello').then(v => console.log(v)); // 'hello'

// In Promise.all — wraps non-promises:
Promise.resolve(maybePromise).then(value => { ... });
```

## Key Resources

- 📖 [MDN — Promise.resolve()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [07-promise-all](http://localhost:3737/exercise/07-promise-all) — Uses Promise.resolve() to handle mixed inputs
