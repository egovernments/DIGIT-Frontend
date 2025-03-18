
const healthHrms = window?.globalConfigs?.getConfig("HRMS_CONTEXT_PATH") || "egov-hrms";
const mdmsPath = window?.globalConfigs?.getConfig("MDMS_CONTEXT_PATH") || "mdms-v2";
const boundarySearchPath = window?.globalConfigs?.getConfig("BOUNDARY_CONTEXT") || "boundary-service/boundary-relationships/_search?";
const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
const projectContextPath = window?.globalConfigs?.getConfig("PROJECT_CONTEXT_PATH") || "project";

const Urls = {
  pgr: {
    search: `/pgr-services/v2/request/_search`,
    create: `/pgr-services/v2/request/_create`
  },
  workflow: {
    processSearch: `egov-workflow-v2/egov-wf/process/_search`,
    businessServiceSearch:  `/egov-workflow-v2/egov-wf/businessservice/_search`,
  }
};

export default Urls;