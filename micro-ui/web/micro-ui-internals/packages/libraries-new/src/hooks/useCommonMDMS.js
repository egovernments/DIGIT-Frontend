import { useQuery } from '@tanstack/react-query';
import mdmsService from '../services/mdms';

/**
 * Common MDMS hook for fetching master data
 * @param {string} stateCode - State/tenant code
 * @param {string} moduleName - MDMS module name
 * @param {Array} masterNames - Array of master data names to fetch
 * @param {Object} config - React Query config options
 * @returns {Object} Query result with data, isLoading, error, etc.
 */
const useCommonMDMS = (stateCode, moduleName, masterNames, config = {}) => {
  return useQuery({
    queryKey: ['MDMS', stateCode, moduleName, masterNames],
    queryFn: async () => {
      // Use the MDMS service to fetch multiple master data
      const result = await mdmsService.getMultipleMasterData(stateCode, moduleName, masterNames);
      return result;
    },
    enabled: !!(stateCode && moduleName && masterNames?.length > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    ...config
  });
};

export default useCommonMDMS;