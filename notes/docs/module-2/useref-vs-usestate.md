---
sidebar_position: 5
title: "useRef vs useState"
---

# useRef vs useState

## Summary

`useState` triggers a re-render when updated. `useRef` holds a mutable `.current` value that persists across renders *without* causing re-renders. This makes `useRef` perfect for storing the "previous" value silently.

```javascript
// useState: triggers re-render
const [count, setCount] = useState(0);
setCount(1); // → re-render!

// useRef: no re-render
const ref = useRef(0);
ref.current = 1; // → no re-render, value persists
```

## Key Resources

- 📖 [React docs — useRef](https://react.dev/reference/react/useRef)
- 📖 [React docs — useState](https://react.dev/reference/react/useState)
- 🎥 [Web Dev Simplified — useRef in 11 Minutes](https://www.youtube.com/watch?v=t2ypzz6gJm0)

---

## My Notes

### 📖 React docs — useRef

Source: [react.dev/reference/react/useRef](https://react.dev/reference/react/useRef)

> **`useRef` is a React Hook that lets you reference a value that's not needed for rendering.**

`useRef` returns an object with a single property:

```javascript
const ref = useRef(initialValue);
// ref = { current: initialValue }
```

**The key behavior:** React gives you **the same object** on every render. It persists across the entire lifetime of the component. Changing `.current` does **not** trigger a re-render.

```javascript
function MyComponent() {
  const renderCount = useRef(0);

  // This runs every render, but does NOT cause another render
  renderCount.current += 1;

  console.log(`Rendered ${renderCount.current} times`);
  // ...
}
```

#### The 3 rules from React docs

1. **You can mutate `ref.current`** — unlike state, it's mutable. Just change it directly.
2. **Changing `ref.current` does NOT re-render** — React doesn't know about the change. It's a plain JavaScript object.
3. **Don't read or write `ref.current` during rendering** (except for initialization) — this makes behavior unpredictable.

---

### 🆚 useRef vs useState — when to use which

The fundamental question: **does the UI need to update when this value changes?**

| | `useState` | `useRef` |
|---|---|---|
| **Triggers re-render on change?** | ✅ Yes | ❌ No |
| **Persists across renders?** | ✅ Yes | ✅ Yes |
| **Mutable?** | ❌ No (must use setter) | ✅ Yes (just change `.current`) |
| **When to use** | Value that the UI displays | Value the UI doesn't need to know about |
| **Updated via** | `setState(newValue)` | `ref.current = newValue` |

```javascript
// ─── useState: when the UI depends on it ───
const [count, setCount] = useState(0);
// Changing count → re-render → user sees new count in the DOM

// ─── useRef: when the UI does NOT depend on it ───
const timerRef = useRef(null);
// Changing timerRef.current → no re-render → nobody sees the change
// Perfect for storing interval IDs, previous values, caches, etc.
```

> 🧠 **Think of it this way:** `useState` is for **what the user sees**. `useRef` is for **what the code needs to remember** between renders.

---

### 🔗 How useRef Connects to Memoization

In our `memoize` exercise, we build a standalone function with a `Map` cache. But what happens when you want memoization **inside a React component**? This is where `useRef` comes in.

#### The Problem: variables reset on every render

```javascript
function SearchResults({ query }) {
  // ❌ BAD: cache is created fresh on EVERY render!
  const cache = new Map();

  // This will NEVER have a cache hit — the Map is always empty
  if (cache.has(query)) return cache.get(query);

  const results = expensiveSearch(query);
  cache.set(query, results);
  return results;
}
```

Every time React re-renders the component, the function runs from the top. Local variables like `const cache = new Map()` are **recreated** every time. The cache never persists.

#### Solution 1: useRef to persist a cache across renders

```javascript
function SearchResults({ query }) {
  // ✅ useRef persists the same Map across all renders
  const cacheRef = useRef(new Map());

  if (cacheRef.current.has(query)) {
    return cacheRef.current.get(query); // cache hit! No re-render triggered
  }

  const results = expensiveSearch(query);
  cacheRef.current.set(query, results); // update cache silently
  return results;
}
```

**Why `useRef` and not `useState` for the cache?**
- Updating the cache shouldn't trigger a re-render — we just want to store it silently
- If we used `useState` to hold the cache, every `setCache(...)` would cause a re-render → infinite loop!

#### Solution 2: useRef to persist a memoized function

You can store the memoized version of a function in a ref so it survives re-renders:

```javascript
function SearchComponent() {
  // Create the memoized function ONCE, persist it with useRef
  const memoizedSearchRef = useRef(
    memoize(
      (query) => expensiveSearch(query),
      (query) => query
    )
  );

  function handleSearch(query) {
    // Uses the same memoized function (with its cache) across all renders
    const results = memoizedSearchRef.current(query);
    setResults(results);
  }

  // ...
}
```

> 📝 The `initialValue` passed to `useRef()` is only used on the **first render**. On subsequent renders, React returns the same ref object — so the memoized function (and its cache) persist.

#### Solution 3: React's built-in `useMemo` (the React way)

React provides `useMemo` which is the "official" way to memoize **values** inside components:

```javascript
function SearchResults({ query }) {
  // React will only re-compute when `query` changes
  const results = useMemo(() => expensiveSearch(query), [query]);
  return <div>{results}</div>;
}
```

**How `useMemo` differs from our `memoize`:**

| | Our `memoize` function | React `useMemo` | `useRef` + Map |
|---|---|---|---|
| **Where it works** | Anywhere (vanilla JS) | Inside React components only | Inside React components only |
| **Cache size** | Unlimited (Map grows) | **Only 1 value** (last result) | Unlimited (Map grows) |
| **When it recomputes** | Cache miss (key not in Map) | Dependency array changed | Cache miss (key not in Map) |
| **Triggers re-render** | N/A (not React) | Only if result changes | ❌ No |
| **Memory concern** | Cache can grow forever | Only stores last value | Cache can grow forever |

> ⚠️ **Key insight:** `useMemo` only caches the **most recent** result. If you need a cache of **multiple** previous results (like a real memoize function), you need `useRef` + `Map`.

---

### 💡 Common useRef use cases

```javascript
// 1. Storing timer/interval IDs (like debounce!)
const timerRef = useRef(null);
function handleClick() {
  clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => { /* ... */ }, 300);
}

// 2. Holding previous value
const prevQueryRef = useRef('');
useEffect(() => {
  if (prevQueryRef.current !== query) {
    console.log(`Query changed: ${prevQueryRef.current} → ${query}`);
    prevQueryRef.current = query;
  }
});

// 3. DOM element reference
const inputRef = useRef(null);
function focusInput() {
  inputRef.current.focus(); // directly access the DOM node
}
return <input ref={inputRef} />;

// 4. Persisting a memoization cache (our module 2 connection!)
const cacheRef = useRef(new Map());
```

---

## Key Takeaways

- **`useRef` returns `{ current: value }`** — the same object on every render, persists across the component's lifetime
- **Changing `.current` does NOT re-render** — React doesn't know about it. Perfect for "invisible" state
- **`useState` is for values the UI displays; `useRef` is for values the code needs silently**
- **Local variables reset on every render** — `const cache = new Map()` inside a component creates a new Map each time. Use `useRef(new Map())` to persist it
- **`useRef` is how you persist a memoize cache in React** — you can store a whole `Map` or a memoized function in a ref
- **`useMemo` only caches the last result** (1 slot). For a multi-entry cache like our `memoize`, you need `useRef` + `Map`
- **Common uses:** timer IDs (debounce!), previous values, DOM refs, and caches

### 🎯 Interview Quick Answers

> **"What's the difference between useRef and useState?"**
> Both persist values across renders, but `useState` triggers a re-render when updated while `useRef` does not. Use `useState` for values that affect what's rendered; use `useRef` for values the UI doesn't need to know about (timers, caches, previous values).

> **"How would you memoize an expensive computation in React?"**
> For single-value caching, use `useMemo(() => compute(x), [x])`. For a multi-entry cache (like a real memoize), use `useRef(new Map())` to persist the cache across renders without triggering re-renders.

> **"Why not use useState for a cache?"**
> Because updating state triggers a re-render. If you stored a cache in state and updated it on every function call, you'd cause unnecessary re-renders (or even infinite loops). `useRef` lets you update the cache silently.

## Related Exercises

- 🏋️ [02-memoize](http://localhost:3737/exercise/02-memoize) — Our memoize function uses a Map cache; in React you'd persist it with useRef
- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Debounce uses a timer ID; in React you'd store it in useRef
- 🏋️ [08-virtual-list](http://localhost:3737/exercise/08-virtual-list) — useRef can hold scroll position without triggering re-renders
