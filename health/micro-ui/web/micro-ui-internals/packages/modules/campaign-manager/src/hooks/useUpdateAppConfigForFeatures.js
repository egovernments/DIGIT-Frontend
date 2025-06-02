import { useMutation } from "react-query";
import { CONSOLE_MDMS_MODULENAME } from "../Module";

// Read MDMS context path from global config, with fallback
const MDMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

/**
 * Fetches MDMS data using the V2 API.
 *
 * @param {string} tenantId - The tenant ID.
 * @param {string} schemaCode - The schema code for MDMS.
 * @param {object} filters - Filters to apply while searching.
 * @returns {Promise<Array>} Array of MDMS records or error.
 */
const searchMDMSV2Data = async (tenantId, schemaCode, filters) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: `/${MDMS_CONTEXT_PATH}/v2/_search`,
      params: {},
      body: {
        MdmsCriteria: {
          tenantId,
          schemaCode,
          isActive: true,
          filters,
        },
      },
    });
    return response?.mdms || [];
  } catch (error) {
    console.error("Error fetching MDMS details:", error);
    return error;
  }
};

/**
 * Updates a single MDMS record via the V2 API.
 *
 * @param {string} schemaCode - The schema code.
 * @param {object} body - The body containing MDMS update payload.
 * @returns {Promise<object>} Updated MDMS response or error.
 */
const updateMDMSV2Data = async (schemaCode, body) => {
  try {
    const response = await Digit.CustomService.getResponse({
      url: `/${MDMS_CONTEXT_PATH}/v2/_update/${schemaCode}`,
      params: {},
      body,
    });
    return response?.mdms || [];
  } catch (error) {
    console.error("Error updating MDMS details:", error);
    return error;
  }
};

/**
 * Main business logic to search existing MDMS entries and update them.
 *
 * @param {string} tenantId - The tenant ID.
 * @param {string} campaignNo - Campaign identifier (project field in MDMS).
 * @returns {Promise<object>} Result of batch updates or error.
 */
const updateCurrentAppConfig = async (tenantId, campaignNo,changes,allModules) => {
  try {
    const schemaCode = `${CONSOLE_MDMS_MODULENAME}.SimpleAppConfiguration`;

    // Fetch all MDMS entries for the given campaign
    const mdmsRecords = await searchMDMSV2Data(tenantId, schemaCode, {
      project: campaignNo,
    });

    if (!mdmsRecords || mdmsRecords.length === 0) {
      throw new Error("No MDMS data found for the given campaign.");
    }

    // Prepare and trigger parallel update calls
    const updatePromises = mdmsRecords.map((record) =>
      updateMDMSV2Data(schemaCode, { Mdms: record })
    );

    const updateResults = await Promise.all(updatePromises);

    return { updatedAppConfig: updateResults };
  } catch (error) {
    console.error("Error updating app config data:", error);
    return { error };
  }
};

/**
 * React Query mutation hook to update app configuration for a campaign.
 *
 * @returns {object} Object containing the mutation function and related states.
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
    // Mutation function
    ({ tenantId, campaignNo ,changes,allModules}) => updateCurrentAppConfig(tenantId, campaignNo,changes,allModules)
  );

  return {
    updateConfig: mutate, // Usage: updateConfig({ tenantId, campaignNo }, { onSuccess, onError })
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    reset,
  };
};

export default useUpdateAppConfigForFeatures;
