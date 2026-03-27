import { describe, it, expect } from "vitest";
import "./index"; // loads the polyfill

describe("Array.prototype.myReduce", () => {
  it("should sum numbers with initial value", () => {
    expect([1, 2, 3].myReduce((acc, val) => acc + val, 0)).toBe(6);
  });

  it("should sum numbers without initial value", () => {
    expect([1, 2, 3].myReduce((acc, val) => acc + val)).toBe(6);
  });

  it("should throw TypeError on empty array with no initial value", () => {
    expect(() => [].myReduce((acc, val) => acc + val)).toThrow(TypeError);
  });

  it("should return initial value for empty array when provided", () => {
    expect([].myReduce((acc, val) => acc + val, 42)).toBe(42);
  });

  it("should pass correct arguments to callback", () => {
    const args: any[] = [];
    [10, 20, 30].myReduce((acc, val, idx, arr) => {
      args.push({ acc, val, idx, arrLength: arr.length });
      return acc + val;
    }, 0);

    expect(args).toEqual([
      { acc: 0, val: 10, idx: 0, arrLength: 3 },
      { acc: 10, val: 20, idx: 1, arrLength: 3 },
      { acc: 30, val: 30, idx: 2, arrLength: 3 },
    ]);
  });

  it("should start from index 1 when no initial value is given", () => {
    const indices: number[] = [];
    [10, 20, 30].myReduce((acc, val, idx) => {
      indices.push(idx);
      return acc + val;
    });

    expect(indices).toEqual([1, 2]); // starts at index 1
  });

  it("should handle single element array with no initial value", () => {
    expect([42].myReduce((acc, val) => acc + val)).toBe(42);
  });

  it("should accept undefined as explicit initial value", () => {
    const result = [1, 2, 3].myReduce((acc, val) => val, undefined);
    expect(result).toBe(3);
  });

  it("should skip sparse array holes", () => {
    // eslint-disable-next-line no-sparse-arrays
    const sparse = [1, , 3]; // hole at index 1
    const indices: number[] = [];

    sparse.myReduce((acc, val, idx) => {
      indices.push(idx);
      return acc + val;
    }, 0);

    expect(indices).toEqual([0, 2]); // index 1 is skipped
  });

  it("should work with string concatenation", () => {
    expect(["a", "b", "c"].myReduce((acc, val) => acc + val, "")).toBe("abc");
  });
});
