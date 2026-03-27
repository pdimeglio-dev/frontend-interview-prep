---
sidebar_position: 3
title: setTimeout & clearTimeout
---

# setTimeout & clearTimeout

## Summary

`setTimeout` schedules a callback to run after a delay (in ms). `clearTimeout` cancels a pending timer before it fires. These are Web APIs, not part of the JS engine itself.

```javascript
const id = setTimeout(() => console.log('fired!'), 1000);
clearTimeout(id); // cancelled — callback never fires
```

## Key Resources

- 📖 [MDN — setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- 📖 [javascript.info — Scheduling](https://javascript.info/settimeout-setinterval)

## My Notes




## Key Takeaways




## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Uses setTimeout/clearTimeout to defer execution
