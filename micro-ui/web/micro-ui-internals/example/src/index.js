import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Hooks } from "@egovernments/digit-ui-libraries";

import { initLibraries } from "@egovernments/digit-ui-libraries";

// Import optimized component initialization methods
window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;

// Lazy load DigitUI with optimized initialization methods
const DigitUILazy = lazy(() => 
  import("@egovernments/digit-ui-module-core").then((module) => ({ 
    default: module.DigitUI,
    initCoreComponents: module.initCoreComponents,
    initCriticalComponents: module.initCriticalComponents
  }))
);


const enabledModules = ["assignment", "HRMS", "Workbench", "Utilities","Campaign"];

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
  const [coreReady, setCoreReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Phase 1: Initialize libraries and critical core components
  useEffect(() => {
    const initializeCriticalComponents = async () => {
      try {
        // Initialize libraries first
        await initLibraries();
        
        // Initialize critical components immediately for faster initial load
        const coreModule = await import("@egovernments/digit-ui-module-core");
        if (coreModule.initCriticalComponents) {
          coreModule.initCriticalComponents();
          console.log("✅ Critical core components initialized");
        }
        
        setIsReady(true);
      } catch (error) {
        console.error("❌ Failed to initialize critical components:", error);
        setIsReady(true); // Continue anyway
      }
    };

    initializeCriticalComponents();
  }, []);

  // Phase 2: Initialize remaining core components and user tokens
  useEffect(() => {
    if (isReady) {
      const initializeRemainingComponents = async () => {
        try {
          // Initialize user tokens
          initTokens(stateCode);
          
          // Initialize remaining core components (lazy loaded)
          const coreModule = await import("@egovernments/digit-ui-module-core");
          if (coreModule.initCoreComponents) {
            coreModule.initCoreComponents();
            console.log("✅ All core components initialized");
          }
          
          setCoreReady(true);
          setLoaded(true);
        } catch (error) {
          console.error("❌ Failed to initialize core components:", error);
          setLoaded(true); // Continue anyway
        }
      };

      initializeRemainingComponents();
    }
  }, [stateCode, isReady]);

  if (!loaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>Loading DIGIT UI...</div>
        {isReady && <div style={{ fontSize: '0.8rem', color: '#666' }}>
          Initializing components...
        </div>}
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading Application...
      </div>
    }>
      {window.Digit && coreReady && (
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
