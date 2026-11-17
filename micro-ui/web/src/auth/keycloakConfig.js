// Tenant-aware Keycloak config. Unlike PublicServices' auth module (static,
// single realm from env var — used by the plain /employee/user/login page),
// this resolves the realm from the tenant segment in the URL itself, per
// backend's model: realm name = tenant code, UPPER CASE. One Keycloak client
// config works for any tenant/realm that exists — nothing here is tenant-specific.

// Keycloak settings come from the deployment's globalConfigs (runtime, per environment — no rebuild
// to switch on/off). The REACT_APP_* .env values are only a fallback for local development.
//   globalConfigs keys: KEYCLOAK_ENABLED, KEYCLOAK_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_CITIZEN_CLIENT_ID
const fromGlobalConfig = (key) => {
  try {
    return window.globalConfigs?.getConfig?.(key);
  } catch (e) {
    return undefined;
  }
};
// `process.env.X` is replaced at build time only when X is defined; otherwise reading it can throw.
const fromEnv = (read) => {
  try {
    return read();
  } catch (e) {
    return undefined;
  }
};

export function isKeycloakEnabled() {
  const configured = fromGlobalConfig("KEYCLOAK_ENABLED");
  if (configured !== undefined && configured !== null) return configured === true || configured === "true";
  return fromEnv(() => process.env.REACT_APP_KEYCLOAK_ENABLED) === "true";
}

export function getKeycloakBaseUrl() {
  return (
    fromGlobalConfig("KEYCLOAK_URL") ||
    fromEnv(() => process.env.REACT_APP_KEYCLOAK_URL) ||
    "https://test-lts.digit.org/keycloak"
  );
}

// userType: "employee" (default) | "citizen" — each has its own Keycloak
// client (confirmed in the STUDIO realm: "employee" confidential + custom
// 3-step browser flow, "citizen" public + the "citizen mobile login" flow —
// mobile number then SMS OTP, both hosted by Keycloak itself).
export function getKeycloakClientId(userType = "employee") {
  if (userType === "citizen") {
    return (
      fromGlobalConfig("KEYCLOAK_CITIZEN_CLIENT_ID") ||
      fromEnv(() => process.env.REACT_APP_KEYCLOAK_CITIZEN_CLIENT_ID) ||
      "citizen"
    );
  }
  return fromGlobalConfig("KEYCLOAK_CLIENT_ID") || fromEnv(() => process.env.REACT_APP_KEYCLOAK_CLIENT_ID) || "employee";
}

export function getKeycloakAuthorizeUrl(tenant) {
  return `${getKeycloakBaseUrl()}/realms/${tenant}/protocol/openid-connect/auth`;
}

export function getKeycloakTokenUrl(tenant) {
  return `${getKeycloakBaseUrl()}/realms/${tenant}/protocol/openid-connect/token`;
}

export function getKeycloakLogoutUrl(tenant) {
  return `${getKeycloakBaseUrl()}/realms/${tenant}/protocol/openid-connect/logout`;
}

// Matches /<contextPath>/<TENANT>/employee/user/login — the one URL shape this
// module cares about. Returns the tenant (upper-cased, per the realm-naming
// rule) or null if the current URL isn't a tenant-prefixed Keycloak login URL.
export function getTenantFromPath(contextPath) {
  const pattern = new RegExp(`^/${contextPath}/([A-Za-z0-9_-]+)/employee/user/login/?$`);
  const match = window.location.pathname.match(pattern);
  return match ? match[1].toUpperCase() : null;
}

export function getKeycloakRedirectUri(contextPath, tenant, userType = "employee") {
  return `${window.location.origin}/${contextPath}/${tenant}/${userType}/user/login`;
}
