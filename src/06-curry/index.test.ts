import { describe, it, expect } from "vitest";
import { curry } from "./index";

describe("curry", () => {
  function add(a: number, b: number, c: number) {
    return a + b + c;
  }

  it("should work with all arguments at once", () => {
    const curried = curry(add);
    expect(curried(1, 2, 3)).toBe(6);
  });

  it("should work with one argument at a time", () => {
    const curried = curry(add);
    expect(curried(1)(2)(3)).toBe(6);
  });

  it("should work with mixed partial applications", () => {
    const curried = curry(add);
    expect(curried(1, 2)(3)).toBe(6);
    expect(curried(1)(2, 3)).toBe(6);
  });

  it("should work with a single-argument function", () => {
    const double = curry((x: number) => x * 2);
    expect(double(5)).toBe(10);
  });

  it("should work with a zero-argument function", () => {
    const greet = curry(() => "hello");
    expect(greet()).toBe("hello");
  });

  it("should preserve this context", () => {
    function greet(this: any, greeting: string, name: string) {
      return `${greeting}, ${this.title} ${name}`;
    }

    const obj = { title: "Dr.", greet: curry(greet) };
    expect(obj.greet("Hello")("Smith")).toBe("Hello, Dr. Smith");
  });

  it("should handle functions with 4+ arguments", () => {
    function sum4(a: number, b: number, c: number, d: number) {
      return a + b + c + d;
    }
    const curried = curry(sum4);

    expect(curried(1)(2)(3)(4)).toBe(10);
    expect(curried(1, 2)(3, 4)).toBe(10);
    expect(curried(1)(2, 3)(4)).toBe(10);
    expect(curried(1, 2, 3, 4)).toBe(10);
  });

  it("should return a function when not enough arguments", () => {
    const curried = curry(add);
    const partial = curried(1);

    expect(typeof partial).toBe("function");
    expect(partial(2, 3)).toBe(6);
  });
});
