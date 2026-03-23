import React, { createContext, useContext, useMemo } from "react";
import getProjectServiceUrl from "../../utils/getProjectServiceUrl";

const CommodityProjectContext = createContext(null);

const CommodityProjectProvider = ({ children }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
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

  // Step 2: Fetch project details for all staff-assigned projects
  const projectSearchCriteria = useMemo(() => ({
    url: `${getProjectServiceUrl()}/v1/_search`,
    params: { tenantId, limit: staffProjectIds.length || 10, offset: 0 },
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

  const isLoading = staffLoading || projectsLoading;
  const hasStaff = !!(projectStaff?.length > 0);

  const value = useMemo(() => ({
    projects: projects || [],
    userBoundary,
    isLoading,
    hasStaff,
  }), [projects, userBoundary, isLoading, hasStaff]);

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
