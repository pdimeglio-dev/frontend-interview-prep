---
sidebar_position: 4
title: "DOM Event Bubbling & Capturing"
---

# DOM Event Bubbling & Capturing

## Summary

When a DOM event fires, it first travels *down* from `document` to the target (capturing phase), then *up* from the target back to `document` (bubbling phase). Most listeners fire during the bubbling phase by default.

```javascript
// Bubbling (default): child → parent → document
parent.addEventListener('click', handler);

// Capturing: document → parent → child
parent.addEventListener('click', handler, { capture: true });

// event.target = actual clicked element
// event.currentTarget = element listener is on
```

## Key Resources

- 📖 [javascript.info — Bubbling and Capturing](https://javascript.info/bubbling-and-capturing)
- 🎥 [Web Dev Simplified — Event Bubbling & Capturing](https://www.youtube.com/watch?v=XF1_MlZ5l6M)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [03-event-emitter](http://localhost:3737/exercise/03-event-emitter) — Understanding native DOM events helps contextualize custom event systems
