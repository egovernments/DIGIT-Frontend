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

/**
 * Check for validation errors and show toast if errors exist
 * @param {Function} setShowToast - Function to set toast state
 * @param {Function} t - Translation function
 * @returns {boolean} - Returns true if validation errors exist, false otherwise
 */
export const checkValidationErrorsAndShowToast = (setShowToast, t) => {
  // Check if validation error checking function exists on window
  if (window.__appConfig_hasValidationErrors && typeof window.__appConfig_hasValidationErrors === "function") {
    const errors = window.__appConfig_hasValidationErrors();

    if (errors && errors.length > 0) {
      // Create error message from all validation errors
      // Handle error messages with parameters (e.g., for mandatory conditional fields)
      const errorMessage = errors.map((err) => {
        if (err.messageParams) {
          return t(err.message, err.messageParams);
        }
        return t(err.message);
      }).join(", ");

      // Show toast error
      setShowToast({
        key: "error",
        label: errorMessage
      });

      return true; // Validation errors exist
    }
  }

  return false; // No validation errors
};
