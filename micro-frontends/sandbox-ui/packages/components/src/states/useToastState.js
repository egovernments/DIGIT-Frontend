import { createGlobalState } from "./createState";

/**
 * Custom hook for managing tenant state.
 * 
 * Utilizes the `createGlobalState` function to create a global state for user-related data.
 * This state includes information about the tenant details.
 * 
 * @author jagankumar-egov
 */
export const useToastState = createGlobalState("toast", {
  label: null,
  type: null,
  showToast: false,
  transitionTime:5000
});
