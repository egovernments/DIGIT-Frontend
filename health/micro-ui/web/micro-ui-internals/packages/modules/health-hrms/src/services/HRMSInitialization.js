/**
 * Generates an ordered list of boundary types from a hierarchical boundary structure.
 *
 * @param {Array} tenantBoundary - Array representing the boundary hierarchy.
 * @returns {Array} - Ordered list of boundary types.
 */
const getBoundaryTypeOrder = (tenantBoundary) => {
  const order = [];
  const seenTypes = new Set();

  /**
   * Recursive function to traverse the boundary hierarchy.
   *
   * @param {Object} node - Current boundary node.
   * @param {number} currentOrder - Order level in the hierarchy.
   */
  const traverse = (node, currentOrder) => {
    if (!seenTypes.has(node.boundaryType)) {
      order.push({ code: node.boundaryType, order: currentOrder });
      seenTypes.add(node.boundaryType);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => traverse(child, currentOrder + 1));
    }
  };

  // Start traversal from the root boundaries
  tenantBoundary.forEach((boundary) => traverse(boundary, 1));

  return order;
};

/**
 * Initializes the HRMS module by fetching staff, project, and boundary data.
 *
 * @param {Object} params - Function parameters.
 * @param {string} params.tenantId - Tenant identifier.
 * @throws {Error} - Throws an error if fetching fails.
 */
const initializeHrmsModule = async ({ tenantId }) => {
  // Retrieve configuration values from globalConfigs (fallback values provided)
  const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || "health-project";
  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "HIERARCHYTEST";

  // Get logged-in user details from session storage
  let user = Digit?.SessionStorage.get("User");

  try {

    // Fetch boundary data associated with the national-level project
    const fetchBoundaryData = await Digit.CustomService.getResponse({
      url: `/boundary-service/boundary-relationships/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,

        hierarchyType: hierarchyType,

        includeChildren: true,
      },
    });

    if (!fetchBoundaryData) {
      throw new Error("Couldn't fetch boundary data");
    }

    // Determine the order of boundary types in the hierarchy
    const boundaryHierarchyOrder = getBoundaryTypeOrder(fetchBoundaryData?.TenantBoundary?.[0]?.boundary);

    // Store boundary hierarchy order in session storage
    Digit.SessionStorage.set("boundaryHierarchyOrder", boundaryHierarchyOrder);

  } catch (error) {
    // Handle API errors gracefully
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default initializeHrmsModule;
