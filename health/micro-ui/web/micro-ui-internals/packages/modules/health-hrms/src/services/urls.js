//import BoundaryTypes from "../../enums/BoundaryTypes";

const healthHrms = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "egov-hrms";
const mdmsPath = window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "mdms-v2";
const boundarySearchPath = window?.globalConfigs?.getConfig("BOUNDARY_CONTEXT") || "boundary-service/boundary-relationships/_search?";
const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_CONTEXT_PATH") || "project";

const Urls = {
  hrms: {
    search: `/${healthHrms}/employees/_search`,
    count: `/${healthHrms}/employees/_count`,
    create: `/${healthHrms}/employees/_create`,
    update: `/${healthHrms}/employees/_update`,
  },
};

export default Urls;
