import React, { createContext, useContext, useMemo } from "react";
import getProjectServiceUrl from "../../utils/getProjectServiceUrl";

const CommodityProjectContext = createContext(null);

const CONSOLE_MDMS_MODULENAME = "HCM-ADMIN-CONSOLE";

const CommodityProjectProvider = ({ children }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleName = Digit.Utils.campaign.getModuleName();
  const user = Digit.SessionStorage.get("User");
  const uuid = user?.info?.uuid;

  // Step 1: Search project staff records for the current user
  const staffSearchCriteria = useMemo(() => ({
    url: `${getProjectServiceUrl()}/staff/v1/_search`,
    params: { tenantId, offset: 0, limit: 100 },
    body: { ProjectStaff: { staffId: [uuid] } },
    config: {
      enabled: !!uuid,
      select: (data) => data?.ProjectStaff || [],
    },
  }), [tenantId, uuid]);

  const { isLoading: staffLoading, data: projectStaff } = Digit.Hooks.useCustomAPIHook(staffSearchCriteria);

  // Extract unique project IDs from staff records
  const staffProjectIds = useMemo(() => {
    if (!projectStaff?.length) return [];
    return [...new Set(projectStaff.map((ps) => ps.projectId).filter(Boolean))];
  }, [projectStaff]);

  // Step 2: Fetch project details for all staff-assigned projects (with descendants)
  const projectSearchCriteria = useMemo(() => ({
    url: `${getProjectServiceUrl()}/v1/_search`,
    params: { tenantId, limit: staffProjectIds.length || 10, offset: 0, includeDescendants: true },
    body: { Projects: staffProjectIds.map((id) => ({ id, tenantId })) },
    config: {
      enabled: !!staffProjectIds.length,
      select: (data) => data?.Project || [],
    },
  }), [tenantId, staffProjectIds]);

  const { isLoading: projectsLoading, data: projects } = Digit.Hooks.useCustomAPIHook(projectSearchCriteria);

  // Derive user boundary from the first project's address
  const userBoundary = useMemo(() => {
    if (!projects?.length) return null;
    const firstProject = projects[0];
    if (firstProject?.address?.boundary && firstProject?.address?.boundaryType) {
      return {
        boundary: firstProject.address.boundary,
        boundaryType: firstProject.address.boundaryType,
      };
    }
    return null;
  }, [projects]);

  // All direct project assignments (for multi-project users)
  const userAssignments = useMemo(() => {
    if (!projects?.length) return [];
    return projects
      .map((p) => ({
        projectId: p.id,
        boundary: p.address?.boundary,
        boundaryType: p.address?.boundaryType,
      }))
      .filter((a) => a.boundary);
  }, [projects]);

  // Collect ALL boundary codes from user's projects + their descendants
  const userBoundaries = useMemo(() => {
    const boundaries = new Set();
    if (!projects?.length) return boundaries;
    const collectBoundaries = (proj) => {
      if (proj?.address?.boundary) boundaries.add(proj.address.boundary);
      if (proj?.descendants) proj.descendants.forEach(collectBoundaries);
    };
    projects.forEach(collectBoundaries);
    return boundaries;
  }, [projects]);

  // Fetch BOUNDARY_HIERARCHY_TYPE from MDMS
  const { data: BOUNDARY_HIERARCHY_TYPE, isLoading: hierarchyTypeLoading } = Digit.Hooks.useCustomMDMS(
    tenantId,
    CONSOLE_MDMS_MODULENAME,
    [{ name: "HierarchySchema", filter: `[?(@.type=='${moduleName}')]` }],
    {
      select: (data) =>
        data?.[CONSOLE_MDMS_MODULENAME]?.HierarchySchema?.[0]?.hierarchy,
    },
    { schemaCode: "HierarchySchema" },
  );

  // Fetch hierarchy definition to determine top-level boundary type
  const hierarchyDefCriteria = useMemo(() => ({
    url: `/boundary-service/boundary-hierarchy-definition/_search`,
    changeQueryName: `commodityCtx_${BOUNDARY_HIERARCHY_TYPE}`,
    body: {
      BoundaryTypeHierarchySearchCriteria: {
        tenantId,
        limit: 2,
        offset: 0,
        hierarchyType: BOUNDARY_HIERARCHY_TYPE,
      },
    },
    config: { enabled: !!BOUNDARY_HIERARCHY_TYPE },
  }), [tenantId, BOUNDARY_HIERARCHY_TYPE]);

  const { data: hierarchyDefinition, isLoading: hierarchyDefLoading } = Digit.Hooks.useCustomAPIHook(hierarchyDefCriteria);

  // Build sorted hierarchy and determine top-level boundary type
  const sortedHierarchy = useMemo(() => {
    const boundaryHierarchy =
      hierarchyDefinition?.BoundaryHierarchy?.[0]?.boundaryHierarchy || [];
    if (!boundaryHierarchy.length) return [];
    const sorted = [];
    let current = boundaryHierarchy.find((item) => !item?.parentBoundaryType);
    while (current) {
      sorted.push(current);
      const next = boundaryHierarchy.find(
        (item) => item?.parentBoundaryType === current?.boundaryType,
      );
      if (!next) break;
      current = next;
    }
    return sorted;
  }, [hierarchyDefinition]);

  const topLevelBoundaryType = sortedHierarchy[0]?.boundaryType || null;
  const isTopLevel = !!(userBoundary?.boundaryType && topLevelBoundaryType && userBoundary.boundaryType === topLevelBoundaryType);

  const userLevelIndex = useMemo(() => {
    if (!userBoundary?.boundaryType || !sortedHierarchy.length) return -1;
    const idx = sortedHierarchy.findIndex((h) => h.boundaryType === userBoundary.boundaryType);
    return idx >= 0 ? idx : -1;
  }, [userBoundary, sortedHierarchy]);

  const isAuthorizedForCommodity = useMemo(() => {
    if (sortedHierarchy.length < 3) return false;
    if (userLevelIndex < 0) return false;
    return userLevelIndex <= sortedHierarchy.length - 3;
  }, [sortedHierarchy, userLevelIndex]);

  const isLoading = staffLoading || projectsLoading || hierarchyTypeLoading || hierarchyDefLoading;
  const hasStaff = !!(projectStaff?.length > 0);

  const value = useMemo(() => ({
    projects: projects || [],
    userBoundary,
    userBoundaries,
    userAssignments,
    isTopLevel,
    topLevelBoundaryType,
    sortedHierarchy,
    userLevelIndex,
    isAuthorizedForCommodity,
    isLoading,
    hasStaff,
  }), [projects, userBoundary, userBoundaries, userAssignments, isTopLevel, topLevelBoundaryType, sortedHierarchy, userLevelIndex, isAuthorizedForCommodity, isLoading, hasStaff]);

  return (
    <CommodityProjectContext.Provider value={value}>
      {children}
    </CommodityProjectContext.Provider>
  );
};

const useCommodityProject = () => {
  const context = useContext(CommodityProjectContext);
  if (!context) {
    throw new Error("useCommodityProject must be used within a CommodityProjectProvider");
  }
  return context;
};

export { CommodityProjectContext, CommodityProjectProvider, useCommodityProject };
