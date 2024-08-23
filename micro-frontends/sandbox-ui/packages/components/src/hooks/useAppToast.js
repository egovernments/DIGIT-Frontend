import { useToastState } from "../states/useToastState"; // Import custom hook to manage toast state

/**
 * useAppToast Hook
 *
 * This custom hook provides a simple interface for showing and hiding toast notifications.
 * It leverages the useToastState hook to manage the toast's visibility and content.
 *
 * @returns {object} An object containing the current toast state, along with functions to show and hide the toast.
 * 
 * @author jagankumar-egov
 */
const useAppToast = () => {
  // Destructure the methods and state from useToastState
  const { setData, resetData, data } = useToastState();

  /**
   * showToast Function
   *
   * This function displays a toast notification with the provided label and type.
   *
   * @param {string} label - The message to display in the toast.
   * @param {string} [type="success"] - The type of the toast (e.g., success, error, etc.).
   */
  const showToast = (label = "", type = "success",transitionTime=5000) => {
    setData({
      ...data,
      label,
      type,
      transitionTime,
      showToast: true,
    });
  };

  /**
   * hideToast Function
   *
   * This function hides the currently visible toast by resetting the toast state.
   */
  const hideToast = () => {
    resetData();
  };
  

  // Return the current toast state along with the show and hide functions
  return {
    ...data,
    hideToast,
    showToast,
  };
};

export default useAppToast;
