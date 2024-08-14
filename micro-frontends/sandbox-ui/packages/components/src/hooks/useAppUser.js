import { useAuthState } from "../states/useAuthState";
import { useTenantState } from "../states/useTenantState";
import { useToastState } from "../states/useToastState"; // Import custom hook to manage toast state
import { useUserState } from "../states/useUserState";

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
const userAppUser = () => {
  // Destructure the methods and state from useToastState
  const { setData: setUserData, resetData:resetUserData, data:resetData } = useUserState();
  const { setData: setTenantData, resetData:resetTenantData, data:tenantData  } = useTenantState();
  const { setData: setAuthData, resetData:resetAuthData, data:authData  } = useAuthState();

  /**
   * showToast Function
   *
   * This function displays a toast notification with the provided label and type.
   *
   * @param {string} label - The message to display in the toast.
   * @param {string} [type="success"] - The type of the toast (e.g., success, error, etc.).
   */
  const loggedIn = (token,tenantId) => {
    setUserData({
      ...setUserData,
      // add other info related to user info
    });
    setTenantData({
      ...setTenantData,
      tenantId
    });
    setAuthData({
      ...setAuthData,
      isSignedIn: true, // Indicates whether the user is signed in.
      loggedInAt: new Date().getTime(), // Timestamp of when the user last signed in.
      userId: token, // Unique identifier for the user.
      token: token
    });
  };

  /**
   * hideToast Function
   *
   * This function hides the currently visible toast by resetting the toast state.
   */
  const loggedOut = () => {
    resetTenantData();
    resetUserData();
    resetAuthData();
  };
  

  // Return the current toast state along with the show and hide functions
  return {
    ...data,
    loggedIn,
    loggedOut,
  };
};

export default userAppUser;
