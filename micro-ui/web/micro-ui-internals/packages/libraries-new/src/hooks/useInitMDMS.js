import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import mdmsService from '../services/mdms';

/**
 * Core MDMS initialization hook for loading essential master data
 * Used by the main app to load foundational MDMS data that all modules need
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.stateCode - State/tenant code
 * @param {Array} config.coreModules - Core MDMS modules to load initially
 * @param {boolean} config.enabled - Whether to enable the hook
 * @param {boolean} config.background - Load in background without blocking UI
 * @returns {Object} Hook state and utilities
 */
const useInitMDMS = ({
  stateCode,
  coreModules = [
    'common-masters',
    'tenant',
    'ACCESSCONTROL-ROLES',
    'ACCESSCONTROL-ACTIONS-TEST',
    'workflow',
    'BillingService',
    'egov-location'
  ],
  schemas = [
    'common-masters.Department',
    'common-masters.Designation', 
    'common-masters.StateInfo',
    'tenant.tenants',
    'tenant.citymodule',
    'ACCESSCONTROL-ROLES.roles',
    'ACCESSCONTROL-ACTIONS-TEST.actions-test'
  ],
  enabled = true,
  background = false
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadedModules, setLoadedModules] = useState([]);
  const queryClient = useQueryClient();

  // Query for core MDMS data
  const {
    data: coreData,
    isLoading: isLoadingCore,
    error: coreError,
    isSuccess: coreSuccess
  } = useQuery({
    queryKey: ['mdms', 'core', stateCode, [...coreModules, ...schemas].sort().join(',')],
    queryFn: async () => {
      console.log('🔄 Loading core MDMS with schemas:', schemas);
      console.log('🔄 Loading core MDMS modules (legacy):', coreModules);
      
      const result = await mdmsService.search({
        tenantId: stateCode,
        modules: coreModules,
        schemas: schemas
      });
      
      console.log('✅ Core MDMS loaded successfully:', Object.keys(result));
      return result;
    },
    enabled: enabled && !!stateCode && (coreModules.length > 0 || schemas.length > 0),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    onSuccess: (data) => {
      // Cache core data in MDMS service for quick access
      mdmsService.setCoreData(stateCode, data);
      
      // Mark modules as loaded
      const loaded = coreModules.filter(module => 
        data && Object.keys(data).some(key => 
          key.toLowerCase().includes(module.toLowerCase()) ||
          module.toLowerCase().includes(key.toLowerCase())
        )
      );
      setLoadedModules(loaded);
      
      console.log(`🎯 Core MDMS initialized: ${loaded.length}/${coreModules.length} modules loaded`);
    },
    onError: (error) => {
      console.error('❌ Failed to load core MDMS:', error);
    }
  });

  // Load essential tenant information
  const {
    data: tenantInfo,
    isLoading: isLoadingTenant,
    error: tenantError
  } = useQuery({
    queryKey: ['mdms', 'tenant-info', stateCode],
    queryFn: async () => {
      console.log('🔄 Loading tenant information for:', stateCode);
      
      const result = await mdmsService.getStateInfo(stateCode);
      
      console.log('✅ Tenant info loaded:', result.code || stateCode);
      return result;
    },
    enabled: enabled && !!stateCode,
    staleTime: 20 * 60 * 1000, // 20 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    onSuccess: (data) => {
      // Store tenant info globally for legacy compatibility
      if (typeof window !== 'undefined') {
        window.Digit = window.Digit || {};
        window.Digit.tenantInfo = data;
        window.Digit.stateCode = stateCode;
      }
    }
  });

  // Calculate overall loading state
  const isLoading = !background && (isLoadingCore || isLoadingTenant);
  const isReady = coreSuccess && !isLoadingCore && !isLoadingTenant && isInitialized;
  const hasError = coreError || tenantError;

  // Mark as initialized when core data is successfully loaded
  useEffect(() => {
    if (coreSuccess && coreData && !isInitialized) {
      setIsInitialized(true);
    }
  }, [coreSuccess, coreData, isInitialized]);

  // Preload commonly needed modules in background
  useEffect(() => {
    if (isInitialized && coreData) {
      const commonModules = ['egov-location', 'common-masters'];
      commonModules.forEach(module => {
        if (!loadedModules.includes(module)) {
          // Preload in background without blocking
          queryClient.prefetchQuery({
            queryKey: ['mdms', 'preload', stateCode, module],
            queryFn: () => mdmsService.search({
              tenantId: stateCode,
              modules: [module]
            }),
            staleTime: 15 * 60 * 1000
          });
        }
      });
    }
  }, [isInitialized, coreData, loadedModules, stateCode, queryClient]);

  /**
   * Get master data for a specific module/master
   */
  const getMasterData = (moduleName, masterName) => {
    if (!coreData) return null;
    
    // Try direct access first
    if (coreData[moduleName]?.[masterName]) {
      return coreData[moduleName][masterName];
    }
    
    // Try case-insensitive search
    const moduleKey = Object.keys(coreData).find(key => 
      key.toLowerCase() === moduleName.toLowerCase()
    );
    
    if (moduleKey && coreData[moduleKey]) {
      const masterKey = Object.keys(coreData[moduleKey]).find(key => 
        key.toLowerCase() === masterName.toLowerCase()
      );
      
      if (masterKey) {
        return coreData[moduleKey][masterKey];
      }
    }
    
    return null;
  };

  /**
   * Check if a specific module is loaded
   */
  const isModuleLoaded = (moduleName) => {
    return loadedModules.some(module => 
      module.toLowerCase() === moduleName.toLowerCase()
    );
  };

  /**
   * Get all loaded modules
   */
  const getLoadedModules = () => {
    return [...loadedModules];
  };

  /**
   * Refresh core MDMS data
   */
  const refreshCore = () => {
    queryClient.invalidateQueries(['mdms', 'core', stateCode]);
    queryClient.invalidateQueries(['mdms', 'tenant-info', stateCode]);
  };

  /**
   * Get tenant information
   */
  const getTenantInfo = () => {
    return tenantInfo;
  };

  return {
    // Loading states
    isLoading,
    isReady,
    isInitialized,
    
    // Data
    coreData,
    tenantInfo,
    loadedModules,
    
    // Error states
    error: hasError,
    coreError,
    tenantError,
    
    // Utilities
    getMasterData,
    isModuleLoaded,
    getLoadedModules,
    getTenantInfo,
    refreshCore,
    
    // State info
    stateCode
  };
};

export default useInitMDMS;