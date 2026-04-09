import { useRef, useEffect } from "react";

/**
 * Implement usePrevious here.
 * See README.md for the full problem description.
 *
 * Returns the previous value of the given input.
 * On the first render, returns undefined.
 */
export function usePrevious<T>(value: T): T | undefined {
  const prev = useRef<T|undefined>(undefined);
  
  useEffect(() => {
    prev.current = value;
  },[value]);

  return prev.current;
}


