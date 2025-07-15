import Urls from "./urls";

/**
 * Fetches employee details along with associated projects.
 * 
 * @param {string} userCode - Unique identifier for the employee.
 * @param {string} tenantId - Tenant identifier.
 * @returns {Promise<Object>} - Employee project details.
 * @throws {Error} - Throws an error if fetching fails.
 */
const employeeDetailsFetch = async (userCode, tenantId) => {
  // Retrieve configuration values from globalConfigs (fallback values provided)
  const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || "health-project";
  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "HIERARCHYTEST";

  try {
    // Fetch staff details based on userCode
    const empResponse = await Digit.CustomService.getResponse({
      url: Urls.hcm.searchStaff,  // API endpoint for staff search
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,  // Tenant scope for the search
        offset: 0,           // Pagination offset
        limit: 100,          // Limit the number of results
      },
      body: {
        ProjectStaff: {
          staffId: [userCode],  // Filtering by userCode
        },
      },
    });

    // Extract relevant data from the response
    const resData = empResponse?.ProjectStaff;

    // Fetch project details associated with the staff
    const response = await Digit.CustomService.getResponse({
      url: Urls.hcm.searchProject,  // API endpoint for project search
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        tenantId: tenantId,       // Tenant scope
        offset: 0,                // Pagination offset
        limit: 100,               // Limit the number of results
        includeAncestors: false,  // Exclude ancestor projects
        includeDescendants: false,// Exclude descendant projects
      },
      body: {
        Projects: resData?.map((data) => {
          return {
            id: data.projectId, // Extracting project ID from staff details
            tenantId: tenantId, 
          };
        }),
      },
    });

    // Throw an error if no staff data is found
    if (!response) {
      throw new Error("No Staff found");
    }

    return response; // Return fetched project details
  } catch (error) {
    // Handle API errors gracefully
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred"); // Generic error message
  }
};

export default employeeDetailsFetch;
