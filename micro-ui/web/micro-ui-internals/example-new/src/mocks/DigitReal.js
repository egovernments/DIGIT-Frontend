// Real Digit implementation using new libraries
import { 
  mdmsService, 
  localizationService, 
  Hooks,
  getDefaultLanguage,
  Storage,
  SessionStorage
} from '@egovernments/digit-ui-libraries-new';

// Global config is now set in the HTML file
// Use the existing window.globalConfigs that's loaded there

// Ensure window.Digit exists
window.Digit = window.Digit || {};

// Debug: Check what we're importing
console.log('DigitReal: Imported Hooks:', Hooks);
console.log('DigitReal: Hooks.useStore:', Hooks.useStore);

// Create real Digit object using new libraries
window.Digit = {
  // Hooks - reference to real hooks
  Hooks: Hooks,

  // Store Data
  StoreData: {
    getCurrentLanguage: () => {
      return SessionStorage.get('locale') || getDefaultLanguage();
    }
  },

  // Utils
  Utils: {
    getDefaultLanguage: () => {
      return getDefaultLanguage();
    }
  },

  // Session Storage
  SessionStorage: {
    get: (key) => SessionStorage.get(key),
    set: (key, value) => SessionStorage.set(key, value)
  },

  // Storage
  Storage: {
    get: (key) => Storage.get(key),
    set: (key, value) => Storage.set(key, value)
  },

  // Localization Service
  LocalizationService: {
    changeLanguage: async (language, stateCode) => {
      console.log(`Language changed to: ${language} for state: ${stateCode}`);
      
      // Use real localization service
      await localizationService.changeLanguage(language, stateCode);
      
      // Update session storage
      SessionStorage.set('locale', language);
      
      // Trigger a re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent('digit-language-change', { 
        detail: { language, stateCode } 
      }));
    },

    getLocale: async ({ modules, locale, tenantId }) => {
      return await localizationService.getLocale({ modules, locale, tenantId });
    }
  },

  // Component Registry Service
  ComponentRegistryService: {
    setupRegistry: (modules) => {
      console.log('Modules registered:', modules);
    }
  },

  // Services
  Services: {
    mdms: mdmsService,
    localization: localizationService
  }
};

// Debug: Check final Digit object structure
console.log('DigitReal: Final window.Digit:', window.Digit);
console.log('DigitReal: window.Digit.Hooks:', window.Digit.Hooks);
console.log('DigitReal: window.Digit.Hooks.useStore:', window.Digit.Hooks.useStore);

export default window.Digit;