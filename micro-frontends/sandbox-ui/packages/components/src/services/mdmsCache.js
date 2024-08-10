import { Request } from "./Request";

// Default API caching settings
const defaultApiCachingSettings = [
  {
    serviceName: "localization",
    cacheTimeInSecs: 86400, // Cache for 24 hours
  },
  {
    serviceName: "access/v1/actions",
    cacheTimeInSecs: 86400, // Cache for 24 hours
  },
  {
    serviceName: "user/_search",
    cacheTimeInSecs: 86400, // Cache for 24 hours
  },
  {
    serviceName: "egov-mdms-service",
    cacheTimeInSecs: 3600, // Cache for 1 hour
    debounceTimeInMS: 1000, // Debounce time for requests
    moduleSettings: [
      {
        moduleName: "FSM",
        cacheTimeInSecs: 7200, // Cache for 2 hours
      },
    ],
  },
];

/**
 * Retrieves the default API caching settings.
 * 
 * @returns {Array} The default API caching settings.
 */
const getCachedSetting = () => {
  return defaultApiCachingSettings;
};

/**
 * Retrieves caching settings for a specific service and module.
 * 
 * @param {string} serviceName - The name of the service.
 * @param {string} [moduleName] - Optional module name for more granular settings.
 * @returns {Object} The caching settings for the given service and module.
 */
const getSetting = (serviceName, moduleName) => {
  const settings = getCachedSetting();
  const serviceSetting = settings.find(item => item.serviceName === serviceName);

  const responseSetting = {
    cacheTimeInSecs: serviceSetting?.cacheTimeInSecs,
    debounceTimeInMS: serviceSetting?.debounceTimeInMS || 1000,
  };

  if (!moduleName) {
    return responseSetting;
  }

  const moduleSettings = serviceSetting?.moduleSettings?.find(item => item.moduleName === moduleName);

  return {
    cacheTimeInSecs: moduleSettings?.cacheTimeInSecs || responseSetting.cacheTimeInSecs,
    debounceTimeInMS: moduleSettings?.debounceTimeInMS || responseSetting.debounceTimeInMS,
  };
};

export const ApiCacheService = {
  /**
   * Gets caching settings based on the service URL and module name.
   * 
   * @param {string} serviceUrl - The URL of the service.
   * @param {string} [moduleName] - Optional module name for more granular settings.
   * @returns {Object} The caching settings for the given service URL and module.
   */
  getSettingByServiceUrl: (serviceUrl, moduleName) => {
    return getSetting(serviceUrl.split("/")[1], moduleName);
  },
};

const mergedData = {};
const mergedPromises = {};

/**
 * Handles debounced API calls, caching data, and managing promises.
 * 
 * @param {Object} params - Parameters for the API call.
 * @param {Function} resolve - Promise resolve function.
 * @param {Function} reject - Promise reject function.
 */
const debouncedCall = ({ serviceName, url, data, useCache, params }, resolve, reject) => {
  if (!mergedPromises[params.tenantId] || mergedPromises[params.tenantId].length === 0) {
    const cacheSetting = getCacheSetting(url, serviceName);
    setTimeout(async () => {
      let callData = JSON.parse(JSON.stringify(mergedData[params.tenantId]));
      mergedData[params.tenantId] = {};
      let callPromises = [...mergedPromises[params.tenantId]];
      mergedPromises[params.tenantId] = [];

      Request({
        url,
        data: callData,
        options:{ useCache },
        params,
      })
        .then(data => {
          callAllPromises(true, callPromises, data);
        })
        .catch(err => {
          callAllPromises(false, callPromises, err);
        });
    }, cacheSetting.debounceTimeInMS || 500);
  }

  mergeMDMSData(data, params.tenantId);

  if (!mergedPromises[params.tenantId]) {
    mergedPromises[params.tenantId] = [];
  }

  mergedPromises[params.tenantId].push({ resolve, reject });
};

/**
 * Gets cache settings for a specific URL and module name.
 * 
 * @param {string} url - The URL of the service.
 * @param {string} moduleName - The module name for more granular settings.
 * @returns {Object} The cache settings for the URL and module.
 */
const getCacheSetting = (url, moduleName) => {
  return ApiCacheService.getSettingByServiceUrl(url, moduleName);
};

/**
 * Resolves or rejects all promises with the given data.
 * 
 * @param {boolean} isSuccess - Indicates if the operation was successful.
 * @param {Array} promises - The list of promises to resolve or reject.
 * @param {Object} data - The data to resolve or reject with.
 */
const callAllPromises = (isSuccess, promises, data) => {
  promises.forEach(promise => {
    if (isSuccess) {
      promise.resolve(data);
    } else {
      promise.reject(data);
    }
  });
};

/**
 * Merges MDMS data with existing data for a tenant.
 * 
 * @param {Object} data - The new MDMS data to merge.
 * @param {string} tenantId - The tenant ID.
 */
const mergeMDMSData = (data, tenantId) => {
  if (!mergedData[tenantId] || Object.keys(mergedData[tenantId]).length === 0) {
    mergedData[tenantId] = data;
  } else {
    data.MdmsCriteria.moduleDetails.forEach(dataModuleDetails => {
      const moduleName = dataModuleDetails.moduleName;
      const masterDetails = dataModuleDetails.masterDetails;
      let found = false;

      mergedData[tenantId].MdmsCriteria.moduleDetails.forEach(moduleDetail => {
        if (moduleDetail.moduleName === moduleName) {
          found = true;
          moduleDetail.masterDetails = [...moduleDetail.masterDetails, ...masterDetails];
        }
      });

      if (!found) {
        mergedData[tenantId].MdmsCriteria.moduleDetails.push(dataModuleDetails);
      }
    });
  }
};

export const mdmsService = {
  /**
   * Makes an API call with debouncing and caching for MDMS service.
   * 
   * @param {string} url - The URL of the MDMS service.
   * @param {string} tenantId - The tenant ID.
   * @param {Array} details - The details to be sent in the request.
   * @returns {Promise} A promise that resolves with the API response data.
   */
  call: (url, tenantId, details) => {
    return new Promise((resolve, reject) =>
      debouncedCall(
        {
          serviceName: "mdmsCall",
          url: url,
          data: getCriteria(tenantId, details),
          useCache: true,
          params: { tenantId },
        },
        resolve,
        reject
      )
    );
  },
};

/**
 * Creates the criteria object for the MDMS request.
 * 
 * @param {string} tenantId - The tenant ID.
 * @param {Array} moduleDetails - The module details for the request.
 * @returns {Object} The criteria object for the MDMS request.
 */
const getCriteria = (tenantId, moduleDetails = [
  {
    moduleName: "",
    masterDetails: [
      {
        name: "",
        filter: `[?(@.somekey == "valuetobefiltered")]`
      }
    ]
  },
]) => {
  return {
    MdmsCriteria: {
      tenantId,
      moduleDetails: [...moduleDetails],
    },
  };
};
