/**
 * Get the MDMS config module name from global configuration
 * @returns {string} Module name for MDMS config
 */
export const getConfigModuleName = () => {
  return window?.globalConfigs?.getConfig?.("UICONFIG_MODULENAME") || "commonUiConfig";
};

/**
 * Get default language from global configuration
 * @returns {string} Default language code
 */
export const getDefaultLanguage = () => {
  return window?.globalConfigs?.getConfig?.("DEFAULT_LANGUAGE") || "en_IN";
};

/**
 * Get current language from localStorage with fallback
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => {
  return localStorage.getItem('digit-language') || getDefaultLanguage();
};

/**
 * Set current language in localStorage
 * @param {string} language - Language code to set
 */
export const setCurrentLanguage = (language) => {
  localStorage.setItem('digit-language', language);
};

/**
 * Get state level tenant ID from global configuration
 * @returns {string} State level tenant ID
 */
export const getStateLevelTenant = () => {
  return window?.globalConfigs?.getConfig?.('STATE_LEVEL_TENANT_ID') || 'mz';
};