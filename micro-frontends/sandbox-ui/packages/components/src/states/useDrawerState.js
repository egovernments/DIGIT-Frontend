import { createGlobalState } from "./createState";
/**
 * Custom hook for managing drawer state.
 * 
 * Utilizes the `createGlobalState` function to create a global state for user-related data.
 * This state includes information about the drawer details.
 * 
 * @author jagankumar-egov
 */
export const useDrawerState = createGlobalState("drawer", {
  isOpen:false,
  content:"",
  clickedFrom:""
});
