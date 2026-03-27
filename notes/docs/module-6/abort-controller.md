---
sidebar_position: 6
title: "AbortController & AbortSignal"
---

# AbortController & AbortSignal

## Summary

`AbortController` creates a signal that can be passed to `fetch`. Calling `controller.abort()` cancels the request. Essential in React to cancel stale requests when a component unmounts or dependencies change.

```javascript
const controller = new AbortController();

fetch(url, { signal: controller.signal })
  .then(res => res.json())
  .catch(err => {
    if (err.name === 'AbortError') return; // intentional
    throw err;
  });

// Cancel the request
controller.abort();
```

## Key Resources

- 📖 [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- 🎥 [Web Dev Simplified — AbortController](https://www.youtube.com/watch?v=4mPkigmVsHs)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [09-autocomplete](http://localhost:3737/exercise/09-autocomplete) — Cancel stale search requests
- 🏋️ [10-infinite-scroll](http://localhost:3737/exercise/10-infinite-scroll) — Cancel pending page fetches on unmount
