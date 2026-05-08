import { Request } from "@egovernments/digit-ui-libraries";
import Urls from "../urls";

export const StaffService = {
  search_staff: (data, tenantId) =>
    Request({
      url: `${Urls.hcm.searchStaff}`,
      useCache: false,
      method: "POST",
      data: data,
      params: { tenantId, limit: 100, offset: 0 },
      auth: true,
      userService: false,
    }),
  delete_staff: ({ projectStaff }) =>
    Request({
      url: `${Urls.hcm.deleteStaff}`,
      useCache: false,
      method: "POST",
      data: { ProjectStaff: projectStaff },
      auth: true,
      userService: false,
    }),
  searchStaffByProject: ({ projectId, tenantId }) =>
    Request({
      url: `${Urls.hcm.searchStaff}`,
      useCache: false,
      method: "POST",
      data: { ProjectStaff: { projectId } },
      params: { tenantId, limit: 100, offset: 0 },
      auth: true,
      userService: false,
    }),
  search_project: ({ tenantId, projects, includeDescendants, includeImmediateChildren }) =>
    Request({
      url: `${Urls.hcm.searchProject}`,
      useCache: true,
      method: "POST",
      params: {
        tenantId,
        limit: 100,
        offset: 0,
        includeAncestors: false,
        includeDescendants,
        includeImmediateChildren,
      },
      data: { Projects: projects },
      auth: true,
      userService: false,
    }),
  createStaff: async ({ projectStaff }) =>
    Request({
      url: `${Urls.hcm.createStaff}`,
      useCache: false,
      method: "POST",
      data: { ProjectStaff: projectStaff, apiOperation: "CREATE" },
      auth: true,
      userService: false,
    }),
};
