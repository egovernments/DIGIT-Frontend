/**
 * SSO tenant discovery and switching.
 *
 * `/user/oauth/tenants` answers "which tenants is this IdP subject mapped to", and is posted
 * with the raw ID token BEFORE the token exchange so a tenantId can be chosen for
 * grant_type=jwt_exchange. The resulting list is kept for the session so the tenant switcher
 * does not have to ask again.
 */

import { getIdpToken } from "./idpToken";

/* Digit.SessionStorage prefixes keys with "Digit." */
const TENANTS_KEY = "sso.tenants";

const basicAuthHeader = () => `Basic ${window?.globalConfigs?.getConfig("JWT_TOKEN") || "ZWdvdi11c2VyLWNsaWVudDo="}`;

/* Tenant the shared-login mapping is keyed on. The backend falls back to its own
   auth.oidc.shared-login.tenant-id when omitted; we send it explicitly so the value is
   visible and configurable per deployment. */
export const getSSOLookupTenantId = () => window?.globalConfigs?.getConfig("SSO_LOOKUP_TENANT_ID") || "public";

/* True on the shared/common login deployment, false on a tenant-specific one. Derived rather
   than configured, so there is no extra flag to keep in sync. */
export const isSharedLoginDeployment = () => Digit.ULBService.getStateId() === getSSOLookupTenantId();

const parseError = async (response, fallbackMessage) => {
  const raw = await response.text();
  let parsed;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch (e) {
    parsed = null;
  }
  const error = new Error(parsed?.error_description || parsed?.error || raw || fallbackMessage);
  error.code = parsed?.error;
  error.status = response.status;
  return error;
};

export const lookupTenants = async (idToken) => {
  const response = await fetch("/user/oauth/tenants", {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      assertion: idToken,
      tenantId: getSSOLookupTenantId(),
    }),
  });

  if (!response.ok) throw await parseError(response, "Tenant lookup failed");

  const data = await response.json();
  return Array.isArray(data?.tenants) ? data.tenants : [];
};

export const storeSSOTenants = (tenants) => Digit.SessionStorage.set(TENANTS_KEY, tenants || []);
export const getStoredSSOTenants = () => Digit.SessionStorage.get(TENANTS_KEY) || [];
export const clearSSOTenants = () => Digit.SessionStorage.del(TENANTS_KEY);

export const sortByTenantId = (tenants = []) =>
  [...tenants].sort((a, b) => String(a?.tenantId || "").localeCompare(String(b?.tenantId || "")));

const deploymentMap = () => window?.globalConfigs?.getConfig("TENANT_DEPLOYMENT_MAP") || {};

/**
 * Drop tenants we cannot actually put the user on.
 *
 * Landing on a tenant with no TENANT_DEPLOYMENT_MAP entry means no redirect happens, so the
 * user ends up authenticated as tenant X while the page still runs tenant Y's globalConfigs
 * (wrong hierarchy, wrong locale, wrong service paths) with nothing shown to explain it.
 *
 * `keepTenantId` is the currently-active tenant, which the switcher needs to keep in the list
 * so it stays visible as the selected option even if it has no mapping. Omit it when choosing
 * a tenant to log in to, where there is nothing to preserve.
 *
 * An empty map means single-deployment mode, so no filtering applies.
 */
export const filterDeployable = (tenants = [], keepTenantId = null) => {
  const keys = Object.keys(deploymentMap());
  if (!keys.length) return tenants;
  return tenants.filter((tenant) => {
    const id = tenant?.tenantId;
    if (!id) return false;
    return keys.includes(String(id).toLowerCase()) || id === keepTenantId;
  });
};

/* Tenant ids the switcher should offer: mapped to a deployment, plus the current one, sorted,
   deduped. Fewer than two means there is nothing to switch between. */
export const getSwitchableTenantIds = (currentTenantId) => {
  const ids = filterDeployable(sortByTenantId(getStoredSSOTenants()), currentTenantId)
    .map((tenant) => tenant?.tenantId)
    .filter(Boolean);
  return [...new Set(ids)];
};

/* Where a given tenant is served from, e.g. chaduat -> /chaduat/hcm-digit-ui */
export const getTenantBasePath = (tenantId) => {
  const target = deploymentMap()[String(tenantId || "").toLowerCase()];
  return target ? target.replace(/^\/|\/$/g, "") : null;
};

/**
 * Persist a freshly exchanged employee session.
 *
 * Deliberately a separate copy of the writes in Login/login.js rather than a shared
 * extraction: that file and pages/employee/Otp/index.js already carry two copies which differ
 * (login.js additionally exempts development builds from the multi-root guard), so unifying
 * them would quietly change the OTP path. Worth consolidating, but not as a side effect of
 * tenant switching.
 */
const persistEmployeeSession = (userObject, token) => {
  if (Digit.Utils.getMultiRootTenant() && process.env.NODE_ENV !== "development") return;

  const locale = JSON.parse(sessionStorage.getItem("Digit.locale"))?.value || Digit.Utils.getDefaultLanguage();
  localStorage.setItem("Employee.tenant-id", userObject?.tenantId);
  localStorage.setItem("tenant-id", userObject?.tenantId);
  localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
  localStorage.setItem("locale", locale);
  localStorage.setItem("Employee.locale", locale);
  localStorage.setItem("token", token);
  localStorage.setItem("Employee.token", token);
  localStorage.setItem("user-info", JSON.stringify(userObject));
  localStorage.setItem("Employee.user-info", JSON.stringify(userObject));
};

/**
 * Switch the logged-in tenant: end the DIGIT session for the current one, re-exchange the
 * stored ID token for the target, persist it, and send the browser to that tenant's
 * deployment.
 *
 * Throws with `code` set to a localisation key so the caller can surface it:
 *   SSO_SESSION_EXPIRED       - no usable ID token, the user has to log in again
 *   SSO_TENANT_SWITCH_FAILED  - the exchange failed for some other reason
 */
export const switchTenant = async (tenantId) => {
  const idToken = getIdpToken();
  if (!idToken) {
    const error = new Error("No IdP token available");
    error.code = "SSO_SESSION_EXPIRED";
    throw error;
  }

  /* Revoke the DIGIT token for the tenant being left. Best effort: a failure here should not
     block the switch, and we deliberately do NOT call UserService.logout(), which would
     navigate away and wipe the storage the switch still needs. */
  try {
    await Digit.UserService.logoutUser();
  } catch (e) {
    console.warn("[sso] could not revoke the previous DIGIT session", e);
  }

  const response = await fetch("/user/oauth/token", {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "jwt_exchange",
      scope: "read",
      userType: "EMPLOYEE",
      assertion: idToken,
      tenantId,
    }),
  });

  if (!response.ok) {
    const error = await parseError(response, "Tenant switch failed");
    /* 400/401 here means the assertion was rejected - almost always an expired ID token. */
    error.code = response.status === 400 || response.status === 401 ? "SSO_SESSION_EXPIRED" : "SSO_TENANT_SWITCH_FAILED";
    throw error;
  }

  const { UserRequest: info, ...tokens } = await response.json();

  Digit.SessionStorage.set("Employee.tenantId", info?.tenantId);
  Digit.SessionStorage.set("citizen.userRequestObject", { info, ...tokens });
  Digit.UserService.setUser({ info, ...tokens });
  persistEmployeeSession(info, tokens?.access_token);

  /* Full page load so initData, localisation and the module configs are rebuilt for the new
     tenant. Going straight to the target deployment avoids bouncing through this one and
     relying on the entry file's redirect interceptor. */
  const basePath = getTenantBasePath(info?.tenantId) || window?.contextPath;
  window.location.replace(`/${basePath}/employee`);
};
