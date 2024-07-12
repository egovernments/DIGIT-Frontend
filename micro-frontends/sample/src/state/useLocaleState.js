import { createGlobalState } from "./createState";

export const useLocaleState = createGlobalState("locale", {
  tenantId: null,
  locale: "en_IN",
  availableLocales: [],
  messages: [],
  cachedModules: [],
  cachedMessages: {},
});
