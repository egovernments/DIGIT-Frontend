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
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "MICROPLAN";

  // Get logged-in user details from session storage
  let user = Digit?.SessionStorage.get("User");

  try {
    // Fetch staff details based on the logged-in user
    const response = await Digit.CustomService.getResponse({
      url: `/${projectContextPath}/staff/v1/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,
        offset: 0,
        limit: 100,
      },
      body: {
        ProjectStaff: {
          staffId: [user?.info?.uuid], // User-specific staff ID
        },
      },
    });

    if (!response) {
      throw new Error("No Staff found");
    }

    const staffs = response?.ProjectStaff;

    if (!staffs || staffs.length === 0) {
      throw new Error("No Staff found");
    }

    // Fetch projects linked to the staff members
    const fetchProjectData = await Digit.CustomService.getResponse({
      url: `/${projectContextPath}/v1/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,
        offset: 0,
        limit: 100,
      },
      body: {
        Projects: staffs.map((staff) => ({
          id: staff?.projectId,
          tenantId: tenantId,
        })),
      },
    });

    if (!fetchProjectData) {
      throw new Error("Projects not found");
    }

    const projects = fetchProjectData?.Project;
    if (!projects || projects.length === 0) {
      throw new Error("No linked projects found");
    }

    // Extract national project ID from the first project
    const nationalProjectId = projects[0]?.projectHierarchy ? projects[0]?.projectHierarchy?.split(".")[0] : projects[0]?.id;

    // Fetch national-level project details
    const fetchNationalProjectData = await Digit.CustomService.getResponse({
      url: `/${projectContextPath}/v1/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,
        offset: 0,
        limit: 100,
      },
      body: {
        Projects: [
          {
            id: nationalProjectId,
            tenantId: tenantId,
          },
        ],
      },
    });

    if (!fetchNationalProjectData) {
      throw new Error("National level Project not found");
    }

    const nationalLevelProject = fetchNationalProjectData?.Project?.[0];

    if (!nationalLevelProject) {
      throw new Error("No linked projects found");
    }

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
        codes: nationalLevelProject?.address?.boundary,
        boundaryType: nationalLevelProject?.address?.boundaryType,
      },
    });

    if (!fetchBoundaryData) {
      throw new Error("Couldn't fetch boundary data");
    }

    // Determine the order of boundary types in the hierarchy
    const boundaryHierarchyOrder = getBoundaryTypeOrder(fetchBoundaryData?.TenantBoundary?.[0]?.boundary);

    // Store boundary hierarchy order in session storage
    Digit.SessionStorage.set("boundaryHierarchyOrder", boundaryHierarchyOrder);

    // Store fetched project details in session storage
    Digit.SessionStorage.set("staffProjects", projects);
  } catch (error) {
    // Handle API errors gracefully
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default initializeHrmsModule;
