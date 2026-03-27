---
sidebar_position: 2
title: "Race Conditions & Stale Closures"
---

# Race Conditions & Stale Closures

## Summary

If a user types "ab", then "abc" quickly, two fetches fire. If "ab"'s response arrives *after* "abc"'s, the UI shows wrong results. The `isMounted` flag pattern or `AbortController` prevents stale responses.

## Key Resources

- 📖 [React docs — Fetching Data in Effects](https://react.dev/learn/synchronizing-with-effects#fetching-data)
- 🎥 [Jack Herrington — Race Conditions in React](https://www.youtube.com/watch?v=T8TpiGp4xm0)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [09-autocomplete](http://localhost:3737/exercise/09-autocomplete) — Uses isMounted flag to ignore stale responses
