import { useQuery } from '@tanstack/react-query';
import mdmsService from '../services/mdms';
import localizationService from '../services/localization';
import { getDefaultLanguage } from '../utils/common';

/**
 * Hook to get initialization data including languages and state info
 */
export const useGetInitData = () => {
  // Get stateCode from global config, defaulting to 'mz' if not found
  const stateCode = window?.globalConfigs?.getConfig?.('STATE_LEVEL_TENANT_ID') || 'mz';
  
  return useQuery({
    queryKey: ['STORE_DATA'],
    queryFn: async () => {
      try {
        // Get MDMS data
        const initData = await mdmsService.getInitData(stateCode);
        
        // Set selected language
        initData.selectedLanguage = getCurrentLanguage() || initData.languages[0]?.value || 'en_IN';
        
        // Load localization data - use basic modules for core functionality
        const localizationModules = [
          'digit-ui-common',
          'digit-ui',
          'digit-tenants',
          `digit-ui-${stateCode.toLowerCase()}`
        ];

        await localizationService.getLocale({
          modules: localizationModules,
          locale: initData.selectedLanguage,
          tenantId: stateCode,
        });

        // Store in session storage for quick access
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('digit-init-data', JSON.stringify(initData));
        }

        return initData;
      } catch (error) {
        console.error('Failed to fetch init data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

/**
 * Store object that matches the original interface pattern
 * This creates a structure where useStore.getInitData points to the hook
 */
export const useStore = {
  getInitData: useGetInitData,
  getCurrentLanguage: () => {
    return getCurrentLanguage();
  }
};

/**
 * Get current language from various sources
 */
function getCurrentLanguage() {
  if (typeof window !== 'undefined') {
    return (
      localStorage.getItem('digit-language') ||
      sessionStorage.getItem('locale') ||
      getDefaultLanguage()
    );
  }
  return 'en_IN';
}

export default useStore;