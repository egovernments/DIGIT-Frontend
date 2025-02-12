import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client"; // Use createRoot from React 18
import { initGlobalConfigs } from "./globalConfig";

const DigitUILazy = lazy(() =>
  import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI }))
);import { initLibraries } from "@egovernments/digit-ui-libraries";

const enabledModules = ["assignment"];

const initTokens = (stateCode) => {
  console.log(window.globalConfigs, "window.globalConfigs");

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
  initGlobalConfigs(); // Ensure global configs are set first
  window.contextPath =
    window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";

  const stateCode = Digit?.ULBService?.getStateId();
  
  const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ React 18 uses createRoot()
  root.render(<MainApp stateCode={stateCode} enabledModules={enabledModules} />);
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);



  useEffect(() => {
    
      initLibraries().then(() => {
        console.log(Digit,window?.Digit);
        
        setIsReady(true)
      });
    
  }, []);

  useEffect(() => {
    initTokens(stateCode);
     setLoaded(true);
  }, [stateCode,isReady]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
    {window.Digit && (
      <DigitUILazy
        stateCode={stateCode}
        enabledModules={enabledModules}
        defaultLanding="home"
      />
    )}
  </Suspense>
  );
};

// Start the app
initDigitUI();
