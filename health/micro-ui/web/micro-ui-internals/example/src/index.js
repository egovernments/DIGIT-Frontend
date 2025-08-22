import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";
import { Loader } from "@egovernments/digit-ui-components";
import "./index.css"

import { initLibraries } from "@egovernments/digit-ui-libraries";
window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;
const DigitUILazy = lazy(() => 
  import("@egovernments/digit-ui-module-core").then((module) => ({ 
    default: module.DigitUI,
    initCoreComponents: module.initCoreComponents,
    initCriticalComponents: module.initCriticalComponents
  }))
);


const enabledModules = ["Workbench", "Campaign"];

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
      try {
        // Phase 1: Initialize critical components immediately
        const coreModule = await import("@egovernments/digit-ui-module-core");
        if (coreModule.initCriticalComponents) {
          coreModule.initCriticalComponents();
          console.log("✅ Critical components ready for immediate use");
        }

        // Phase 2: Initialize remaining components when needed
        if (coreModule.initCoreComponents) {
          coreModule.initCoreComponents();
          console.log("✅ All core components registered");
        }

        // Initialize critical campaign components first
        const {initCriticalCampaignComponents, initNonCriticalCampaignComponents} = await import("@egovernments/digit-ui-module-campaign-manager")
        if (initCriticalCampaignComponents) {
          initCriticalCampaignComponents();
          console.log("✅ Critical campaign components ready");
        }

        // Initialize module-specific components
        const { initWorkbenchComponents } = await import("@egovernments/digit-ui-module-workbench")
        initWorkbenchComponents();

        // Initialize non-critical campaign components
        if (initNonCriticalCampaignComponents) {
          initNonCriticalCampaignComponents();
          console.log("✅ All campaign components registered");
        }
        
        setIsReady(true);
      } catch (error) {
        console.error("❌ Component initialization failed:", error);
        setIsReady(true); // Continue with partial functionality
      }
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
    <Suspense fallback={<div><Loader page={true} variant={"PageLoader"} /></div>}>
      {window.Digit && (
        <DigitUILazy stateCode={stateCode} enabledModules={enabledModules} allowedUserTypes={["employee", "citizen"]} defaultLanding="employee" />
      )}
    </Suspense>
  );
};

initDigitUI();
