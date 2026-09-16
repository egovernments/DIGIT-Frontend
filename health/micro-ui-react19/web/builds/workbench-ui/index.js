import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { Loader } from "@egovernments/digit-ui-components";

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
const enabledModules = ["assignment", "Workbench", "Utilities", "Campaign"];

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