import { createGlobalState } from "./createState";

/**
 * Custom hook for managing authentication state.
 * 
 * Utilizes the `createGlobalState` function to create a global state for authentication-related data.
 * This state includes information about the user's authentication status, login details, and tokens.
 * 
 * @author jagankumar-egov
 */
export const useAuthState = createGlobalState("auth", {
  isSignedIn: false, // Indicates whether the user is signed in.
  loggedInAt: null, // Timestamp of when the user last signed in.
  userId: null, // Unique identifier for the user.
  token: null, // Authentication token for the user.
  tokenExpiresAt: null, // Expiration timestamp of the authentication token.
  refreshToken: null, // Refresh token used to obtain a new authentication token.
  refreshTokenExpiresAt: null, // Expiration timestamp of the refresh token.
  userType: "employee", // Type of user, e.g., employee, admin.
});
