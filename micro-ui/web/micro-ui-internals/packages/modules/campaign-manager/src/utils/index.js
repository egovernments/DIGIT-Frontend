import _ from "lodash";
import { downloadExcelWithCustomName } from "./downloadExcel";
const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";


export default {
  downloadExcelWithCustomName,
  getModuleName: () => {
    return window?.Digit?.Customizations?.commonUiConfig?.["HCM_MODULE_NAME"] || "console";
  },
 /**
 * Generates criteria for fetching data from MDMS v1.
 * 
 * @param {string} tenantId - The tenant identifier for the MDMS request.
 * @param {string} moduleName - The name of the module whose data is to be fetched.
 * @param {Array} masterDetails - An array specifying the master details to fetch from the module.
 * @param {string} cacheKey - A unique key used for caching the query results.
 * 
 * @returns {Object} - A query object to be used with React Query or a similar data fetching utility.
 */
getMDMSV1Criteria: (tenantId, moduleName, masterDetails, cacheKey="CAMP_MDMS",config={}) => {
  const MDMSV1Criteria = {
    // API endpoint for MDMS v1 search
    url: `/${mdms_context_path}/v1/_search`,

    // Request payload with tenant and module/master details
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: moduleName,
            masterDetails: masterDetails
          }
        ]
      }
    },

    // Custom query name for React Query caching and identification
    changeQueryName: `CMP-${cacheKey}`,

    // Query configuration for caching and data selection
    config: {
      enabled: true,              // Enables the query
      cacheTime: Infinity,        // Keeps cached data forever
      staleTime: Infinity,        // Data never becomes stale
      select: (data) => {
        // Select and return the module's data
        return data?.MdmsRes?.[moduleName];
      },
      ...config
    },
  };

  return MDMSV1Criteria;
},
/**
 * Generates criteria for fetching data from MDMS v2.
 * 
 * @param {string} tenantId - The tenant identifier for the MDMS request.
 * @param {string} schemaCode - The schema code for the MDMS v2 request.
 * @param {Object} filters - Filter criteria for the MDMS v2 search.
 * @param {string} cacheKey - A unique key used for caching the query results.
 * @param {Object} config - Additional configuration options for React Query.
 * 
 * @returns {Object} - A query object to be used with React Query or a similar data fetching utility.
 */
getMDMSV2Criteria: (tenantId, schemaCode,filters={}, cacheKey="CAMP_MDMS",config={}) => {
  const MDMSV2Criteria = {
    // API endpoint for MDMS v2 search
    url: `/${mdms_context_path}/v2/_search`,

    // Request payload with tenant and module/master details
    body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: schemaCode,
            isActive: true,
            filters
          },
    },

    // Custom query name for React Query caching and identification
    changeQueryName: `CMP-${cacheKey}-${schemaCode}`,

    // Query configuration for caching and data selection
    config: {
      enabled: true,              // Enables the query
      cacheTime: Number.POSITIVE_INFINITY,        // Keeps cached data forever
      staleTime: Number.POSITIVE_INFINITY,        // Data never becomes stale
      select: (data) => {
        // Select and return the mdms's data
        return data?.mdms;
      },
      ...config
    },
  };

  return MDMSV2Criteria;
},
 getMDMSV1Selector(moduleName,masterName) {
  return {
    select: (data) => {
      // Select and return the module's data
      return data?.MdmsRes?.[moduleName]?.[masterName];
    }
  };
}

};
export { downloadExcelWithCustomName };
export const PRIMARY_COLOR = "#C84C0E";
