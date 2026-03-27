# Infinite Scroll

> **Module 8** · Related: [GreatFrontEnd System Design — News Feed](https://www.greatfrontend.com/system-design)

## Problem

Build an `InfiniteFeed` React component that loads more data as the user scrolls to the bottom, using `IntersectionObserver`.

## Requirements

1. Render a list of items from the `items` state
2. Place a "sentinel" element at the bottom of the list
3. Use `IntersectionObserver` to detect when the sentinel is visible
4. When visible, increment the page and fetch the next batch via `fetchPage(page)`
5. Append new data to existing items (don't replace)
6. Stop fetching when `fetchPage` returns an empty array
7. Show a loading indicator while fetching
8. Prevent duplicate fetches while one is in-flight

## Examples

```tsx
<InfiniteFeed fetchPage={async (page) => {
  const res = await fetch(`/api/items?page=${page}&limit=20`);
  return res.json();
}} />
```

## Constraints

- Use `IntersectionObserver`, not scroll event listeners
- Use functional state updates `setState(prev => [...prev, ...new])`
- Wrap the observer callback in `useCallback`
- Your implementation should pass all tests in `InfiniteFeed.test.tsx`
