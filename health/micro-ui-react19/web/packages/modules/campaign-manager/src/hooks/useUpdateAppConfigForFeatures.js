import { useMutation } from "@tanstack/react-query";
import { CONSOLE_MDMS_MODULENAME } from "../Module";
import { HCMCONSOLE_APPCONFIG_MODULENAME } from "../pages/employee/NewCampaignCreate/CampaignDetails";

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
 * Updates the app configuration object by setting the visibility (hidden flag)
 * of properties based on selected features for a module.
 *
 * @param {Object} dataConfig - Existing app configuration object to update.
 * @param {Object} selectedFeaturesByModule - Mapping of selected features by module.
 * @param {Array} availableFormats - List of available modules with their respective features.
 * @returns {Object} Updated configuration with modified visibility settings.
 */
const updateAppConfigForFeature = (dataConfig = {}, selectedFeaturesByModule, availableFormats) => {
  // Proceed only if dataConfig contains `pages`
  if (!dataConfig?.data?.pages) return dataConfig;

  const currentModule = dataConfig?.data?.name;

  // Extract enabled feature formats for the current module
  const currentModuleFeatures = availableFormats
    ?.filter((module) => module?.code === currentModule)
    ?.flatMap((module) => module?.features?.filter((feature) => !feature?.disabled)?.map((feature) => feature?.format));

  // Update each page's properties based on feature selection
  dataConfig.data.pages = dataConfig.data.pages.map((page) => {
    const updatedProperties = page?.properties?.map((property) => {
      let hidden = property?.hidden;

      // Check if field is required (should always be visible)
      const isFieldRequired = property?.validations?.some((rule) => rule?.type === "required" && rule?.value);

      // Set hidden based on feature toggle and field requirement
      if (isFieldRequired) {
        hidden = false;
      } else if (currentModuleFeatures?.includes(property?.format)) {
        hidden = !selectedFeaturesByModule?.[currentModule]?.includes(property?.format);
      }

      return {
        ...property,
        hidden,
      };
    });

    return {
      ...page,
      properties: updatedProperties,
    };
  });

  return dataConfig;
};

/**
 * Main business logic to search existing MDMS entries and update them.
 *
 * @param {string} tenantId - The tenant ID.
 * @param {string} campaignNo - Campaign identifier (project field in MDMS).
 * @returns {Promise<object>} Result of batch updates or error.
 */
const updateCurrentAppConfig = async (tenantId, campaignNo, changes, selectedFeaturesByModule, availableFormats) => {
  try {
    const schemaCode = `${CONSOLE_MDMS_MODULENAME}.${HCMCONSOLE_APPCONFIG_MODULENAME}`;

    // Fetch all MDMS entries for the given campaign
    const filters = {
      project: campaignNo,
      ...(changes?.keys.length == 1 ? { name: changes?.keys?.[0] } : {}),
    };

    const mdmsRecords = await searchMDMSV2Data(tenantId, schemaCode, filters);

    if (!mdmsRecords || mdmsRecords.length === 0) {
      throw new Error("No MDMS data found for the given campaign.");
    }

    // Prepare and trigger parallel update calls
    const updatePromises = mdmsRecords.map((record) =>
      updateMDMSV2Data(schemaCode, { Mdms: updateAppConfigForFeature(record, selectedFeaturesByModule, availableFormats) })
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
  const { mutate, isLoading, isError, error, data, isSuccess, reset } = useMutation({
    mutationFn: ({ tenantId, campaignNo, changes, selectedFeaturesByModule, availableFormats }) =>
      updateCurrentAppConfig(tenantId, campaignNo, changes, selectedFeaturesByModule, availableFormats),
  });

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
