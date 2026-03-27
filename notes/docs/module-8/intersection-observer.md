---
sidebar_position: 3
title: "IntersectionObserver API"
---

# IntersectionObserver API

## Summary

A browser API that asynchronously detects when an element enters or exits the viewport. Far more performant than scroll event listeners. A "sentinel" element at the bottom triggers the next page fetch.

```javascript
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadNextPage(); // sentinel is visible!
  }
});
observer.observe(sentinelElement);
```

## Key Resources

- 📖 [MDN — IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- 🎥 [Web Dev Simplified — Intersection Observer in 15 Minutes](https://www.youtube.com/watch?v=2IbRtjez6ag)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [10-infinite-scroll](http://localhost:3737/exercise/10-infinite-scroll) — Uses IntersectionObserver to trigger page loads
