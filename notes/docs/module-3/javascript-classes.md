---
sidebar_position: 2
title: "JavaScript Classes"
---

# JavaScript Classes

## Summary

ES6 `class` syntax is sugar over prototypal inheritance. A `constructor` initializes instance properties, and methods defined in the class body are added to the prototype. `this` inside methods refers to the instance.

```javascript
class EventEmitter {
  constructor() {
    this.events = new Map(); // instance property
  }
  
  emit(name, ...args) {     // prototype method
    this.events.get(name)?.forEach(cb => cb(...args));
  }
}
```

## Key Resources

- 📖 [javascript.info — Classes](https://javascript.info/class)
- 📖 [MDN — Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- 🎥 [Web Dev Simplified — JS Classes in 1 Hour](https://www.youtube.com/watch?v=2ZphE5HGQaA)

## My Notes

<!-- Write your own notes here -->



## Key Takeaways

<!-- Bullet points you want to remember -->



## Related Exercises

- 🏋️ [03-event-emitter](http://localhost:3737/exercise/03-event-emitter) — Built as an ES6 class
