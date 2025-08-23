import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import mdmsService from '../services/mdms';

/**
 * Module-specific MDMS hook for loading master data required by individual modules
 * Used by specific modules to load their required MDMS data without affecting other modules
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.moduleName - Unique identifier for the module (for caching)
 * @param {Array} config.modules - MDMS modules to load for this specific module
 * @param {string} config.stateCode - State/tenant code (optional, uses global if not provided)
 * @param {boolean} config.enabled - Whether to enable the hook
 * @param {boolean} config.background - Load in background without blocking UI
 * @param {Array} config.dependsOn - Other modules this depends on (load order)
 * @returns {Object} Hook state and utilities
 */
const useModuleMDMS = ({
  moduleName,
  modules = [],
  schemas = [],
  stateCode,
  enabled = true,
  background = false,
  dependsOn = []
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cachedData, setCachedData] = useState(null);

  // Get stateCode from global if not provided
  const effectiveStateCode = stateCode || window?.Digit?.stateCode || 'mz';

  // Check if dependencies are loaded
  const dependenciesReady = dependsOn.length === 0 || 
    dependsOn.every(dep => mdmsService.isModuleLoaded(dep, effectiveStateCode));

  // Query for module-specific MDMS data
  const {
    data: moduleData,
    isLoading,
    error,
    isSuccess,
    isCached,
    refetch
  } = useQuery({
    queryKey: ['mdms', 'module', moduleName, effectiveStateCode, [...modules, ...schemas].sort().join(',')],
    queryFn: async () => {
      console.log(`🔄 Loading MDMS for module "${moduleName}" with schemas:`, schemas);
      console.log(`🔄 Loading MDMS for module "${moduleName}" with modules (legacy):`, modules);
      
      const result = await mdmsService.search({
        tenantId: effectiveStateCode,
        modules,
        schemas
      });
      
      console.log(`✅ MDMS loaded for module "${moduleName}":`, Object.keys(result));
      return result;
    },
    enabled: enabled && !!moduleName && (modules.length > 0 || schemas.length > 0) && dependenciesReady,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 45 * 60 * 1000, // 45 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: (data) => {
      // Store module data in MDMS service
      mdmsService.setModuleData(moduleName, effectiveStateCode, data);
      
      // Cache locally for quick access
      setCachedData(data);
      
      // Mark module as loaded
      mdmsService.markModuleLoaded(moduleName, effectiveStateCode, modules);
      
      console.log(`🎯 Module "${moduleName}" MDMS loaded successfully`);
    },
    onError: (error) => {
      console.error(`❌ Failed to load MDMS for module "${moduleName}":`, error);
    }
  });

  // Mark as loaded when data is successfully fetched
  useEffect(() => {
    if (isSuccess && moduleData && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isSuccess, moduleData, isLoaded]);

  // Initialize cached data from service if available
  useEffect(() => {
    if (!cachedData && moduleName && effectiveStateCode) {
      const cached = mdmsService.getModuleData(moduleName, effectiveStateCode);
      if (cached) {
        setCachedData(cached);
        setIsLoaded(true);
      }
    }
  }, [moduleName, effectiveStateCode, cachedData]);

  /**
   * Get master data for a specific module/master within this module's data
   */
  const getMasterData = (moduleName, masterName) => {
    const data = moduleData || cachedData;
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
  };

  /**
   * Get all master data for a specific module
   */
  const getModuleMasters = (moduleName) => {
    const data = moduleData || cachedData;
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
  };

  /**
   * Check if specific master data exists
   */
  const hasMasterData = (moduleName, masterName) => {
    return getMasterData(moduleName, masterName) !== null;
  };

  /**
   * Get all loaded modules for this module instance
   */
  const getLoadedModules = () => {
    return modules.filter(module => 
      mdmsService.isModuleLoaded(`${moduleName}_${module}`, effectiveStateCode)
    );
  };

  /**
   * Reload module data
   */
  const reloadModule = () => {
    // Clear cached data
    setCachedData(null);
    setIsLoaded(false);
    
    // Clear service cache
    mdmsService.clearModuleData(moduleName, effectiveStateCode);
    
    // Refetch data
    refetch();
  };

  /**
   * Get specific data with fallback support
   */
  const getDataWithFallback = (path, fallback = null) => {
    const data = moduleData || cachedData;
    if (!data) return fallback;
    
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
  };

  return {
    // Loading states
    isLoading: !background && isLoading,
    isLoaded,
    isCached,
    dependenciesReady,
    
    // Data
    data: moduleData || cachedData,
    moduleData: moduleData || cachedData,
    
    // Error states
    error,
    hasError: !!error,
    
    // Utilities
    getMasterData,
    getModuleMasters,
    hasMasterData,
    getLoadedModules,
    getDataWithFallback,
    reloadModule,
    
    // Module info
    moduleName,
    modules,
    stateCode: effectiveStateCode
  };
};

/**
 * Preload module MDMS data in background
 */
export const usePreloadModuleMDMS = ({
  moduleName,
  modules,
  stateCode
}) => {
  return useModuleMDMS({
    moduleName: `preload_${moduleName}`,
    modules,
    stateCode,
    background: true,
    enabled: true
  });
};

/**
 * Conditionally load module MDMS data based on a condition
 */
export const useConditionalModuleMDMS = (condition, config) => {
  return useModuleMDMS({
    ...config,
    enabled: condition && (config.enabled !== false)
  });
};

export default useModuleMDMS;