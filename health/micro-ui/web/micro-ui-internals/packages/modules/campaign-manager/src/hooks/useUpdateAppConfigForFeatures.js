import { useQuery } from "react-query";
import { useMutation } from "react-query";

import { CONSOLE_MDMS_MODULENAME } from "../Module";
const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";


  const searchMDMSV2Data= async ( tenantId,schemaCode,filters) => {
    try {
      const response = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_search`,

        params: {},
        body:{MdmsCriteria: {
          tenantId,
          schemaCode: schemaCode, //`${CONSOLE_MDMS_MODULENAME}.SimpleAppConfiguration`,
          isActive: true,
          filters: {
            ...filters
            // project:campaignNo
          }
        }},
      });
      return response?.mdms || [];
    } catch (error) {
      console.error("Error fetching MDMS Details:", error);
      return error;
    }
  };

  const updateMDMSV2Data= async ( schemaCode,body) => {

    try {
      const response = await Digit.CustomService.getResponse({
        url: `/${mdms_context_path}/v2/_update/${schemaCode}`,
        params: {},
        body:{...body},
      });
      return response?.mdms || [];
    } catch (error) {
      console.error("Error Updating MDMS Details:", error);
      return error;
    }
  };


/**
 * Fetches consolidated data by combining campaign search and boundary data.
 *
 * @param {string} tenantId - The tenant ID.
 * @param {string} campaignId - The campaign ID.
 * @param {string} planConfigId - The plan configuration ID.
 * @returns {Promise<object>} Merged data including boundary and campaign information.
 */
const updateCurrentAppConfig = async (tenantId, campaignNo, ) => {
  try {
const schemaCode=`${CONSOLE_MDMS_MODULENAME}.SimpleAppConfiguration`;

    const searchedMDMSData = await searchMDMSV2Data(tenantId,schemaCode,  {
      project:campaignNo
    });

    if (!searchedMDMSData) {
      throw new Error("No MDMSData found.");
    }


const allPromises=searchedMDMSData.map( (data)=>updateMDMSV2Data(schemaCode,{Mdms:data}))
const results = await Promise.all(allPromises);

    return { updatedAppConfig:results};
  } catch (error) {
    console.error("Error updating app config data:", error);
    return { error };
  }
};





/**
 * React Query mutation hook to update app config for features.
 *
 * @param {function} onSuccess - Callback on successful mutation.
 * @param {function} onError - Callback on mutation error.
 * @returns {object} Mutation object with mutate function and states.
 */
const useUpdateAppConfigForFeatures = () => {
  const {
    mutate,
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    reset,
  } = useMutation(
    ({ tenantId, campaignNo }) => updateCurrentAppConfig(tenantId, campaignNo)
  );

  return {
    updateConfig: mutate, // Call this with (params, { onSuccess, onError })
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    reset,
  };
};


export default useUpdateAppConfigForFeatures;
