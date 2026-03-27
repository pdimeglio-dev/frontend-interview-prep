---
sidebar_position: 6
title: "React useEffect & Cleanup"
---

# React useEffect & Cleanup

## Summary

`useEffect` runs side effects after render. Its return function is the "cleanup" — called before the effect re-runs or when the component unmounts. Critical for clearing timers to prevent memory leaks.

```javascript
useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id); // cleanup!
}, []);
```

## Key Resources

- 📖 [React docs — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- 🎥 [Jack Herrington — Mastering useEffect](https://www.youtube.com/watch?v=dH6i3GurZW8)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Must clean up timeouts in useEffect return to avoid memory leaks
