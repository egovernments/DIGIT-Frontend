// Import hooks from individual files
import { useToggle } from "./useToggle";

/**
 * Re-exports common hooks for easier access.
 * 
 * This file centralizes the export of commonly used hooks, making it easier
 * to import them in other parts of the application. 
 * 
 * @module Hooks
 */

/**
 * useToggle - A hook for managing a boolean state.
 * 
 * @example
 * import { useToggle } from 'path/to/hooks';
 * const [isToggled, toggle] = useToggle();
 * 
 * @see {@link ./useToggle.js} for details.
 */
export { useToggle };


