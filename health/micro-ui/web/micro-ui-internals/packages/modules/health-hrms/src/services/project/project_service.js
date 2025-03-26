import Urls from "../urls";
import { Request } from "@egovernments/digit-ui-libraries";

/**
 * ProjectService provides API request functions to handle staff and project-related operations.
 * This service includes functionalities for searching, deleting, and retrieving project details.
 * It interacts with HRMS and HCM services using Digit's request utilities.
 *
 * Available methods:
 * - `search_staff(data, tenantId)`: Searches for staff based on provided criteria.
 * - `delete_staff(staffDetails)`: Deletes staff members from the project.
 * - `searchStaffByProject({ projectId, tenantId })`: Searches staff within a specific project.
 * - `search_project({ tenantId, projects, includeDescendants, includeImmediateChildren })`: Fetches project details based on filters.
 * - `getProjectDetails({ userId, tenantId, includeDescendants, includeImmediateChildren })`: Retrieves project details for a given user.
 * - `createStaffAndUpdateAssignments({ staffCreateData, assignmentUpdateData, tenantId })`: Creates new staff and updates existing assignments.
 */


export const ProjectService = {
  search_staff: (data, tenantId) =>
    Request({
      url: `${Urls.hcm.searchStaff}`,
      useCache: false,
      method: "POST",
      data: data,
      params: {
        tenantId: tenantId,
        limit: 100,
        offset: 0,
      },
      auth: true,
      userService: false,
    }),
  delete_staff: (staffDetails) =>
    Request({
      url: `${Urls.hcm.deleteStaff}`,
      useCache: false,
      method: "POST",
      data: {
        ProjectStaff: staffDetails,
      },
      auth: true,
      userService: false,
    }),
  searchStaffByProject: ({ projectId, tenantId }) =>
    Request({
      url: `${Urls.hcm.searchStaff}`,
      useCache: false,
      method: "POST",
      data: {
        ProjectStaff: {
          projectId: projectId,
        },
      },
      params: {
        tenantId: tenantId,
        limit: 100,
        offset: 0,
      },
      auth: true,
      userService: false,
    }),
  search_project: ({ tenantId, projects, includeDescendants, includeImmediateChildren }) =>
    Request({
      url: `${Urls.hcm.searchProject}`,
      useCache: true,
      method: "POST",
      params: {
        tenantId: tenantId,
        limit: 100,
        offset: 0,
        includeAncestors: false,
        includeDescendants: includeDescendants,
        includeImmediateChildren: includeImmediateChildren,
      },
      data: {
        Projects: projects,
      },
      auth: true,
      userService: false,
    }),
  getProjectDetails: async ({ userId, tenantId, includeDescendants, includeImmediateChildren }) => {
    let projectStaff = [];
    let projectDetails = [];
    try {
      await ProjectService.search_staff({ userId, tenantId })
        .then((res) => {
          projectStaff = res?.ProjectStaff;
        })
        .catch((err) => err);
      if (projectStaff.some((staff) => staff?.projectId?.length !== 0)) {
        let projects = [];
        for (let i = 0; i < projectStaff?.length; i++) {
          projects.push({
            id: projectStaff[i].projectId,
            tenantId: projectStaff[i].tenantId,
          });
        }
        await ProjectService.search_project({ tenantId, projects, includeDescendants, includeImmediateChildren })
          .then((res) => {
            projectDetails = res?.Project;
          })
          .catch((err) => err);
      }
      return projectDetails;
    } catch (err) {
      return projectDetails;
    }
  },
  createStaffAndUpdateAssignments: async ({ staffCreateData, assignmentUpdateData, tenantId }) => {
    await HRMS.update(assignmentUpdateData, tenantId);

    return Request({
      url: `${Urls.hcm.createStaff}`,
      useCache: false,
      method: "POST",
      data: {
        ProjectStaff: staffCreateData,
        apiOperation: "CREATE",
      },
      auth: true,
      userService: false,
    });
  },
};
