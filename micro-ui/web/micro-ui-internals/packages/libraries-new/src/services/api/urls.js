const getGlobalConfig = (key, fallback) => {
  return window?.globalConfigs?.getConfig?.(key) || fallback;
};

const mdmsV1Path = getGlobalConfig("MDMS_V1_CONTEXT_PATH", "egov-mdms-service");
const mdmsV2Path = getGlobalConfig("MDMS_V2_CONTEXT_PATH", "mdms-v2");

export const ApiUrls = {
  // Core services
  MDMS: `/${mdmsV1Path}/v1/_search`,
  MDMS_V2: `/${mdmsV2Path}/v1/_search`,
  TenantConfigSearch: `/tenant-management/tenant/config/_search`,
  Localization: `/localization/messages/v1/_search`,
  
  // User management
  OTP_Send: "/user-otp/v1/_send",
  Authenticate: "/user/oauth/token",
  RegisterUser: "/user/citizen/_create",
  ChangePassword: "/user/password/nologin/_update",
  ChangePassword1: "/user/password/_update",
  UserProfileUpdate: "/user/profile/_update",
  UserSearch: "/user/_search",
  UserLogout: "/user/_logout",

  // Location services
  Location: {
    localities: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Locality`,
    wards: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=ADMIN&boundaryType=Ward`,
    revenue_localities: `/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality`,
  },

  // File services
  FileStore: "/filestore/v1/files",
  FileFetch: "/filestore/v1/files/url",

  // Workflow
  WorkFlow: `/egov-workflow-v2/egov-wf/businessservice/_search`,
  WorkFlowProcessSearch: `/egov-workflow-v2/egov-wf/process/_search`,

  // Employee services
  EmployeeSearch: "/egov-hrms/employees/_search",

  // Access control
  AccessControl: "/access/v1/actions/mdms/_get",

  // Utils
  Shortener: "/egov-url-shortening/shortener",
};

export default ApiUrls;