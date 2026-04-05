---
sidebar_position: 7
title: "Custom Hooks"
---

# Custom Hooks

## Summary

A custom hook is **just a regular JavaScript function** whose name starts with `use`. There is no special syntax, no registration, no decorator — it's literally a function that calls other hooks. The `use` prefix is a naming convention that tells React "this function may use hooks inside it."

```typescript
// That's it. That's a custom hook.
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}
```

## Key Resources

- 📖 [React docs — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- 📖 [React docs — Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- 🎥 [Web Dev Simplified — Custom Hooks in React](https://www.youtube.com/watch?v=6ThXsUwLWvc)

## My Notes

### What is a Custom Hook?

A custom hook is a **plain function** that:
1. Starts with the word `use` (e.g., `useDebounce`, `useLocalStorage`, `useWindowSize`)
2. Can call other hooks inside it (`useState`, `useEffect`, `useRef`, or even other custom hooks)

That's the entire definition. There is **nothing magical** about the declaration:

```typescript
// A custom hook is just a function
function useMyHook() {
  // Can use built-in hooks
  const [value, setValue] = useState(0);
  
  // Can use effects
  useEffect(() => {
    console.log('value changed:', value);
  }, [value]);
  
  // Returns whatever you want
  return { value, setValue };
}
```

Compare this to a regular utility function:

```typescript
// Regular utility function
function add(a: number, b: number): number {
  return a + b;
}

// Custom hook — same structure, just uses hooks inside
function useCounter(initial: number): { count: number; increment: () => void } {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  return { count, increment };
}
```

The function signature, return type, generics — all standard TypeScript. The only difference is what happens *inside* (it calls hooks).

---

### Why the `use` Prefix Matters

The `use` prefix isn't just a convention — it serves two purposes:

1. **React's linter uses it** to verify you're following the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks). If a function starts with `use`, the linter checks that hooks inside it are called correctly (not in conditionals, loops, etc.)

2. **It signals to other developers** that this function has hook behavior — it must be called inside a React component or another custom hook, not in arbitrary JavaScript.

```typescript
// ❌ This will trigger linter warnings — hooks called inside non-hook function
function getDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value); // linter warning!
  // ...
}

// ✅ Naming it with 'use' prefix — linter is happy
function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value); // ✅
  // ...
}
```

---

### The Mental Model: Custom Hooks = Extract & Reuse

Think of custom hooks as **extracting a piece of component logic into a reusable function**. It's the same refactoring pattern you'd use with any code:

```jsx
// BEFORE: Logic inline in the component
function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  // ... rest of component uses debouncedQuery
}

// AFTER: Extract the debounce logic into a custom hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}

// Component is now clean and declarative
function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  // ... rest of component
}
```

This is identical to extracting a helper function in any language. The only rule is: if the extracted code uses hooks, name it `useSomething`.

---

### Each Call Gets Its Own State

A critical thing to understand: **each call to a custom hook gets its own independent state**. Hooks don't share state between components.

```jsx
function ComponentA() {
  const debouncedA = useDebounce(valueA, 300); // has its OWN useState internally
}

function ComponentB() {
  const debouncedB = useDebounce(valueB, 500); // has its OWN separate useState
}
```

`ComponentA`'s debounced value is completely independent from `ComponentB`'s. The custom hook is just a function — calling it twice is like calling any function twice. Each call creates its own local variables (and its own hook state).

---

### Anatomy of useDebounce

Let's break down the `useDebounce` hook to see how it's just composing two built-in hooks:

```typescript
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number): T {
  // 1. State to hold the debounced value
  //    Initialized with the current value (so it's correct on first render)
  const [debouncedValue, setDebouncedValue] = useState(value);

  // 2. Effect that runs whenever value or delay changes
  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value/delay changes before it fires
    // This is the "reset the elevator door" pattern from the debounce exercise
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  // 3. Return the debounced value
  return debouncedValue;
}
```

**What makes this work:**

| Concept | Role in useDebounce |
|---|---|
| `useState` | Holds the debounced value, triggers re-render when it updates |
| `useEffect` | Runs the timer logic whenever `value` or `delay` changes |
| Cleanup function | Cancels the previous timer (the "debounce reset") |
| Dependency array | `[value, delay]` — re-run effect when either changes |
| Generics (`<T>`) | Makes the hook work with any type (string, number, object...) |

The flow when a user types rapidly:
1. User types → `value` changes → component re-renders
2. `useEffect` cleanup runs (cancels the old timer)
3. New `useEffect` runs (starts a new timer)
4. If user keeps typing, steps 1-3 repeat (timer keeps resetting)
5. User stops typing → timer finally fires → `setDebouncedValue(value)` → component re-renders with debounced value

---

### Custom Hook vs Utility Function: When to Use Which

| Scenario | Use This | Why |
|---|---|---|
| Pure logic (no React state/effects) | Regular function | `function debounce(fn, delay)` — no hooks needed |
| Needs `useState`, `useEffect`, `useRef`, etc. | Custom hook | `function useDebounce(value, delay)` — uses hooks internally |
| Needs to trigger re-renders | Custom hook | Only hooks can call `setState` to trigger renders |
| Stateless transformation | Regular function | `function formatDate(d)` — pure computation |

The `01-debounce` exercise is a **utility function** — it takes a function and returns a debounced function. Pure JavaScript, no React.

The `01c-use-debounce` exercise is a **custom hook** — it takes a value and returns a debounced value, using `useState` and `useEffect` internally. React-specific.

Both solve the same conceptual problem (debouncing), but the hook version integrates with React's rendering cycle.

---

### Rules of Hooks (Apply to Custom Hooks Too)

Since custom hooks call other hooks, the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) apply:

1. **Only call hooks at the top level** — not inside conditions, loops, or nested functions
2. **Only call hooks from React functions** — components or other custom hooks

```typescript
// ❌ WRONG: hook inside a condition
function useDebounce<T>(value: T, delay: number): T {
  if (delay === 0) {
    return value; // early return BEFORE hooks — violates Rules of Hooks!
  }
  const [debounced, setDebounced] = useState(value); // hooks must be called unconditionally
  // ...
}

// ✅ CORRECT: hooks always called, condition inside
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]); // delay=0 still works — setTimeout with 0ms fires immediately

  return debounced;
}
```

---

## Key Takeaways

- A custom hook is **just a function** that starts with `use` and calls other hooks inside — no magic, no special syntax
- The `use` prefix is a **naming convention** that enables linting and signals hook behavior to developers
- Custom hooks are the React way to **extract and reuse stateful logic** between components
- Each call to a custom hook gets **its own independent state** — hooks don't share state
- All [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) apply: call hooks at the top level, unconditionally
- `useDebounce` is a textbook custom hook: it composes `useState` + `useEffect` to create reusable debounce-a-value logic

## Related Exercises

- 🏋️ [01c-use-debounce](http://localhost:3737/exercise/01c-use-debounce) — Implement the `useDebounce` custom hook
- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — The utility function version (plain JS, no React)
