---
sidebar_position: 4
title: "Pagination: Offset vs Cursor-based"
---

# Pagination: Offset vs Cursor-based

## Summary

**Offset-based** (`?page=2&limit=20`) is simple but breaks when items are added/deleted between requests. **Cursor-based** (`?after=abc123&limit=20`) uses a pointer to the last item, providing stable pagination.

## Key Resources

- 📖 [Slack Engineering — Evolving API Pagination](https://slack.engineering/evolving-api-pagination-at-slack/)
- 📖 [Apollo GraphQL — Cursor-based Pagination](https://www.apollographql.com/docs/react/pagination/cursor-based)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [10-infinite-scroll](http://localhost:3737/exercise/10-infinite-scroll) — Manages paginated data loading
