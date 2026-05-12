import Urls from "../urls";

export const ProjectService = {
  search_staff: (data, tenantId) =>
    Digit.CustomService.getResponse({
      url: Urls.hcm.searchStaff,
      useCache: false,
      method: "POST",
      body: data,
      params: { tenantId, limit: 100, offset: 0 },
    }),
  delete_staff: (staffDetails) =>
    Digit.CustomService.getResponse({
      url: Urls.hcm.deleteStaff,
      useCache: false,
      method: "POST",
      body: { ProjectStaff: staffDetails },
    }),
  searchStaffByProject: ({ projectId, tenantId }) =>
    Digit.CustomService.getResponse({
      url: Urls.hcm.searchStaff,
      useCache: false,
      method: "POST",
      body: { ProjectStaff: { projectId } },
      params: { tenantId, limit: 100, offset: 0 },
    }),
  search_project: ({ tenantId, projects, includeDescendants, includeImmediateChildren }) =>
    Digit.CustomService.getResponse({
      url: Urls.hcm.searchProject,
      useCache: false,
      method: "POST",
      params: {
        tenantId,
        limit: 100,
        offset: 0,
        includeAncestors: false,
        includeDescendants,
        includeImmediateChildren,
      },
      body: { Projects: projects },
    }),
  getProjectDetails: async ({ userId, tenantId, includeDescendants, includeImmediateChildren }) => {
    let projectStaff = [];
    let projectDetails = [];
    try {
      await ProjectService.search_staff({ userId }, tenantId)
        .then((res) => { projectStaff = res?.ProjectStaff; })
        .catch((err) => err);
      if (projectStaff.some((staff) => staff?.projectId?.length !== 0)) {
        const projects = projectStaff.map((s) => ({ id: s.projectId, tenantId: s.tenantId }));
        await ProjectService.search_project({ tenantId, projects, includeDescendants, includeImmediateChildren })
          .then((res) => { projectDetails = res?.Project; })
          .catch((err) => err);
      }
      return projectDetails;
    } catch (err) {
      return projectDetails;
    }
  },
  createStaffAndUpdateAssignments: async ({ staffCreateData, tenantId }) =>
    Digit.CustomService.getResponse({
      url: Urls.hcm.createStaff,
      useCache: false,
      method: "POST",
      body: { ProjectStaff: staffCreateData, apiOperation: "CREATE" },
    }),
};
