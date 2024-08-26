import { useAuthState } from "../states/useAuthState";
import { useTenantState } from "../states/useTenantState";
import { useToastState } from "../states/useToastState"; // Import custom hook to manage toast state
import { useUserState } from "../states/useUserState";
import { navigateToUrl } from 'single-spa';

/**
 * userAppUser Hook
 *
 * This custom hook provides a simple interface for showing and hiding toast notifications.
 * It leverages the useToastState hook to manage the toast's visibility and content.
 *
 * @returns {object} An object containing the current toast state, along with functions to show and hide the toast.
 * 
 * @author jagankumar-egov
 */
const useNavigate = () => {
  // Destructure the methods and state from useToastState
 

  const navigateTo = (url) => {
    navigateToUrl(`${url}`);
  };
  // Return the current toast state along with the show and hide functions
  return {
  navigateTo
  };
};

export default useNavigate;
