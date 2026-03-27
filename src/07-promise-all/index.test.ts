import { describe, it, expect } from "vitest";
import { promiseAll } from "./index";

describe("promiseAll", () => {
  it("should resolve with all values in order", async () => {
    const result = await promiseAll([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should preserve order even when promises resolve out of order", async () => {
    const slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 50));
    const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 10));

    const result = await promiseAll([slow, fast]);
    expect(result).toEqual(["slow", "fast"]);
  });

  it("should handle non-promise values", async () => {
    const result = await promiseAll([1, Promise.resolve(2), "three"]);
    expect(result).toEqual([1, 2, "three"]);
  });

  it("should resolve immediately with empty array", async () => {
    const result = await promiseAll([]);
    expect(result).toEqual([]);
  });

  it("should reject immediately on first rejection", async () => {
    const error = new Error("fail");
    await expect(
      promiseAll([Promise.resolve(1), Promise.reject(error), Promise.resolve(3)])
    ).rejects.toThrow("fail");
  });

  it("should reject with the first error when multiple reject", async () => {
    const error1 = new Error("first");
    const error2 = new Error("second");

    await expect(
      promiseAll([Promise.reject(error1), Promise.reject(error2)])
    ).rejects.toThrow("first");
  });

  it("should handle a single promise", async () => {
    const result = await promiseAll([Promise.resolve(42)]);
    expect(result).toEqual([42]);
  });

  it("should handle a single non-promise value", async () => {
    const result = await promiseAll([42]);
    expect(result).toEqual([42]);
  });

  it("should handle promises that resolve to falsy values", async () => {
    const result = await promiseAll([
      Promise.resolve(0),
      Promise.resolve(""),
      Promise.resolve(null),
      Promise.resolve(false),
    ]);
    expect(result).toEqual([0, "", null, false]);
  });
});
