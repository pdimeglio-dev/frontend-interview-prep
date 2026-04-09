# usePrevious Hook

> **Module 2** · Custom React Hook

## Problem

Implement a `usePrevious` custom hook that returns the **previous value** of a given variable. On the first render, it should return `undefined` (there is no previous value yet).

This is the React companion to the memoize exercise — both rely on **persisting data across renders**. Memoize uses a `Map` cache via closure; `usePrevious` uses `useRef` to silently store the old value.

> **🔗 GreatFrontEnd:** [usePrevious](https://www.greatfrontend.com/questions/react/use-previous)

## Prerequisites

Make sure you understand these concepts from Module 2:
→ [useRef vs useState notes](/docs/module-2/useref-vs-usestate) — why `useRef` doesn't trigger re-renders
→ [02-memoize](/exercise/02-memoize) — closure-based caching (same persistence idea)

## Requirements

1. Accept a `value` of any type
2. Return `undefined` on the first render (no previous value exists)
3. After each render, return what the value was **before** the most recent change
4. Do NOT trigger extra re-renders — use `useRef`, not `useState`
5. Update the stored value **after** render (in a `useEffect`), so the returned value is always "one render behind"

## Signature

```ts
function usePrevious<T>(value: T): T | undefined
```

## Examples

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

- Initial render: `count = 0`, `prevCount = undefined`
- After first click: `count = 1`, `prevCount = 0`
- After second click: `count = 2`, `prevCount = 1`

## Why useRef and not useState?

If you used `useState` to store the previous value, updating it would trigger **another re-render**, which would update it again → infinite loop! `useRef` updates silently without causing re-renders.

## Key Insight: Effect Timing

The trick is that `useEffect` runs **after** the render is committed to the screen:

1. React renders with the **new** value
2. Component returns `ref.current` (still the **old** value) ← this is what the caller sees
3. `useEffect` fires and updates `ref.current` to the **new** value
4. Next render, step 2 will return what is now the **previous** value

## Constraints

- Use `useRef` and `useEffect` from React
- Do NOT use `useState` for storing the previous value
- The hook should work with any value type (numbers, strings, objects, etc.)
