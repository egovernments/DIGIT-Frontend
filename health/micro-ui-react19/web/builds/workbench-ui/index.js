import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { Loader } from "@egovernments/digit-ui-components";

window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;

// Lazy load the core module
const DigitUILazy = lazy(() => import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI })));

// Enabled modules for workbench variant
const enabledModules = ["assignment", "Workbench", "Utilities", "Campaign", "Payments", "PGR", "HRMS"];

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
        import(/* webpackChunkName: "health-payments" */ "@egovernments/digit-ui-module-health-payments"),
        import(/* webpackChunkName: "pgr" */ "@egovernments/digit-ui-module-health-pgr"),
        import(/* webpackChunkName: "health-hrms" */ "@egovernments/digit-ui-module-health-hrms"),
      ]);

      const [campaignResult, workbenchResult, paymentsResult, pgrResult, hrmsResult] = results;

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

      if (paymentsResult.status === "fulfilled" && paymentsResult.value?.initPaymentComponents) {
        paymentsResult.value.initPaymentComponents();
      } else if (paymentsResult.status === "rejected") {
        console.log("health-payments failed to load:", paymentsResult.reason);
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
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;
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