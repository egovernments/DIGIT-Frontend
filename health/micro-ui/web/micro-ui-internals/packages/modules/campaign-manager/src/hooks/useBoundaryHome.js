import { useQuery } from "react-query";
import { CONSOLE_MDMS_MODULENAME } from "../Module";

const MDMS_V2_CONTEXT_PATH = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";
const HRMS_CONTEXT_PATH = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "egov-hrms";



const generateFile = async (hierarchyType, tenantId) => {
  const res = await Digit.CustomService.getResponse({
    url: `/project-factory/v1/data/_generate`,
    body: {},
    params: {
      tenantId: tenantId,
      type: "boundaryManagement",
      forceUpdate: true,
      hierarchyType: hierarchyType,
      campaignId: "default",
    },
  });
  return res;
};

const fetchBoundaryHierarchy = async (hierarchyType, tenantId) => {
  try {
    // Second API Call: Fetch Service Definitions
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
    console.error("Error fetching service definition:", error);
    return error;
  }
};

const fetchEmployeeDetails = async (userName, tenantId) => {
  try {
    // Second API Call: Fetch Service Definitions
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
    console.error("Error fetching service definition:", error);
    return error;
  }
};

const selectData = (data) => {
  return data?.mdms
    ?.map((e) => e?.data)
    .reduce((acc, curr) => {
      acc[curr?.type] = curr;
      return acc;
    }, {});
};

const useBoundaryHome = ({ screenType = "campaign", defaultHierarchyType = "", hierarchyType = "", userName, tenantId }) => {
  const fetchConsolidatedData = async () => {
    try {
      // First API Call: Fetch MDMS Data
      const mdmsResponse = await Digit.CustomService.getResponse({
        url: `/${MDMS_V2_CONTEXT_PATH}/v2/_search`,
        body: {
          MdmsCriteria: {
            tenantId: tenantId,
            schemaCode: `${CONSOLE_MDMS_MODULENAME}.HierarchySchema`,
            isActive: true
          },
        },
      });
      // Second API Call: Merge MDMS Data with Service Definition
      const final = selectData(mdmsResponse);
      // let final = selectData(mdmsResponse);
      // final.campaign.hierarchyType="BOUNDARYDEMO35";

      const boundaryConfig = final?.[screenType];

      const employeeDetails = (boundaryConfig?.department?.length > 0 && (await fetchEmployeeDetails(userName, tenantId))) || null;
      const hierarchyName=hierarchyType || boundaryConfig?.hierarchy;
      const defaultHierarchyName=defaultHierarchyType || final?.["default"]?.hierarchy;
      const boundaryData = await fetchBoundaryHierarchy(hierarchyName, tenantId);
      const defaultBoundaryData = await fetchBoundaryHierarchy(defaultHierarchyName, tenantId);
      // boundaryData && generateFile(hierarchyType || boundaryConfig?.hierarchy, tenantId);

      // Return a promise that resolves after both API calls are complete
      return new Promise((resolve) => {
        // Once the second call (`mergeData`) is done, resolve the final data

        // Merge the MDMS data with the service data
        const mergedData = {
          boundaryConfig: final,
          defaultBoundaryData,
          boundaryData,
          employeeDetails,
          hierarchyName,
          defaultHierarchyName
        };
        resolve(mergedData);
      });
    } catch (error) {
      console.error("Error fetching MDMS data:", error);
      return [];
    }
  };

  const { data, isFetching, refetch, isLoading, error } = useQuery(
    ["mdmsData", screenType, defaultHierarchyType, hierarchyType, userName, tenantId],
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
    isFetching,
    revalidate: () => {
      // final && client.invalidateQueries({ queryKey: [url].filter((e) => e) });
    },
  };
};

export default useBoundaryHome;
