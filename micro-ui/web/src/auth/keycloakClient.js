// Same PKCE mechanics as PublicServices' keycloakClient.js, parameterized by
// tenant/realm instead of reading one fixed realm from env. See that file for
// the detailed PKCE/state notes — kept brief here to avoid duplicating them.
import {
  getKeycloakAuthorizeUrl,
  getKeycloakClientId,
  getKeycloakLogoutUrl,
  getKeycloakRedirectUri,
  getKeycloakTokenUrl,
} from "./keycloakConfig";

const OAUTH_STATE_KEY = "studio:keycloak:oauth";
const TOKENS_KEY = "studio:keycloak:tokens";

function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateCodeVerifier() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function generatePkceChallenge(codeVerifier) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
  return base64UrlEncode(new Uint8Array(digest));
}

function parseJwt(token) {
  const payload = token.split(".")[1];
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(normalized));
}

function getOAuthParams() {
  const search = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#")
    ? new URLSearchParams(window.location.hash.slice(1))
    : new URLSearchParams();
  return { search, hash };
}

export function hasOAuthCallback() {
  const { search, hash } = getOAuthParams();
  return Boolean(search.get("code") || hash.get("code") || search.get("error") || hash.get("error"));
}

export function getOAuthCallbackError() {
  const { search, hash } = getOAuthParams();
  const error = search.get("error") ?? hash.get("error");
  if (!error) return null;
  const description = search.get("error_description") ?? hash.get("error_description");
  return description ? `${error}: ${description.replace(/_/g, " ")}` : error;
}

export async function loginWithKeycloak(contextPath, tenant, userType = "employee", returnTo = null) {
  const clientId = getKeycloakClientId(userType);
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generatePkceChallenge(codeVerifier);
  const state = crypto.randomUUID();
  const redirectUri = getKeycloakRedirectUri(contextPath, tenant, userType);

  sessionStorage.setItem(OAUTH_STATE_KEY, JSON.stringify({ state, codeVerifier, tenant, userType, returnTo }));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    response_mode: "query",
    scope: "openid profile email",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  window.location.assign(`${getKeycloakAuthorizeUrl(tenant)}?${params.toString()}`);
}

export async function completeKeycloakLogin(contextPath) {
  const callbackError = getOAuthCallbackError();
  if (callbackError) throw new Error(callbackError);

  const { search, hash } = getOAuthParams();
  const code = search.get("code") ?? hash.get("code");
  const state = search.get("state") ?? hash.get("state");
  if (!code || !state) throw new Error("Incomplete sign-in response from Keycloak.");

  const storedRaw = sessionStorage.getItem(OAUTH_STATE_KEY);
  if (!storedRaw) throw new Error("Missing sign-in state. Please try logging in again.");
  const stored = JSON.parse(storedRaw);
  if (stored.state !== state) throw new Error("Invalid sign-in state (possible CSRF). Please try logging in again.");
  sessionStorage.removeItem(OAUTH_STATE_KEY);

  // The realm/client we exchange against are the tenant+userType WE sent the
  // user to log into, from our own stored state — never trust those read back
  // from the URL/response at this point.
  const tenant = stored.tenant;
  const userType = stored.userType || "employee";

  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: getKeycloakClientId(userType),
    code,
    redirect_uri: getKeycloakRedirectUri(contextPath, tenant, userType),
    code_verifier: stored.codeVerifier,
  });

  const tokenResponse = await fetch(getKeycloakTokenUrl(tenant), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenParams,
  });

  if (!tokenResponse.ok) {
    const detail = await tokenResponse.text();
    throw new Error(`Keycloak token exchange failed (${tokenResponse.status}). ${detail}`);
  }

  const tokens = await tokenResponse.json();
  sessionStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));

  return {
    tenant,
    userType,
    returnTo: stored.returnTo || null,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    parsedToken: parseJwt(tokens.access_token),
  };
}

export function logoutFromKeycloak(tenant, postLogoutRedirectUri, userType = "employee") {
  const raw = sessionStorage.getItem(TOKENS_KEY);
  const idToken = raw ? JSON.parse(raw)?.id_token : null;
  sessionStorage.removeItem(TOKENS_KEY);

  const params = new URLSearchParams({
    client_id: getKeycloakClientId(userType),
    post_logout_redirect_uri: postLogoutRedirectUri || window.location.origin,
  });
  if (idToken) params.set("id_token_hint", idToken);

  window.location.assign(`${getKeycloakLogoutUrl(tenant)}?${params.toString()}`);
}
