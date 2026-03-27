---
sidebar_position: 6
title: "Functional State Updates"
---

# Functional State Updates

## Summary

When appending data (like new pages), use `setState(prev => [...prev, ...newData])` to safely access the previous state. This avoids stale closure bugs where the callback captures an outdated snapshot.

```javascript
// ❌ Stale closure bug:
setItems([...items, ...newData]); // items might be outdated!

// ✅ Functional update:
setItems(prev => [...prev, ...newData]); // always gets latest
```

## Key Resources

- 📖 [React docs — Updating state based on previous state](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [10-infinite-scroll](http://localhost:3737/exercise/10-infinite-scroll) — Appends new page data using functional setState
