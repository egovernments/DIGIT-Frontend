/**
 * Initializes PGR module-specific configurations.
 * 
 * This function:
 * 1. Fetches boundary hierarchy data for the given tenant.
 * 2. Derives the boundary type order (used to build nested boundary dropdowns).
 * 3. Stores the derived boundary type order in session storage under "boundaryHierarchyOrder".
 * 
 * @param {Object} config - The configuration object
 * @param {string} config.tenantId - The tenant ID for which the boundary hierarchy should be initialized
 * 
 * @throws Will throw an error if the boundary data cannot be fetched
 */
const initializePGRModule = async ({ tenantId }) => {
  // Get hierarchy type from global config or fallback to "HIERARCHYTEST"
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "HIERARCHYTEST";

  // Get current logged-in user from session (not used further here, but could be used for logging/debugging)
  let user = Digit?.SessionStorage.get("User");

  try {
    // Call boundary-service to get hierarchical boundary data with children included
    const fetchBoundaryData = await Digit.CustomService.getResponse({
      url: `/boundary-service/boundary-relationships/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,
        hierarchyType: hierarchyType,
        includeChildren: true,
      }
    });

    if (!fetchBoundaryData) {
      throw new Error("Couldn't fetch boundary data");
    }

    // Extract the order of boundary types using a depth-first traversal
    const boundaryHierarchyOrder = getBoundaryTypeOrder(fetchBoundaryData?.TenantBoundary?.[0]?.boundary);

    // Store the ordered boundary types in session storage for use in dropdown components
    Digit.SessionStorage.set("boundaryHierarchyOrder", boundaryHierarchyOrder);


  } catch (error) {
    // Throw readable errors if available from backend, otherwise generic error
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

/**
 * Given a nested boundary tree, this function computes the order of unique boundary types.
 * 
 * Example:
 *  - If the hierarchy is: Country -> Province -> District, it returns:
 *    [{ code: "Country", order: 1 }, { code: "Province", order: 2 }, { code: "District", order: 3 }]
 * 
 * @param {Array} tenantBoundary - Array of root boundary nodes with nested children
 * @returns {Array} Ordered list of unique boundary type codes
 */
const getBoundaryTypeOrder = (tenantBoundary) => {
  const order = [];
  const seenTypes = new Set();

  // Recursive DFS to capture boundary type hierarchy
  const traverse = (node, currentOrder) => {
    if (!seenTypes.has(node.boundaryType)) {
      order.push({ code: node.boundaryType, order: currentOrder });
      seenTypes.add(node.boundaryType);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => traverse(child, currentOrder + 1));
    }
  };

  // Start traversal from each top-level boundary node
  tenantBoundary.forEach((boundary) => traverse(boundary, 1));

  return order;
};

export default initializePGRModule;
