import apiClient from './api/client';
import { ApiUrls } from './api/urls';
import mdmsService from './mdms';

/**
 * Enhanced Localization Service for managing translations and language switching
 * Works with i18next and provides centralized translation repository
 */
class LocalizationService {
  constructor() {
    this.cache = new Map();
    this.currentLanguage = 'en_IN';
    this.translations = {};
    this.loadedModules = new Set();
    this.moduleTranslations = new Map();
    this.availableLanguages = [];
  }

  /**
   * Get localized messages for given modules and locale (legacy compatibility)
   */
  async getLocale({ modules, locale, tenantId }) {
    const cacheKey = `${tenantId}-${locale}-${modules.join(',')}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const requestBody = {
      tenantId,
      module: modules,
      locale,
    };

    try {
      const response = await apiClient.post(ApiUrls.Localization, requestBody,{params: {tenantId,locale,module:modules}});
      const messages = this.processMessages(response.data);
      
      // Cache the result
      this.cache.set(cacheKey, messages);
      
      // Update current translations
      this.translations = { ...this.translations, ...messages };
      this.currentLanguage = locale;
      
      return messages;
    } catch (error) {
      console.error('Error fetching localization data:', error);
      // Return empty object to prevent app crashes
      return {};
    }
  }

  /**
   * Load translations for specific modules
   */
  async loadTranslations(tenantId, modules, language = 'en_IN') {
    const cacheKey = `${tenantId}_${language}_${modules.join(',')}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const requestBody = {
      RequestInfo: {
        apiId: 'digit-ui',
        ver: '1.0',
        ts: Date.now(),
        action: '_search',
        did: '',
        key: '',
        msgId: `search_${Date.now()}`,
        authToken: ''
      },
      tenantId,
      module: modules,
      locale: language
    };
const module=modules?.join(",");

    try {
      const response = await apiClient.post(ApiUrls.Localization, requestBody,{params: {tenantId,locale:language,module}});
      const messages = response.data?.messages || [];
      
      // Transform messages to key-value pairs
      const translations = {};
      messages.forEach(message => {
        translations[message.code] = message.message;
      });
      
      // Cache the result
      this.cache.set(cacheKey, translations);
      
      // Store in memory for quick access
      this.translations[language] = {
        ...this.translations[language],
        ...translations
      };
      
      return translations;
    } catch (error) {
      console.error('Error loading translations:', error);
      return {};
    }
  }

  /**
   * Enhanced module translation loading with better error handling and caching
   */
  async loadModuleTranslations(tenantId, modules, language = 'en_IN') {
    if (!Array.isArray(modules) || modules.length === 0) {
      return {};
    }

    const moduleKey = `${language}_${modules.join(',')}`;
    
    // Check if already loaded
    if (this.moduleTranslations.has(moduleKey)) {
      return this.moduleTranslations.get(moduleKey);
    }

    try {
      const translations = await this.loadTranslations(tenantId, modules, language);
      
      // Store module-specific translations
      this.moduleTranslations.set(moduleKey, translations);
      
      // Mark modules as loaded
      modules.forEach(module => {
        this.loadedModules.add(`${module}_${language}`);
      });
      
      return translations;
    } catch (error) {
      console.error(`Failed to load module translations for modules: ${modules.join(', ')}`, error);
      return {};
    }
  }

  /**
   * Check if specific modules are already loaded for a language
   */
  isModuleLoaded(modules, language) {
    return modules.every(module => 
      this.loadedModules.has(`${module}_${language}`)
    );
  }

  /**
   * Get cached translations for specific modules
   */
  getModuleTranslations(modules, language) {
    const moduleKey = `${language}_${modules.join(',')}`;
    return this.moduleTranslations.get(moduleKey) || {};
  }

  /**
   * Notify that modules have been successfully loaded
   */
  notifyModuleLoaded(modules, language) {
    modules.forEach(module => {
      this.loadedModules.add(`${module}_${language}`);
    });
  }

  /**
   * Get state info including available languages from MDMS
   */
  async getStateInfo(tenantId) {
    try {
      const stateInfo = await mdmsService.getStateInfo(tenantId);
      
      // Process languages
      const languages = stateInfo.hasLocalisation 
        ? stateInfo.languages?.map(lang => ({
            label: lang.label || lang,
            value: lang.value || lang
          })) || []
        : [{ label: "ENGLISH", value: "en_IN" }];
      
      this.availableLanguages = languages;
      
      return {
        ...stateInfo,
        languages
      };
    } catch (error) {
      console.error('Error fetching state info:', error);
      return {
        languages: [{ label: "ENGLISH", value: "en_IN" }]
      };
    }
  }

  /**
   * Process localization messages from API response (legacy compatibility)
   */
  processMessages(data) {
    const messages = {};
    
    if (data?.messages) {
      data.messages.forEach((msg) => {
        messages[msg.code] = msg.message;
      });
    }

    return messages;
  }

  /**
   * Get translation for a key (legacy compatibility)
   */
  getTranslation(key, params = {}) {
    let translation = this.translations[key] || key;
    
    // Replace placeholders with parameters
    Object.keys(params).forEach(param => {
      translation = translation.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });
    
    return translation;
  }

  /**
   * Enhanced language change with module reload support
   */
  async changeLanguage(language, tenantId, reloadModules = true) {
    const previousLanguage = this.currentLanguage;
    this.currentLanguage = language;
    
    // Store in localStorage
    localStorage.setItem('digit-language', language);
    localStorage.setItem('Employee.locale', language);
    localStorage.setItem('Citizen.locale', language);
    
    // Dispatch custom event for components to listen (legacy compatibility)
    window.dispatchEvent(new CustomEvent('digit-language-change', { 
      detail: { language, stateCode: tenantId } 
    }));
    
    try {
      if (reloadModules) {
        // Get all loaded modules for previous language and reload for new language
        const loadedModuleKeys = Array.from(this.loadedModules)
          .filter(key => key.endsWith(`_${previousLanguage}`))
          .map(key => key.replace(`_${previousLanguage}`, ''));
        
        if (loadedModuleKeys.length > 0) {
          await this.loadModuleTranslations(tenantId, loadedModuleKeys, language);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      // Revert language change on error
      this.currentLanguage = previousLanguage;
      return false;
    }
  }

  /**
   * Load default language modules (legacy compatibility)
   */
  async loadDefaultData(stateCode, moduleCode, language, modulePrefix) {
    const modules = [];
    
    if (typeof moduleCode === 'string') {
      modules.push(modulePrefix ? `${modulePrefix}-${moduleCode.toLowerCase()}` : `${moduleCode.toLowerCase()}`);
    } else if (Array.isArray(moduleCode)) {
      moduleCode.forEach((code) => {
        modules.push(modulePrefix ? `${modulePrefix}-${code.toLowerCase()}` : `${code.toLowerCase()}`);
      });
    }

    await this.getLocale({
      modules,
      locale: language,
      tenantId: stateCode,
    });

    return {};
  }

  /**
   * Clear all caches and loaded module tracking
   */
  clearCache() {
    this.cache.clear();
    this.moduleTranslations.clear();
    this.loadedModules.clear();
    this.translations = {};
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage || localStorage.getItem('digit-language') || 'en_IN';
  }

  /**
   * Get available languages
   */
  getAvailableLanguages() {
    return this.availableLanguages;
  }

  /**
   * Get all loaded modules for debugging
   */
  getLoadedModules() {
    return Array.from(this.loadedModules);
  }

  /**
   * Get all cached translations (legacy compatibility)
   */
  getAllTranslations() {
    return this.translations;
  }

  /**
   * Preload modules in background
   */
  async preloadModules(tenantId, modules, language) {
    try {
      await this.loadModuleTranslations(tenantId, modules, language);
      console.log(`✅ Preloaded translations for modules: ${modules.join(', ')}`);
    } catch (error) {
      console.warn(`⚠️ Failed to preload translations for modules: ${modules.join(', ')}`, error);
    }
  }
}

export default new LocalizationService();