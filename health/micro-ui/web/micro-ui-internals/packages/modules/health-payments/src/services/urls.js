//import BoundaryTypes from "../../enums/BoundaryTypes";

const healthHrms = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "health-hrms";
const mdmsPath = window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "mdms-v2";
const boundarySearchPath = window?.globalConfigs?.getConfig("BOUNDARY_CONTEXT") || "boundary-service/boundary-relationships/_search?";
const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "HIERARCHYTEST";
const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || "health-project";

const Urls = {
  hrms: {
    search: `/${healthHrms}/employees/_search`,
    count: `/${healthHrms}/employees/_count`,
    create: `/${healthHrms}/employees/_create`,
    update: `/${healthHrms}/employees/_update`,
  },
  MDMS: `/${mdmsPath}/v1/_search`,
  WorkFlow: `/egov-workflow-v2/egov-wf/businessservice/_search`,
  WorkFlowProcessSearch: `/egov-workflow-v2/egov-wf/process/_search`,
  localization: `/localization/messages/v1/_search`,
  filter_data: `https://run.mocky.io/v3/597a50a0-90e5-4a45-b82e-8a2186b760bd`,
  FileStore: "/filestore/v1/files",

  FileFetch: "/filestore/v1/files/url",

  EmployeeSearch: `/${healthHrms}/employees/_search`,

  InboxSearch: "/works-inbox-service/v2/_search",

  UserSearch: "/user/_search",
  UserLogout: "/user/_logout",

  Shortener: "/egov-url-shortening/shortener",

  hrms: {
    search: `/${healthHrms}/employees/_search`,
    count: `/${healthHrms}/employees/_count`,
    create: `/${healthHrms}/employees/_create`,
    update: `/${healthHrms}/employees/_update`,
  },

  hcm: {
    searchStaff: `/${projectContextPath}/staff/v1/_search`,
    searchProject: `/${projectContextPath}/v1/_search`,
    createStaff: `/${projectContextPath}/staff/v1/_create`,
    deleteStaff: `/${projectContextPath}/staff/v1/_delete`,
  },


  attendee:{
    deenrollAttendee:`/health-attendance/attendee/v1/_delete`,
    search: `/health-individual/v1/_search`,
    enrollAttendee:`/health-attendance/attendee/v1/_create`,
    
  }
};

export default Urls;
