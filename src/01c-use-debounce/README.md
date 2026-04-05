# useDebounce Hook

> **Module 1** · Custom React Hook

## Problem

Implement a `useDebounce` custom hook that takes a rapidly-changing value and returns a debounced version that only updates after a specified delay of inactivity.

This is the React-idiomatic version of the debounce utility you already built — instead of debouncing a *function call*, you're debouncing a *value update*.

## Prerequisites

Make sure you've completed the debounce exercises first:
→ [01-debounce](/exercise/01-debounce)
→ [01b-debounce-leading-trailing](/exercise/01b-debounce-leading-trailing)

## Requirements

1. Accept a `value` of any type and a `delay` in milliseconds
2. Return the debounced value — initially the same as the input value
3. Only update the returned value after `delay` ms of the input value not changing
4. Reset the internal timer whenever the input value changes (like the elevator door)
5. Clean up the timeout on unmount to prevent memory leaks / state updates on unmounted components
6. If `delay` is `0`, return the value immediately (no debounce)

## Signature

```ts
function useDebounce<T>(value: T, delay: number): T
```

## Examples

```tsx
function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

- User types `"r"`, `"re"`, `"rea"`, `"reac"`, `"react"` rapidly
- `debouncedQuery` stays `""` during typing
- 300ms after the last keystroke, `debouncedQuery` becomes `"react"`
- The `useEffect` fires once, fetching results for `"react"`

## Constraints

- Use `useState` and `useEffect` from React
- You may NOT import your previous debounce utility — implement the logic inside the hook
- Clean up timeouts properly (return a cleanup function from `useEffect`)
