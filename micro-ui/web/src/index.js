import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";
import "@egovernments/digit-ui-health-css";
// import { BrowserRouter } from "react-router-dom";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { fetchAndApplyThemeOverrides } from "./config/themeOverrides";
import KeycloakTenantLogin from "./KeycloakTenantLogin";
import { logoutFromKeycloak } from "./auth/keycloakClient";
import { isKeycloakEnabled, getKeycloakBaseUrl } from "./auth/keycloakConfig";
window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;
const DigitUILazy = lazy(() => import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI })));

// isKeycloakEnabled() (./auth/keycloakConfig) reads KEYCLOAK_ENABLED from globalConfigs, .env as fallback.

// ---------------------------------------------------------------------------
// Citizen tenant from the URL (skill 08: tenant = Keycloak realm, known from the URL before sign-in).
// Citizen pages live at /<base>/<TENANT>/citizen/...; employee pages stay /<base>/employee/... (their
// tenant comes from their login). Not done with core's MULTI_ROOT_TENANT flag: in core that switches
// the whole app into sandbox mode (a different root app, tenant-config API, sandbox link rewrites).
// ---------------------------------------------------------------------------
const originalGetConfig = window.globalConfigs?.getConfig;
const getBasePath = () => originalGetConfig?.("CONTEXT_PATH") || "digit-ui";
const defaultStateTenant = () => originalGetConfig?.("STATE_LEVEL_TENANT_ID");
const CITIZEN_TENANT_KEY = "studio:citizen:tenant";
// The tenant segment of a citizen URL as written (contextPath must match the URL exactly), or null.
const citizenTenantSegment = (pathname = window.location.pathname) => {
  const segment = pathname.match(new RegExp(`^/${getBasePath()}/([A-Za-z0-9_-]+)/citizen(/|$)`))?.[1];
  return segment && segment !== "employee" ? segment : null;
};
const citizenTenantFromUrl = () => citizenTenantSegment()?.toUpperCase() || null;
let citizenRedirectPending = false;

// digit-ui-libraries' getCurrentTenantId()/getStateId() for non-employees, the app's stateCode and
// this file's MDMS shim all fall back to STATE_LEVEL_TENANT_ID. On a citizen tenant page that has to
// be the URL's tenant, so answer it from the URL there.
// Employees: the tenant is the realm they signed in to (Employee.tenant-id, written by
// KeycloakTenantLogin). Without this a STUDIOB employee's app initialised against the
// globalConfigs tenant (STUDIO) — tenants/citymodule/StateInfo for STUDIO, which a STUDIOB token
// can't read — so no modules loaded and every employee page rendered blank. For a STUDIO
// employee the value is STUDIO either way.
const employeeTenantFromSession = () => {
  if (!new RegExp(`^/${getBasePath()}/employee(/|$)`).test(window.location.pathname)) return null;
  try {
    return window.localStorage.getItem("Employee.token") ? window.localStorage.getItem("Employee.tenant-id") || null : null;
  } catch (e) {
    return null;
  }
};
(function tenantAwareStateTenant() {
  if (!isKeycloakEnabled() || typeof originalGetConfig !== "function") return;
  window.globalConfigs.getConfig = (key) =>
    (key === "STATE_LEVEL_TENANT_ID" && (citizenTenantFromUrl() || employeeTenantFromSession())) || originalGetConfig(key);
})();

// ---------------------------------------------------------------------------
// Patch: digit-ui-libraries ships its OWN axios bundled inline inside its own
// dist/main.js — confirmed by grepping for axios' own internal error strings
// in that file. That means it is a separate, isolated axios instance from
// `import Axios from "axios"` here (even though both resolve the same
// package — one is bundled into a closure at publish time, this one is a
// fresh module import), so an Axios.interceptors.* registered on the import
// in this file silently never runs for any of digit-ui-libraries' requests
// (tried that first; confirmed via direct testing that the header never
// actually reached the network). Patching the one thing both copies must
// still go through in a browser — the real XMLHttpRequest — reaches every
// caller regardless of which bundled axios copy issued the request.
//
// Same underlying problem as the OTP override below: digit-ui-libraries'
// shared Request() never sends a standard `Authorization: Bearer` header —
// it puts the token inside the POST body's RequestInfo.authToken (the old
// 2.x contract) or, opt-in per call, a non-standard `auth-token` header.
// Kong on digit-lts only recognizes `Authorization: Bearer <token>`
// (confirmed via backend's spec and by reproducing the exact mdms-v2 401
// both with and without this header). Scoped to isKeycloakEnabled() so the
// existing unified-dev/2.x flow, which Kong doesn't front, is unaffected.
// ---------------------------------------------------------------------------
(function patchXhrForBearerAuth() {
  const originalSend = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function (body) {
    if (isKeycloakEnabled()) {
      const token = window.Digit?.UserService?.getUser?.()?.access_token;
      if (token) {
        try {
          this.setRequestHeader("Authorization", `Bearer ${token}`);
        } catch (e) {
          // setRequestHeader throws if called in the wrong XHR state — nothing
          // to do here, the request just goes out without the header this time.
        }
      }
    }
    return originalSend.call(this, body);
  };
})();

// Same gap for window.fetch: several PublicServices screens (records list,
// record prefill, inbox, module page, ...) call fetch() directly with only
// the 2.x `auth-token` header, which Kong rejects with 401 "No JWT token
// provided". Adds `Authorization: Bearer` to same-origin calls only (never
// to third-party analytics), skips Keycloak's own endpoints, and leaves any
// request that already carries an Authorization header untouched.
(function patchFetchForBearerAuth() {
  const originalFetch = window.fetch;
  if (typeof originalFetch !== "function") return;
  window.fetch = function (input, init) {
    try {
      const token = isKeycloakEnabled() && window.Digit?.UserService?.getUser?.()?.access_token;
      if (token) {
        const isRequest = typeof Request !== "undefined" && input instanceof Request;
        const url = new URL(isRequest ? input.url : String(input), window.location.href);
        if (url.origin === window.location.origin && !url.pathname.startsWith("/keycloak/")) {
          const headers = new Headers((init && init.headers) || (isRequest ? input.headers : undefined));
          if (!headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
            return originalFetch.call(this, input, { ...(init || {}), headers });
          }
        }
      }
    } catch (e) {
      // Fall through to the unmodified call on anything unexpected.
    }
    return originalFetch.call(this, input, init);
  };
})();

// ---------------------------------------------------------------------------
// Patch: multiple backend services on digit-lts (3.0) — not just mdms-v2 —
// have moved to a REST contract (GET + query params + X-Tenant-ID/X-Client-ID
// headers), confirmed by pulling the actual deployed mdms-v2 build off the
// cluster and decompiling it, and by checking Keycloak's own Authorization
// Services resources for localization/boundary (they only exist for the new
// v3-style paths, never the old ones). None of the UI packages Studio uses
// (digit-ui-libraries, digit-ui-react-components, digit-ui-components) know
// about this — they all still call the old 2.x `POST/GET .../_search`-style
// paths. The real fix belongs upstream in those libraries (tracked in the
// changelog, not done here — it affects every 3.0 consumer, not just Studio).
// These calls funnel into private, unexported senders that aren't reachable
// via the window.Digit property-override pattern used elsewhere in this file,
// so the XHR layer is the only chokepoint that reliably catches all of them
// regardless of which package/internal helper built the request. This
// translates each old-style request shape Studio is known to send into the
// real contract, and fakes the XHR's completion so whichever bundled axios
// copy made the call resolves exactly as it would have against the old API.
// Scoped to isKeycloakEnabled() like the other digit-lts-only patches.
//
// Extend this as more old-style calls surface (expected — this is a systemic
// gap, not specific to the 3 services currently handled here).
// ---------------------------------------------------------------------------
(function patchXhrForMdmsV3Compat() {
  const MDMS_CONTEXT = "mdms-v2"; // matches globalConfigsStudioLTS.js's mdmsContext
  const CLIENT_ID = "digit-studio";

  const originalOpen = window.XMLHttpRequest.prototype.open;
  const originalSend = window.XMLHttpRequest.prototype.send;

  window.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__mdmsMethod = method;
    this.__mdmsUrl = url;

    // DIGIT 3.0: digit-ui-libraries' Filestorage/Filefetch helpers still build
    // the old 2.x filestore contract (POST filestore/v1/files, GET
    // filestore/v1/files/url) — confirmed via decompiling the deployed
    // filestore pod: the real paths are /v3/files/upload and
    // /v3/files/download-urls. Response shapes are IDENTICAL already
    // ({files:[{fileStoreId,tenantId,ownerIds}]} for upload,
    // {fileStoreIds:[{id,url}]} for download-urls, both confirmed from the
    // decompiled File/FileStoreResponse/StorageResponse models) — only the
    // URL changed, so this is a straight rewrite, not a response-faking shim
    // like the mdms/localization/boundary ones below. Upload also moves
    // tenantId from the old form field into an X-Tenant-Id header (the v3
    // endpoint doesn't declare tenantId as a form param at all) — handled in
    // the send() override below, since the FormData body isn't available yet
    // here at open() time.
    if (isKeycloakEnabled() && typeof url === "string") {
      let rewritten = url;
      if (method.toUpperCase() === "GET" && /\/filestore\/v1\/files\/url(\?|$)/.test(url)) {
        rewritten = url.replace("/filestore/v1/files/url", "/filestore/v3/files/download-urls");
      } else if (method.toUpperCase() === "POST" && /\/filestore\/v1\/files(\?|$)/.test(url)) {
        rewritten = url.replace("/filestore/v1/files", "/filestore/v3/files/upload");
        this.__filestoreUploadRewrite = true;
      } else if (method.toUpperCase() === "GET" && /(^|\/\/[^/]+)\/public-service-init\/v1\/service(\?|$)/.test(url) && !isSignedIn()) {
        // Published services list before sign-in (public reads, see PUBLIC_READS).
        rewritten = url.replace("/public-service-init/v1/service", `${PUBLIC_READS}/service`);
      }
      if (rewritten !== url) {
        this.__mdmsUrl = rewritten;
        return originalOpen.call(this, method, rewritten, ...rest);
      }
    }

    return originalOpen.call(this, method, url, ...rest);
  };

  const authHeaders = (tenantId) => {
    const headers = { "X-Tenant-ID": tenantId, "X-Client-ID": CLIENT_ID };
    const user = window.Digit?.UserService?.getUser?.();
    if (user?.access_token) headers["Authorization"] = `Bearer ${user.access_token}`;
    // 3.0 services (mdms-v2 create/update, localization upsert) read the
    // caller's X-User-ID for audit fields (createdBy) — optional on most
    // routes, but send it whenever we actually know who's logged in.
    if (user?.info?.uuid) headers["X-User-ID"] = user.info.uuid;
    return headers;
  };

  const fallbackTenantId = () => window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "STUDIO";

  // Before sign-in (the citizen pages), 3.0's Kong refuses every MDMS / localization / service read.
  // public-service-init serves an allow-listed, trimmed copy of exactly those reads without a token
  // (same response shapes; tenant as a query param), so send them there when nobody is signed in.
  const PUBLIC_READS = "/public-service-init/v1/public";
  const isSignedIn = () => !!window.Digit?.UserService?.getUser?.()?.access_token;

  // Fakes the original XHR's completion so axios (reading readyState/status/
  // responseText/getAllResponseHeaders off THIS object) resolves normally —
  // both the EventListener style and the plain `xhr.onX = fn` assignment
  // style are covered, since we don't control which one the bundled axios
  // copy inside digit-ui-libraries uses internally.
  function completeXhr(xhr, status, bodyObj) {
    const text = JSON.stringify(bodyObj);
    Object.defineProperty(xhr, "readyState", { value: 4, configurable: true });
    Object.defineProperty(xhr, "status", { value: status, configurable: true });
    Object.defineProperty(xhr, "statusText", { value: status === 200 ? "OK" : "Error", configurable: true });
    Object.defineProperty(xhr, "responseText", { value: text, configurable: true });
    Object.defineProperty(xhr, "response", { value: text, configurable: true });
    xhr.getAllResponseHeaders = () => "content-type: application/json\r\n";
    xhr.getResponseHeader = (name) => (String(name).toLowerCase() === "content-type" ? "application/json" : null);
    const fire = (type) => {
      const event = new Event(type);
      xhr.dispatchEvent(event);
      const handler = xhr[`on${type}`];
      if (typeof handler === "function") handler.call(xhr, event);
    };
    fire("readystatechange");
    fire(status >= 200 && status < 300 ? "load" : "error");
    fire("loadend");
  }

  // POST /mdms-v2/v2/_search {MdmsCriteria:{tenantId,schemaCode,isActive,filters}}
  //   -> GET /mdms-v2/v2?schemaCode=...(+filters flattened as query params).
  // Response is already {mdms:[...], totalCount, offset, limit} — confirmed
  // identical to what callers select off the old response — passthrough.
  function handleV2Search(xhr, body) {
    const c = body?.MdmsCriteria || {};
    const tenantId = c.tenantId || fallbackTenantId();
    const params = new URLSearchParams();
    if (c.schemaCode) params.set("schemaCode", c.schemaCode);
    if (c.isActive !== undefined) params.set("isActive", c.isActive);
    if (c.offset !== undefined) params.set("offset", c.offset);
    if (c.limit !== undefined) params.set("limit", c.limit);
    if (c.uniqueIdentifiers?.length) params.set("uniqueIdentifiers", c.uniqueIdentifiers.join(","));
    if (c.ids?.length) params.set("ids", c.ids.join(","));
    Object.entries(c.filters || {}).forEach(([k, v]) => params.set(k, v));

    if (!isSignedIn()) params.set("tenantId", tenantId);
    const url = isSignedIn() ? `/${MDMS_CONTEXT}/v2?${params.toString()}` : `${PUBLIC_READS}/mdms/v2?${params.toString()}`;
    fetch(url, { headers: authHeaders(tenantId) })
      .then((r) => r.json().then((parsed) => completeXhr(xhr, r.status, parsed)))
      .catch(() => completeXhr(xhr, 0, {}));
  }

  // POST /mdms-v2/v2/_create[/{schemaCode}] {Mdms:{...record...}, RequestInfo:{...}}
  // POST /mdms-v2/v2/_update[/{schemaCode}] {Mdms:{...record...}, RequestInfo:{...}}
  //   -> real contract (confirmed from the official studio-digit3-migration
  //      backend's own MdmsV2Client.java, not guessed): POST (create) / PUT
  //      (update) /mdms-v2/v2, body {"Mdms":[record]} — ARRAY-wrapped, not a
  //      bare object — with schemaCode moved from the URL into the record
  //      itself (only when the record doesn't already carry one; several
  //      ServiceDesigner call sites embed it directly and hit the bare
  //      `/v2/_create` URL with no schemaCode segment at all). RequestInfo is
  //      dropped — 3.0 reads the caller from headers, same as everywhere
  //      else in this shim. Response is already {"mdms":[...]} on both sides
  //      per that same client's own doc comment — passthrough, no reshaping.
  //      This single handler covers EVERY ServiceDesigner hook that saves to
  //      MDMS (checklist/role/fee/form/payment/notification/theme/app config,
  //      ServiceConfiguration itself, ...) since they all build this exact
  //      old-contract shape.
  // "My drafts": 3.0 mdms-v2 fills auditDetails.createdBy from X-Client-ID ("digit-studio")
  // and ignores X-User-ID, so the landing page can no longer tell whose draft a record is.
  // Record the creator inside the draft itself instead (the drafts schema allows extra
  // fields). Only stamped when missing, so the original owner is kept on every later save;
  // a draft saved before this existed becomes owned by the next person who saves it.
  // LandingPage.js (extractDraftsAndPublished) filters on it.
  const DRAFTS_SCHEMA = "Studio.ServiceConfigurationDrafts";
  function stampDraftOwner(record) {
    if (record.schemaCode !== DRAFTS_SCHEMA || !record.data || record.data.createdByUserUuid) return record;
    const uuid = window.Digit?.UserService?.getUser?.()?.info?.uuid;
    return uuid ? { ...record, data: { ...record.data, createdByUserUuid: uuid } } : record;
  }

  function handleV2CreateOrUpdate(xhr, body, schemaCodeFromUrl, isUpdate) {
    let record = { ...(body?.Mdms || {}) };
    const tenantId = record.tenantId || fallbackTenantId();
    if (!record.schemaCode && schemaCodeFromUrl) record.schemaCode = schemaCodeFromUrl;
    record = stampDraftOwner(record);
    fetch(`/${MDMS_CONTEXT}/v2`, {
      method: isUpdate ? "PUT" : "POST",
      headers: { ...authHeaders(tenantId), "Content-Type": "application/json" },
      body: JSON.stringify({ Mdms: [record] }),
    })
      .then((r) => r.json().then((parsed) => completeXhr(xhr, r.status, parsed)))
      .catch(() => completeXhr(xhr, 0, {}));
  }

  // POST /mdms-v2/v1/schema/_search {SchemaDefCriteria:{tenantId,codes,...}}
  //   -> the real endpoint only accepts one `code` per call, so fan out one
  //      GET /mdms-v2/v1/schema?code=X per requested code and merge the
  //      SchemaDefinitions arrays back into one response.
  function handleSchemaSearch(xhr, body) {
    const c = body?.SchemaDefCriteria || {};
    const tenantId = c.tenantId || fallbackTenantId();
    const codes = c.codes?.length ? c.codes : [undefined];

    Promise.all(
      codes.map((code) => {
        const params = new URLSearchParams();
        if (code) params.set("code", code);
        if (c.offset !== undefined) params.set("offset", c.offset);
        if (c.limit !== undefined) params.set("limit", c.limit);
        return fetch(`/${MDMS_CONTEXT}/v1/schema?${params.toString()}`, { headers: authHeaders(tenantId) })
          .then((r) => r.json())
          .catch(() => ({ SchemaDefinitions: [] }));
      })
    ).then((results) => {
      completeXhr(xhr, 200, { SchemaDefinitions: results.flatMap((r) => r?.SchemaDefinitions || []) });
    });
  }

  // POST /mdms-v2/v1/_search {MdmsCriteria:{tenantId,moduleDetails:[{moduleName,masterDetails:[{name},...]},...]}}
  //   -> the real endpoint only accepts one moduleName+masterName pair per
  //      call, so fan out one GET /mdms-v2/v1/mdms?... per pair and deep-merge
  //      each MdmsRes.<module>.<master> back together — confirmed (via a
  //      direct test against the real service) to already be the exact
  //      {MdmsRes:{module:{master:[...]}}} shape digit-ui-libraries' batching
  //      layer (wr.init/wr.call/getDataByCriteria) expects to read.
  // 2.x applied each master's JSONPath `filter` server-side; 3.0's GET /v1/mdms takes none. Apply the
  // single-field comparisons the app actually sends (`[?(@.url == 'x')]`, `[?(@.active == true)]`,
  // `$.[?(@.code!='CITIZEN')]`). Anything else (projections like `$.*.name`, `*`) stays unfiltered.
  const FILTER_RE = /^\$?\.?\[\?\(@\.([A-Za-z0-9_]+)\s*(==|!=)\s*(?:'([^']*)'|(true|false)|(-?\d+(?:\.\d+)?))\)\]$/;
  const applyMdmsFilter = (rows, filter) => {
    const m = typeof filter === "string" && Array.isArray(rows) ? filter.trim().match(FILTER_RE) : null;
    if (!m) return rows;
    const [, field, op, str, bool, num] = m;
    const value = str !== undefined ? str : bool !== undefined ? bool === "true" : Number(num);
    return rows.filter((row) => (op === "==" ? row?.[field] === value : row?.[field] !== value));
  };

  // Citizen card actions are stored with url `<base>-card`, but core builds its card filter from
  // window.contextPath, which on citizen pages is `<base>/<TENANT>` (tenant in the URL) and so would
  // match nothing. digit-ui-libraries caches MDMS per tenant/module/master regardless of the filter,
  // so that empty answer could also replace the page's own correct one. Treat both as `<base>-card`.
  const normalizeCardFilter = (filter) =>
    typeof filter === "string" && window.globalPath && window.contextPath !== window.globalPath
      ? filter.split(`'${window.contextPath}-card'`).join(`'${window.globalPath}-card'`)
      : filter;

  function handleLegacyBatchSearch(xhr, body) {
    const c = body?.MdmsCriteria || {};
    const tenantId = c.tenantId || fallbackTenantId();
    const pairs = [];
    (c.moduleDetails || []).forEach((mod) => {
      (mod.masterDetails || []).forEach((master) => {
        pairs.push({ moduleName: mod.moduleName, masterName: master.name, filter: master.filter });
      });
    });

    const publicRead = !isSignedIn();
    Promise.all(
      pairs.map(({ moduleName, masterName, filter }) => {
        const params = new URLSearchParams({ tenantId, moduleName, masterName });
        const url = publicRead ? `${PUBLIC_READS}/mdms/v1?${params.toString()}` : `/${MDMS_CONTEXT}/v1/mdms?${params.toString()}`;
        return fetch(url, { headers: authHeaders(tenantId) })
          .then((r) =>
            r.json().then((parsed) => {
              // Callers get an empty result either way (as before), but a refused read must not be silent —
              // except masters the public reads don't serve (400 NOT_PUBLIC, e.g. common-masters.Department).
              if (!r.ok && !(publicRead && parsed?.code === "NOT_PUBLIC")) console.error(`[mdms-compat] ${moduleName}.${masterName} → HTTP ${r.status}`, parsed);
              const rows = parsed?.MdmsRes?.[moduleName]?.[masterName];
              if (rows) parsed.MdmsRes[moduleName][masterName] = applyMdmsFilter(rows, normalizeCardFilter(filter));
              return parsed;
            })
          )
          .catch(() => ({ MdmsRes: {} }));
      })
    ).then((results) => {
      const merged = { MdmsRes: {} };
      results.forEach((r) => {
        Object.entries(r?.MdmsRes || {}).forEach(([moduleName, masters]) => {
          merged.MdmsRes[moduleName] = { ...(merged.MdmsRes[moduleName] || {}), ...masters };
        });
      });
      completeXhr(xhr, 200, merged);
    });
  }

  // GET /localization/messages/v1/_search?module=...&locale=...&tenantId=...
  //   -> GET /localization/v3/messages?module=...&locale=...&tenantId=... —
  //      same param names, EXCEPT `module`: the old 2.x contract let one call
  //      search several comma-joined modules at once (digit-ui-libraries
  //      batches them this way); the new v3 search() takes `module` as a
  //      single String (confirmed via decompile — not a List like `codes`),
  //      so a literal "modA,modB" never matches anything and silently
  //      returns {messages:[]} (confirmed live: QA's real upserted messages
  //      for one module came back empty the instant a second module was
  //      batched into the same call). Fan out one GET per module and merge.
  function handleLocalizationSearch(xhr, urlObj) {
    const locale = urlObj.searchParams.get("locale");
    const tenantId = urlObj.searchParams.get("tenantId") || fallbackTenantId();
    const modules = (urlObj.searchParams.get("module") || "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    const fetchOne = (module) => {
      const params = new URLSearchParams();
      if (module) params.set("module", module);
      if (locale) params.set("locale", locale);
      if (tenantId) params.set("tenantId", tenantId);
      const url = isSignedIn() ? `/localization/v3/messages?${params.toString()}` : `${PUBLIC_READS}/localization?${params.toString()}`;
      return fetch(url, { headers: authHeaders(tenantId) })
        .then((r) => r.json())
        .catch(() => ({ messages: [] }));
    };

    Promise.all((modules.length ? modules : [""]).map(fetchOne))
      .then((results) => {
        const messages = results.flatMap((r) => r?.messages || []);
        completeXhr(xhr, 200, { messages });
      })
      .catch(() => completeXhr(xhr, 0, {}));
  }

  // POST /localization/messages/v1/_upsert {tenantId, module, messages:[{code,message,module,locale}]}
  //   -> real contract (confirmed via decompile of the deployed localization-java
  //      pod's MessageController, and verified live against the gateway):
  //      PUT /localization/v3/messages/upsert, body {"messages":[...]} only —
  //      no top-level tenantId/module wrapper (tenantId goes in the
  //      X-Tenant-ID header; each message already carries its own module).
  //      Each message needs non-blank code/message/module/locale (validated
  //      server-side) — uuid/status stay optional. Response is already
  //      {"messages":[...]} on both sides — passthrough, no reshaping.
  function handleLocalizationUpsert(xhr, body) {
    const tenantId = body?.tenantId || fallbackTenantId();
    const messages = (body?.messages || []).map((m) => ({
      ...(m.uuid ? { uuid: m.uuid } : {}),
      code: m.code,
      message: m.message,
      module: m.module || body?.module,
      locale: m.locale,
      ...(m.status ? { status: m.status } : {}),
    }));
    fetch("/localization/v3/messages/upsert", {
      method: "PUT",
      headers: { ...authHeaders(tenantId), "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })
      .then((r) => r.json().then((parsed) => completeXhr(xhr, r.status, parsed)))
      .catch(() => completeXhr(xhr, 0, {}));
  }

  // GET /boundary-service/boundary-relationships/_search?tenantId=...&hierarchyType=...&includeChildren=...
  //   -> GET /boundary/v3/relationship?tenantId=...&hierarchyType=...&includeChildren=...
  //      — same param names, straight path rewrite. NOTE: the old response's
  //      top-level key casing (classic DIGIT boundary APIs use `TenantBoundary`,
  //      capitalized) hasn't been cross-checked against every caller here —
  //      the new endpoint returns `tenantBoundary` (lowercase); if any
  //      boundary-dependent UI (address/hierarchy pickers) renders empty
  //      despite real data existing, check this casing first.
  function handleBoundaryRelationshipSearch(xhr, urlObj) {
    const params = new URLSearchParams();
    ["tenantId", "hierarchyType", "includeChildren"].forEach((k) => {
      const v = urlObj.searchParams.get(k);
      if (v) params.set(k, v);
    });
    const tenantId = urlObj.searchParams.get("tenantId") || fallbackTenantId();
    fetch(`/boundary/v3/relationship?${params.toString()}`, { headers: authHeaders(tenantId) })
      .then((r) => r.json().then((parsed) => completeXhr(xhr, r.status, parsed)))
      .catch(() => completeXhr(xhr, 0, {}));
  }

  // POST /boundary-service/boundary-hierarchy-definition/_search
  //   {BoundaryTypeHierarchySearchCriteria:{tenantId,limit,offset}}
  //   -> real contract (confirmed via decompile of the deployed boundary-java
  //      pod's BoundaryController): GET /boundary/v3/hierarchy, header
  //      X-Tenant-Id only — no criteria at all (3.0 has exactly one hierarchy
  //      per tenant, not several selectable "types" like 2.x; limit/offset
  //      and any hierarchyType filter from the old call are dropped since
  //      there's nothing left for them to select between). Response shape is
  //      otherwise identical to the old one at the field level (confirmed via
  //      the deployed BoundaryHierarchyResponse/BoundaryHierarchy/
  //      BoundaryTypeHierarchy models — same hierarchyType/boundaryHierarchy[
  //      ].boundaryType field names) — only the top-level key changed, from
  //      `BoundaryHierarchy` (old) to lowercase `hierarchy` (new). Rename it
  //      back so DrawerFieldComposer's existing `data?.BoundaryHierarchy`
  //      read keeps working unchanged.
  function handleBoundaryHierarchySearch(xhr, body) {
    const tenantId = body?.BoundaryTypeHierarchySearchCriteria?.tenantId || fallbackTenantId();
    fetch(`/boundary/v3/hierarchy`, { headers: authHeaders(tenantId) })
      .then((r) =>
        r.json().then((parsed) => completeXhr(xhr, r.status, { BoundaryHierarchy: parsed?.hierarchy || [] }))
      )
      .catch(() => completeXhr(xhr, 0, { BoundaryHierarchy: [] }));
  }

  // POST /user/_search {tenantId, uuid:[...], ...} — egov-user isn't deployed
  // on digit-lts at all (confirmed via the cluster), so no real backend call
  // can ever succeed here; this is NOT an API-contract mismatch like the
  // others above. Deliberately narrow: only handles the case actually
  // observed — the page looking up its OWN logged-in user (requested uuid
  // list is exactly length 1 and matches the current session's uuid) — using
  // data already in hand from the JWT/session, nothing fabricated. A request
  // for any OTHER uuid (e.g. a different applicant/assigned officer) falls
  // through untouched and still fails, since there's no real data to serve
  // for a user we're not logged in as.
  function tryHandleSelfUserSearch(xhr, body) {
    const requestedUuids = body?.uuid || [];
    const currentUser = window.Digit?.UserService?.getUser?.()?.info;
    if (requestedUuids.length === 1 && currentUser?.uuid && requestedUuids[0] === currentUser.uuid) {
      // A Keycloak user with no first/last name has no `name` claim, so the session
      // fell back to the username — for a citizen that's the mobile number, which the
      // profile page then showed as the name. Show it empty so they can fill it in.
      const user = { ...currentUser };
      if (user.name && (user.name === user.userName || user.name === user.mobileNumber)) user.name = "";
      completeXhr(xhr, 200, { user: [user] });
      return true;
    }
    return false;
  }

  // Edit Profile on 3.0. egov-user and studio-individual aren't deployed, so core's
  // profile pages (UserProfile -> POST /user/profile/_update; IndividualUserProfile,
  // used when USE_INDIVIDUAL_MODEL is on -> POST <INDIVIDUAL_SERVICE_CONTEXT_PATH>/v1/
  // _search and _update) all answered 404. A person's name lives on their Keycloak
  // user, and Keycloak's Account API lets every user (default role manage-account)
  // edit their own first/last name. Only the SIGNED-IN user's own record is handled;
  // anything else falls through untouched. Only the name is saved: the mobile number
  // is the citizen's login, and an email change needs Keycloak's own checks.
  // The account is read first and sent back whole, so its other fields are kept.
  function saveOwnNameToKeycloak(name) {
    const session = window.Digit?.UserService?.getUser?.();
    const token = session?.access_token;
    if (!token) return Promise.reject(new Error("Not signed in"));
    const realm = session?.info?.tenantId || fallbackTenantId();
    const url = `${getKeycloakBaseUrl()}/realms/${encodeURIComponent(realm)}/account/`;
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
    return fetch(url, { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`account read ${r.status}`))))
      .then((account) => {
        const { userProfileMetadata, ...rest } = account || {};
        const updated = name ? { ...rest, firstName: name, lastName: "" } : rest;
        return fetch(url, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(updated) }).then((r) =>
          r.ok ? [updated.firstName, updated.lastName].filter(Boolean).join(" ") : r.text().then((t) => Promise.reject(new Error(`account update ${r.status} ${t.slice(0, 200)}`)))
        );
      })
      .then((savedName) => {
        // A reload rebuilds the session from the info stored at login (see the
        // Citizen.user-info / Employee.user-info restore below), and the current token
        // still has the old name until the next login — keep the stored copy in step.
        ["Citizen.user-info", "Employee.user-info"].forEach((key) => {
          try {
            const stored = JSON.parse(window.localStorage.getItem(key) || "null");
            if (stored && stored.uuid === session.info?.uuid) window.localStorage.setItem(key, JSON.stringify({ ...stored, name: savedName }));
          } catch (e) {
            // storage unavailable — the name is still saved in Keycloak for the next login
          }
        });
        return savedName;
      });
  }

  const profileError = (xhr, e) =>
    completeXhr(xhr, 400, { Errors: [{ code: "PROFILE_UPDATE_FAILED", message: e?.message || "Profile update failed", description: e?.message || "Profile update failed" }] });

  // UserProfile: answers in the 2.x shape it reads ({responseInfo:{status:"200"}, user:[...]});
  // core then puts the new name into the stored session itself.
  function handleProfileUpdate(xhr, body) {
    const info = window.Digit?.UserService?.getUser?.()?.info || {};
    saveOwnNameToKeycloak(String(body?.user?.name || "").trim())
      .then((savedName) => completeXhr(xhr, 200, { responseInfo: { status: "200" }, user: [{ ...info, ...(body?.user || {}), name: savedName }] }))
      .catch((e) => profileError(xhr, e));
  }

  // IndividualUserProfile: the signed-in user's own record, in the individual shape it
  // reads (Individual[0].name.givenName, mobileNumber, email), built from the session.
  function individualFromSession(info) {
    return {
      userUuid: info.uuid,
      tenantId: info.tenantId,
      name: { givenName: info.name || "" },
      mobileNumber: info.mobileNumber || null,
      email: info.emailId || null,
    };
  }
  function tryHandleOwnIndividual(xhr, pathname, body) {
    const servicePath = window.globalConfigs?.getConfig?.("INDIVIDUAL_SERVICE_CONTEXT_PATH");
    if (!servicePath) return false;
    const base = `/${String(servicePath).replace(/^\/+|\/+$/g, "")}/v1/`;
    const info = window.Digit?.UserService?.getUser?.()?.info;
    if (!info?.uuid) return false;
    if (pathname.endsWith(`${base}_search`)) {
      const uuids = body?.Individual?.userUuid || [];
      if (uuids.length !== 1 || uuids[0] !== info.uuid) return false;
      completeXhr(xhr, 200, { ResponseInfo: { status: "successful" }, Individual: [individualFromSession(info)] });
      return true;
    }
    if (pathname.endsWith(`${base}_update`)) {
      const individual = body?.Individual;
      if (!individual || (individual.userUuid && individual.userUuid !== info.uuid)) return false;
      saveOwnNameToKeycloak(String(individual?.name?.givenName || "").trim())
        .then((savedName) =>
          completeXhr(xhr, 200, { ResponseInfo: { status: "successful" }, Individual: [{ ...individualFromSession(info), ...individual, name: { ...(individual.name || {}), givenName: savedName } }] })
        )
        .catch((e) => profileError(xhr, e));
      return true;
    }
    return false;
  }

  // POST /egov-hrms/employees/_search?tenantId&roles=A,B&isActive (2.x HRMS) -> 3.0
  //   GET /employee/v3/employees?role=<one role>&include=individual,roles, once per role.
  // digit-ui-libraries' useHRMSSearch still calls the 2.x route, which has no route on
  // 3.0 (404), so the workflow popup's assignee list (WorkflowPopup.js) came up empty.
  // The 3.0 search takes a single role per call, so fan out and merge by employee id,
  // then reshape to the 2.x {Employees:[{uuid, code, user:{uuid,name,...}}]} the popup
  // reads (user.name for the label, uuid as the workflow assignee — the Keycloak user id).
  function handleHrmsEmployeeSearch(xhr, urlObj) {
    const params = urlObj.searchParams;
    const tenantId = params.get("tenantId") || fallbackTenantId();
    const roles = (params.get("roles") || "").split(",").map((r) => r.trim()).filter(Boolean);
    const activeOnly = String(params.get("isActive")) === "true";
    const fetchRole = (role) => {
      const q = new URLSearchParams({ include: "individual,roles", limit: "100", offset: "0" });
      if (role) q.set("role", role);
      return fetch(`/employee/v3/employees?${q.toString()}`, { headers: authHeaders(tenantId) })
        .then((r) => (r.ok ? r.json() : []))
        .then((d) => (Array.isArray(d) ? d : d?.employees || []))
        .catch(() => []);
    };
    Promise.all(roles.length ? roles.map(fetchRole) : [fetchRole(null)])
      .then((lists) => {
        const byId = new Map();
        lists.flat().forEach((emp) => emp?.id && byId.set(emp.id, emp));
        const Employees = Array.from(byId.values())
          .filter((emp) => !activeOnly || emp.isActive !== false)
          .map((emp) => {
            const ind = emp.individual || {};
            const name = [ind.givenName, ind.familyName].filter(Boolean).join(" ") || emp.code;
            const userRoles = (emp.roles || []).map((code) => ({ code, name: code, tenantId }));
            return {
              id: emp.id,
              uuid: emp.userId,
              code: emp.code,
              tenantId,
              isActive: emp.isActive !== false,
              employeeStatus: emp.status,
              employeeType: emp.employeeType,
              user: { uuid: emp.userId, name, userName: emp.code, emailId: ind.email || null, roles: userRoles, tenantId },
              assignments: [{ department: emp.department, designation: emp.designation, isCurrentAssignment: true }],
            };
          });
        completeXhr(xhr, 200, { Employees });
      })
      .catch(() => completeXhr(xhr, 200, { Employees: [] }));
  }

  window.XMLHttpRequest.prototype.send = function (body) {
    if (isKeycloakEnabled() && typeof this.__mdmsUrl === "string") {
      let urlObj;
      try {
        urlObj = new URL(this.__mdmsUrl, window.location.origin);
      } catch (e) {
        urlObj = null;
      }

      if (urlObj) {
        const pathname = urlObj.pathname;

        // Filestore upload rewrite (see open() override above) — the v3
        // endpoint reads tenantId from an X-Tenant-Id header, not the old
        // form field, so move it rather than drop it.
        if (this.__filestoreUploadRewrite && body instanceof FormData) {
          const tenantId = body.get("tenantId");
          if (tenantId) {
            try {
              this.setRequestHeader("X-Tenant-Id", tenantId);
            } catch (e) {
              // setRequestHeader throws if called in the wrong XHR state — nothing
              // to do here, the request just goes out without the header this time.
            }
          }
        }

        if (this.__mdmsMethod === "POST" && pathname.endsWith("/egov-hrms/employees/_search")) {
          return void handleHrmsEmployeeSearch(this, urlObj);
        }

        if (this.__mdmsMethod === "POST" && typeof body === "string") {
          let parsedBody;
          try {
            parsedBody = JSON.parse(body);
          } catch (e) {
            parsedBody = null; // not JSON — not one of ours, fall through untouched.
          }
          if (parsedBody) {
            if (pathname.endsWith(`/${MDMS_CONTEXT}/v2/_search`)) return void handleV2Search(this, parsedBody);
            if (pathname.endsWith(`/${MDMS_CONTEXT}/v1/schema/_search`)) return void handleSchemaSearch(this, parsedBody);
            if (pathname.endsWith(`/${MDMS_CONTEXT}/v1/_search`)) return void handleLegacyBatchSearch(this, parsedBody);
            if (pathname.endsWith("/user/_search") && tryHandleSelfUserSearch(this, parsedBody)) return;
            if (pathname.endsWith("/user/profile/_update")) return void handleProfileUpdate(this, parsedBody);
            if (tryHandleOwnIndividual(this, pathname, parsedBody)) return;

            const createMatch = pathname.match(new RegExp(`/${MDMS_CONTEXT}/v2/_create(?:/([^/]+))?$`));
            if (createMatch) return void handleV2CreateOrUpdate(this, parsedBody, createMatch[1] && decodeURIComponent(createMatch[1]), false);
            const updateMatch = pathname.match(new RegExp(`/${MDMS_CONTEXT}/v2/_update(?:/([^/]+))?$`));
            if (updateMatch) return void handleV2CreateOrUpdate(this, parsedBody, updateMatch[1] && decodeURIComponent(updateMatch[1]), true);

            if (pathname.endsWith("/localization/messages/v1/_upsert")) return void handleLocalizationUpsert(this, parsedBody);
            if (pathname.endsWith("/boundary-service/boundary-hierarchy-definition/_search")) return void handleBoundaryHierarchySearch(this, parsedBody);

            // Digit.CustomService.getResponse's public wrapper (the `xn.getResponse`
            // object actually assigned to window.Digit.CustomService, confirmed by
            // locating its `bm("CustomService", xn)` registration) only forwards
            // url/params/body/useCache/userService/method/auth/headers/
            // plainAccessRequest/userDownload/setTimeParam to the internal sender —
            // `noRequestInfo` is NOT in that list, so it's silently dropped before
            // the internal sender (which DOES support it) ever sees it. Passing
            // `noRequestInfo: true` at the call site (HRMSCreateEdit.js) therefore
            // can never work through the public API — confirmed by reading both
            // functions directly. employee-onboarding's job-create endpoint and
            // Keycloak's admin role-mappings endpoint both reject/ignore an extra
            // RequestInfo field, so strip it here instead, the same chokepoint the
            // other digit-lts contract patches above use.
            if (parsedBody && typeof parsedBody === "object" && "RequestInfo" in parsedBody) {
              const isEmployeeOnboardingJob = pathname.endsWith("/employee-onboarding/v3/jobs");
              const isKeycloakRoleMappings = pathname.endsWith("/role-mappings/realm");
              const isBillingV3 = pathname.startsWith("/billing/v3/");
              if (isEmployeeOnboardingJob || isKeycloakRoleMappings || isBillingV3) {
                delete parsedBody.RequestInfo;
                body = JSON.stringify(parsedBody);
              }
            }
          }
        }

        // These two are already GET-shaped (params only, no JSON body) in the
        // old call — just the path differs, so match regardless of method.
        if (pathname.endsWith("/localization/messages/v1/_search")) return void handleLocalizationSearch(this, urlObj);
        if (pathname.endsWith("/boundary-service/boundary-relationships/_search")) return void handleBoundaryRelationshipSearch(this, urlObj);
      }
    }
    return originalSend.call(this, body);
  };
})();

// ---------------------------------------------------------------------------
// Patch: egov-accesscontrol (the service behind /access/v1/actions/mdms/_get,
// which Digit.Hooks.useAccessControl() calls to build the employee sidebar/home
// menu from role codes) isn't deployed on digit-lts at all — confirmed via the
// cluster — and per backend's own 3.0 spec, menus are meant to come from token
// roles instead, not this call. That rebuild is separate, larger work; for now,
// override the hook itself (same property-setter pattern as the UserService
// override just below, needed because various module initializers re-run
// `window.Digit.Hooks = Hooks` and would otherwise stomp a plain reassignment)
// to serve a real snapshot of Studio's actual menu data — fetched from
// unified-dev, where this service still works, for the same
// STUDIO_ADMIN/EMPLOYEE/DESIGNER roles — instead of fabricating placeholder
// menu data. This replaces the hook outright rather than patching the network
// call, since useAccessControl is reached through many different internal
// call sites across digit-ui-module-core that all go through this one hook.
// ---------------------------------------------------------------------------
function installAccessControlOverride() {
  if (!window.Digit?.Hooks) return;
  let fixtureCache = null;
  const useAccessControlOverride = () => {
    const [state, setState] = React.useState({ isLoading: true, data: undefined });
    React.useEffect(() => {
      if (!isKeycloakEnabled()) return;
      (fixtureCache
        ? Promise.resolve(fixtureCache)
        : // Bundled as its own lazy chunk (served under the app's publicPath) rather than
          // fetched from /fixtures/: deployed builds serve only /<context-path>/ and don't
          // copy public/ at all, so a root-relative fetch 404'd with an HTML page there.
          import(/* webpackChunkName: "studio-access-control-fixture" */ "./fixtures/studioAccessControlActions.json")
            .then((m) => (fixtureCache = m.default || m))
      ).then((data) => setState({ isLoading: false, data }));
    }, []);
    return state;
  };

  let hooksRef = window.Digit.Hooks;
  hooksRef.useAccessControl = useAccessControlOverride;
  Object.defineProperty(window.Digit, "Hooks", {
    configurable: true,
    enumerable: true,
    get: () => hooksRef,
    set: (next) => {
      hooksRef = next;
      hooksRef.useAccessControl = useAccessControlOverride;
    },
  });
}
installAccessControlOverride();

// ---------------------------------------------------------------------------
// Patch: the citizen `all-services` home was discarded in favour of the new
// CitizenLandingPage grid (`/citizen/user/citizen-landing`). Core still ships
// the `all-services` route and the Home side-menu link that points to it.
// Rather than modify core, we intercept any navigation to `.../citizen/all-services`
// (and the bare citizen root) and redirect it to the citizen landing grid — the
// grid then opens the per-service ServiceLandingPage with the correct
// module/service/serviceCode params, so downstream actions (Apply / My
// Applications) resolve properly instead of hitting `null/null`. This covers the
// initial hard load, react-router push/replace (SPA menu clicks) and back/forward.
// ---------------------------------------------------------------------------
(function redirectDiscardedAllServices() {
  const ALL_SERVICES_SUFFIX = "/citizen/all-services";
  const CITIZEN_ROOT_SUFFIX = "/citizen"; // bare citizen root, e.g. /digit-studio/citizen
  const NEW_SUFFIX = "/citizen/user/citizen-landing";

  // Native History API, captured before we wrap push/replaceState below, so the
  // client-side redirect can rewrite the URL without re-entering our wrapper.
  const nativeReplaceState = window.history.replaceState.bind(window.history);

  const redirectIfNeeded = () => {
    const { search, hash } = window.location;
    const path = window.location.pathname.replace(/\/$/, ""); // tolerate trailing slash

    // Base = the path up to (and excluding) the discarded segment. Both the old
    // `all-services` page and the bare citizen root now land on service-landing.
    let base = null;
    if (path.endsWith(ALL_SERVICES_SUFFIX)) {
      base = path.slice(0, -ALL_SERVICES_SUFFIX.length);
    } else if (path.endsWith(CITIZEN_ROOT_SUFFIX)) {
      // Only the bare root — any real citizen sub-route ends with a deeper
      // segment (e.g. .../citizen/user/service-landing), so it won't match here.
      base = path.slice(0, -CITIZEN_ROOT_SUFFIX.length);
    } else {
      return false;
    }

    const target = base + NEW_SUFFIX + search + hash;

    // Client-side redirect — NO hard reload. `window.location.replace()` would
    // issue a fresh GET for the deep citizen-landing path, which only resolves
    // where the server rewrites unknown routes to index.html (webpack-dev-server's
    // historyApiFallback locally). Deployed static hosts without that fallback
    // drop the request to `/citizen`, so the redirect silently failed there.
    // Instead we rewrite the URL via the History API and fire popstate so React
    // Router re-reads window.location and renders CitizenLandingPage in place.
    nativeReplaceState(window.history.state, "", target);
    window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
    return true;
  };

  // Case 2: SPA navigation — react-router calls window.history.push/replaceState.
  const wrap = (original) =>
    function (...args) {
      const result = original.apply(this, args);
      redirectIfNeeded();
      return result;
    };
  window.history.pushState = wrap(window.history.pushState);
  window.history.replaceState = wrap(window.history.replaceState);

  // Case 3: browser back/forward onto /all-services.
  window.addEventListener("popstate", redirectIfNeeded);

  // Case 1: landed directly on /all-services (hard load / external link).
  // Run last so the wrappers + popstate listener above are always installed —
  // the client-side redirect no longer reloads the page, so we must NOT return
  // early here or later SPA navigations back to /all-services would go unhandled.
  redirectIfNeeded();
})();

// ---------------------------------------------------------------------------
// Patch: every "log in first" path on the citizen side (landing CTA, service-landing Apply / My
// applications, Request.js on a 401, DynamicLoginComponent, core's private routes, shared
// /citizen/login links) goes to core's 2.x OTP login at `/citizen/login`, carrying the post-login
// target as `?from=` and/or router state `{from}`. With Keycloak on, send all of them to this
// tenant's Keycloak login instead (KeycloakTenantLogin), carrying the same `from`, so the flow is
// unchanged apart from which screen does the login. A full navigation, since index.js decides at
// startup whether to render KeycloakTenantLogin. Also puts every citizen URL under a tenant (see
// citizenTenantSegment above).
(function routeCitizenPagesByTenant() {
  if (!isKeycloakEnabled()) return;

  const fromOf = (state) => {
    const fromQuery = new URLSearchParams(window.location.search).get("from");
    const fromState = state?.usr?.from ?? state?.from; // react-router v6 keeps user state under `usr`
    const from = fromQuery || fromState;
    if (from && typeof from === "object") return `${from.pathname || ""}${from.search || ""}`;
    return from || "";
  };

  // Citizen pages open without sign-in, as in 2.x: before sign-in their reads go to
  // public-service-init's public reads (see PUBLIC_READS in the MDMS shim); sign-in happens when a
  // page needs it (Apply / My applications / private routes → /citizen/login → Keycloak).
  // A citizen login counts only for its own tenant (realm): a STUDIO token is no use on a STUDIOB page,
  // so on another tenant's page it is dropped and the page loads as a visitor.
  const hasCitizenSessionFor = (tenant) =>
    !!window.localStorage.getItem("Citizen.token") &&
    String(window.localStorage.getItem("Citizen.tenant-id") || "").toUpperCase() === tenant;
  const dropCitizenSession = () => {
    const token = window.localStorage.getItem("Citizen.token");
    if (window.localStorage.getItem("token") === token) window.localStorage.removeItem("token");
    ["Citizen.token", "Citizen.user-info", "Citizen.tenant-id"].forEach((k) => window.localStorage.removeItem(k));
    window.sessionStorage.removeItem("Digit.User");
  };
  const leave = (url) => {
    citizenRedirectPending = true; // initDigitUI then skips starting the app on a page that's being left
    window.location.replace(url);
  };
  const keycloakLogin = (tenant, from) =>
    leave(`/${getBasePath()}/${tenant}/citizen/user/login${from ? `?from=${encodeURIComponent(from)}` : ""}`);

  const redirect = (state) => {
    const base = getBasePath();
    const { pathname: path, search, hash } = window.location;

    // Tenant-less citizen URL (MDMS service links, share links, PDF QR links, older code paths):
    // the same page under a tenant — the last one used in this tab, else the environment default,
    // which exists only for these old links.
    const legacy = path.match(new RegExp(`^/${base}/citizen(/.*)?$`));
    if (legacy) {
      const rest = legacy[1] || "";
      const tenant = String(window.sessionStorage.getItem(CITIZEN_TENANT_KEY) || defaultStateTenant() || "").toUpperCase();
      if (!tenant) return;
      if (/^\/login(\/|$)/.test(rest)) return keycloakLogin(tenant, fromOf(state));
      return leave(`/${base}/${tenant}/citizen${rest}${search}${hash}`);
    }

    const segment = citizenTenantSegment(path);
    if (!segment) return;
    const tenant = segment.toUpperCase();
    window.sessionStorage.setItem(CITIZEN_TENANT_KEY, tenant);
    const rest = path.slice(`/${base}/${segment}/citizen`.length);
    if (/^\/user\/login\/?$/.test(rest)) return; // the Keycloak login route itself
    if (/^\/login(\/|$)/.test(rest)) return keycloakLogin(tenant, fromOf(state));
    if (window.localStorage.getItem("Citizen.token") && !hasCitizenSessionFor(tenant)) dropCitizenSession();
  };

  const wrap = (original) =>
    function (state, ...rest) {
      const result = original.call(this, state, ...rest);
      redirect(state);
      return result;
    };
  window.history.pushState = wrap(window.history.pushState);
  window.history.replaceState = wrap(window.history.replaceState);
  window.addEventListener("popstate", () => redirect(window.history.state));
  redirect(window.history.state);
})();

// ---------------------------------------------------------------------------
// Patch: citizen logout intermittently stayed on the bare `/citizen` root
// instead of landing on `/citizen/user/citizen-landing`. Root cause: logout
// (vendored `digit-ui-libraries` UserService.logout()) hard-navigates via
// `window.location.replace(".../citizen")`, a full page reload — the rewrite
// to `citizen-landing` above then depends on THIS script re-running and
// winning a race against React Router reading the URL on that fresh load,
// which is flaky under bundle caching. Rewriting the target here, at the
// call site itself, sends the browser straight to citizen-landing in a
// single hop, removing the race entirely.
(function rewriteCitizenRootHardNavigation() {
  const rewriteTarget = (url) => {
    try {
      const u = new URL(url, window.location.origin);
      const path = u.pathname.replace(/\/$/, "");
      if (path.endsWith("/citizen/all-services")) {
        u.pathname = path.slice(0, -"/all-services".length) + "/user/citizen-landing";
        return u.toString();
      }
      if (path.endsWith("/citizen") && !path.endsWith("/citizen/user/citizen-landing")) {
        u.pathname = path + "/user/citizen-landing";
        return u.toString();
      }
    } catch (e) {
      // Malformed/relative URL we can't parse — fall through untouched.
    }
    return url;
  };

  try {
    const nativeReplace = window.location.replace.bind(window.location);
    window.location.replace = (url) => nativeReplace(rewriteTarget(url));

    const nativeAssign = window.location.assign.bind(window.location);
    window.location.assign = (url) => nativeAssign(rewriteTarget(url));
  } catch (e) {
    // Some environments (older Safari, certain sandboxes) make location
    // methods non-configurable — the History-API patch above still covers
    // the deep-link/back-forward cases even if this one can't install.
  }
})();

// The library's UserService.logout only clears this app's storage (after a 2.x logoutUser call
// that does nothing on 3.0) and goes home. Keycloak's own SSO session survives it, so the next
// login silently re-issues a token without asking for credentials — on a shared counter machine
// the next person is logged in as the previous user. End the Keycloak session too, then land on
// this tenant's login page.
function keycloakAwareLogout() {
  const userType = String(window.Digit?.SessionStorage?.get("userType") || "").toLowerCase() === "citizen" ? "citizen" : "employee";
  const prefix = userType === "citizen" ? "Citizen" : "Employee";
  const tenant =
    window.Digit?.SessionStorage?.get(`${prefix}.tenantId`) ||
    localStorage.getItem(`${prefix}.tenant-id`) ||
    localStorage.getItem("tenant-id");
  const base = window.globalPath || getBasePath(); // contextPath includes the tenant on citizen pages
  if (!tenant) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace(`/${base}/${userType}`);
    return;
  }
  // Reads the id_token from sessionStorage, so it must run before the clear below; the redirect
  // it starts only happens after this function returns.
  logoutFromKeycloak(tenant, `${window.location.origin}/${base}/${tenant}/${userType}/user/login`, userType);
  localStorage.clear();
  sessionStorage.clear();
}

// digit-ui-libraries' WorkflowService.getDetailsByIdV2 (behind Digit.Hooks.useWorkflowDetailsV2 and the
// vendor WFHISTORY timeline) reads 2.x egov-workflow-v2 `process/_search` + `businessservice/_search`,
// which don't exist on 3.0. Same result shape from workflow v3: the entity's transition history
// (`GET /workflow/v3/transition?...&history=true` → latest instance's `transitionHistory`, oldest first)
// and the process definition for state ids/types (`GET /workflow/v3/process/definition/{code}`).
// v3 needs the process code with the entity id; moduleCode is that code.
async function workflowDetailsV3({ tenantId, id, moduleCode }) {
  if (!tenantId || !id || !moduleCode) return {};
  const request = (url, params) =>
    window.Digit.CustomService.getResponse({
      url,
      params,
      headers: { "X-Tenant-ID": tenantId, "auth-token": window.Digit.UserService.getUser()?.access_token },
      method: "GET",
      useCache: false,
      setTimeParam: false,
    });
  const [search, definition] = await Promise.all([
    request("/workflow/v3/transition", { entityId: id, processCode: moduleCode, history: true }),
    request(`/workflow/v3/process/definition/${encodeURIComponent(moduleCode)}`, {}).catch(() => null),
  ]);
  const latest = search?.processInstances?.[0];
  if (!latest) return {};

  const stateByCode = Object.fromEntries((definition?.states || []).map((s) => [s.code, s]));
  const stateById = Object.fromEntries((definition?.states || []).map((s) => [s.id, s]));
  const toState = (code) => {
    const s = stateByCode[code];
    return {
      uuid: s?.id || code,
      state: code,
      applicationStatus: s?.additionalDetails?.applicationStatus ?? null,
      isTerminateState: String(s?.type || "").startsWith("TERMINAL"),
      isStateUpdatable: s?.additionalDetails?.isStateUpdatable,
    };
  };
  const history = latest.transitionHistory?.length
    ? latest.transitionHistory
    : [{ action: latest.action, toState: latest.currentState, comment: latest.comment, auditDetail: latest.auditDetail }];
  // 2.x returned process instances newest first; the timeline renders index 0 as the current step.
  const processInstances = history
    .slice()
    .reverse()
    .map((h) => ({
      action: h.action,
      state: toState(h.toState),
      comment: h.comment,
      documents: h.documents || null,
      assignes: null,
      assigner: null,
      businessService: latest.processCode || moduleCode,
      auditDetails: { createdTime: h.auditDetail?.createdTime, lastModifiedTime: h.auditDetail?.modifiedTime ?? h.auditDetail?.createdTime },
    }));
  const toDate = (epoch) => (epoch ? window.Digit.DateUtils.ConvertEpochToDate(epoch) : null);
  const timeline = processInstances.map((p) => ({
    performedAction: p.action,
    status: p.state.applicationStatus,
    state: p.state.state,
    assigner: null,
    comment: p.comment,
    wfDocuments: p.documents,
    thumbnailsToShow: { thumbs: undefined, fullImage: undefined },
    assignes: null,
    caption: null,
    businessService: p.businessService,
    auditDetails: {
      created: toDate(p.auditDetails.createdTime),
      lastModified: toDate(p.auditDetails.lastModifiedTime),
      lastModifiedEpoch: p.auditDetails.lastModifiedTime,
    },
    isTerminateState: p.state.isTerminateState,
  }));
  const nextActionDetails = latest.nextActionDetails || [];
  const actionState = {
    ...toState(latest.currentState),
    nextActions: nextActionDetails.map((a) => ({ ...toState(stateById[a.nextState]?.code || a.nextState), action: a.action, roles: a.roles })),
    roles: nextActionDetails.flatMap((a) => a.roles || []),
  };
  return {
    timeline,
    nextActions: nextActionDetails.map((a) => ({ action: a.action, roles: (a.roles || []).join(",") })),
    actionState,
    applicationBusinessService: latest.processCode || moduleCode,
    processInstances,
  };
}

const enabledModules = [
  "DSS",
  "Workbench",
  "HCMWORKBENCH",
  //  "Engagement", "NDSS","QuickPayLinks", "Payment",
  "Utilities",
  "Microplanning",
  "Sample",
  "PublicServices",
  "OpenPayment",
  "ServiceDesigner",
  //added to check fsm
  // "FSM"
];

const initTokens = (stateCode) => {
  const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";
  const token = window.localStorage.getItem("token") || process.env[`REACT_APP_${userType}_TOKEN`];

  const citizenInfo = window.localStorage.getItem("Citizen.user-info");
  const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;
  const employeeInfo = window.localStorage.getItem("Employee.user-info");
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");

  const userTypeInfo = userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
  window.Digit.SessionStorage.set("user_type", userTypeInfo);
  window.Digit.SessionStorage.set("userType", userTypeInfo);

  if (userType !== "CITIZEN") {
    window.Digit.SessionStorage.set("User", {
      access_token: token,
      info: JSON.parse(employeeInfo),
    });
  } else if (citizenInfo) {
    // Citizen Keycloak login (KeycloakTenantLogin.js, userType="citizen") does
    // a hard reload after writing Citizen.user-info, same as the employee
    // flow — without this branch that info is written but never read back
    // into Digit.SessionStorage.User on the next load. The OLD citizen OTP
    // flow never writes Citizen.user-info at all (it keeps its own session
    // live without a reload), so this only fires for a Keycloak-logged-in
    // citizen, never interferes with that flow.
    window.Digit.SessionStorage.set("User", {
      access_token: token,
      info: JSON.parse(citizenInfo),
    });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

  if (employeeTenantId && employeeTenantId.length) {
    window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
  }
};

const initDigitUI = () => {
  if (citizenRedirectPending) return; // a citizen tenant/login redirect is already under way
  window.globalPath = getBasePath();
  window.contextPath = window.globalPath;

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "mz";

  const root = ReactDOM.createRoot(document.getElementById("root"));

  // Tenant-prefixed Keycloak entry point
  // (/<contextPath>/<TENANT>/employee/user/login or .../citizen/user/login).
  // Checked before anything else loads: this path is handled entirely outside
  // digit-ui-module-core's router (which has no :tenant route), so a new
  // tenant/realm never needs a change there — only a Keycloak-side client
  // config and, if testing locally, a registered redirect URI.
  const tenantLoginMatch = window.location.pathname.match(
    new RegExp(`^/${window.contextPath}/([A-Za-z0-9_-]+)/(employee|citizen)/user/login/?$`)
  );
  if (tenantLoginMatch) {
    const tenant = tenantLoginMatch[1].toUpperCase();
    const userType = tenantLoginMatch[2];
    root.render(<KeycloakTenantLogin contextPath={window.contextPath} tenant={tenant} userType={userType} />);
    return;
  }

  // Citizen pages carry the tenant: core builds its routes and links from contextPath, so this
  // puts every citizen route under /<base>/<TENANT>/citizen. stateCode above already resolved to
  // this tenant (STATE_LEVEL_TENANT_ID override).
  const citizenSegment = isKeycloakEnabled() ? citizenTenantSegment() : null;
  if (citizenSegment) window.contextPath = `${window.globalPath}/${citizenSegment}`;

  root.render(<>

    <MainApp stateCode={stateCode} enabledModules={enabledModules} />

  </>);
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initLibraries().then(async () => {
      // ---------------------------------------------------------------------
      // Patch: Studio has its own OTP service (studio-user-otp). The send URL
      // inside digit-ui-libraries (Urls.OTP_Send = "/user-otp/v1/_send") is
      // baked into the published bundle and not configurable, so rather than
      // modify the shared core/libraries we re-point UserService.sendOtp here
      // at the app shell — studio-only. Covers employee forgot-password,
      // change-password resend and citizen login/register, which all resolve
      // Digit.UserService.sendOtp at call time. auth/userService stay false to
      // match the library's original sendOtp (pre-login call, no RequestInfo).
      //
      // A plain `Digit.UserService.sendOtp = ...` does NOT survive:
      // digit-ui-components and digit-ui-react-components both run
      // initLibraries() again at import time (when module-core loads below),
      // and the library's register helper rebuilds each service as
      // `window.Digit[name] = {...existing, ...service}` — restoring the
      // original sendOtp. So install the override through a property setter:
      // every re-registration of UserService gets sendOtp re-pointed again.
      // ---------------------------------------------------------------------
      if (window.Digit?.UserService && window.Digit?.CustomService) {
        const repointSendOtp = (svc) => {
          if (svc && typeof svc === "object") {
            svc.sendOtp = (details, stateCode) =>
              window.Digit.CustomService.getResponse({
                url: "/studio-user-otp/v1/_send",
                body: details,
                params: { tenantId: stateCode },
                auth: false,
                userService: false,
                useCache: false,
              }).catch((err) => {
                // Core ForgotPassword toasts error.fields[0].message, else a
                // hardcoded "Invalid login credentials!". A server rejection of a
                // password-reset OTP means no user for that username/city.
                const data = err?.response?.data;
                if (details?.otp?.type === "passwordreset" && err?.response && !data?.error?.fields?.[0]?.message) {
                  err.response.data = {
                    ...data,
                    error: { ...data?.error, fields: [{ message: "CORE_FORGOT_PASSWORD_NO_ACCOUNT_FOUND" }] },
                  };
                }
                throw err;
              });
            if (isKeycloakEnabled()) svc.logout = keycloakAwareLogout;
          }
          return svc;
        };
        let userServiceRef = repointSendOtp(window.Digit.UserService);
        Object.defineProperty(window.Digit, "UserService", {
          configurable: true,
          enumerable: true,
          get: () => userServiceRef,
          set: (next) => {
            userServiceRef = repointSendOtp(next);
          },
        });
      } else {
        console.warn("[digit-studio] OTP override skipped — Digit.UserService/CustomService not ready");
      }
      // Same re-registration problem as UserService above, for WorkflowService.getDetailsByIdV2
      // (see workflowDetailsV3).
      if (isKeycloakEnabled() && window.Digit?.WorkflowService) {
        const repointWorkflow = (svc) => {
          if (svc && typeof svc === "object") svc.getDetailsByIdV2 = workflowDetailsV3;
          return svc;
        };
        let workflowServiceRef = repointWorkflow(window.Digit.WorkflowService);
        Object.defineProperty(window.Digit, "WorkflowService", {
          configurable: true,
          enumerable: true,
          get: () => workflowServiceRef,
          set: (next) => {
            workflowServiceRef = repointWorkflow(next);
          },
        });
      }
      await fetchAndApplyThemeOverrides();
      try {
        // const { initCampaignComponents } = await import("@egovernments/digit-ui-module-campaign-manager")
        const { initCoreComponents } = await import("@egovernments/digit-ui-module-core")
        const { initServiceDesignerComponents } = await import("@egovernments/digit-ui-module-service-designer")
        const { initOpenPaymentComponents } = await import("@egovernments/digit-ui-module-open-payment")
        const { initPublicServiceComponents } = await import("@egovernments/digit-ui-module-public-services")

        const { initWorkbenchComponents } = await import("@egovernments/digit-ui-module-workbench")
        // initCampaignComponents();
        initCoreComponents();
        initWorkbenchComponents();
        initServiceDesignerComponents();
        initOpenPaymentComponents();
        initPublicServiceComponents();
      } catch (error) {
        console.error("Error loading modules:", error);
        // Continue without modules if they fail to load
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    initTokens(stateCode);
    setLoaded(true);
  }, [stateCode, isReady]);

  // Wait until ALL modules have finished importing + registering (isReady) before
  // rendering DigitUI. DigitUI's module loader looks up each enabled module in the
  // component registry with only a short 3-attempt retry window; rendering it
  // before registration completes races that window — and a heavy module bundle
  // (e.g. ServiceDesigner with charts) can register too late → "Module not found
  // after 3 attempts". Gating on isReady removes the race regardless of bundle size.
  if (!loaded || !isReady) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {window.Digit && (
        <DigitUILazy stateCode={stateCode} enabledModules={enabledModules} allowedUserTypes={["employee", "citizen"]} defaultLanding="employee" />
      )}
    </Suspense>
  );
};

initDigitUI();
