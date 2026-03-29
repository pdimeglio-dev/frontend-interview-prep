import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./index";

describe("debounce with leading & trailing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Basic behavior (should still work) ──

  it("should default to trailing: true, leading: false", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should reset timer on subsequent calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced(); // reset
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should forward arguments to the original function", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("hello", 42);
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith("hello", 42);
  });

  it("should preserve this context", () => {
    const fn = vi.fn(function (this: any) {
      return this;
    });
    const debounced = debounce(fn, 100);

    const obj = { method: debounced };
    obj.method();
    vi.advanceTimersByTime(100);

    expect(fn.mock.instances[0]).toBe(obj);
  });

  // ── Leading edge ──

  it("should support leading: true (invoke immediately on first call)", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, { leading: true, trailing: false });

    debounced();
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1); // no trailing call
  });

  it("should not invoke leading again within the wait period", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, { leading: true, trailing: false });

    debounced();
    debounced();
    debounced();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // ── Both leading and trailing ──

  it("should support both leading and trailing", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100, { leading: true, trailing: true });

    debounced("first");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("first");

    debounced("second");
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("second");
  });

  // ── Cancel ──

  it("should have a .cancel() method that stops pending invocation", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(100);

    expect(fn).not.toHaveBeenCalled();
  });

  it("should allow new calls after cancel", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced("a");
    debounced.cancel();

    debounced("b");
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("b");
  });
});
