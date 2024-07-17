import { Request } from "../../idb/Request";

// Default API caching settings
const defaultApiCachingSettings = [
  {
    serviceName: "localization",
    cacheTimeInSecs: 86400,
  },
  {
    serviceName: "access/v1/actions",
    cacheTimeInSecs: 86400,
  },
  {
    serviceName: "user/_search",
    cacheTimeInSecs: 86400,
  },
  {
    serviceName: "egov-mdms-service",
    cacheTimeInSecs: 3600,
    debounceTimeInMS: 1000,
    moduleSettings: [
      {
        moduleName: "FSM",
        cacheTimeInSecs: 7200,
      },
    ],
  },
];


const getCachedSetting =  () => {
  const setting = defaultApiCachingSettings;
  return setting;
};

const getSetting =  (serviceName, moduleName) => {
  const setting =  getCachedSetting();
  const serviceSetting = setting.find((item) => item?.serviceName === serviceName);
  const responseSetting = {
    cacheTimeInSecs: serviceSetting.cacheTimeInSecs,
    debounceTimeInMS: serviceSetting.debounceTimeInMS || 1000,
  };
  if (!moduleName) {
    return responseSetting;
  }
  const moduleSettings = serviceSetting?.moduleSettings?.find((item) => item.moduleName === moduleName);
  if (!moduleSettings) {
    return responseSetting;
  }
  return {
    cacheTimeInSecs: moduleSettings.cacheTimeInSecs || responseSetting.cacheTimeInSecs,
    debounceTimeInMS: moduleSettings.debounceTimeInMS || responseSetting.debounceTimeInMS,
  };
};

export const ApiCacheService = {
  getSettingByServiceUrl:  (serviceUrl, moduleName) => {
    return  getSetting(serviceUrl.split("/")[1], moduleName);
  },
};

const mergedData = {};
const mergedPromises = {};

const debouncedCall =  ({ serviceName, url, data, useCache, params }, resolve, reject) => {
  if (!mergedPromises[params.tenantId] || mergedPromises[params.tenantId].length === 0) {
    const cacheSetting =  getCacheSetting(url, serviceName);
    setTimeout(async () => {
      let callData = JSON.parse(JSON.stringify(mergedData[params.tenantId]));
      mergedData[params.tenantId] = {};
      let callPromises = [...mergedPromises[params.tenantId]];
      mergedPromises[params.tenantId] = [];
      Request({
        serviceName,
        url,
        data: callData,
        useCache,
        params,
      })
        .then((data) => {
          callAllPromises(true, callPromises, data);
        })
        .catch((err) => {
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

const getCacheSetting =  (url, moduleName) => {
  return  ApiCacheService.getSettingByServiceUrl(url, moduleName);
};

const callAllPromises = (isSuccess, promises, data) => {
  promises.forEach((promise) => {
    if (isSuccess) {
      promise.resolve(data);
    } else {
      promise.reject(data);
    }
  });
};

const mergeMDMSData = (data, tenantId) => {
  if (!mergedData[tenantId] || Object.keys(mergedData[tenantId]).length === 0) {
    mergedData[tenantId] = data;
  } else {
    data.MdmsCriteria.moduleDetails.forEach((dataModuleDetails) => {
      const moduleName = dataModuleDetails.moduleName;
      const masterDetails = dataModuleDetails.masterDetails;
      let found = false;
      mergedData[tenantId].MdmsCriteria.moduleDetails.forEach((moduleDetail) => {
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
