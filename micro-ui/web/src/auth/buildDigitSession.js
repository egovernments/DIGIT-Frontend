// Same role-filtering rule as PublicServices/src/auth/mapKeycloakUser.js (kept
// a second copy here deliberately — see note in KeycloakTenantLogin.js on why
// this lives at the app-entry level rather than being imported across the
// PublicServices package boundary).
const IGNORED_KEYCLOAK_ROLES = new Set([
  "offline_access",
  "uma_authorization",
  "uma_protection",
  "default-roles-master",
]);

function isDigitRole(role) {
  if (IGNORED_KEYCLOAK_ROLES.has(role) || role.startsWith("default-roles-")) return false;
  if (role.includes("-")) return false; // Keycloak's own built-in roles are hyphenated; DIGIT roles use underscores.
  return true;
}

export function buildDigitSessionFromKeycloak({ tenant, accessToken, refreshToken, parsedToken, userType = "employee" }) {
  const roles = (parsedToken?.realm_access?.roles ?? [])
    .filter(isDigitRole)
    .map((code) => ({ code, name: code, tenantId: tenant }));

  const isCitizen = userType === "citizen";
  // The "citizen mobile login" flow's own "Login – Mobile Number" step sets
  // the username to the mobile number entered (confirmed from the flow's
  // step name in Keycloak) — citizen tokens have no separate phone_number
  // claim, so preferred_username IS the mobile number here.
  const mobileNumber = isCitizen ? parsedToken.preferred_username : parsedToken.phone_number || null;

  const info = {
    uuid: parsedToken.sub,
    userName: parsedToken.preferred_username,
    // A citizen who registered with only a mobile number has no name in Keycloak; their
    // username IS the mobile number, so don't show it as their name (the profile page
    // pre-fills this). They set a name on Edit Profile, which saves it to Keycloak.
    name: parsedToken.name || (isCitizen ? "" : parsedToken.preferred_username),
    emailId: parsedToken.email || null,
    mobileNumber,
    type: isCitizen ? "CITIZEN" : "EMPLOYEE",
    tenantId: tenant,
    active: true,
    roles,
  };

  return { info, access_token: accessToken, refresh_token: refreshToken };
}
