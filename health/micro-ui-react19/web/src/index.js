import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks, initLibraries } from "@egovernments/digit-ui-libraries";
import "@egovernments/digit-ui-health-css";
import UserSessionPage from "./workbench/user-session/UserSessionPage";
import UserSessionCard from "./workbench/user-session/UserSessionCard";
import {
  USER_SESSION_ROUTE,
  USER_SESSION_ALLOWED_ACTION_KEYS,
  USER_SESSION_FALLBACK_ROLES,
  hasUserSessionAccess,
  resolveWorkbenchContextPath,
  getUserSessionRouteLink,
} from "./workbench/user-session/config";
import { ensureUserSessionI18n } from "../packages/modules/campaign-manager/src/utils/i18nKeyConstants";
import { initGlobalConfigs } from "./globalConfig";

window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;

const CAMPAIGN_MAPPING_AND_MICROPLANNING_ADMINISTRATOR = "CAMPAIGN_MAPPING_AND_MICROPLANNING_ADMINISTRATOR";
const BOUNDARY_MANAGER = "BOUNDARY_MANAGER";
const PRIVILEGED_BOUNDARY_ACCESS_ROLES = [
  "BOUNDARY_MANAGER",
  "CAMPAIGN_MANAGER",
  "SUPERUSER",
  "SYSTEM_ADMINISTRATOR",
  "CAMPAIGN_MAPPING_AND_MICROPLANNING_ADMINISTRATOR",
];

const getCurrentUserRoles = () => {
  try {
    const employeeInfo = window.localStorage.getItem("Employee.user-info");
    const parsedInfo = employeeInfo ? JSON.parse(employeeInfo) : null;
    const roles = parsedInfo?.info?.roles || parsedInfo?.roles || [];
    return roles.map((role) => role?.code).filter(Boolean);
  } catch (error) {
    return [];
  }
};

const hasAnyRole = (roleCodes = []) => {
  try {
    if (window?.Digit?.Utils?.didEmployeeHasAtleastOneRole) {
      return window.Digit.Utils.didEmployeeHasAtleastOneRole(roleCodes);
    }
  } catch (error) {
    // Fallback to local parsing when utility is unavailable.
  }

  const roles = getCurrentUserRoles();
  return roleCodes.some((roleCode) => roles.includes(roleCode));
};

const shouldRedirectBoundaryAccess = () => {
  const hasCampaignMicroplanningRole = hasAnyRole([CAMPAIGN_MAPPING_AND_MICROPLANNING_ADMINISTRATOR]);
  const hasPrivilegedBoundaryRole = hasAnyRole(PRIVILEGED_BOUNDARY_ACCESS_ROLES);

  if (!hasCampaignMicroplanningRole || hasPrivilegedBoundaryRole) {
    return false;
  }

  return window.location.pathname.includes("/employee/workbench/boundary/data");
};

const enforceWorkbenchBoundaryRoleGuard = () => {
  if (!shouldRedirectBoundaryAccess()) {
    return;
  }

  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  const contextPath = firstSegment || window?.contextPath || "workbench-ui";
  const redirectUrl = `/${contextPath}/employee/campaign/campaign-home`;
  if (window.location.pathname !== redirectUrl) {
    window.location.replace(redirectUrl);
  }
};

const setupBoundaryAccessGuard = () => {
  const checkAndRedirect = () => enforceWorkbenchBoundaryRoleGuard();

  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function pushStateGuard(...args) {
    const result = originalPushState.apply(this, args);
    checkAndRedirect();
    return result;
  };

  window.history.replaceState = function replaceStateGuard(...args) {
    const result = originalReplaceState.apply(this, args);
    checkAndRedirect();
    return result;
  };

  window.addEventListener("popstate", checkAndRedirect);
  checkAndRedirect();
};

const DigitUILazy = lazy(() =>
  import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI }))
);

const enabledModules = ["Utilities", "Workbench", "Campaign", "Payments", "PGR", "HRMS", "DSS", "UserSession"];

const USER_SESSION_ACTION_KEY = USER_SESSION_ALLOWED_ACTION_KEYS[0] || "USERMANAGEMENT.USER_SESSION";
const USER_SESSION_LINK_KEY = USER_SESSION_ALLOWED_ACTION_KEYS[1] || "USER_SESSION_LINK_USER_SESSION";
const USER_SESSION_PARENT_MODULE = "USER_SESSION";
const USER_SESSION_MODULE_CODE = "user-session";

const getUserSessionNavigationLink = () => {
  return getUserSessionRouteLink();
};

const UserSessionModule = () => <UserSessionPage />;

const appendUserSessionModule = (source) => {
  if (!source || !Array.isArray(source.modules)) {
    return source;
  }

  const hasUserSessionModule = source.modules.some((moduleConfig) => String(moduleConfig?.code || "").toLowerCase() === USER_SESSION_MODULE_CODE);
  if (hasUserSessionModule) {
    return source;
  }

  const workbenchModule = source.modules.find((moduleConfig) => String(moduleConfig?.code || "").toLowerCase() === "workbench");
  const userSessionModule = {
    code: USER_SESSION_MODULE_CODE,
    module: "UserSession",
    tenants: workbenchModule?.tenants || source.modules?.[0]?.tenants || [],
  };

  return {
    ...source,
    modules: [...source.modules, userSessionModule],
  };
};

const ensureUserSessionModuleOnSource = (source) => {
  const patched = appendUserSessionModule(source);
  if (!source || !patched || patched === source) {
    return source;
  }

  source.modules = patched.modules;
  return source;
};

const patchUseInitStoreForUserSessionModule = () => {
  const hooks = window?.Digit?.Hooks;
  if (!hooks || typeof hooks.useInitStore !== "function" || hooks.__userSessionInitStorePatchApplied) {
    return;
  }

  const originalUseInitStore = hooks.useInitStore.bind(hooks);
  hooks.useInitStore = (...args) => {
    const result = originalUseInitStore(...args);
    if (!result || !result.data || typeof result !== "object") {
      return result;
    }
    ensureUserSessionModuleOnSource(result.data);
    return result;
  };

  hooks.__userSessionInitStorePatchApplied = true;
};

const patchAccessControlForUserSessionCard = () => {
  const hooks = window?.Digit?.Hooks;
  if (!hooks || typeof hooks.useAccessControl !== "function" || hooks.__userSessionCardPatchApplied) {
    return;
  }

  const originalUseAccessControl = hooks.useAccessControl.bind(hooks);
  hooks.useAccessControl = (...args) => {
    const result = originalUseAccessControl(...args);
    const actions = result?.data?.actions;

    if (!Array.isArray(actions)) {
      return result;
    }

    const routeLink = getUserSessionNavigationLink();
    const userSessionKeys = [USER_SESSION_ACTION_KEY, USER_SESSION_LINK_KEY];
    const isAuthorizedForUserSession = hasUserSessionAccess();
    const normalizedActions = actions.map((action) => {
      const key = String(action?.name || action?.displayName || action?.path || "").toUpperCase();
      const navigationURL = String(action?.navigationURL || action?.url || action?.path || "");
      const isUserSessionAction = userSessionKeys.includes(key) || navigationURL.includes(USER_SESSION_ROUTE);

      if (!isUserSessionAction) {
        return action;
      }

      const isCardAction = String(action?.url || "").toLowerCase() === "card";
      return {
        ...action,
        navigationURL: routeLink,
        path: isCardAction ? "card" : routeLink,
        url: isCardAction ? "card" : (action?.url || routeLink),
        parentModule: action?.parentModule || USER_SESSION_PARENT_MODULE,
        roles: USER_SESSION_FALLBACK_ROLES,
      };
    });

    const hasUserSessionCard = normalizedActions.some((action) => {
      const key = String(action?.name || action?.displayName || action?.path || "").toUpperCase();
      return userSessionKeys.includes(key) && String(action?.url || "").toLowerCase() === "card";
    });


    if (!isAuthorizedForUserSession) {
      const filteredActions = normalizedActions.filter((action) => {
        const key = String(action?.name || action?.displayName || action?.path || "").toUpperCase();
        const navigationURL = String(action?.navigationURL || action?.url || action?.path || "");
        return !userSessionKeys.includes(key) && !navigationURL.includes(USER_SESSION_ROUTE);
      });

      return {
        ...result,
        data: {
          ...result.data,
          actions: filteredActions,
        },
      };
    }

    const userSessionCardAction = {
      name: USER_SESSION_ACTION_KEY,
      displayName: "USER_SESSION",
      url: "card",
      path: "card",
      navigationURL: routeLink,
      parentModule: USER_SESSION_PARENT_MODULE,
      roles: USER_SESSION_FALLBACK_ROLES,
    };

    return {
      ...result,
      data: {
        ...result.data,
        actions: hasUserSessionCard ? normalizedActions : [...normalizedActions, userSessionCardAction],
      },
    };
  };

  hooks.__userSessionCardPatchApplied = true;
};

const registerWorkbenchUserSessionComponents = () => {
  const registry = window?.Digit?.ComponentRegistryService;
  if (!registry || typeof registry.setComponent !== "function") {
    return;
  }

  if (!registry.__userSessionWorkbenchRegistrationApplied) {
    registry.setComponent("UserSessionPage", UserSessionPage);
    registry.setComponent("UserSession", UserSessionPage);
    registry.setComponent("UserSessionModule", UserSessionModule);
    registry.setComponent("user-sessionModule", UserSessionModule);
    registry.setComponent("USERMANAGEMENT.USER_SESSION", UserSessionPage);
    registry.setComponent("USER_SESSION_LINK_USER_SESSION", UserSessionPage);
    registry.setComponent("UserSessionCard", UserSessionCard);
    registry.__userSessionWorkbenchRegistrationApplied = true;
  }
};

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
  initGlobalConfigs();
  ensureUserSessionI18n();
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || resolveWorkbenchContextPath() || "digit-ui";
  patchAccessControlForUserSessionCard();
  patchUseInitStoreForUserSessionModule();
  registerWorkbenchUserSessionComponents();
  setupBoundaryAccessGuard();

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "mz";

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<MainApp stateCode={stateCode} enabledModules={enabledModules} />);
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initLibraries().then(async () => {
      // Use Promise.allSettled so each module is independent — one failure won't block others
      const results = await Promise.allSettled([
        import(/* webpackChunkName: "campaign-manager" */ "@egovernments/digit-ui-module-campaign-manager"),
        import(/* webpackChunkName: "workbench" */ "@egovernments/digit-ui-module-workbench"),
        import(/* webpackChunkName: "pgr" */ "@egovernments/digit-ui-module-health-pgr"),
        import(/* webpackChunkName: "health-hrms" */ "@egovernments/digit-ui-module-health-hrms"),
        import(/* webpackChunkName: "health-payments" */ "@egovernments/digit-ui-module-health-payments"),
        import(/* webpackChunkName: "health-dss" */ "@egovernments/digit-ui-module-health-dss"),
      ]);

      const [campaignResult, workbenchResult, pgrResult, hrmsResult, paymentsResult, dssResult] = results;

      if (campaignResult.status === "fulfilled" && campaignResult.value?.initCampaignComponents) {
        campaignResult.value.initCampaignComponents();
      } else if (campaignResult.status === "rejected") {
        console.log("campaign-manager failed to load:", campaignResult.reason);
      }

      if (workbenchResult.status === "fulfilled" && workbenchResult.value?.initWorkbenchComponents) {
        workbenchResult.value.initWorkbenchComponents();
        // User Session customizations
        patchAccessControlForUserSessionCard();
        patchUseInitStoreForUserSessionModule();
        // Register User Session components
        registerWorkbenchUserSessionComponents();
        // Retry registration to handle delayed Workbench initialization
        setTimeout(registerWorkbenchUserSessionComponents, 0);
        setTimeout(registerWorkbenchUserSessionComponents, 500);
        setTimeout(registerWorkbenchUserSessionComponents, 1500);
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

      if (dssResult.status === "fulfilled" && dssResult.value?.initDSSComponents) {
        dssResult.value.initDSSComponents();
      } else if (dssResult.status === "rejected") {
        console.log("health-dss failed to load:", dssResult.reason);
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
