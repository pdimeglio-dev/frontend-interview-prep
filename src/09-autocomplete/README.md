# Autocomplete

> **Module 8** · BFE.dev: [Autocomplete UI](https://bigfrontend.dev/problem) · [GreatFrontEnd Autocomplete](https://www.greatfrontend.com/questions/user-interface/autocomplete)

## Problem

Build an `AutoComplete` React component that fetches and displays suggestions as the user types, with debouncing and race condition protection.

## Requirements

1. Render a text input that the user types into
2. Debounce the input — only fetch after the user stops typing for 300ms
3. Display results in a dropdown list below the input
4. Handle race conditions: if a newer request is fired, ignore stale responses
5. Clear results when the input is empty
6. Accept a `fetchResults(query)` prop that returns `Promise<{id: string, name: string}[]>`

## Examples

```tsx
<AutoComplete fetchResults={async (q) => {
  const res = await fetch(`/api/search?q=${q}`);
  return res.json();
}} />
```

## Constraints

- Implement your own debouncing (don't import from lodash)
- Handle race conditions (stale closure or AbortController pattern)
- Your implementation should pass all tests in `AutoComplete.test.tsx`
