import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import localizationService from '../services/localization';
import { getCurrentLanguage, getStateLevelTenant } from '../utils';

/**
 * Core localization initialization hook for app startup
 * Initializes i18next and loads default core translations
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.stateCode - State/tenant code for localization
 * @param {string[]} config.coreModules - Core modules to load initially (default: common core modules)
 * @param {string} config.defaultLanguage - Default language (default: from localStorage or 'en_IN')
 * @param {boolean} config.enableDetection - Enable language detection (default: false)
 * @returns {Object} - { isLoading, error, isReady, currentLanguage, availableLanguages, changeLanguage }
 */
const useInitLocalization = ({
  stateCode,
  coreModules = [
    'rainmaker-common',
    'rainmaker-core',
    'digit-ui',
    'common-masters',
    'tenant',
    'locale'
  ],
  defaultLanguage,
  enableDetection = false
} = {}) => {
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    defaultLanguage || getCurrentLanguage()
  );
  const [availableLanguages, setAvailableLanguages] = useState([]);
  
  const tenantId = stateCode || getStateLevelTenant();

  // Initialize i18next instance
  useEffect(() => {
    const initI18n = async () => {
      if (!i18next.isInitialized) {
        await i18next
          .use(initReactI18next)
          .init({
            lng: currentLanguage,
            fallbackLng: 'en_IN',
            debug: process.env.NODE_ENV === 'development',
            
            interpolation: {
              escapeValue: false, // React already does escaping
            },
            
            detection: enableDetection ? {
              order: ['localStorage', 'navigator', 'htmlTag'],
              lookupLocalStorage: 'digit-language',
              caches: ['localStorage'],
            } : undefined,
            
            resources: {}, // Will be populated by localization service
          });
      }
      setIsI18nReady(true);
    };

    initI18n();
  }, [currentLanguage, enableDetection]);

  // Load core translations
  const { data: localizationData, isLoading, error } = useQuery({
    queryKey: ['coreLocalization', tenantId, currentLanguage, coreModules],
    queryFn: async () => {
      if (!isI18nReady) return null;
      
      // Load available languages first
      const stateInfoResult = await localizationService.getStateInfo(tenantId);
      const languages = stateInfoResult.languages || [
        { label: 'ENGLISH', value: 'en_IN' },
        { label: 'हिंदी', value: 'hi_IN' }
      ];
      
      setAvailableLanguages(languages);
      
      // Load core module translations
      const translations = await localizationService.loadModuleTranslations(
        tenantId,
        coreModules,
        currentLanguage
      );
      
      // Add translations to i18next
      i18next.addResourceBundle(currentLanguage, 'translation', translations, true, true);
      
      // Notify localization service about successful load
      localizationService.notifyModuleLoaded(coreModules, currentLanguage);
      
      return {
        translations,
        languages,
        loadedModules: coreModules
      };
    },
    enabled: isI18nReady && !!tenantId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });

  // Change language function
  const changeLanguage = async (newLanguage) => {
    try {
      setCurrentLanguage(newLanguage);
      
      // Store in localStorage
      localStorage.setItem('digit-language', newLanguage);
      localStorage.setItem('Employee.locale', newLanguage);
      localStorage.setItem('Citizen.locale', newLanguage);
      
      // Load translations for new language
      if (localizationData?.loadedModules) {
        const translations = await localizationService.loadModuleTranslations(
          tenantId,
          localizationData.loadedModules,
          newLanguage
        );
        
        // Add translations to i18next
        i18next.addResourceBundle(newLanguage, 'translation', translations, true, true);
      }
      
      // Change i18next language
      await i18next.changeLanguage(newLanguage);
      
      // Notify localization service
      await localizationService.changeLanguage(newLanguage, tenantId);
      
      // Trigger page reload if needed for complete language switch
      // window.location.reload();
      
    } catch (err) {
      console.error('Failed to change language:', err);
      // Revert to previous language on error
      setCurrentLanguage(currentLanguage);
    }
  };

  return {
    isLoading: isLoading || !isI18nReady,
    error,
    isReady: !isLoading && isI18nReady && !!localizationData,
    currentLanguage,
    availableLanguages,
    translations: localizationData?.translations || {},
    loadedModules: localizationData?.loadedModules || [],
    changeLanguage,
    
    // Utility functions
    t: i18next.t,
    i18n: i18next,
  };
};

export default useInitLocalization;