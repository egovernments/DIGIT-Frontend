/**
 * Storage for the IdP (SSO) ID token.
 *
 * The token arrives in the SSO callback URL fragment and is currently used once, as the
 * `assertion` on /user/oauth/token, then discarded. It has to outlive that exchange so it
 * can be reused for the tenant lookup (/user/oauth/tenants) and, later, to re-exchange a
 * DIGIT token when the user switches tenant.
 *
 * Kept in a cookie at `path=/` deliberately. Every tenant is a separate deployment under
 * its own base path on one shared origin, and the token is written on whichever deployment
 * handled the callback (often the shared login) but read on the tenant deployment the user
 * is redirected into - so it must be readable across all of them.
 *
 * Note this cookie is sent on every same-origin request, including all DIGIT API calls.
 * ID tokens frequently approach the ~4KB per-cookie browser limit, so oversized tokens
 * fall back to sessionStorage rather than being silently dropped.
 *
 * Not HttpOnly - it cannot be, since it is set from JS. Treat it as no more protected than
 * localStorage; if that matters, the backend has to set the cookie instead.
 */

const COOKIE_NAME = "sso-id-token";
const FALLBACK_KEY = "sso-id-token";
/* Browsers drop cookies above ~4096 bytes, counting name, value and attributes. */
const MAX_COOKIE_BYTES = 4000;

/* Read `exp` out of the JWT payload so the cookie can expire with the token itself, and a
   missing cookie can be treated as "needs re-authentication". No verification here - that
   is the backend's job on /user/oauth/token. */
const readExpiry = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat(b64.length % 4 ? 4 - (b64.length % 4) : 0);
    const exp = JSON.parse(atob(padded))?.exp;
    return typeof exp === "number" ? exp : null;
  } catch (e) {
    return null;
  }
};

export const getIdpToken = () => {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
    if (match) return decodeURIComponent(match[1]);
  } catch (e) {
    /* fall through to sessionStorage */
  }
  try {
    return window.sessionStorage.getItem(FALLBACK_KEY);
  } catch (e) {
    return null;
  }
};

const storeFallback = (token) => {
  try {
    window.sessionStorage.setItem(FALLBACK_KEY, token);
  } catch (e) {
    console.warn("[idp] could not store the ID token anywhere");
  }
};

export const setIdpToken = (token) => {
  if (!token) return;

  const exp = readExpiry(token);
  const maxAge = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : null;

  const attributes = [
    "path=/",
    "SameSite=Strict",
    ...(window.location.protocol === "https:" ? ["Secure"] : []),
    /* No Max-Age when the token carries no exp: a session cookie is the safer default. */
    ...(maxAge ? [`Max-Age=${maxAge}`] : []),
  ];
  const cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; ${attributes.join("; ")}`;

  if (cookie.length > MAX_COOKIE_BYTES) {
    console.warn(`[idp] ID token too large for a cookie (${cookie.length}B), using sessionStorage`);
    storeFallback(token);
    return;
  }

  try {
    document.cookie = cookie;
  } catch (e) {
    /* handled by the read-back below */
  }
  /* The browser can reject the cookie without throwing, so confirm it landed. */
  if (getIdpToken() !== token) {
    console.warn("[idp] cookie was rejected, using sessionStorage");
    storeFallback(token);
  }
};

export const clearIdpToken = () => {
  try {
    /* Path must match the one it was set with, or the delete is a no-op. */
    document.cookie = `${COOKIE_NAME}=; path=/; Max-Age=0; SameSite=Strict`;
  } catch (e) {
    /* ignore */
  }
  try {
    window.sessionStorage.removeItem(FALLBACK_KEY);
  } catch (e) {
    /* ignore */
  }
};
