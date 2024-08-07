import { createGlobalState } from "./createState";

/**
 * Custom hook for managing user state.
 * 
 * Utilizes the `createGlobalState` function to create a global state for user-related data.
 * This state includes information about the user's profile, roles, and contact details.
 * 
 * @author jagankumar-egov
 */
export const useUserState = createGlobalState("user", {
  name: "default", // The name of the user.
  userType: "employee", // The type of user (e.g., employee, admin).
  roles: [], // An array of roles assigned to the user.
  userId: null, // Unique identifier for the user.
  mobileNumber: null, // Mobile number of the user.
  emailId: null, // Email address of the user.
  tenantId: null, // Identifier for the tenant or organization the user belongs to.
});
