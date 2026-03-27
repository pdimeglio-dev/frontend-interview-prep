---
sidebar_position: 5
title: "Fetch API & HTTP Basics"
---

# Fetch API & HTTP Basics

## Summary

`fetch(url)` returns a promise that resolves to a `Response` object. `response.ok` is `true` for 200-299. `response.json()` returns another promise. Fetch does *not* reject on 404/500 — only on network errors.

```javascript
const res = await fetch('/api/data');

if (!res.ok) {
  throw new Error(`HTTP ${res.status}`); // must check manually!
}

const data = await res.json(); // another async step
```

## Key Resources

- 📖 [MDN — Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- 📖 [javascript.info — Fetch](https://javascript.info/fetch)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [09-autocomplete](http://localhost:3737/exercise/09-autocomplete) — Fetches search results from an API
