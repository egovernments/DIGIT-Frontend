import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks, initLibraries } from "@egovernments/digit-ui-libraries";
import "@egovernments/digit-ui-health-css";

window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;

const DigitUILazy = lazy(() =>
  import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI }))
);

const enabledModules = ["Utilities", "Workbench", "Campaign", "Payments", "PGR", "HRMS"];

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
      info: userType !== "CITIZEN" ? JSON.parse(employeeInfo) : citizenInfo,
    });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

  if (employeeTenantId && employeeTenantId.length) {
    window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
  }
};

// --- Per-deployment locale ---------------------------------------------------------
// Every tenant deployment (hcm-digit-ui, chaduat/hcm-digit-ui, zambia/hcm-digit-ui, ...)
// is served from the SAME origin, so sessionStorage is shared between them. The core
// libraries keep the active locale in a single unscoped key ("Digit.locale"), which
// therefore leaks across deployments: a locale picked on the shared login (en_AFRO)
// survives the redirect into chaduat, and LocalizationService then appends this
// deployment's LOCALE_REGION to it (en_AFRO + CHADUAT -> en_AFROCHADUAT), so the
// localisation search returns nothing and the UI renders raw keys.
//
// Fix: keep a locale per deployment, and seed the unscoped key from it on every boot.
// Everything downstream (i18next, Request.js msgId, each module's useStore, the pdf
// utils, campaign-manager) still reads the unscoped key, so nothing else changes.

// Build marker. Bumped whenever this locale logic changes, so "which bundle is live?"
// is a single console read (window.__tenantLocale) instead of decoding minified source.
const TENANT_LOCALE_BUILD = "v3-resolve";

const SESSION_TTL_SECONDS = 86400; // matches the Digit.SessionStorage default

// Digit.SessionStorage prefixes keys with "Digit." and wraps values as {value, ttl, expiry}.
// Reimplemented here because these run before initLibraries(), so Digit isn't up yet.
const readSessionValue = (key) => {
  try {
    const raw = window.sessionStorage.getItem(`Digit.${key}`);
    if (!raw || raw === "undefined") return null;
    const item = JSON.parse(raw);
    if (item?.expiry && Date.now() > item.expiry) {
      window.sessionStorage.removeItem(`Digit.${key}`);
      return null;
    }
    return item?.value ?? null;
  } catch (e) {
    return null;
  }
};

const writeSessionValue = (key, value) => {
  const item = { value, ttl: SESSION_TTL_SECONDS, expiry: Date.now() + SESSION_TTL_SECONDS * 1000 };
  window.sessionStorage.setItem(`Digit.${key}`, JSON.stringify(item));
};

const removeSessionValue = (key) => window.sessionStorage.removeItem(`Digit.${key}`);

const currentDeployment = () => window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "default";
const tenantLocaleKey = () => `locale.${currentDeployment()}`;

// Language preferences are written by digit-ui-module-core (utils/tenantLocale.js) into
// localStorage, in the Digit.PersistantStorage wrapper format:
//
//   Digit.locale.<tenant>    locale last used on this deployment, e.g. fr_CHADUAT
//   Digit.language.pending   a language the user JUST picked, region-free, e.g. "fr"
//
// Read here rather than written: core owns the writes, because it is the only place a user
// deliberately picks a language. Reimplemented instead of using Digit.PersistantStorage so
// the format stays explicit on this side of the boundary.
const PENDING_LANGUAGE_KEY = "Digit.language.pending";

const readPersistentValue = (key) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw || raw === "undefined") return null;
    const item = JSON.parse(raw);
    if (item?.expiry && Date.now() > item.expiry) {
      window.localStorage.removeItem(key);
      return null;
    }
    return item?.value ?? null;
  } catch (e) {
    return null;
  }
};

// The locale strings encode the deployment (fr_AFRO vs fr_CHADUAT), so a language chosen on
// the shared login cannot be carried across as-is - only its language part can, re-stamped
// with this deployment's region.
const localeForThisDeployment = (languageSubtag) => {
  const region = window?.globalConfigs?.getConfig("LOCALE_REGION");
  return languageSubtag && region ? `${languageSubtag}_${region}` : null;
};

// Languages this deployment actually offers. Needed to validate a carried-over choice before
// applying it: an unavailable locale means no messages AND no loaded fallback, i.e. raw keys.
// MdmsService.init is memoised in Digit.RequestCache, so digitInitData's own call later reuses
// this response - no extra request.
const getConfiguredLanguages = async (stateCode) => {
  try {
    const { MdmsRes } = await window.Digit.MDMSService.init(stateCode);
    const stateInfo = MdmsRes?.["common-masters"]?.StateInfo?.[0] || {};
    return (stateInfo.hasLocalisation ? stateInfo.languages : [])?.map((l) => l?.value).filter(Boolean) || [];
  } catch (e) {
    console.warn("[tenant-locale] could not read the configured languages", e);
    return [];
  }
};

// Decide the active locale for this deployment, in priority order:
//   1. a language the user just picked elsewhere, re-stamped and validated -> then consumed
//   2. the locale last used on this deployment
//   3. nothing: clear the unscoped key so digitInitData falls through to languages[0]
//
// The unscoped Digit.locale stays in sessionStorage - it is what i18next, RequestInfo.msgId,
// the per-module useStore calls and the pdf utils read.
const applyTenantLocale = async (stateCode) => {
  const pending = readPersistentValue(PENDING_LANGUAGE_KEY);
  const scoped = readPersistentValue(`Digit.${tenantLocaleKey()}`);
  const languages = pending || scoped ? await getConfiguredLanguages(stateCode) : [];

  let resolved = null;
  let via = "default";

  if (pending) {
    const candidate = localeForThisDeployment(pending);
    // Consume it either way: a one-shot handoff must not linger and override a later choice.
    window.localStorage.removeItem(PENDING_LANGUAGE_KEY);
    if (candidate && languages.includes(candidate)) {
      resolved = candidate;
      via = "pending";
    }
  }

  if (!resolved && scoped && languages.includes(scoped)) {
    resolved = scoped;
    via = "scoped";
  }

  if (resolved) writeSessionValue("locale", resolved);
  else removeSessionValue("locale");

  if (window.__tenantLocale) {
    window.__tenantLocale.resolvedLocale = resolved;
    window.__tenantLocale.resolvedVia = via;
  }
};

// initData is cached under one unscoped key too, so arriving from another deployment can
// render that deployment's stateInfo (logo, banner, language list) for a paint before
// digitInitData overwrites it. Drop it whenever the deployment changes.
const clearInitDataOnDeploymentChange = () => {
  const current = currentDeployment();
  const previous = readSessionValue("lastDeployment");
  if (previous && previous !== current) removeSessionValue("initData");
  writeSessionValue("lastDeployment", current);
};

// Cross-deployment tenant redirect: this build (this contextPath) is the shared/common
// login instance. Each tenant (chad, congo, ...) is a SEPARATE deployment at its own
// base path (same origin), configured via globalConfigs.TENANT_DEPLOYMENT_MAP. Since the
// core login module navigates in-app via history.pushState/replaceState with no basename
// (see digit-ui-module-core), the only way to bounce the browser to another deployment's
// path after login is to intercept navigation from outside its router.
const redirectToTenantDeploymentIfNeeded = () => {
  const tenantId = window.localStorage.getItem("Employee.tenant-id");
  if (!tenantId) return;

  const tenantDeploymentMap = window?.globalConfigs?.getConfig("TENANT_DEPLOYMENT_MAP") || {};
  const targetBase = tenantDeploymentMap[tenantId.toLowerCase()];
  if (!targetBase) return;

  const normalizedTarget = targetBase.replace(/^\/|\/$/g, "");
  const pathname = window.location.pathname;
  // Check the actual URL, not window.contextPath: that's a static value re-read from the
  // same globalConfigs on every load, so it can't tell us we've already arrived at the
  // target deployment (this matters in local dev, where one server answers every path).
  if (pathname === `/${normalizedTarget}` || pathname.startsWith(`/${normalizedTarget}/`)) return;

  const suffix = pathname.replace(`/${window.contextPath}`, "") || "/employee";
  window.location.replace(`/${normalizedTarget}${suffix}${window.location.search}`);
};

const initDigitUI = () => {
  // In production, docker-entrypoint.sh injects <base href="/chaduat/hcm-digit-ui/">
  // Use that to derive contextPath (includes country prefix), otherwise fall back to globalConfigs
  const baseTag = document.querySelector("base");
  if (baseTag) {
    window.contextPath = baseTag.getAttribute("href").replace(/^\/|\/$/g, "");
  } else {
    window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "hcm-digit-ui";
  }
  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "mz";

  // Must run before initLibraries() (which initialises i18next from the unscoped locale)
  // and before digitInitData reads it.
  clearInitDataOnDeploymentChange();
  /* applyTenantLocale needs Digit (MDMS + storage), so it runs after initLibraries() below. */

  window.__tenantLocale = {
    build: TENANT_LOCALE_BUILD,
    deployment: currentDeployment(),
    region: window?.globalConfigs?.getConfig("LOCALE_REGION"),
    contextPath: window.contextPath,
    scopedKey: `Digit.${tenantLocaleKey()}`,
    resolvedLocale: null, // filled in by applyTenantLocale() once it has run
    resolvedVia: null,
  };

  ["pushState", "replaceState"].forEach((method) => {
    const original = window.history[method];
    window.history[method] = function (...args) {
      const result = original.apply(this, args);
      redirectToTenantDeploymentIfNeeded();
      return result;
    };
  });
  window.addEventListener("popstate", redirectToTenantDeploymentIfNeeded);
  redirectToTenantDeploymentIfNeeded(); // handles page refresh with a tenant already logged in

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<MainApp stateCode={stateCode} enabledModules={enabledModules} />);
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initLibraries().then(async () => {
      await applyTenantLocale(stateCode);
      console.info("[tenant-locale]", window.__tenantLocale);
      // Use Promise.allSettled so each module is independent — one failure won't block others
      const results = await Promise.allSettled([
        import(/* webpackChunkName: "campaign-manager" */ "@egovernments/digit-ui-module-campaign-manager"),
        import(/* webpackChunkName: "workbench" */ "@egovernments/digit-ui-module-workbench"),
        import(/* webpackChunkName: "pgr" */ "@egovernments/digit-ui-module-health-pgr"),
        import(/* webpackChunkName: "health-hrms" */ "@egovernments/digit-ui-module-health-hrms"),
        import(/* webpackChunkName: "health-payments" */ "@egovernments/digit-ui-module-health-payments"),
      ]);

      const [campaignResult, workbenchResult, pgrResult, hrmsResult, paymentsResult] = results;

      if (campaignResult.status === "fulfilled" && campaignResult.value?.initCampaignComponents) {
        campaignResult.value.initCampaignComponents();
      } else if (campaignResult.status === "rejected") {
        console.log("campaign-manager failed to load:", campaignResult.reason);
      }

      if (workbenchResult.status === "fulfilled" && workbenchResult.value?.initWorkbenchComponents) {
        workbenchResult.value.initWorkbenchComponents();
      } else if (workbenchResult.status === "rejected") {
        console.log("workbench failed to load:", workbenchResult.reason);
      }

      if (pgrResult.status === "fulfilled" && pgrResult.value?.initPGRComponents) {
        pgrResult.value.initPGRComponents();
      } else if (pgrResult.status === "rejected") {
        console.log("pgr failed to load:", pgrResult.reason);
      }

      if (hrmsResult.status === "fulfilled" && hrmsResult.value?.initHRMSComponents) {
        hrmsResult.value.initHRMSComponents();
      } else if (hrmsResult.status === "rejected") {
        console.log("hrms failed to load:", hrmsResult.reason);
      }

      if (paymentsResult.status === "fulfilled" && paymentsResult.value?.initPaymentComponents) {
        paymentsResult.value.initPaymentComponents();
      } else if (paymentsResult.status === "rejected") {
        console.log("health-payments failed to load:", paymentsResult.reason);
      }

      window.Digit.Customizations = {
        ...window.Digit.Customizations,
        PGR: window.Digit.Customizations?.PGR || {},
      };

      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    initTokens(stateCode);
    setLoaded(true);
  }, [stateCode, isReady]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {window.Digit && (
        <DigitUILazy
          stateCode={stateCode}
          enabledModules={enabledModules}
          allowedUserTypes={["employee", "citizen"]}
          defaultLanding="employee"
        />
      )}
    </Suspense>
  );
};

initDigitUI();
