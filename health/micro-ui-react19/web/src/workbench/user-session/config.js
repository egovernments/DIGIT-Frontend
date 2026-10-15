export const USER_SESSION_ROUTE = "/employee/user-session";
export const USER_SESSION_SEARCH_PATH_KEY = "USER_SESSION_SEARCH_PATH";
export const USER_SESSION_EMPLOYEE_SEARCH_PATH_KEY = "USER_SESSION_EMPLOYEE_SEARCH_PATH";
export const USER_SESSION_DEFAULT_SEARCH_URL = "/egov-hrms/employees/_search";
export const USER_SESSION_EMPLOYEE_SEARCH_URL = "/egov-hrms/employees/_search";
export const USER_SESSION_ACTIVE_SESSION_SEARCH_URL = "/user/user-session/v1/_search";
export const USER_SESSION_ACTIVE_USERS_BY_CAMPAIGN_URL = "/project-factory/v1/data/active-users/_search";
export const USER_SESSION_REVOKE_URL = "/user/user-session/v1/_revoke";
export const USER_SESSION_PAGE_SIZE = 10;
export const USER_SESSION_EMPLOYEE_SEARCH_LIMIT = 1000;
export const USER_SESSION_EMPLOYEE_SEARCH_OFFSET = 0;

export const USER_SESSION_ALLOWED_ACTION_KEYS = [
  "USERMANAGEMENT.USER_SESSION",
  "USER_SESSION_LINK_USER_SESSION",
  "USER_SESSION",
];

export const USER_SESSION_REQUIRED_ROLE = "SYSTEM_ADMINISTRATOR";

export const USER_SESSION_FALLBACK_ROLES = [
  USER_SESSION_REQUIRED_ROLE,
];

export const hasUserSessionAccess = () => {
  try {
    if (window?.Digit?.Utils?.didEmployeeHasAtleastOneRole) {
      return window.Digit.Utils.didEmployeeHasAtleastOneRole([USER_SESSION_REQUIRED_ROLE]);
    }
  } catch (error) {
    // Fallback to local role parsing when utility is unavailable.
  }

  try {
    const raw = window.localStorage.getItem("Employee.user-info") || "";
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const roles = parsed?.info?.roles || parsed?.roles || [];
    return roles.some((role) => String(role?.code || "").toUpperCase() === USER_SESSION_REQUIRED_ROLE);
  } catch (error) {
    return false;
  }
};

const NON_CONTEXT_SEGMENTS = new Set(["employee", "citizen"]);

export const resolveWorkbenchContextPath = () => {
  const configuredContextPath = String(window?.globalConfigs?.getConfig?.("CONTEXT_PATH") || "").trim();
  const pathSegment = String(window?.location?.pathname?.split("/").filter(Boolean)[0] || "").trim();
  const runtimeContextPath = String(window?.contextPath || "").trim();

  if (configuredContextPath && !NON_CONTEXT_SEGMENTS.has(configuredContextPath.toLowerCase())) {
    return configuredContextPath;
  }

  if (pathSegment && !NON_CONTEXT_SEGMENTS.has(pathSegment.toLowerCase())) {
    return pathSegment;
  }

  if (runtimeContextPath && !NON_CONTEXT_SEGMENTS.has(runtimeContextPath.toLowerCase())) {
    return runtimeContextPath;
  }

  return "workbench-ui";
};

export const getUserSessionRouteLink = () => `/${resolveWorkbenchContextPath()}${USER_SESSION_ROUTE}`;
export const getEmployeeHomeRouteLink = () => `/${resolveWorkbenchContextPath()}/employee`;
