const healthHrms = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "health-hrms";
const mdmsPath = window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "mdms-v2";
const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_SERVICE_PATH") || "health-project";
const healthAttendanceContextPath = window?.globalConfigs?.getConfig("ATTENDANCE_CONTEXT_PATH") || "health-attendance";
const healthIndividualContextPath = window?.globalConfigs?.getConfig("INDIVIDUAL_CONTEXT_PATH") || "health-individual";

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
  FileStore: "/filestore/v1/files",
  FileFetch: "/filestore/v1/files/url",
  EmployeeSearch: `/${healthHrms}/employees/_search`,
  InboxSearch: "/works-inbox-service/v2/_search",
  UserSearch: "/user/_search",
  UserLogout: "/user/_logout",
  Shortener: "/egov-url-shortening/shortener",
  hcm: {
    searchStaff: `/${projectContextPath}/staff/v1/_search`,
    searchProject: `/${projectContextPath}/v1/_search`,
    createStaff: `/${projectContextPath}/staff/v1/_create`,
    deleteStaff: `/${projectContextPath}/staff/v1/_delete`,
  },
  attendee: {
    deenrollAttendee: `/${healthAttendanceContextPath}/attendee/v1/_delete`,
    search: `/${healthIndividualContextPath}/v1/_search`,
  },
};

export default Urls;
