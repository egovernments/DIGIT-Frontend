// // // import React from 'react';
// // // import ReactDOM from 'react-dom';
// // // import { initLibraries } from "@egovernments/digit-ui-libraries";
// // // //import "./index.css";
// // // import App from './App';
// // // import { TLCustomisations } from './Customisations/tl/TLCustomisation';

// // // initLibraries();


// // // window.Digit.Customizations = { PGR: {} ,TL:TLCustomisations};

// // // const user = window.Digit.SessionStorage.get("User");

// // // if (!user || !user.access_token || !user.info) {
// // //   // login detection

// // //   const parseValue = (value) => {
// // //     try {
// // //       return JSON.parse(value)
// // //     } catch (e) {
// // //       return value
// // //     }
// // //   }

// // //   const getFromStorage = (key) => {
// // //     const value = window.localStorage.getItem(key);
// // //     return value && value !== "undefined" ? parseValue(value) : null;
// // //   }

// // //   const token = getFromStorage("token")

// // //   const citizenToken = getFromStorage("Citizen.token")
// // //   const citizenInfo = getFromStorage("Citizen.user-info")
// // //   const citizenTenantId = getFromStorage("Citizen.tenant-id")

// // //   const employeeToken = getFromStorage("Employee.token")
// // //   const employeeInfo = getFromStorage("Employee.user-info")
// // //   const employeeTenantId = getFromStorage("Employee.tenant-id")
// // //   const userType = token === citizenToken ? "citizen" : "employee";

// // //   window.Digit.SessionStorage.set("user_type", userType);
// // //   window.Digit.SessionStorage.set("userType", userType);

// // //   const getUserDetails = (access_token, info) => ({ token: access_token, access_token, info })

// // //   const userDetails = userType === "citizen" ? getUserDetails(citizenToken, citizenInfo) : getUserDetails(employeeToken, employeeInfo)

// // //   window.Digit.SessionStorage.set("User", userDetails);
// // //   window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
// // //   window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
// // //   // end
// // // }

// // // ReactDOM.render(
// // //   <React.StrictMode>
// // //     <App />
// // //   </React.StrictMode>,
// // //   document.getElementById('root')
// // // );

// import React, { useEffect, useState, lazy, Suspense } from "react";
// import ReactDOM from "react-dom/client"; // Use createRoot from React 18
// import { initGlobalConfigs } from "./globalConfig";
// // import {initAssignmentComponents} from "@egovernments/digit-ui-module-assignment"
// // import {initWorkbenchComponents} from "@egovernments/digit-ui-module-workbench"
// // import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Hooks } from "@egovernments/digit-ui-libraries";

// // Ensure Digit is defined before using it
// window.Digit = window.Digit || {};
// window.Digit.Hooks = Hooks; 
// const queryClient = new QueryClient();
// const DigitUILazy = lazy(() =>
//   import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI }))
// );import { initLibraries } from "@egovernments/digit-ui-libraries";

// const enabledModules = ["assignment", "HRMS", "Workbench"];

// const initTokens = (stateCode) => {
//   console.log(window.globalConfigs, "window.globalConfigs");

//   const userType =
//     window.sessionStorage.getItem("userType") ||
//     process.env.REACT_APP_USER_TYPE ||
//     "CITIZEN";
//   const token =
//     window.localStorage.getItem("token") ||
//     process.env[`REACT_APP_${userType}_TOKEN`];

//   const citizenInfo = window.localStorage.getItem("Citizen.user-info");
//   const citizenTenantId =
//     window.localStorage.getItem("Citizen.tenant-id") || stateCode;
//   const employeeInfo = window.localStorage.getItem("Employee.user-info");
//   const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");

//   const userTypeInfo =
//     userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
//   window.Digit.SessionStorage.set("user_type", userTypeInfo);
//   window.Digit.SessionStorage.set("userType", userTypeInfo);

//   if (userType !== "CITIZEN") {
//     window.Digit.SessionStorage.set("User", {
//       access_token: token,
//       info: userType !== "CITIZEN" ? JSON.parse(employeeInfo) : citizenInfo,
//     });
//   }

//   window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

//   if (employeeTenantId && employeeTenantId.length) {
//     window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
//   }
// };

// const initDigitUI = () => {
//   initGlobalConfigs(); // Ensure global configs are set first
//   // console.log("initWorkbenchComponents", initWorkbenchComponents)
//   // initWorkbenchComponents();
//   window.contextPath =
//   window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";

//   const stateCode = Digit?.ULBService?.getStateId();

//   const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ React 18 uses createRoot()
//   root.render(

//       <MainApp stateCode={stateCode} enabledModules={enabledModules} />
//     );
// };

// initLibraries().then(()=>{
//   initDigitUI();
// })

// // const MainApp = ({ stateCode, enabledModules }) => {
// //   const [isReady, setIsReady] = useState(false);
// //   const [loaded, setLoaded] = useState(false);



// //   useEffect(() => {

// //     initLibraries().then(() => {
// //       console.log(Digit,window?.Digit);
// //       // initAssignmentComponents();

// //       setIsReady(true)
// //     });
// //     // initWorkbenchComponents();

// //   }, []);

// //   useEffect(() => {
// //     initTokens(stateCode);
// //      setLoaded(true);
// //   }, [stateCode,isReady]);

// //   if (!loaded) {
// //     return <div>Loading...</div>;
// //   }

// //   return (
// //     <Suspense fallback={<div>Loading...</div>}>
// //     {window.Digit && (
// //       <QueryClientProvider client={queryClient}><DigitUILazy
// //         stateCode={stateCode}
// //         enabledModules={enabledModules}
// //         defaultLanding="home"
// //       /></QueryClientProvider>
// //     )}
// //   </Suspense>
// //   );
// // };

// // // Start the app
// // initDigitUI();


// // import React from "react";
// // import ReactDOM from "react-dom";
// // import { initLibraries } from "@egovernments/digit-ui-libraries";
// // import { DigitUI } from "@egovernments/digit-ui-module-core";
// // // import {initWorkbenchComponents} from "@egovernments/digit-ui-module-workbench";

// // var Digit = window.Digit || {};

// // const enabledModules = [ 
// // ];

// // const initTokens = (stateCode) => {
// //   const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";
// //   const token = window.localStorage.getItem("token") || process.env[`REACT_APP_${userType}_TOKEN`];
// //   const citizenInfo = window.localStorage.getItem("Citizen.user-info");
// //   const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || stateCode;
// //   const employeeInfo = window.localStorage.getItem("Employee.user-info");
// //   const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");
// //   const userTypeInfo = userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";

// //   window.Digit.SessionStorage.set("user_type", userTypeInfo);
// //   window.Digit.SessionStorage.set("userType", userTypeInfo);

// //   if (userType !== "CITIZEN") {
// //     window.Digit.SessionStorage.set("User", { access_token: token, info: userType !== "CITIZEN" ? JSON.parse(employeeInfo) : citizenInfo });
// //   } else {
// //     // if (!window.Digit.SessionStorage.get("User")?.extraRoleInfo) window.Digit.SessionStorage.set("User", { access_token: token, info: citizenInfo });
// //   }

// //   window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

// //   if (employeeTenantId && employeeTenantId.length) window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
// // };

// // const initDigitUI = () => {
// //   window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
// //   // initWorkbenchComponents();

// //   const moduleReducers = (initData) =>  ({
// //   });

// //   const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
// //   initTokens(stateCode);

// //   const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ React 18 uses createRoot()
// //   root.render(<DigitUI stateCode={stateCode} enabledModules={enabledModules} defaultLanding="employee" moduleReducers={moduleReducers} />);
// // };

// // initLibraries().then(() => {
// //   initDigitUI();
// // });

// // import React from "react";
// // import ReactDOM from "react-dom/client";
// // import App from "./App"; // Import the wrapper component
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// // const root = ReactDOM.createRoot(document.getElementById("root"));
// // const queryClient = new QueryClient();

// // root.render(
// //   <React.StrictMode>
// //     <QueryClientProvider client={queryClient}>
// //       <App />
// //     </QueryClientProvider>
// //   </React.StrictMode>
// // );

import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client"; // Use createRoot from React 18
import { initGlobalConfigs } from "./globalConfig";
// import {initAssignmentComponents} from "@egovernments/digit-ui-module-assignment"
// import {initWorkbenchComponents} from "@egovernments/digit-ui-module-workbench"
// import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Hooks } from "@egovernments/digit-ui-libraries";
import { initI18n } from "@egovernments/digit-ui-libraries";
import { initSampleComponents } from "@egovernments/digit-ui-module-sample";

// Ensure Digit is defined before using it
window.Digit = window.Digit || {};
window.Digit.Hooks = Hooks;
const queryClient = new QueryClient();
const DigitUILazy = lazy(() =>
  import("@egovernments/digit-ui-module-core").then((module) => ({ default: module.DigitUI }))
);

import { initLibraries } from "@egovernments/digit-ui-libraries";

const enabledModules = ["assignment", "HRMS", "Workbench","Utilities"];

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
  // console.log("initWorkbenchComponents", initWorkbenchComponents)
  // initWorkbenchComponents();
  window.contextPath =
    window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";

  // const stateCode = Digit?.ULBService?.getStateId();
  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "mz"

  const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ React 18 uses createRoot()
  root.render(
    <QueryClientProvider client={queryClient}>
      <MainApp stateCode={stateCode} enabledModules={enabledModules} />
    </QueryClientProvider>
  );
};

const MainApp = ({ stateCode, enabledModules }) => {
  const [isReady, setIsReady] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // const initAllModules = ()=>{
  //   initWorkbenchComponents();
  // }

  useEffect(() => {

    initLibraries().then(() => {
      console.log(Digit, window?.Digit);
      // initAssignmentComponents();
      // initWorkbenchComponents();
      initSampleComponents();

      setIsReady(true)
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
        <DigitUILazy
          stateCode={stateCode}
          enabledModules={enabledModules}
          defaultLanding="employee"
        />
      )}
    </Suspense>
  );
};

// Start the app
initDigitUI();