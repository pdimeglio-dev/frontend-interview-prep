import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./index";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("should not update the debounced value before the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 300 } }
    );

    rerender({ value: "world", delay: 300 });

    // Before delay expires, should still be the old value
    expect(result.current).toBe("hello");
  });

  it("should update the debounced value after the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 300 } }
    );

    rerender({ value: "world", delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("world");
  });

  it("should reset the timer on rapid changes (only last value wins)", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );

    rerender({ value: "b", delay: 300 });
    act(() => vi.advanceTimersByTime(100));

    rerender({ value: "c", delay: 300 });
    act(() => vi.advanceTimersByTime(100));

    rerender({ value: "d", delay: 300 });
    act(() => vi.advanceTimersByTime(100));

    // 300ms haven't passed since last change
    expect(result.current).toBe("a");

    // Now let the full delay pass from the last change
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("d");
  });

  it("should work with number values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 200 } }
    );

    rerender({ value: 42, delay: 200 });

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe(42);
  });

  it("should clean up timeout on unmount", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");

    const { unmount } = renderHook(() => useDebounce("test", 300));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it("should return value immediately when delay is 0", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "instant", delay: 0 } }
    );

    rerender({ value: "updated", delay: 0 });

    // With delay 0, should update without waiting
    act(() => vi.advanceTimersByTime(0));
    expect(result.current).toBe("updated");
  });

  it("should handle delay changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "hello", delay: 300 } }
    );

    // Change both value and delay
    rerender({ value: "world", delay: 500 });

    // Old delay (300ms) should NOT trigger the update
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("hello");

    // New delay (500ms total from change) should trigger
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("world");
  });
});
