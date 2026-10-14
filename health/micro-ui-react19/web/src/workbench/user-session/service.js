import {
  USER_SESSION_DEFAULT_SEARCH_URL,
  USER_SESSION_ACTIVE_USERS_BY_CAMPAIGN_URL,
  USER_SESSION_SEARCH_PATH_KEY,
  USER_SESSION_EMPLOYEE_SEARCH_PATH_KEY,
  USER_SESSION_EMPLOYEE_SEARCH_LIMIT,
  USER_SESSION_EMPLOYEE_SEARCH_OFFSET,
  USER_SESSION_EMPLOYEE_SEARCH_URL,
  USER_SESSION_ACTIVE_SESSION_SEARCH_URL,
  USER_SESSION_REVOKE_URL,
  USER_SESSION_PAGE_SIZE,
} from "./config";

export const getCurrentUserInfo = () => {
  try {
    const fromSession = window?.Digit?.SessionStorage?.get("User")?.info;
    if (fromSession) return fromSession;

    const raw = window.localStorage.getItem("Employee.user-info") || window.localStorage.getItem("Citizen.user-info");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.info || parsed;
  } catch (error) {
    return null;
  }
};

export const getResolvedTenantId = () => {
  const fromULB = Digit?.ULBService?.getCurrentTenantId?.();
  const fromStorage = window.localStorage.getItem("Employee.tenant-id");
  const fromUser = getCurrentUserInfo()?.tenantId;
  const fromState = window?.globalConfigs?.getConfig?.("STATE_LEVEL_TENANT_ID");
  const fromRoles = (getCurrentUserInfo()?.roles || []).find((role) => role?.tenantId)?.tenantId;

  return fromULB || fromStorage || fromUser || fromState || fromRoles || "";
};

export const getRequestInfo = (action = "_search") => {
  if (window?.Digit?.Utils?.getRequestInfo) {
    return {
      ...window.Digit.Utils.getRequestInfo(),
      action,
      msgId: `user-session-${Date.now()}`,
      userInfo: getCurrentUserInfo(),
    };
  }

  return {
    apiId: "hcm-ui",
    ver: ".01",
    ts: Date.now(),
    action,
    did: "1",
    key: "",
    msgId: `user-session-${Date.now()}`,
    authToken: window.localStorage.getItem("token"),
    userInfo: getCurrentUserInfo(),
  };
};

export const postJson = async (url, body, params = {}, requestOptions = {}) => {
  return Digit.CustomService.getResponse({
    url,
    method: "POST",
    useCache: false,
    body,
    params,
    ...requestOptions,
  });
};

export const getSessionSearchUrl = () => {
  return window?.globalConfigs?.getConfig(USER_SESSION_EMPLOYEE_SEARCH_PATH_KEY) || USER_SESSION_DEFAULT_SEARCH_URL;
};

export const getActiveSessionSearchUrl = () => {
  return window?.globalConfigs?.getConfig(USER_SESSION_SEARCH_PATH_KEY) || USER_SESSION_ACTIVE_SESSION_SEARCH_URL;
};

export const normalizeSessions = (payload) => {
  if (Array.isArray(payload?.userSessions)) return payload.userSessions;
  if (Array.isArray(payload?.sessions)) return payload.sessions;
  if (Array.isArray(payload?.sessionDetails)) return payload.sessionDetails;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.Users)) return payload.Users;
  if (Array.isArray(payload?.users)) return payload.users;
  return [];
};

const normalizeEmployees = (payload) => {
  if (Array.isArray(payload?.Employees)) return payload.Employees;
  if (Array.isArray(payload?.employees)) return payload.employees;
  return [];
};

const getEmployeesTotalCount = (payload, employees = []) => {
  if (Number.isFinite(payload?.totalCount)) return payload.totalCount;
  if (Number.isFinite(payload?.TotalCount)) return payload.TotalCount;
  if (Number.isFinite(payload?.count)) return payload.count;
  return employees.length;
};

const normalizeLookupKey = (value) => String(value || "").trim().toLowerCase();

const getEmployeeLookupMatches = (employees = [], employeeCode = "") => {
  const lookupKey = normalizeLookupKey(employeeCode);
  if (!lookupKey) return [];

  return employees.filter((employee) => {
    const code = normalizeLookupKey(employee?.code);
    const userName = normalizeLookupKey(employee?.user?.userName);
    return code === lookupKey || userName === lookupKey;
  });
};

const getStatusValue = (session) => {
  if (session?.status) return String(session.status).toUpperCase();
  if (session?.active === true) return "ACTIVE";
  if (session?.active === false) return "INACTIVE";
  return "-";
};

const normalizeRoles = (session, user) => {
  const roleSource = session?.roles || user?.roles || [];
  if (!Array.isArray(roleSource)) return [];
  return roleSource
    .map((role) => role?.name || role?.code)
    .filter(Boolean)
    .map((roleName) => String(roleName).trim());
};

const mapEmployeeRow = (item = {}, index = 0) => {
  const user = item?.user || {};
  const employeeCode = item?.code || null;
  const userUuid = item?.uuid || user?.uuid || null;
  const tenantId = item?.tenantId || user?.tenantId || "";
  const userName = user?.userName || item?.code || "-";
  const name = user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "-";
  const mobileNumber = user?.mobileNumber || "";
  const roles = normalizeRoles(item, user);
  const status = item?.isActive === false || user?.active === false ? "INACTIVE" : "ACTIVE";

  return {
    id: userUuid || `${userName}-${index}`,
    employeeCode,
    tenantId,
    userUuid,
    userName,
    name,
    mobileNumber,
    roles,
    status,
    deviceId: "-",
  };
};

export const mapSessionRow = (item = {}, index = 0) => {
  const user = item?.user || {};
  const employeeCode = item?.code || user?.code || null;
  const userUuid = item?.userUuid || item?.uuid || item?.userId || user?.uuid;
  const tenantId = item?.tenantId || user?.tenantId || "";
  const userName = item?.userName || item?.username || user?.userName || "-";
  const nameFromUser = [user?.name, user?.profile?.name, user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(" ");
  const name = item?.name || nameFromUser || "-";
  const deviceId =
    item?.deviceId ||
    item?.deviceID ||
    item?.device?.id ||
    user?.additionalDetails?.deviceId ||
    user?.additionalDetails?.deviceID ||
    "-";

  return {
    id: userUuid || `${userName}-${index}`,
    employeeCode,
    tenantId,
    userUuid,
    userName,
    name,
    mobileNumber: item?.mobileNumber || user?.mobileNumber || "",
    roles: normalizeRoles(item, user),
    status: getStatusValue(item),
    deviceId,
  };
};

const normalizeActiveUsers = (payload) => {
  if (Array.isArray(payload?.activeUsers)) return payload.activeUsers;
  if (Array.isArray(payload?.ActiveUsers)) return payload.ActiveUsers;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.Users)) return payload.Users;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.userSessions)) return payload.userSessions;
  if (Array.isArray(payload?.sessions)) return payload.sessions;
  if (Array.isArray(payload?.sessionDetails)) return payload.sessionDetails;

  if (Array.isArray(payload?.response?.activeUsers)) return payload.response.activeUsers;
  if (Array.isArray(payload?.Response?.activeUsers)) return payload.Response.activeUsers;
  if (Array.isArray(payload?.response?.users)) return payload.response.users;

  return [];
};

const isUuidLike = (value) => {
  if (typeof value !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim());
};

const firstReadableValue = (values = []) => {
  for (const raw of values) {
    const value = typeof raw === "string" ? raw.trim() : raw;
    if (!value) continue;
    if (typeof value === "string" && isUuidLike(value)) continue;
    return value;
  }
  return null;
};

const firstPresentValue = (values = []) => {
  for (const raw of values) {
    const value = typeof raw === "string" ? raw.trim() : raw;
    if (!value) continue;
    return value;
  }
  return null;
};

const mapActiveUserRow = (item = {}, index = 0) => {
  const user = item?.user || {};
  const employee = item?.employee || {};
  const userUuid = item?.userUuid || item?.uuid || user?.uuid || employee?.uuid || null;
  const sessionUserName =
    firstPresentValue([
      item?.userName,
      item?.username,
      user?.userName,
      user?.username,
      item?.employeeCode,
      item?.code,
      employee?.code,
      item?.userId,
      user?.id,
    ]) || null;

  const fallbackComposedName = [user?.firstName, user?.middleName, user?.lastName].filter(Boolean).join(" ").trim();
  const sessionName =
    firstPresentValue([
      item?.name,
      item?.fullName,
      user?.name,
      employee?.name,
      employee?.employeeName,
      fallbackComposedName,
    ]) || null;
  const tenantId = item?.tenantId || user?.tenantId || employee?.tenantId || "";
  const employeeCode = item?.employeeCode || item?.code || employee?.code || null;
  const deviceId =
    item?.deviceId ||
    item?.deviceID ||
    item?.device?.id ||
    user?.additionalDetails?.deviceId ||
    user?.additionalDetails?.deviceID ||
    "-";

  return {
    id: userUuid || `${employeeCode || "session"}-${index}`,
    employeeCode,
    tenantId,
    userUuid,
    sessionUserName,
    sessionName,
    userName: "-",
    name: "-",
    mobileNumber: item?.mobileNumber || user?.mobileNumber || employee?.mobileNumber || "",
    roles: normalizeRoles(item, user),
    status: "ACTIVE",
    deviceId,
  };
};

const shouldHydrateDisplayFields = (row = {}) => {
  const normalizedUserName = String(row?.userName || "").trim();
  const normalizedName = String(row?.name || "").trim();
  const userNameMissing = !normalizedUserName || normalizedUserName === "-";
  const nameMissing = !normalizedName || normalizedName === "-";
  return userNameMissing || nameMissing || isUuidLike(normalizedUserName) || isUuidLike(normalizedName);
};

const mapUserIdentity = (entry = {}) => {
  const uuid = String(entry?.uuid || "").trim();
  if (!uuid) return null;

  return {
    uuid,
    userName: firstReadableValue([entry?.userName]) || null,
    name: firstReadableValue([entry?.name]) || null,
  };
};

const searchUsersByUuids = async ({ tenantId, uuids = [] }) => {
  const uniqueUuids = [...new Set((uuids || []).map((value) => String(value || "").trim()).filter(Boolean))];
  if (!uniqueUuids.length) return new Map();

  const response = await postJson("/user/_search", {
    requestInfo: getRequestInfo("_search"),
    uuid: uniqueUuids,
    tenantId,
  });

  const users = Array.isArray(response?.user) ? response.user : [];
  const userMap = new Map();

  users.forEach((entry) => {
    const mapped = mapUserIdentity(entry);
    if (!mapped?.uuid) return;
    userMap.set(mapped.uuid, mapped);
  });

  return userMap;
};

export const searchActiveUsersByCampaignNumber = async ({ tenantId, campaignNumber }) => {
  const normalizedCampaignNumber = String(campaignNumber || "").trim();
  if (!normalizedCampaignNumber) {
    return [];
  }

  const response = await postJson(USER_SESSION_ACTIVE_USERS_BY_CAMPAIGN_URL, {
    RequestInfo: getRequestInfo("_search"),
    SearchCriteria: {
      tenantId,
      campaignNumber: normalizedCampaignNumber,
    },
  });

  const mappedRows = normalizeActiveUsers(response).map(mapActiveUserRow);

  const rowsNeedingHydration = mappedRows.filter((row) => shouldHydrateDisplayFields(row));

  try {
    const uuidCandidates = mappedRows
      .map((row) => {
        if (row?.userUuid) return row.userUuid;
        const rowUserName = String(row?.userName || "").trim();
        return isUuidLike(rowUserName) ? rowUserName : null;
      })
      .filter(Boolean);

    if (!uuidCandidates.length) {
      return mappedRows.map((row) => ({
        ...row,
        userName: "-",
        name: "-",
      }));
    }

    const userMap = await searchUsersByUuids({ tenantId, uuids: uuidCandidates });

    if (rowsNeedingHydration.length && userMap.size < uuidCandidates.length) {
      const missingCount = uuidCandidates.length - userMap.size;
      console.warn(`[UserSession] User lookup missing ${missingCount} UUID record(s) from /user/_search for tenant '${tenantId}'.`);
    }

    return mappedRows.map((row) => {
      const rowUserUuid = String(row?.userUuid || "").trim();
      const userNameAsUuid = String(row?.sessionUserName || "").trim();
      const lookupUuid = rowUserUuid || (isUuidLike(userNameAsUuid) ? userNameAsUuid : "");
      const match = lookupUuid ? userMap.get(lookupUuid) : null;

      const resolvedUserName = firstReadableValue([match?.userName]) || "-";
      const resolvedName = firstReadableValue([match?.name]) || "-";

      return {
        ...row,
        userUuid: row?.userUuid || lookupUuid || null,
        userName: resolvedUserName,
        name: resolvedName,
      };
    });
  } catch (error) {
    console.warn(`[UserSession] Failed to enrich active session users via /user/_search for tenant '${tenantId}'.`, {
      error: error?.message || "unknown-error",
    });
    return mappedRows.map((row) => ({
      ...row,
      userName: "-",
      name: "-",
    }));
  }
};

export const lookupActiveSessionUserUuid = async ({ tenantId, employeeCode, userName, limit = 20, offset = 0 }) => {
  const lookupKey = String(employeeCode || userName || "").trim();
  if (!lookupKey) {
    return { status: "not-found", userUuid: null, matchedSession: null };
  }

  const response = await postJson(
    getActiveSessionSearchUrl(),
    {
      RequestInfo: getRequestInfo("_search"),
    },
    {
      tenantId,
      limit,
      offset,
      codes: lookupKey,
    }
  );

  const sessions = normalizeSessions(response);
  const normalizedLookupKey = normalizeLookupKey(lookupKey);

  const matches = sessions.filter((session) => {
    const sessionUserUuid = normalizeLookupKey(session?.userUuid || session?.uuid || session?.user?.uuid);
    const sessionUserName = normalizeLookupKey(session?.userName || session?.username || session?.user?.userName);
    const sessionCode = normalizeLookupKey(session?.code || session?.employeeCode || session?.employee?.code);
    return sessionUserUuid === normalizedLookupKey || sessionUserName === normalizedLookupKey || sessionCode === normalizedLookupKey;
  });

  if (matches.length === 1) {
    const userUuid = matches[0]?.userUuid || matches[0]?.uuid || matches[0]?.user?.uuid || null;
    if (!userUuid) {
      return { status: "not-found", userUuid: null, matchedSession: null };
    }
    return { status: "resolved", userUuid, matchedSession: matches[0] };
  }

  if (matches.length > 1) {
    return { status: "ambiguous", userUuid: null, matchedSession: null };
  }

  return { status: "not-found", userUuid: null, matchedSession: null };
};

export const searchUserSessions = async ({ tenantId, userName, limit = USER_SESSION_PAGE_SIZE, offset = 0 }) => {
  const normalizedCode = userName?.trim() || undefined;
  const payload = {
    RequestInfo: getRequestInfo("_search"),
  };

  const employeeResponse = await postJson(getSessionSearchUrl(), payload, {
    tenantId,
    limit,
    offset,
    codes: normalizedCode,
  });

  const employees = normalizeEmployees(employeeResponse);

  return {
    rows: employees.map(mapEmployeeRow),
    totalCount: getEmployeesTotalCount(employeeResponse, employees),
  };
};

export const lookupEmployeeUuidByCode = async ({ tenantId, employeeCode, limit = USER_SESSION_EMPLOYEE_SEARCH_LIMIT, offset = USER_SESSION_EMPLOYEE_SEARCH_OFFSET }) => {
  const normalizedEmployeeCode = String(employeeCode || "").trim();

  if (!normalizedEmployeeCode) {
    return { status: "not-found", userUuid: null, matchedEmployee: null };
  }

  const response = await postJson(
    USER_SESSION_EMPLOYEE_SEARCH_URL,
    {
      RequestInfo: getRequestInfo("_search"),
    },
    {
      tenantId,
      limit,
      offset,
      codes: normalizedEmployeeCode,
    }
  );

  const employees = normalizeEmployees(response);
  const matches = getEmployeeLookupMatches(employees, normalizedEmployeeCode);

  if (matches.length === 1) {
    const userUuid = matches[0]?.uuid || null;
    if (!userUuid) {
      return { status: "not-found", userUuid: null, matchedEmployee: null };
    }
    return { status: "resolved", userUuid, matchedEmployee: matches[0] };
  }

  if (matches.length > 1) {
    return { status: "ambiguous", userUuid: null, matchedEmployee: null };
  }

  return { status: "not-found", userUuid: null, matchedEmployee: null };
};

export const revokeUserSession = async ({ userUuid, tenantId }) => {
  const authTokenFromRequestInfo = Digit?.Utils?.getRequestInfo?.()?.authToken;
  const authTokenFromStorage = window.localStorage.getItem("token");
  const authToken = authTokenFromRequestInfo || authTokenFromStorage || "";

  return postJson(
    USER_SESSION_REVOKE_URL,
    {
      RequestInfo: {
        authToken,
      },
      userUuid,
      tenantId,
    },
    {},
    {
      setTimeParam: false,
    }
  );
};

export const isRevokeSuccessful = (response) => {
  if (!response || typeof response !== "object") return false;
  if (Array.isArray(response?.Errors) && response.Errors.length > 0) return false;
  if (response?.error || response?.errorMessage) return false;

  const explicitStatus =
    response?.status ??
    response?.Status ??
    response?.responseStatus ??
    response?.ResponseInfo?.status;

  if (typeof explicitStatus === "boolean") return explicitStatus;
  if (typeof explicitStatus === "string") {
    const normalizedStatus = explicitStatus.trim().toLowerCase();
    if (["success", "successful", "succeeded", "ok"].includes(normalizedStatus)) return true;
    if (["failed", "failure", "error", "unsuccessful"].includes(normalizedStatus)) return false;
  }

  // If backend does not send explicit status and no errors are present, treat as successful.
  return true;
};
