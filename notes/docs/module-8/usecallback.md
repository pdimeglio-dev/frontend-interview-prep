---
sidebar_position: 5
title: "useCallback & Stable References"
---

# useCallback & Stable References

## Summary

`useCallback(fn, deps)` returns a memoized version of the callback that only changes when dependencies change. Without it, functions recreated every render cause `useEffect` to re-run unnecessarily.

```javascript
// Without useCallback: new function every render
const handler = (entries) => { ... };

// With useCallback: stable reference
const handler = useCallback((entries) => {
  if (entries[0].isIntersecting && !isLoading) {
    setPage(p => p + 1);
  }
}, [isLoading]); // only changes when isLoading changes
```

## Key Resources

- 📖 [React docs — useCallback](https://react.dev/reference/react/useCallback)
- 🎥 [Jack Herrington — useMemo & useCallback](https://www.youtube.com/watch?v=MxIPQZ64x0I)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [10-infinite-scroll](http://localhost:3737/exercise/10-infinite-scroll) — useCallback stabilizes the IntersectionObserver handler
