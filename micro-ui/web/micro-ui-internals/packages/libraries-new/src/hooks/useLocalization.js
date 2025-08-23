import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import localizationService from '../services/localization';

/**
 * Localization hook for managing translations
 */
export const useLocalization = () => {
  const queryClient = useQueryClient();

  /**
   * Get translations for specific modules
   */
  const getTranslations = useCallback(({ modules, locale, tenantId }) => {
    return useQuery({
      queryKey: ['LOCALIZATION', tenantId, locale, modules],
      queryFn: () => localizationService.getLocale({ modules, locale, tenantId }),
      enabled: !!(tenantId && locale && modules?.length),
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      refetchOnWindowFocus: false,
    });
  }, []);

  /**
   * Change language and update cache
   */
  const changeLanguage = useCallback(async (language, stateCode, modules = []) => {
    try {
      await localizationService.changeLanguage(language, stateCode, modules);
      
      // Invalidate all localization queries to fetch new language
      queryClient.invalidateQueries({ queryKey: ['LOCALIZATION'] });
      
      // Also invalidate store data to update with new language
      queryClient.invalidateQueries({ queryKey: ['STORE_DATA'] });
      
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  }, [queryClient]);

  /**
   * Get translation for a key
   */
  const t = useCallback((key, params = {}) => {
    return localizationService.getTranslation(key, params);
  }, []);

  /**
   * Get current language
   */
  const getCurrentLanguage = useCallback(() => {
    return localizationService.getCurrentLanguage();
  }, []);

  /**
   * Clear localization cache
   */
  const clearCache = useCallback(() => {
    localizationService.clearCache();
    queryClient.invalidateQueries({ queryKey: ['LOCALIZATION'] });
  }, [queryClient]);

  return {
    getTranslations,
    changeLanguage,
    t,
    getCurrentLanguage,
    clearCache,
  };
};

/**
 * Hook to preload translations for specific modules
 */
export const usePreloadTranslations = (tenantId, modules, locale) => {
  return useQuery({
    queryKey: ['LOCALIZATION_PRELOAD', tenantId, locale, modules],
    queryFn: () => localizationService.getLocale({ modules, locale, tenantId }),
    enabled: !!(tenantId && locale && modules?.length),
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export default useLocalization;