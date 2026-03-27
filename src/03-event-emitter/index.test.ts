import { describe, it, expect, vi } from "vitest";
import { EventEmitter } from "./index";

describe("EventEmitter", () => {
  it("should call subscriber when event is emitted", () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();

    emitter.subscribe("test", fn);
    emitter.emit("test");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should pass arguments to the callback", () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();

    emitter.subscribe("data", fn);
    emitter.emit("data", 1, "hello", true);

    expect(fn).toHaveBeenCalledWith(1, "hello", true);
  });

  it("should support multiple subscribers for the same event", () => {
    const emitter = new EventEmitter();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    emitter.subscribe("click", fn1);
    emitter.subscribe("click", fn2);
    emitter.emit("click", 42);

    expect(fn1).toHaveBeenCalledWith(42);
    expect(fn2).toHaveBeenCalledWith(42);
  });

  it("should not call subscribers of different events", () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();

    emitter.subscribe("click", fn);
    emitter.emit("hover");

    expect(fn).not.toHaveBeenCalled();
  });

  it("should remove subscriber on release()", () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();

    const sub = emitter.subscribe("click", fn);
    emitter.emit("click");
    expect(fn).toHaveBeenCalledTimes(1);

    sub.release();
    emitter.emit("click");
    expect(fn).toHaveBeenCalledTimes(1); // not called again
  });

  it("should only remove the specific subscriber on release", () => {
    const emitter = new EventEmitter();
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const sub1 = emitter.subscribe("click", fn1);
    emitter.subscribe("click", fn2);

    sub1.release();
    emitter.emit("click");

    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
  });

  it("should handle emit with no subscribers gracefully", () => {
    const emitter = new EventEmitter();
    expect(() => emitter.emit("nonexistent")).not.toThrow();
  });

  it("should allow same callback to be subscribed multiple times", () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();

    emitter.subscribe("click", fn);
    emitter.subscribe("click", fn);
    emitter.emit("click");

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should handle release called multiple times without error", () => {
    const emitter = new EventEmitter();
    const fn = vi.fn();

    const sub = emitter.subscribe("click", fn);
    sub.release();
    expect(() => sub.release()).not.toThrow();
  });
});
