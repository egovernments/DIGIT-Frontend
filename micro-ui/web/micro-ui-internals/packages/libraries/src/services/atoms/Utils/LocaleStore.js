import HybridStorage from "./HybridStorage";

// Thin facade over HybridStorage scoped to locale data. Keys are built by
// LocalizationStore (in elements/Localization/service.js) using the bare
// "Locale.{locale}.{module}" shape; LocaleStore just provides namespaced
// access + a hydration helper.

const LOCALE_PREFIX = "Locale.";

export const LocaleStore = {
  get: (key) => HybridStorage.getSync(key),
  set: (key, value, ttl) => HybridStorage.setSync(key, value, ttl),
  remove: (key) => HybridStorage.remove(key),

  // Boot-time: warm the in-memory Map with every Locale.* entry from IDB.
  // Called once after init so language switches feel instant.
  hydrate: () => HybridStorage.hydrate((k) => k.startsWith(LOCALE_PREFIX)),
};

export default LocaleStore;
