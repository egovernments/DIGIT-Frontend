import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";
import "@egovernments/digit-ui-health-css";
// import { BrowserRouter } from "react-router-dom";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { fetchAndApplyThemeOverrides } from "./config/themeOverrides";
window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;
const DigitUILazy = lazy(() => import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI })));

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
      info: userType !== "CITIZEN" ? JSON.parse(employeeInfo) : citizenInfo,
    });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

  if (employeeTenantId && employeeTenantId.length) {
    window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
  }
};

const initDigitUI = () => {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "mz";

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<>

    <MainApp stateCode={stateCode} enabledModules={enabledModules} />

  </>);
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initLibraries().then(async () => {
      await fetchAndApplyThemeOverrides();
      try {
        // const { initCampaignComponents } = await import("@egovernments/digit-ui-module-campaign-manager")
        const { initServiceDesignerComponents } = await import("@egovernments/digit-ui-module-service-designer")
        const { initOpenPaymentComponents } = await import("@egovernments/digit-ui-module-open-payment")
        const { initPublicServiceComponents } = await import("@egovernments/digit-ui-module-public-services")
        
        const { initWorkbenchComponents } = await import("@egovernments/digit-ui-module-workbench")
        // initCampaignComponents();
        initWorkbenchComponents();
        initServiceDesignerComponents();
        initOpenPaymentComponents();
        initPublicServiceComponents();
      } catch (error) {
        console.log("Error loading modules:", error);
        // Continue without modules if they fail to load
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    initTokens(stateCode);
    setLoaded(true);
  }, [stateCode, isReady]);

  if (!loaded) {
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
