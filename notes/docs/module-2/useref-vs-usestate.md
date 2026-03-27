---
sidebar_position: 5
title: "useRef vs useState"
---

# useRef vs useState

## Summary

`useState` triggers a re-render when updated. `useRef` holds a mutable `.current` value that persists across renders *without* causing re-renders. This makes `useRef` perfect for storing the "previous" value silently.

```javascript
// useState: triggers re-render
const [count, setCount] = useState(0);
setCount(1); // → re-render!

// useRef: no re-render
const ref = useRef(0);
ref.current = 1; // → no re-render, value persists
```

## Key Resources

- 📖 [React docs — useRef](https://react.dev/reference/react/useRef)
- 📖 [React docs — useState](https://react.dev/reference/react/useState)
- 🎥 [Web Dev Simplified — useRef in 11 Minutes](https://www.youtube.com/watch?v=t2ypzz6gJm0)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [08-virtual-list](http://localhost:3737/exercise/08-virtual-list) — useRef can hold scroll position without triggering re-renders
