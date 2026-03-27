import { describe, it, expect, vi } from "vitest";
import { memoize } from "./index";

describe("memoize", () => {
  it("should return cached result for same first argument", () => {
    const fn = vi.fn((a: number) => a * 2);
    const memoized = memoize(fn);

    expect(memoized(2)).toBe(4);
    expect(memoized(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should recompute for different arguments", () => {
    const fn = vi.fn((a: number) => a * 2);
    const memoized = memoize(fn);

    expect(memoized(2)).toBe(4);
    expect(memoized(3)).toBe(6);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should use first argument as default cache key", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 99)).toBe(3); // same first arg → cached
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should use resolver function for custom cache key", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn, (a, b) => `${a}-${b}`);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3); // cached
    expect(memoized(1, 3)).toBe(4); // different key
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should preserve this context", () => {
    const obj = {
      multiplier: 3,
      compute: memoize(function (this: any, n: number) {
        return n * this.multiplier;
      }),
    };

    expect(obj.compute(5)).toBe(15);
  });

  it("should cache falsy return values correctly", () => {
    const fn = vi.fn(() => 0);
    const memoized = memoize(fn);

    expect(memoized("key")).toBe(0);
    expect(memoized("key")).toBe(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should cache null and undefined return values", () => {
    const fn = vi.fn(() => null);
    const memoized = memoize(fn);

    expect(memoized("a")).toBeNull();
    expect(memoized("a")).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should handle object keys with resolver", () => {
    const fn = vi.fn((obj: { id: number }) => obj.id * 2);
    const memoized = memoize(fn, (obj) => obj.id);

    expect(memoized({ id: 1 })).toBe(2);
    expect(memoized({ id: 1 })).toBe(2); // cached by id
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
