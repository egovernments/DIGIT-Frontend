/**
 * Per-deployment language preference.
 *
 * Every tenant is a separate deployment under its own base path on one shared origin, and
 * the locale string encodes the deployment (fr_AFRO on the shared login, fr_CHADUAT on
 * chaduat). So a single unscoped locale cannot be shared between them - hence two keys:
 *
 *   Digit.locale.<tenant>    the locale last used ON that deployment, e.g. fr_CHADUAT
 *   Digit.language.pending   a language the user JUST picked, e.g. "fr", region-free
 *
 * Both live in localStorage (Digit.PersistantStorage) so they survive a new tab. The locale
 * that is actually *active* stays in sessionStorage under the unscoped `Digit.locale`, which
 * is what i18next, RequestInfo.msgId, the per-module useStore calls and the pdf utils read.
 *
 * The pending marker exists so a language chosen on the shared login carries into whichever
 * tenant the user then logs in to, even though the locale strings differ. It is written only
 * on a deliberate choice - never on the boot-time auto-select - and is consumed and cleared
 * the first time a deployment applies it, so a stale one can never override a newer
 * per-tenant preference.
 *
 * Resolution order, applied at boot (see applyTenantLocale in the app's entry file):
 *   1. pending, mapped onto this deployment's region and validated -> use, then clear
 *   2. Digit.locale.<tenant>, if still one of the configured languages
 *   3. the tenant's first configured language
 */

/* A remembered language should outlive the Digit.PersistantStorage default of one day. */
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/* localStorage keys are prefixed with "Digit." by PersistantStorage. */
const SCOPED_KEY_PREFIX = "Digit.locale.";
const PENDING_KEY = "language.pending";

const currentDeployment = () => window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "default";

export const tenantLocaleKey = () => `locale.${currentDeployment()}`;

/* "fr_CHADUAT" -> "fr". Locales are <language>_<REGION>, region varying per deployment. */
export const toLanguageSubtag = (locale) => String(locale || "").split("_")[0] || null;

export const getStoredTenantLocale = () => {
  try {
    return Digit?.PersistantStorage?.get(tenantLocaleKey()) || null;
  } catch (e) {
    return null;
  }
};

export const getPendingLanguage = () => {
  try {
    return Digit?.PersistantStorage?.get(PENDING_KEY) || null;
  } catch (e) {
    return null;
  }
};

export const clearPendingLanguage = () => {
  try {
    Digit?.PersistantStorage?.del(PENDING_KEY);
  } catch (e) {
    /* ignore */
  }
};

/**
 * Record a language the user deliberately chose.
 *
 * Call this ONLY from a real user action - the language picker or the top bar dropdown.
 * Calling it on the boot-time auto-select would leave a pending marker on every page load,
 * which would then override every per-tenant preference forever.
 */
export const rememberChosenLanguage = (locale) => {
  if (!locale) return;
  try {
    Digit?.PersistantStorage?.set(tenantLocaleKey(), locale, ONE_YEAR_IN_SECONDS);
    Digit?.PersistantStorage?.set(PENDING_KEY, toLanguageSubtag(locale), ONE_YEAR_IN_SECONDS);
  } catch (e) {
    /* a lost preference just means the default is used next time */
  }
};

/**
 * UserService.logout() clears the whole of localStorage, which would take these with it.
 * Snapshot before logging out, restore immediately after.
 *
 * Prefix-based, so it covers every tenant this browser has seen and core does not need to
 * know which deployments exist.
 */
export const snapshotLanguagePreferences = () => {
  const saved = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      /* Scoped preferences only. The pending marker is a within-journey handoff (shared
         login -> chosen tenant); carrying it past a logout would let a choice made in a
         previous session override the next one. */
      if (key && key.startsWith(SCOPED_KEY_PREFIX)) saved[key] = localStorage.getItem(key);
    }
  } catch (e) {
    /* ignore */
  }
  return saved;
};

export const restoreLanguagePreferences = (saved) => {
  try {
    Object.entries(saved || {}).forEach(([key, value]) => {
      if (value != null) localStorage.setItem(key, value);
    });
  } catch (e) {
    /* ignore */
  }
};
