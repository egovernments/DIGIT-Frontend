import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../state/stateConfigs";
import { genericService } from "./genericService";
import { mdmsService } from "./services/mdmsCache";

/**
 * Custom hook which can make api call and format response
 *
 * @author jagankumar-egov
 *
 *
 * @example
 * 
 const requestCriteria = [
      "/user/_search",             // API details
    {},                            //requestParam
    {data : {uuid:[Useruuid]}},    // requestBody
    {} ,                           // privacy value 
    {                              // other configs
      enabled: privacyState,
      cacheTime: 100,
      select: (data) => {
                                    // format data
        return  _.get(data, loadData?.jsonPath, value);
      },
    },
  ];
  const { isLoading, data, revalidate } = Digit.Hooks.useCustomAPIHook(...requestCriteria);

 *
 * @returns {Object} Returns the object which contains data and isLoading flag
 */

const useMDMSHook = ({
  url = "/egov-mdms-service/v1/_search",
  moduleDetails = [],
  config = {},
  tenantId = "",
  options,
}) => {
  const client = queryClient;
  const { isLoading, data, isFetching, refetch } = useQuery({
    queryKey: [url, tenantId, JSON.stringify(moduleDetails)].filter((e) => e),
    queryFn: () => mdmsService.call(url, tenantId, moduleDetails),
    cacheTime: 0,
    ...config,
  });

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {
      data && client.invalidateQueries({ queryKey: [url].filter((e) => e) });
    },
  };
};

export default useMDMSHook;

// getDataByCriteria: async (tenantId, mdmsDetails, moduleCode) => {
//   const key = `MDMS.${tenantId}.${moduleCode}.${mdmsDetails.type}.${JSON.stringify(mdmsDetails.details)}`;
//   const inStoreValue = PersistantStorage.get(key);
//   if (inStoreValue) {
//     return inStoreValue;
//   }
//   const { MdmsRes } = await MdmsService.call(tenantId, mdmsDetails.details);
//   const responseValue = transformResponse(mdmsDetails.type, MdmsRes, moduleCode.toUpperCase(), tenantId);
//   const cacheSetting = getCacheSetting(mdmsDetails.details.moduleDetails[0].moduleName);
//   PersistantStorage.set(key, responseValue, cacheSetting.cacheTimeInSecs);
//   return responseValue;
// },

// const transformResponse = (type, MdmsRes, moduleCode, tenantId) => {
//   switch (type) {

//     default:
//       return MdmsRes;}
//     }

// const getCriteria = (tenantId, moduleDetails) => {
//   return {
//     MdmsCriteria: {
//       tenantId,
//       ...moduleDetails,
//     },
//   };
// };
