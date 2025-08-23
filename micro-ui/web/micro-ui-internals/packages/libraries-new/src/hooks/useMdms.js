import { useQuery } from '@tanstack/react-query';
import mdmsService from '../services/mdms';

/**
 * Hook for MDMS operations with caching
 */

/**
 * Generic MDMS search hook
 */
export const useMdmsSearch = (tenantId, moduleDetails, options = {}) => {
  return useQuery({
    queryKey: ['MDMS_SEARCH', tenantId, moduleDetails],
    queryFn: () => mdmsService.search(tenantId, moduleDetails),
    enabled: !!tenantId && !!moduleDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Get master data hook
 */
export const useMasterData = (tenantId, moduleName, masterName, filter = null, options = {}) => {
  return useQuery({
    queryKey: ['MASTER_DATA', tenantId, moduleName, masterName, filter],
    queryFn: () => mdmsService.getMasterData(tenantId, moduleName, masterName, filter),
    enabled: !!tenantId && !!moduleName && !!masterName,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Get multiple master data types
 */
export const useMultipleMasterData = (tenantId, moduleName, masterNames, options = {}) => {
  return useQuery({
    queryKey: ['MULTIPLE_MASTER_DATA', tenantId, moduleName, masterNames],
    queryFn: () => mdmsService.getMultipleMasterData(tenantId, moduleName, masterNames),
    enabled: !!tenantId && !!moduleName && Array.isArray(masterNames) && masterNames.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Specific master data hooks
 */

export const useDepartments = (tenantId, options = {}) => {
  return useQuery({
    queryKey: ['DEPARTMENTS', tenantId],
    queryFn: () => mdmsService.getDepartments(tenantId),
    enabled: !!tenantId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useDesignations = (tenantId, options = {}) => {
  return useQuery({
    queryKey: ['DESIGNATIONS', tenantId],
    queryFn: () => mdmsService.getDesignations(tenantId),
    enabled: !!tenantId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useTenants = (tenantId, options = {}) => {
  return useQuery({
    queryKey: ['TENANTS', tenantId],
    queryFn: () => mdmsService.getTenants(tenantId),
    enabled: !!tenantId,
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCityModules = (tenantId, options = {}) => {
  return useQuery({
    queryKey: ['CITY_MODULES', tenantId],
    queryFn: () => mdmsService.getCityModules(tenantId),
    enabled: !!tenantId,
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useStateInfo = (tenantId, options = {}) => {
  return useQuery({
    queryKey: ['STATE_INFO', tenantId],
    queryFn: () => mdmsService.getStateInfo(tenantId),
    enabled: !!tenantId,
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    cacheTime: 4 * 60 * 60 * 1000, // 4 hours
    refetchOnWindowFocus: false,
    ...options,
  });
};