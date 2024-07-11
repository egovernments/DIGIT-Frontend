import { createGlobalState } from "./createState";

export const useLocalisationState = createGlobalState("localisation", {
  tenantId: null,
  locale: "en_IN",
  availableLocales: [],
  messages: [],
  cachedModules: [],
  cachedMessages: {},
});
