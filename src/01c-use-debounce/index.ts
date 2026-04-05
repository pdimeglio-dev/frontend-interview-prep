import { useEffect, useState } from "react";

/**
 * Implement a useDebounce custom hook.
 * See README.md for the full problem description.
 *
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // we create a new timeout every time the value or delay changes, and only update the debounced value when timeout expires. If any other call comes in before this happens, we should restart the timer.
        const timeOutId = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

        // this is the cleanup function. In regular js we cancel the timeout and re assign it to the new one in every call. Here we use the react rendering as a way to reset the timer.
        // everytime the value or delay change, react will re render and call the cleanup function on the previous effect, component is unmounting and re mounting, so we can use this to 
        // clear the timeout and avoid memory leaks.
        return () => {
            clearTimeout(timeOutId);
        };
    }, [value, delay]);

    return debouncedValue;
}
