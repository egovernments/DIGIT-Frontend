import { useState } from "react";

/**
 * useToggle hook for managing a boolean state.
 * 
 * This hook provides a simple way to toggle between two boolean values.
 * It returns the current state and a function to toggle the state.
 * 
 * @param {boolean} initialValue - The initial value of the state (default is false).
 * @returns {[boolean, Function]} - Returns the current state and a function to toggle it.
 * 
 * @example
 * const [isToggled, toggle] = useToggle(false);
 * 
 * return (
 *   <button onClick={toggle}>
 *     {isToggled ? "On" : "Off"}
 *   </button>
 * );
 */
const useToggle = (initialValue = false) => {
  const [state, setState] = useState(initialValue);

  /**
   * Toggles the state between true and false.
   */
  const toggle = () => {
    setState((prevState) => !prevState);
  };

  return [state, toggle];
};

export default useToggle;
