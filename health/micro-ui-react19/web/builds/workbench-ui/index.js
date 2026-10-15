import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";
import "@egovernments/digit-ui-health-css";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { Loader } from "@egovernments/digit-ui-components";
import UserSessionPage from "./workbench/user-session/UserSessionPage";
import UserSessionCard from "./workbench/user-session/UserSessionCard";

window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;

// Lazy load the core module
const DigitUILazy = lazy(() => import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI })));

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
    const roleObjects = parsedInfo?.info?.roles || parsedInfo?.roles || [];
    return roleObjects.map((role) => role?.code).filter(Boolean);
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

const hasUserSessionAccess = () => hasAnyRole(["SYSTEM_ADMINISTRATOR"]);

const isRestrictedBoundaryAccess = () => {
  const hasCampaignMicroplanningRole = hasAnyRole([CAMPAIGN_MAPPING_AND_MICROPLANNING_ADMINISTRATOR]);
  const hasPrivilegedBoundaryRole = hasAnyRole(PRIVILEGED_BOUNDARY_ACCESS_ROLES);

  if (!hasCampaignMicroplanningRole || hasPrivilegedBoundaryRole) {
    return false;
  }

  return window.location.pathname.includes("/employee/workbench/boundary/data");
};

const getContextPathPrefix = () => {
  const firstSegment = window.location.pathname.split("/").filter(Boolean)[0];
  if (firstSegment) {
    return firstSegment;
  }
  return window?.contextPath || "workbench-ui";
};

const enforceWorkbenchBoundaryRoleGuard = () => {
  if (!isRestrictedBoundaryAccess()) {
    return;
  }

  const contextPath = getContextPathPrefix();
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

// Enabled modules for workbench variant
const enabledModules = ["assignment", "Workbench", "Utilities", "Campaign", "UserSession"];
const USER_SESSION_ROUTE = "/employee/user-session";
const USER_SESSION_ACTION_KEY = "USERMANAGEMENT.USER_SESSION";
const USER_SESSION_LINK_KEY = "USER_SESSION_LINK_USER_SESSION";
const USER_SESSION_PARENT_MODULE = "USER_SESSION";
const USER_SESSION_MODULE_CODE = "user-session";
const USER_SESSION_FALLBACK_ROLES = [
  "SYSTEM_ADMINISTRATOR",
];

const NON_CONTEXT_SEGMENTS = new Set(["employee", "citizen"]);

const resolveWorkbenchContextPath = () => {
  const configuredContextPath = String(window?.globalConfigs?.getConfig?.("CONTEXT_PATH") || "").trim();
  const firstSegment = String(window?.location?.pathname?.split("/").filter(Boolean)[0] || "").trim();
  const runtimeContextPath = String(window?.contextPath || "").trim();

  if (configuredContextPath && !NON_CONTEXT_SEGMENTS.has(configuredContextPath.toLowerCase())) {
    return configuredContextPath;
  }

  if (firstSegment && !NON_CONTEXT_SEGMENTS.has(firstSegment.toLowerCase())) {
    return firstSegment;
  }

  if (runtimeContextPath && !NON_CONTEXT_SEGMENTS.has(runtimeContextPath.toLowerCase())) {
    return runtimeContextPath;
  }

  return "workbench-ui";
};

const getUserSessionNavigationLink = () => {
  return `/${resolveWorkbenchContextPath()}${USER_SESSION_ROUTE}`;
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
  window.contextPath = resolveWorkbenchContextPath();
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
      try {
        // Dynamically import heavy modules only for workbench
        const [campaignModule, workbenchModule] = await Promise.all([
          import(/* webpackChunkName: "campaign-manager" */ "@egovernments/digit-ui-module-campaign-manager"),
          import(/* webpackChunkName: "workbench" */ "@egovernments/digit-ui-module-workbench")
        ]);
        
        if (campaignModule?.initCampaignComponents) {
          campaignModule.initCampaignComponents();
        }
        if (workbenchModule?.initWorkbenchComponents) {
          workbenchModule.initWorkbenchComponents();
        }
        patchAccessControlForUserSessionCard();
        patchUseInitStoreForUserSessionModule();
        registerWorkbenchUserSessionComponents();
        setTimeout(registerWorkbenchUserSessionComponents, 0);
        setTimeout(registerWorkbenchUserSessionComponents, 500);
        setTimeout(registerWorkbenchUserSessionComponents, 1500);
      } catch (error) {
        console.log("Error loading modules:", error);
      }
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    initTokens(stateCode);
    setLoaded(true);
  }, [stateCode, isReady]);

  if (!loaded) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <Suspense fallback={<Loader page={true} variant={"PageLoader"} />}>
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