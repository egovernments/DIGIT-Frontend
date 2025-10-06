/**
 * Utility function to filter and get a specific page from fullParentConfig
 * @param {Object} fullParentConfig - The full parent configuration object
 * @param {string} flow - The flow ID (e.g., "REGISTRATION-DELIVERY")
 * @param {string} pageName - The page name (e.g., "beneficiaryLocation")
 * @returns {Object|null} - The filtered page object or null if not found
 */
export const getPageFromConfig = (fullParentConfig, flow, pageName) => {
  if (!fullParentConfig || !fullParentConfig.flows || !flow || !pageName) {
    console.warn("Invalid parameters for getPageFromConfig:", { fullParentConfig, flow, pageName });
    return null;
  }

  // Find the flow by ID
  const targetFlow = fullParentConfig.flows.find((flowObj) => flowObj.id === flow);

  if (!targetFlow) {
    console.warn(`Flow with id "${flow}" not found in fullParentConfig`);
    return null;
  }

  // Find the page by name within the flow
  const targetPage = targetFlow.pages?.find((page) => page.name === pageName);

  if (!targetPage) {
    console.warn(`Page with name "${pageName}" not found in flow "${flow}"`);
    return null;
  }

  return targetPage;
};

/**
 * Get all flows from fullParentConfig
 * @param {Object} fullParentConfig - The full parent configuration object
 * @returns {Array} - Array of flow objects
 */
export const getAllFlows = (fullParentConfig) => {
  return fullParentConfig?.flows || [];
};

/**
 * Get all pages for a specific flow
 * @param {Object} fullParentConfig - The full parent configuration object
 * @param {string} flow - The flow ID
 * @returns {Array} - Array of page objects
 */
export const getAllPagesForFlow = (fullParentConfig, flow) => {
  const targetFlow = fullParentConfig?.flows?.find((flowObj) => flowObj.id === flow);
  return targetFlow?.pages || [];
};
