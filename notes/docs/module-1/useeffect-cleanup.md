---
sidebar_position: 6
title: "React useEffect & Cleanup"
---

# React useEffect & Cleanup

## Summary

`useEffect` runs side effects after render. Its return function is the "cleanup" — called before the effect re-runs or when the component unmounts. Critical for clearing timers to prevent memory leaks.

```javascript
useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id); // cleanup!
}, []);
```

## Key Resources

- 📖 [React docs — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- 🎥 [Jack Herrington — Mastering useEffect](https://www.youtube.com/watch?v=dH6i3GurZW8)
- 📖 [React docs — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

## My Notes

### What is `useEffect`?

`useEffect` is React's way of letting you run **side effects** — anything that reaches outside the component's pure render: fetching data, subscribing to events, setting timers, manually changing the DOM, etc.

```jsx
useEffect(() => {
  // ← effect function: your side-effect code goes here
  
  return () => {
    // ← cleanup function (optional): undo the side effect
  };
}, [dep1, dep2]); // ← dependency array: controls WHEN the effect re-runs
```

---

### When does `useEffect` run?

`useEffect` fires **after the browser has painted** the screen (not before — that's `useLayoutEffect`). The timing depends on the **dependency array**:

| Dependency Array | When Effect Runs | Use Case |
|---|---|---|
| `useEffect(fn)` — **no array** | After **every** render | Rare — usually a mistake |
| `useEffect(fn, [])` — **empty array** | After **first render only** (mount) | Subscriptions, one-time setup |
| `useEffect(fn, [a, b])` — **with deps** | After first render + whenever `a` or `b` change | Sync with specific values |

```jsx
// ❌ No dependency array — runs after EVERY render (usually wrong)
useEffect(() => {
  console.log('I run on every single render');
});

// ✅ Empty array — runs once on mount
useEffect(() => {
  const ws = new WebSocket('wss://api.example.com');
  return () => ws.close();
}, []);

// ✅ With dependencies — re-runs when `userId` changes
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);
```

**The mental model from the React docs:** Don't think of `useEffect` as "lifecycle methods" (mount/update/unmount). Think of it as **synchronizing** your component with some external system. The dependency array tells React "re-sync whenever these values change."

---

### The Dependency Array — How React Decides to Re-run

React compares each dependency with its previous value using `Object.is()` (essentially `===`). If **any** dependency changed → the effect re-runs.

**Key rule:** Every reactive value used inside the effect **must** be in the dependency array. React's ESLint plugin (`react-hooks/exhaustive-deps`) will warn you if you miss one.

```jsx
// ✅ All values used inside the effect are listed as dependencies
useEffect(() => {
  const url = `https://api.example.com/users/${userId}`;
  fetch(url).then(r => r.json()).then(setUser);
}, [userId]); // userId is used inside → must be listed

// ❌ Missing dependency — stale closure bug
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);  // 'count' is captured but not in deps
  }, 1000);
  return () => clearInterval(id);
}, []); // count is missing → count is always 0 (stale!)

// ✅ Fix: use functional updater to avoid the dependency
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);  // no dependency on 'count'
  }, 1000);
  return () => clearInterval(id);
}, []); // ✅ no stale closure
```

---

### 🚨 Avoiding Infinite Loops

An infinite loop happens when the **effect itself causes a dependency to change**, which triggers the effect again, which changes the dependency again… forever.

#### Common Trap #1: Setting state that's in the dependency array

```jsx
// ❌ INFINITE LOOP — effect sets 'data', 'data' is a dependency
useEffect(() => {
  setData({ ...data, loaded: true }); // creates new object every time
}, [data]); // data changed → re-run → setData → data changed → ...
```

**Fix:** Remove the circular dependency, or use a functional updater:

```jsx
// ✅ Functional updater — no dependency on 'data'
useEffect(() => {
  setData(prev => ({ ...prev, loaded: true }));
}, []); // runs once
```

#### Common Trap #2: Objects/arrays as dependencies

Objects and arrays are compared **by reference**. If you create a new object every render, it's "different" every time — even if the contents are the same:

```jsx
// ❌ INFINITE LOOP — options is a new object every render
function MyComponent({ userId }) {
  const options = { method: 'GET', userId };  // new ref each render!

  useEffect(() => {
    fetchData(options);
  }, [options]); // always "changed" → runs every render → re-render → ...
}
```

**Fixes:**

```jsx
// Fix 1: Move the object INSIDE the effect
useEffect(() => {
  const options = { method: 'GET', userId };
  fetchData(options);
}, [userId]); // ✅ primitive dependency, stable

// Fix 2: useMemo to stabilize the reference
const options = useMemo(() => ({ method: 'GET', userId }), [userId]);
useEffect(() => {
  fetchData(options);
}, [options]); // ✅ only changes when userId changes
```

#### Common Trap #3: Functions as dependencies

Functions are **objects** — a new function is created every render:

```jsx
// ❌ fetchUser is a new function every render
function MyComponent({ userId }) {
  function fetchUser() {
    return fetch(`/api/users/${userId}`);
  }

  useEffect(() => {
    fetchUser().then(setUser);
  }, [fetchUser]); // new ref every render → infinite loop
}
```

**Fixes:**

```jsx
// Fix 1: Move function inside the effect
useEffect(() => {
  function fetchUser() {
    return fetch(`/api/users/${userId}`);
  }
  fetchUser().then(setUser);
}, [userId]); // ✅ 

// Fix 2: useCallback to stabilize the function reference
const fetchUser = useCallback(() => {
  return fetch(`/api/users/${userId}`);
}, [userId]);

useEffect(() => {
  fetchUser().then(setUser);
}, [fetchUser]); // ✅ only changes when userId changes
```

#### Quick Checklist: "Will this infinite loop?"

1. Does the effect **set state** that's in its own dependency array? → ♻️ Loop risk
2. Is a dependency an **object/array/function** created during render? → ♻️ Loop risk (new reference each time)
3. Are all dependencies **primitives** or **stable references** (from `useMemo`/`useCallback`/`useRef`)? → ✅ Safe

---

### The Cleanup Function

The function you **return** from `useEffect` is the cleanup. React calls it:

1. **Before re-running the effect** (when dependencies change)
2. **When the component unmounts**

This is essential for preventing memory leaks:

```jsx
useEffect(() => {
  // Setup
  const handler = (e) => console.log(e.key);
  window.addEventListener('keydown', handler);

  // Cleanup — runs before next effect and on unmount
  return () => window.removeEventListener('keydown', handler);
}, []);
```

**Common things to clean up:**
- `clearTimeout` / `clearInterval`
- `removeEventListener`
- `WebSocket.close()`
- `AbortController.abort()` (cancel fetch requests)
- Unsubscribe from observables/stores

```jsx
// Aborting a fetch on cleanup (prevents setting state on unmounted component)
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser)
    .catch(err => {
      if (err.name !== 'AbortError') throw err;
    });

  return () => controller.abort();
}, [userId]);
```

> 💡 In **Strict Mode** (development), React intentionally runs effects **twice** (mount → unmount → mount) to help you catch missing cleanups. If your effect breaks on the second run, you're missing a cleanup.

---

### "When X changes, do Y" — useEffect vs Derived State

Coming from RxJS, you might think of `useEffect` as the React equivalent of `.subscribe()` — "watch a value, and when it changes, do something." And it *looks* like that:

```jsx
// Looks like an observable subscription, right?
useEffect(() => {
  console.log('userId changed!', userId);
  fetchUser(userId).then(setUser);
}, [userId]); // "subscribe" to userId changes
```

But here's the critical distinction React makes:

#### ✅ useEffect IS for: syncing with **external systems**

When the "something" you do is a **side effect** — reaching outside React:

```jsx
// ✅ Correct: userId changes → fetch from API (external system)
useEffect(() => {
  const controller = new AbortController();
  fetch(`/api/users/${userId}`, { signal: controller.signal })
    .then(r => r.json())
    .then(setUser);
  return () => controller.abort();
}, [userId]);

// ✅ Correct: theme changes → update document title (external DOM)
useEffect(() => {
  document.title = `App — ${theme} mode`;
}, [theme]);
```

#### ❌ useEffect is NOT for: deriving state from other state

When "X changes → update Y" is just **computing something from existing state**, you don't need `useEffect` at all. This is the #1 `useEffect` mistake:

```jsx
// ❌ WRONG: "when items change, update filteredItems"
const [items, setItems] = useState([]);
const [filteredItems, setFilteredItems] = useState([]);

useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]); // unnecessary effect + extra re-render!

// ✅ RIGHT: just compute it during render
const [items, setItems] = useState([]);
const filteredItems = items.filter(item => item.active); // derived value, no state needed

// Why does this work? Because when setItems() is called, React re-renders
// the component — the ENTIRE function runs again from top to bottom.
// So filteredItems is recomputed with the latest items. Always in sync.
// No subscription needed — the function just runs again!

// ✅ Or with useMemo if the computation is expensive
// (useMemo skips the computation if items hasn't changed — pure optimization)
const filteredItems = useMemo(
  () => items.filter(item => item.active),
  [items]
);
```

#### The mental model: RxJS vs React

| RxJS Pattern | React Equivalent | Tool |
|---|---|---|
| `value$.subscribe(val => sideEffect(val))` | "When dep changes, run side effect" | `useEffect(fn, [dep])` |
| `value$.pipe(map(transform))` | "Derive a new value from state" | Compute during render or `useMemo` |
| `combineLatest([a$, b$]).pipe(map(...))` | "Combine multiple values" | Compute during render or `useMemo` |
| `value$.pipe(distinctUntilChanged())` | "Only re-run if actually changed" | Already built in — React diffs deps |
| `subject.next(value)` | "Push a new value" | `setState(value)` |

#### The Rule of Thumb

> **Ask yourself:** "Am I reaching *outside* React (API, DOM, timer, WebSocket)?"
> - **Yes** → `useEffect` ✅
> - **No, just transforming state into other state** → Compute during render, `useMemo`, or restructure your state ❌ no effect needed

The React docs call this ["You Might Not Need an Effect"](https://react.dev/learn/you-might-not-need-an-effect) — it's one of the most important pages to read.

---

## Key Takeaways

- `useEffect` runs **after paint**, not during render — it's for **side effects** only
- Think "synchronization" not "lifecycle": the effect syncs your component with an external system
- **No array** = every render, **empty array** = mount only, **with deps** = when deps change
- Every reactive value used inside the effect **must** be in the dependency array (enforced by `react-hooks/exhaustive-deps` lint rule)
- Objects, arrays, and functions are compared **by reference** → new reference every render = infinite loop risk
- Use **functional state updaters** (`prev => ...`), **`useMemo`**, **`useCallback`**, or move values inside the effect to stabilize dependencies
- Always **clean up**: return a function that undoes the side effect (timers, listeners, subscriptions, fetch aborts)
- Strict Mode double-invokes effects to catch missing cleanups — if it breaks, add a cleanup



## Related Exercises

- 🏋️ [01-debounce](http://localhost:3737/exercise/01-debounce) — Must clean up timeouts in useEffect return to avoid memory leaks
