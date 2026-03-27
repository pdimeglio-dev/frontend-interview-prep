# Deep Clone

> **Module 4** · BFE.dev: [#63 Deep Clone](https://bigfrontend.dev/problem/create-cloneDeep)

## Problem

Implement a `deepClone` function that creates a deep copy of a given value. The clone should be completely independent — mutating the clone should not affect the original.

## Requirements

1. Handle all primitive types (return as-is)
2. Recursively clone nested objects and arrays
3. Handle `Date` objects (clone into a new Date)
4. Handle `RegExp` objects (clone into a new RegExp)
5. Handle **circular references** without infinite recursion
6. Only clone own enumerable properties (not inherited ones)

## Examples

```js
const original = { a: 1, b: { c: 2 }, d: [3, 4] };
const cloned = deepClone(original);
cloned.b.c = 99;
console.log(original.b.c); // 2 (unaffected)

// Circular reference
const obj = { name: "circular" };
obj.self = obj;
const cloned2 = deepClone(obj);
cloned2.self === cloned2; // true (not obj)
```

## Constraints

- Do NOT use `JSON.parse(JSON.stringify())` or `structuredClone()`
- Your implementation should pass all tests in `index.test.ts`
