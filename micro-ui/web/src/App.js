import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client"; // React 18 support
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { initCoreComponents } from "@egovernments/digit-ui-module-core";
import { UICustomizations } from "./Customisations/UICustomizations";

window.Digit = window.Digit || {};
window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const queryClient = new QueryClient();

// Lazy load DigitUI for better performance
const DigitUILazy = lazy(() =>
  import("@egovernments/digit-ui-module-core").then((module) => ({
    default: module.DigitUI,
  }))
);

const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  "HRMS",
  "Engagement",
  // "Workbench",
  "PGR",
];

const moduleReducers = (initData) => ({
  initData,
});

// Initialize user session tokens
const initTokens = (stateCode) => {
  const userType =
    window.sessionStorage.getItem("userType") ||
    process.env.REACT_APP_USER_TYPE ||
    "CITIZEN";

  const token =
    window.localStorage.getItem("token") ||
    process.env[`REACT_APP_${userType}_TOKEN`];

  const citizenInfo = window.localStorage.getItem("Citizen.user-info");
  const citizenTenantId =
    window.localStorage.getItem("Citizen.tenant-id") || stateCode;
  const employeeInfo = window.localStorage.getItem("Employee.user-info");
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");

  const userTypeInfo =
    userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
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
  window.Digit.ComponentRegistryService.setupRegistry({});
  initCoreComponents();

  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: UICustomizations,
  };
};

// Initialize libraries and start the app
initLibraries().then(() => {
  initDigitUI();
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MainApp />
      </QueryClientProvider>
    </BrowserRouter>
  );
});

const MainApp = () => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;

  useEffect(() => {
    if (!stateCode) return;

    initTokens(stateCode);
    setLoaded(true);
  }, [stateCode]);

  useEffect(() => {
    initLibraries().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!stateCode) {
    return <h1>StateCode is not defined</h1>;
  }

  if (!loaded || !isReady) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DigitUILazy
        stateCode={stateCode}
        enabledModules={enabledModules}
        moduleReducers={moduleReducers}
        // defaultLanding="employee"
      />
    </Suspense>
  );
};
