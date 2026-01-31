const getBoundaryTypeOrder = (tenantBoundary) => {
  const order = [];
  const seenTypes = new Set();

  // Recursive function to traverse the hierarchy
  const traverse = (node, currentOrder) => {
    if (!seenTypes.has(node.boundaryType)) {
      order.push({ code: node.boundaryType, order: currentOrder });
      seenTypes.add(node.boundaryType);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => traverse(child, currentOrder + 1));
    }
  };

  // Process the root boundaries
  tenantBoundary.forEach((boundary) => traverse(boundary, 1));

  return order;
};

const initializePaymentsModule = async ({ tenantId }) => {

  const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_CONTEXT_PATH") || "health-project";
  const individualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";
  // const hierarchyType = Digit.SessionStorage.get("HIERARCHY_TYPE") || "MICROPLAN";

  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "MICROPLAN";


  let user = Digit?.SessionStorage.get("User");

  try {
    const response = await Digit.CustomService.getResponse({
      url: `/${projectContextPath}/staff/v1/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        "tenantId": tenantId,
        "offset": 0,
        "limit": 100
      },
      body: {
        "ProjectStaff": {
          "staffId": [user?.info?.uuid]
        }
      },
    });
    if (!response) {
      throw new Error("No Staff found");
    }
    const staffs = response?.ProjectStaff;
    if (!staffs || staffs?.length === 0) {
      throw new Error("No Staff found");
    }
    const fetchProjectData = await Digit.CustomService.getResponse({
      url: `/${projectContextPath}/v1/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        "tenantId": tenantId,
        "offset": 0,
        "limit": 100
      },
      body: {
        Projects: staffs?.map((staff) => {
          return {
            "id": staff?.projectId,
            "tenantId": tenantId,
          };
        })
      }
    });
    if (!fetchProjectData) {
      throw new Error("Projects not found");
    }
    const projects = fetchProjectData?.Project;
    if (!projects || projects?.length === 0) {
      throw new Error("No linked projects found");
    }

    const nationalProjectId = projects?.[0]?.projectHierarchy != null ? projects?.[0]?.projectHierarchy?.split(".")?.[0] : projects?.[0]?.id;

    const fetchNationalProjectData = await Digit.CustomService.getResponse({
      url: `/${projectContextPath}/v1/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        "tenantId": tenantId,
        "offset": 0,
        "limit": 100
      },
      body: {
        Projects: [
          {
            "id": nationalProjectId,
            "tenantId": tenantId,
          }
        ]
      }
    });
    if (!fetchNationalProjectData) {
      throw new Error("National level Project not found");
    }
    const nationalLevelProject = fetchNationalProjectData?.Project?.[0];
    if (!nationalLevelProject) {
      throw new Error("No linked projects found");
    }


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
      }
    });

    if (!fetchBoundaryData) {
      throw new Error("Couldn't fetch boundary data");
    }

    const boundaryHierarchyOrder = getBoundaryTypeOrder(fetchBoundaryData?.TenantBoundary?.[0]?.boundary);
    Digit.SessionStorage.set("boundaryHierarchyOrder", boundaryHierarchyOrder);


    const fetchIndividualData = await Digit.CustomService.getResponse({
      url: `/${individualContextPath}/v1/_search`,
      useCache: false,
      method: "POST",
      userService: false,
      params: {
        "tenantId": tenantId,
        "offset": 0,
        "limit": 100
      },
      body: {
        Individual: {
          userUuid: staffs?.map((s) => {
            return s.userId;
          })
        }
      }
    });

    if (!fetchIndividualData) {
      throw new Error("Individuals not found");
    }
    const individual = fetchIndividualData?.Individual;

    Digit.SessionStorage.set("staffProjects", projects);
    Digit.SessionStorage.set("UserIndividual", individual);


  } catch (error) {
    if (error?.response?.data?.Errors) {
      throw new Error(error.response.data.Errors[0].message);
    }
    throw new Error("An unknown error occurred");
  }
};

export default initializePaymentsModule;
