import { describe, it, expect } from "vitest";
import { deepClone } from "./index";

describe("deepClone", () => {
  it("should return primitives as-is", () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone("hello")).toBe("hello");
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBeNull();
    expect(deepClone(undefined)).toBeUndefined();
  });

  it("should clone a flat object", () => {
    const obj = { a: 1, b: "two" };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });

  it("should clone nested objects deeply", () => {
    const obj = { a: { b: { c: 3 } } };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned.a).not.toBe(obj.a);
    expect(cloned.a.b).not.toBe(obj.a.b);

    cloned.a.b.c = 999;
    expect(obj.a.b.c).toBe(3);
  });

  it("should clone arrays", () => {
    const arr = [1, [2, [3]]];
    const cloned = deepClone(arr);

    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[1]).not.toBe(arr[1]);
  });

  it("should clone objects with array values", () => {
    const obj = { items: [1, 2, { nested: true }] };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned.items).not.toBe(obj.items);
    expect(cloned.items[2]).not.toBe(obj.items[2]);
  });

  it("should clone Date objects", () => {
    const date = new Date("2024-01-01");
    const cloned = deepClone(date);

    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
    expect(cloned instanceof Date).toBe(true);
    expect(cloned.getTime()).toBe(date.getTime());
  });

  it("should clone RegExp objects", () => {
    const regex = /hello/gi;
    const cloned = deepClone(regex);

    expect(cloned).not.toBe(regex);
    expect(cloned instanceof RegExp).toBe(true);
    expect(cloned.source).toBe(regex.source);
    expect(cloned.flags).toBe(regex.flags);
  });

  it("should handle circular references", () => {
    const obj: any = { name: "circular" };
    obj.self = obj;

    const cloned = deepClone(obj);

    expect(cloned.name).toBe("circular");
    expect(cloned.self).toBe(cloned); // points to itself, not original
    expect(cloned.self).not.toBe(obj);
  });

  it("should only clone own properties", () => {
    const parent = { inherited: true };
    const child = Object.create(parent);
    child.own = "yes";

    const cloned = deepClone(child);

    expect(cloned.own).toBe("yes");
    expect(cloned.hasOwnProperty("inherited")).toBe(false);
  });

  it("should handle nested circular references", () => {
    const a: any = { name: "a" };
    const b: any = { name: "b" };
    a.ref = b;
    b.ref = a;

    const clonedA = deepClone(a);

    expect(clonedA.name).toBe("a");
    expect(clonedA.ref.name).toBe("b");
    expect(clonedA.ref.ref).toBe(clonedA);
  });
});
