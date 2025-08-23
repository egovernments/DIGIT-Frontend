import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import localizationService from '../services/localization';
import { getCurrentLanguage, getStateLevelTenant } from '../utils';

/**
 * Module-specific localization hook for individual modules to load their translations
 * Adds module translations to the centralized i18next instance
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.moduleName - Module name (required)
 * @param {string[]} config.modules - Array of module codes to load translations for
 * @param {string} config.stateCode - State/tenant code (optional, defaults to global)
 * @param {string} config.language - Language code (optional, defaults to current language)
 * @param {boolean} config.enabled - Whether to enable the query (default: true)
 * @param {boolean} config.background - Load in background without blocking (default: false)
 * @returns {Object} - { isLoading, error, translations, isLoaded, reload }
 */
const useModuleLocalization = ({
  moduleName,
  modules = [],
  stateCode,
  language,
  enabled = true,
  background = false
}) => {
  const currentLanguage = language || getCurrentLanguage();
  const tenantId = stateCode || getStateLevelTenant();
  
  // Validate required parameters
  if (!moduleName) {
    throw new Error('useModuleLocalization: moduleName is required');
  }

  // If modules array is empty, use moduleName as the module to load
  const moduleList = modules.length > 0 ? modules : [moduleName];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['moduleLocalization', moduleName, moduleList, tenantId, currentLanguage],
    queryFn: async () => {
      try {
        // Check if already loaded to avoid duplicate loading
        const alreadyLoaded = localizationService.isModuleLoaded(moduleList, currentLanguage);
        if (alreadyLoaded && !background) {
          return {
            translations: localizationService.getModuleTranslations(moduleList, currentLanguage),
            cached: true
          };
        }

        // Load module translations
        const translations = await localizationService.loadModuleTranslations(
          tenantId,
          moduleList,
          currentLanguage
        );

        // Add translations to i18next (merge with existing)
        if (translations && Object.keys(translations).length > 0) {
          i18next.addResourceBundle(currentLanguage, 'translation', translations, true, true);
          
          // Notify localization service about successful load
          localizationService.notifyModuleLoaded(moduleList, currentLanguage);
          
          console.log(`✅ Loaded translations for module: ${moduleName}`, {
            modules: moduleList,
            language: currentLanguage,
            translationCount: Object.keys(translations).length
          });
        }

        return {
          translations,
          cached: false
        };
      } catch (err) {
        console.error(`❌ Failed to load translations for module: ${moduleName}`, err);
        throw err;
      }
    },
    enabled: enabled && !!moduleName && !!tenantId && !!currentLanguage && i18next.isInitialized,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Background loading options
    refetchOnWindowFocus: !background,
    refetchOnMount: !background,
  });

  // Check if module is loaded
  const isLoaded = !!data && !isLoading && !error;

  return {
    isLoading: enabled ? isLoading : false,
    error,
    translations: data?.translations || {},
    isLoaded,
    isCached: data?.cached || false,
    reload: refetch,
    
    // Utility functions
    getTranslation: (key, options) => {
      if (isLoaded) {
        return i18next.t(key, options);
      }
      return key; // Return key if not loaded yet
    },
    
    // Module info
    moduleName,
    modules: moduleList,
    language: currentLanguage,
  };
};

/**
 * Hook for preloading module translations in background
 * Useful for lazy-loaded modules or prefetching
 */
export const usePreloadModuleLocalization = (config) => {
  return useModuleLocalization({
    ...config,
    background: true,
    enabled: true
  });
};

/**
 * Hook for conditionally loading module translations
 * Only loads when condition is met
 */
export const useConditionalModuleLocalization = (condition, config) => {
  return useModuleLocalization({
    ...config,
    enabled: !!condition
  });
};

export default useModuleLocalization;