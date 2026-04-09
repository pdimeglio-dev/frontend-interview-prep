import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePrevious } from "./index";

describe("usePrevious", () => {
  it("should return undefined on the first render", () => {
    const { result } = renderHook(() => usePrevious(0));
    expect(result.current).toBeUndefined();
  });

  it("should return the previous value after a re-render", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 0 } }
    );

    // First render: no previous
    expect(result.current).toBeUndefined();

    // Second render: previous should be 0
    rerender({ value: 1 });
    expect(result.current).toBe(0);

    // Third render: previous should be 1
    rerender({ value: 2 });
    expect(result.current).toBe(1);
  });

  it("should work with string values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: "hello" } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: "world" });
    expect(result.current).toBe("hello");

    rerender({ value: "!" });
    expect(result.current).toBe("world");
  });

  it("should work with object values", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };

    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj1 } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: obj2 });
    expect(result.current).toBe(obj1); // same reference
  });

  it("should track the value even when re-rendered with the same value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 42 } }
    );

    expect(result.current).toBeUndefined();

    // Re-render with the same value
    rerender({ value: 42 });
    expect(result.current).toBe(42);

    // Re-render with a new value
    rerender({ value: 99 });
    expect(result.current).toBe(42);
  });

  it("should handle null and undefined values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: null as string | null } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: "something" });
    expect(result.current).toBeNull();

    rerender({ value: null });
    expect(result.current).toBe("something");
  });

  it("should handle boolean values", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: false } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: true });
    expect(result.current).toBe(false);

    rerender({ value: false });
    expect(result.current).toBe(true);
  });

  it("should handle rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 2 });
    rerender({ value: 3 });
    rerender({ value: 4 });
    rerender({ value: 5 });

    // Previous should be the value from the render before the last one
    expect(result.current).toBe(4);
  });
});
