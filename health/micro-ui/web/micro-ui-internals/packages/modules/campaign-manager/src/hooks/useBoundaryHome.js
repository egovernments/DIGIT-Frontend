import { useQuery } from "react-query";

const MDMS_V2_CONTEXT_PATH = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
const HRMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "egov-hrms";

const fetchBoundaryHierarchy = async (hierarchyType, tenantId) => {
  try {
    const res = await Digit.CustomService.getResponse({
      url: `/boundary-service/boundary-hierarchy-definition/_search`,
      params: {},
      body: {
        BoundaryTypeHierarchySearchCriteria: {
          tenantId: tenantId,
          limit: 1,
          offset: 0,
          hierarchyType,
        },
      },
    });
    return res?.BoundaryHierarchy?.[0] || {};
  } catch (error) {
    console.error("Error fetching boundary hierarchy:", error);
    return error;
  }
};

const fetchEmployeeDetails = async (userName, tenantId) => {
  try {
    const res = await Digit.CustomService.getResponse({
      url: `/${HRMS_CONTEXT_PATH}/employees/_search`,
      params: {
        tenantId: tenantId,
        codes: userName,
        sortOrder: "ASC",
      },
      body: {},
    });
    return res?.Employees?.[0];
  } catch (error) {
    console.error("Error fetching employee details:", error);
    return error;
  }
};

const fetchHierarchies = async (tenantId) => {
  try {
    const res = await Digit.CustomService.getResponse({
      url: `/egov-mdms-service/v1/_search`,
      body: {
        MdmsCriteria: {
          tenantId: tenantId,
          moduleDetails: [{
            moduleName: "HCM-ADMIN-CONSOLE",
            masterDetails: [{
              name: "HierarchySchema"
            }]
          }]
        },
      },
    });
    return res?.MdmsRes?.["HCM-ADMIN-CONSOLE"]?.HierarchySchema|| [];
  } catch (error) {
    console.error("Error fetching hierarchies:", error);
    return [];
  }
};

const useBoundaryHome = ({ hierarchyType = "", userName, tenantId }) => {
  const fetchConsolidatedData = async () => {
    try {
      // Fetch all hierarchies
      const hierarchies = await fetchHierarchies(tenantId);
      
      // Fetch employee details
      const employeeDetails = await fetchEmployeeDetails(userName, tenantId);
      const employeeDepartments = employeeDetails?.assignments?.map(assignment => assignment.department) || [];
      // Find matching hierarchy based on employee departments
      const matchingHierarchy = hierarchies.find(
        schema => (schema.department || []).some(dept => employeeDepartments.includes(dept))
      );
      const hierarchyName = hierarchyType || matchingHierarchy?.hierarchy;
      
      // Fetch boundary data for the matched hierarchy
      const boundaryData = hierarchyName ? await fetchBoundaryHierarchy(hierarchyName, tenantId) : null;

      return {
        boundaryData,
        employeeDetails,
        hierarchyName,
        matchingHierarchy,
        hierarchies
      };

    } catch (error) {
      console.error("Error in consolidated data fetch:", error);
      return {};
    }
  };

  const { data, isFetching, refetch, isLoading, error } = useQuery(
    ["boundaryData", hierarchyType, userName, tenantId],
    fetchConsolidatedData,
    {
      cacheTime: 0,
    }
  );

  return {
    data,
    isLoading,
    error,
    refetch,
    isFetching
  };
};

export default useBoundaryHome;