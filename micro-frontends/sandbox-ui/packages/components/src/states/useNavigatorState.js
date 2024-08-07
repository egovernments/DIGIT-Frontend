import { createGlobalState } from "./createState";

/**
 * Custom hook for managing navigator state.
 * 
 * Utilizes the `createGlobalState` function to create a global state for user-related data.
 * This state includes information about the navigator details.
 * 
 * @author jagankumar-egov
 */
export const useNavigatorState = createGlobalState("navigator", {
  currentScreen: "",
  history: [],
  previousScreen: "",
});
