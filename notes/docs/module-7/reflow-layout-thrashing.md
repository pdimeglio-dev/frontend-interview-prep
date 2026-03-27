---
sidebar_position: 2
title: "Reflow & Layout Thrashing"
---

# Reflow & Layout Thrashing

## Summary

A "reflow" recalculates the geometry of elements. Reading a layout property (like `offsetHeight`) right after writing one forces synchronous reflow. Doing this in a loop is "layout thrashing."

## Key Resources

- 📖 [web.dev — Avoid Large, Complex Layouts](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)
- 📖 [Paul Irish — What Forces Layout/Reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [08-virtual-list](http://localhost:3737/exercise/08-virtual-list) — Avoids thrashing by only rendering visible items
