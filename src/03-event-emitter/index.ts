/**
 * Implement EventEmitter here.
 * See README.md for the full problem description.
 */

interface Subscription {
  release: () => void;
}

export class EventEmitter {
  // TODO: Implement this

  subscribe(eventName: string, callback: (...args: any[]) => void): Subscription {
    // TODO: Implement this
    return { release: () => {} };
  }

  emit(eventName: string, ...args: any[]): void {
    // TODO: Implement this
  }
}
