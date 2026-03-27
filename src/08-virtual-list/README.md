# Virtual List

> **Module 7** · Related: [react-window](https://github.com/bvaughn/react-window) · [GreatFrontEnd System Design](https://www.greatfrontend.com/system-design)

## Problem

Build a `VirtualList` React component that efficiently renders a large list by only rendering the items currently visible in the viewport (plus a small buffer).

## Requirements

1. Accept props: `items` (data array), `itemHeight` (fixed px height), `windowHeight` (viewport height)
2. Only render the items visible within the scroll viewport + a buffer of 2 items above/below
3. Use a container div with `overflow: auto` and a tall inner div to create a scrollbar
4. Position each visible item using `position: absolute` and calculated `top` offsets
5. Update visible items on scroll

## Examples

```tsx
<VirtualList
  items={Array.from({ length: 10000 }, (_, i) => `Item ${i}`)}
  itemHeight={40}
  windowHeight={400}
/>
// Only renders ~12 items at a time instead of 10,000
```

## Constraints

- Do NOT use react-window, react-virtualized, or any virtualization library
- Your implementation should pass all tests in `VirtualList.test.tsx`
- Bonus: create a Storybook story in `VirtualList.stories.tsx`
