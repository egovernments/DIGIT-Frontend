import HybridStorage from "./HybridStorage";

// Locale-specific helpers over HybridStorage. Phase 3 wires these into LocalizationService.
// Key shape (kept identical to legacy PersistantStorage for migration continuity):
//   Digit.Locale.{locale}.List          — list of modules cached for a locale
//   Digit.Locale.List                   — union of all locale module lists
//   Digit.Locale.{locale}.{module}      — actual translations array

const LIST_KEY = (locale) => `Digit.Locale.${locale}.List`;
const ALL_LIST_KEY = () => `Digit.Locale.List`;
const MODULE_KEY = (locale, module) => `Digit.Locale.${locale}.${module}`;
const LOCALE_PREFIX = "Digit.Locale.";

export const LocaleStore = {
  getModules: (locale) => HybridStorage.getSync(LIST_KEY(locale)) || [],
  setModules: (locale, modules, ttl) => HybridStorage.setSync(LIST_KEY(locale), modules, ttl),

  getAllModules: () => HybridStorage.getSync(ALL_LIST_KEY()) || [],
  setAllModules: (modules, ttl) => HybridStorage.setSync(ALL_LIST_KEY(), modules, ttl),

  getMessages: (locale, module) => HybridStorage.getSync(MODULE_KEY(locale, module)),
  setMessages: (locale, module, messages, ttl) => HybridStorage.setSync(MODULE_KEY(locale, module), messages, ttl),

  // Async-archive path: data for non-active locales lives in L2 only.
  setMessagesArchive: (locale, module, messages, ttl) =>
    HybridStorage.setAsync(MODULE_KEY(locale, module), messages, ttl),

  // Boot hydration: warm the in-memory Map with every locale entry from IDB.
  // Called once after init so language switches feel instant.
  hydrate: () => HybridStorage.hydrate((k) => k.startsWith(LOCALE_PREFIX)),
};

export default LocaleStore;
