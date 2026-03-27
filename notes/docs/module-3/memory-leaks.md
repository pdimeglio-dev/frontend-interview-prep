---
sidebar_position: 5
title: "Memory Leaks from Event Listeners"
---

# Memory Leaks from Event Listeners

## Summary

Every `addEventListener` call creates a reference. If you don't `removeEventListener` on cleanup (or component unmount), those listeners persist, holding references to DOM nodes and closures that can't be garbage collected.

## Key Resources

- 📖 [web.dev — Memory Leaks](https://web.dev/articles/fix-memory-problems)
- 🎥 [Jack Herrington — React Memory Leaks](https://www.youtube.com/watch?v=ZKJh7mDBVS8)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [03-event-emitter](http://localhost:3737/exercise/03-event-emitter) — The release() method prevents dangling references
