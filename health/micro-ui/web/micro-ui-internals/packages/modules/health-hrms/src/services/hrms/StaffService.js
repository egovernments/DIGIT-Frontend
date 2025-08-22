import { Request } from "@egovernments/digit-ui-libraries";
import Urls from "../urls";
//import HRMS from "./HRMS";

/**
 * StaffService provides API request functions to manage staff-related operations.
 * This service includes functionalities for searching, deleting, and creating staff records.
 * It interacts with the HCM (Human Capital Management) system using Digit's request utilities.
 *
 * Available methods:
 * - `search_staff(data, tenantId)`: Searches for staff members based on provided criteria.
 * - `delete_staff(staffDetails)`: Deletes staff records based on given details.
 * - `searchStaffByProject({ projectId, tenantId })`: Searches staff members associated with a specific project.
 * - `search_project({ tenantId, projects, includeDescendants, includeImmediateChildren })`: Searches project details based on given filters.
 * - `getProjectDetails({ userId, tenantId, includeDescendants, includeImmediateChildren })`: Fetches project details for a user.
 * - `createStaff({ staffCreateData })`: Creates new staff records.
 */


export const StaffService = {
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
  delete_staff: ({ projectStaff }) =>
    Request({
      url: `${Urls.hcm.deleteStaff}`,
      useCache: false,
      method: "POST",
      data: {
        ProjectStaff: projectStaff,
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
  createStaff: async ({ projectStaff }) => {
    // await HRMS.update(assignmentUpdateData, tenantId);

    return Request({
      url: `${Urls.hcm.createStaff}`,
      useCache: false,
      method: "POST",
      data: {
        ProjectStaff: projectStaff,
        apiOperation: "CREATE",
      },
      auth: true,
      userService: false,
    });
  },
};
