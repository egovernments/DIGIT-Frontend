import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { Loader } from "@egovernments/digit-ui-components";


window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;
const DigitUILazy = lazy(() => import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI })));


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
  root.render(<MainApp stateCode={stateCode} enabledModules={enabledModules} />);
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initLibraries().then(() => {
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    initTokens(stateCode);
    setLoaded(true);
  }, [stateCode]);

  // Load modules lazily only when needed
  useEffect(() => {
    if (isReady && loaded) {
      // Load modules in the background after initial render
      setTimeout(async () => {
        if (enabledModules.includes("Campaign")) {
          try {
            const { initCampaignComponents } = await import("@egovernments/digit-ui-module-campaign-manager")
            initCampaignComponents();
          } catch (error) {
            console.warn("Campaign module not available:", error.message);
          }
        }
        if (enabledModules.includes("Workbench")) {
          try {
            const { initWorkbenchComponents } = await import("@egovernments/digit-ui-module-workbench")
            initWorkbenchComponents();
          } catch (error) {
            console.warn("Workbench module not available:", error.message);
          }
        }
      }, 100); // Small delay to allow initial render
    }
  }, [isReady, loaded, enabledModules]);

  if (!loaded) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  return (
    <Suspense fallback={<Loader page={true} variant={"PageLoader"} />}>
      {window.Digit && (
        <DigitUILazy stateCode={stateCode} enabledModules={enabledModules}   allowedUserTypes={["employee", "citizen"]} defaultLanding="employee" />
      )}
    </Suspense>
  );
};

initDigitUI();
