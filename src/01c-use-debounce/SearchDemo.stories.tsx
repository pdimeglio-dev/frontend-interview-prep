import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useEffect, useState, useCallback } from "react";
import { debounce } from "../01-debounce";
import { useDebounce } from "./index";

// ═══════════════════════════════════════════════════════════
// Mock data & fetch — shared by both search bars
// ═══════════════════════════════════════════════════════════

const MOCK_ITEMS = [
  "JavaScript", "TypeScript", "Java", "Python", "React",
  "React Native", "Redux", "Rust", "Ruby", "Rails",
  "Angular", "Vue", "Svelte", "Next.js", "Node.js",
];

/** Simulates an API call with latency */
function mockFetch(query: string): Promise<string[]> {
  // TODO: implement — filter MOCK_ITEMS by query, add ~200ms simulated latency
  return Promise.resolve([]);
}

// ═══════════════════════════════════════════════════════════
// Part 1: Vanilla JS Search Bar (uses debounce utility)
// ═══════════════════════════════════════════════════════════

/**
 * This component wraps the vanilla JS `debounce()` function from exercise 01.
 * It uses useRef to attach a classic event listener + debounced callback.
 *
 * The point: show how the plain JS debounce wraps the *function call*.
 */
function VanillaSearchBar({ delay }: { delay: number }) {
  // TODO: implement
  // - useRef for the input element
  // - Create a debounced version of a search function using debounce(fn, delay)
  // - Attach an 'input' event listener in useEffect
  // - Display results and a fetch counter showing how many API calls were made
  // - Clean up the event listener on unmount

  return (
    <div style={{ flex: 1, padding: "1rem" }}>
      <h3>🟡 Vanilla JS <code>debounce()</code></h3>
      <p style={{ fontSize: "0.85rem", color: "#888" }}>
        Uses the <code>debounce(fn, {delay})</code> utility from exercise 01-debounce.
        <br />Debounces the <strong>function call</strong>.
      </p>
      {/* TODO: <input ref={inputRef} /> */}
      {/* TODO: fetch count indicator */}
      {/* TODO: results list */}
      <p style={{ color: "#666", fontStyle: "italic" }}>⏳ Not yet implemented</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Part 2: React Search Bar (uses useDebounce hook)
// ═══════════════════════════════════════════════════════════

/**
 * This component uses the `useDebounce()` hook from exercise 01c.
 * It's the React-idiomatic approach: controlled input + debounced value.
 *
 * The point: show how the hook debounces the *value*, not the function.
 */
function ReactSearchBar({ delay }: { delay: number }) {
  // TODO: implement
  // - useState for query (controlled input)
  // - useDebounce(query, delay) to get the debounced value
  // - useEffect watching debouncedQuery to trigger mockFetch
  // - Display results and a fetch counter showing how many API calls were made

  return (
    <div style={{ flex: 1, padding: "1rem" }}>
      <h3>🟢 React <code>useDebounce()</code></h3>
      <p style={{ fontSize: "0.85rem", color: "#888" }}>
        Uses the <code>useDebounce(value, {delay})</code> hook from exercise 01c-use-debounce.
        <br />Debounces the <strong>value</strong>, triggers fetch via useEffect.
      </p>
      {/* TODO: <input value={query} onChange={...} /> */}
      {/* TODO: fetch count indicator */}
      {/* TODO: results list */}
      <p style={{ color: "#666", fontStyle: "italic" }}>⏳ Not yet implemented</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Combined Demo — renders both side by side
// ═══════════════════════════════════════════════════════════

function SearchDemoComparison({ delay }: { delay: number }) {
  return (
    <div>
      <h2>Debounce Comparison: Vanilla JS vs React Hook</h2>
      <p style={{ color: "#999", marginBottom: "1.5rem" }}>
        Type in both inputs simultaneously to see how each approach handles rapid keystrokes.
        Watch the fetch counter — both should make the same number of API calls.
      </p>
      <div style={{ display: "flex", gap: "2rem", border: "1px solid #333", borderRadius: "8px" }}>
        <VanillaSearchBar delay={delay} />
        <div style={{ width: "1px", background: "#333" }} />
        <ReactSearchBar delay={delay} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Storybook Meta & Stories
// ═══════════════════════════════════════════════════════════

const meta: Meta<typeof SearchDemoComparison> = {
  title: "Exercises/Debounce Comparison",
  component: SearchDemoComparison,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    delay: {
      control: { type: "range", min: 0, max: 1000, step: 50 },
      description: "Debounce delay in milliseconds",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchDemoComparison>;

export const Default: Story = {
  args: {
    delay: 300,
  },
};

export const FastDebounce: Story = {
  args: {
    delay: 100,
  },
};

export const SlowDebounce: Story = {
  args: {
    delay: 800,
  },
};
