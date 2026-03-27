# Event Emitter

> **Module 3** · BFE.dev: [#16 Event Emitter](https://bigfrontend.dev/problem/create-an-Event-Emitter)

## Problem

Implement an `EventEmitter` class that allows subscribing to named events, emitting events with arguments, and unsubscribing.

## Requirements

1. `subscribe(eventName, callback)` — registers a callback for the given event name
2. `subscribe` returns an object with a `release()` method that removes that specific callback
3. `emit(eventName, ...args)` — calls all callbacks registered for the event, passing the args
4. Multiple callbacks can be registered for the same event
5. After `release()`, the callback should no longer be called on emit
6. If all callbacks for an event are released, the event key should be cleaned up

## Examples

```js
const emitter = new EventEmitter();

const sub1 = emitter.subscribe("click", (x) => console.log("A:", x));
const sub2 = emitter.subscribe("click", (x) => console.log("B:", x));

emitter.emit("click", 42); // logs "A: 42" then "B: 42"

sub1.release();
emitter.emit("click", 99); // logs "B: 99" only
```

## Constraints

- Do NOT use Node's built-in `EventEmitter`
- Your implementation should pass all tests in `index.test.ts`
