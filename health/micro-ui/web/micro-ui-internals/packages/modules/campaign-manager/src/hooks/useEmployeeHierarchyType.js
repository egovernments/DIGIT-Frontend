import { useEffect, useState, useCallback, useMemo } from 'react';

const useEmployeeHierarchyType = (tenantId, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const HRMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "egov-hrms";
  const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";
  const MDMS_V2_CONTEXT_PATH = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "egov-mdms-service";


  const fetchEmployeeAndHierarchy = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch employee details
      const employeeResponse = await Digit.CustomService.getResponse({
        url: `/${HRMS_CONTEXT_PATH}/employees/_search`,
        params: { 
          tenantId,
          codes: Digit.UserService.getUser()?.info?.userName,
          SortOrder: "ASC"
        },
        body: {}
      });
      
      const employee = employeeResponse?.Employees?.[0];
      
      // Fetch hierarchies using MDMS
      const mdmsResponse = await Digit.CustomService.getResponse(
        {
            url: `/${MDMS_V2_CONTEXT_PATH}/v1/_search`,
            params: {},
                body: {
                  MdmsCriteria: {
                    tenantId,
                    moduleDetails: [{
                      moduleName: "HCM-ADMIN-CONSOLE",
                      masterDetails: [{
                        name: "HierarchySchema"
                      }]
                    }]
                  }
                }
            }
      );
      
      // Get employee departments
      const employeeDepartments = employee?.assignments?.map(assignment => assignment.department) || [];
      const hierarchies = mdmsResponse?.MdmsRes?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema || [];
      
      // Find matching hierarchy
      const matchingHierarchy = hierarchies.find(
        schema => (schema.department || []).some(dept => employeeDepartments.includes(dept))
      );

      const result = {
        hierarchy: matchingHierarchy?.hierarchy || null,
        employee,
        allHierarchies: hierarchies,
        matchingHierarchy
      };

      setData(result);
      setIsLoading(false);
      return result;

    } catch (err) {
      console.error("Error in useEmployeeHierarchyType:", err);
      setError(err);
      setIsLoading(false);
      return null;
    }
  }, [tenantId]);

  useEffect(() => {
    fetchEmployeeAndHierarchy();
  }, [fetchEmployeeAndHierarchy]);

  const select = options?.select || (data => data?.hierarchy);
  const queryData = useMemo(() => {
    if (!data) return null;
    return select(data);
  }, [data, select]);

  return {
    data: queryData,
    isLoading,
    error,
    refetch: fetchEmployeeAndHierarchy,
    rawData: data
  };
};

export default useEmployeeHierarchyType;