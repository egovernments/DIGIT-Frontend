import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import mdmsService from '../services/mdms';

/**
 * Custom MDMS hook for specific master data fetching with fallback support
 * Used for ad-hoc MDMS queries, fallback data loading, or specific master data requirements
 * 
 * @param {Object} config - Configuration object
 * @param {Array|string} config.modules - MDMS modules to fetch (can be single module or array)
 * @param {string} config.stateCode - State/tenant code (optional, uses global if not provided)
 * @param {boolean} config.enabled - Whether to enable the hook
 * @param {Object} config.filters - Additional filters to apply
 * @param {boolean} config.lazy - Whether to load data lazily (manually trigger)
 * @param {number} config.staleTime - How long data stays fresh (default: 10 minutes)
 * @param {number} config.cacheTime - How long data stays in cache (default: 30 minutes)
 * @param {string} config.queryKey - Custom query key suffix
 * @returns {Object} Hook state and utilities
 */
const useCustomMDMS = ({
  modules = [],
  schemas = [],
  stateCode,
  enabled = true,
  filters = {},
  lazy = false,
  staleTime = 10 * 60 * 1000, // 10 minutes
  cacheTime = 30 * 60 * 1000, // 30 minutes
  queryKey: customQueryKey
}) => {
  const [manualEnabled, setManualEnabled] = useState(!lazy);
  const queryClient = useQueryClient();

  // Normalize modules to array
  const normalizedModules = Array.isArray(modules) ? modules : [modules];
  const normalizedSchemas = Array.isArray(schemas) ? schemas : [schemas];
  
  // Get stateCode from global if not provided
  const effectiveStateCode = stateCode || window?.Digit?.stateCode || 'mz';
  
  // Create unique query key
  const queryKey = [
    'mdms', 
    'custom',
    customQueryKey || 'default',
    effectiveStateCode,
    [...normalizedModules, ...normalizedSchemas].sort().join(','),
    JSON.stringify(filters)
  ];

  // Main query for custom MDMS data
  const {
    data,
    isLoading,
    error,
    isSuccess,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('🔄 Custom MDMS fetch with schemas:', normalizedSchemas);
      console.log('🔄 Custom MDMS fetch with modules (legacy):', normalizedModules);
      console.log('🔄 Custom MDMS filters:', filters);
      
      const result = await mdmsService.search({
        tenantId: effectiveStateCode,
        modules: normalizedModules,
        schemas: normalizedSchemas,
        filter: Object.keys(filters).length > 0 ? filters : undefined
      });
      
      console.log('✅ Custom MDMS loaded:', Object.keys(result));
      return result;
    },
    enabled: enabled && manualEnabled && (normalizedModules.length > 0 || normalizedSchemas.length > 0),
    staleTime,
    cacheTime,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('❌ Custom MDMS fetch failed:', error);
    }
  });

  /**
   * Manually trigger the query (for lazy loading)
   * Can accept new parameters to update the query dynamically
   */
  const trigger = useCallback((newParams = {}) => {
    if (lazy) {
      setManualEnabled(true);
    }
    
    // If new parameters are provided, we should refetch with updated params
    // For now, just refetch with existing params since React Query doesn't
    // easily support dynamic query key updates in the same hook instance
    return refetch();
  }, [lazy, refetch]);

  /**
   * Get master data for a specific module/master
   */
  const getMasterData = useCallback((moduleName, masterName) => {
    if (!data) return null;
    
    // Try direct access first
    if (data[moduleName]?.[masterName]) {
      return data[moduleName][masterName];
    }
    
    // Try case-insensitive search
    const moduleKey = Object.keys(data).find(key => 
      key.toLowerCase() === moduleName.toLowerCase()
    );
    
    if (moduleKey && data[moduleKey]) {
      const masterKey = Object.keys(data[moduleKey]).find(key => 
        key.toLowerCase() === masterName.toLowerCase()
      );
      
      if (masterKey) {
        return data[moduleKey][masterKey];
      }
    }
    
    return null;
  }, [data]);

  /**
   * Get all masters for a specific module
   */
  const getModuleMasters = useCallback((moduleName) => {
    if (!data) return null;
    
    // Try direct access first
    if (data[moduleName]) {
      return data[moduleName];
    }
    
    // Try case-insensitive search
    const moduleKey = Object.keys(data).find(key => 
      key.toLowerCase() === moduleName.toLowerCase()
    );
    
    return moduleKey ? data[moduleKey] : null;
  }, [data]);

  /**
   * Search for specific master data with criteria
   */
  const searchMasters = useCallback((moduleName, masterName, searchCriteria = {}) => {
    const masters = getMasterData(moduleName, masterName);
    if (!masters || !Array.isArray(masters)) return [];

    if (Object.keys(searchCriteria).length === 0) {
      return masters;
    }

    return masters.filter(item => {
      return Object.entries(searchCriteria).every(([key, value]) => {
        if (typeof value === 'string') {
          return String(item[key]).toLowerCase().includes(value.toLowerCase());
        }
        return item[key] === value;
      });
    });
  }, [getMasterData]);

  /**
   * Get master data with fallback to default values
   */
  const getMasterDataWithFallback = useCallback((moduleName, masterName, fallback = null) => {
    const result = getMasterData(moduleName, masterName);
    return result !== null ? result : fallback;
  }, [getMasterData]);

  /**
   * Check if specific master data exists and is not empty
   */
  const hasMasterData = useCallback((moduleName, masterName) => {
    const result = getMasterData(moduleName, masterName);
    return result !== null && (
      !Array.isArray(result) || result.length > 0
    );
  }, [getMasterData]);

  /**
   * Get data using dot notation path (e.g., "common-masters.Department")
   */
  const getDataByPath = useCallback((path, fallback = null) => {
    if (!data || !path) return fallback;
    
    const pathArray = path.split('.');
    let current = data;
    
    for (const key of pathArray) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }
    
    return current;
  }, [data]);

  /**
   * Prefetch additional modules without affecting current query
   */
  const prefetchModules = useCallback(async (additionalModules) => {
    const modulesToPrefetch = Array.isArray(additionalModules) 
      ? additionalModules 
      : [additionalModules];

    return queryClient.prefetchQuery({
      queryKey: [
        'mdms', 
        'custom',
        'prefetch',
        effectiveStateCode,
        modulesToPrefetch.sort().join(',')
      ],
      queryFn: () => mdmsService.search({
        tenantId: effectiveStateCode,
        modules: modulesToPrefetch
      }),
      staleTime: staleTime / 2 // Shorter stale time for prefetched data
    });
  }, [queryClient, effectiveStateCode, staleTime]);

  /**
   * Clear cache for this query
   */
  const clearCache = useCallback(() => {
    queryClient.removeQueries(queryKey);
  }, [queryClient, queryKey]);

  /**
   * Reset the hook state
   */
  const reset = useCallback(() => {
    setManualEnabled(!lazy);
    clearCache();
  }, [lazy, clearCache]);

  return {
    // Loading states
    isLoading,
    isFetching,
    isSuccess,
    isError,
    
    // Data
    data,
    
    // Error states
    error,
    hasError: !!error,
    
    // Utilities
    getMasterData,
    getModuleMasters,
    searchMasters,
    getMasterDataWithFallback,
    hasMasterData,
    getDataByPath,
    
    // Actions
    trigger,
    refetch,
    prefetchModules,
    clearCache,
    reset,
    
    // Configuration
    modules: normalizedModules,
    schemas: normalizedSchemas,
    stateCode: effectiveStateCode,
    enabled: enabled && manualEnabled,
    lazy
  };
};

/**
 * Simplified hook for fetching a single master
 */
export const useMasterData = (moduleName, masterName, options = {}) => {
  const {
    data,
    isLoading,
    error,
    getMasterData
  } = useCustomMDMS({
    modules: [moduleName],
    ...options
  });

  return {
    data: getMasterData(moduleName, masterName),
    isLoading,
    error,
    hasError: !!error,
    refetch: options.refetch
  };
};

/**
 * Hook for fetching multiple related masters
 */
export const useMultipleMasters = (masterConfigs = [], options = {}) => {
  // Extract unique modules from configs
  const modules = [...new Set(masterConfigs.map(config => config.module))];
  
  const {
    data,
    isLoading,
    error,
    getMasterData,
    ...rest
  } = useCustomMDMS({
    modules,
    ...options
  });

  // Map configs to their data
  const masters = masterConfigs.reduce((acc, config) => {
    const key = config.key || `${config.module}_${config.master}`;
    acc[key] = getMasterData(config.module, config.master);
    return acc;
  }, {});

  return {
    masters,
    data,
    isLoading,
    error,
    hasError: !!error,
    ...rest
  };
};

export default useCustomMDMS;