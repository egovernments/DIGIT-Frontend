import { createGlobalState } from "./createState";

/**
 * Custom hook for managing locale state.
 * 
 * Utilizes the `createGlobalState` function to create a global state for user-related data.
 * This state includes information about the locale details.
 * 
 * @author jagankumar-egov
 */
export const useLocaleState = createGlobalState("locale", {
  tenantId: null,
  locale: "en_IN",
  availableLocales: [],
  messages: [],
  cachedModules: [],
  cachedMessages: {},
});
