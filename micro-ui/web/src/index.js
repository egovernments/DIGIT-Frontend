// import React from 'react';
// import ReactDOM from 'react-dom';
// import { initLibraries } from "@egovernments/digit-ui-libraries";
// import "./index.css";
// import App from './App';
// import { TLCustomisations } from './Customisations/tl/TLCustomisation';


// initLibraries();


// window.Digit.Customizations = { PGR: {} ,TL:TLCustomisations};

// const user = window.Digit.SessionStorage.get("User");

// if (!user || !user.access_token || !user.info) {
//   // login detection

//   const parseValue = (value) => {
//     try {
//       return JSON.parse(value)
//     } catch (e) {
//       return value
//     }
//   }

//   const getFromStorage = (key) => {
//     const value = window.localStorage.getItem(key);
//     return value && value !== "undefined" ? parseValue(value) : null;
//   }

//   const token = getFromStorage("token")

//   const citizenToken = getFromStorage("Citizen.token")
//   const citizenInfo = getFromStorage("Citizen.user-info")
//   const citizenTenantId = getFromStorage("Citizen.tenant-id")

//   const employeeToken = getFromStorage("Employee.token")
//   const employeeInfo = getFromStorage("Employee.user-info")
//   const employeeTenantId = getFromStorage("Employee.tenant-id")
//   const userType = token === citizenToken ? "citizen" : "employee";

//   window.Digit.SessionStorage.set("user_type", userType);
//   window.Digit.SessionStorage.set("userType", userType);

//   const getUserDetails = (access_token, info) => ({ token: access_token, access_token, info })

//   const userDetails = userType === "citizen" ? getUserDetails(citizenToken, citizenInfo) : getUserDetails(employeeToken, employeeInfo)

//   window.Digit.SessionStorage.set("User", userDetails);
//   window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
//   window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
//   // end
// }

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

import React from "react";
import ReactDOM from "react-dom";
import { PGRReducers } from "@egovernments/digit-ui-module-pgr";
import { initLibraries } from "@egovernments/digit-ui-libraries";
// import { paymentConfigs, PaymentLinks, PaymentModule } from "@egovernments/digit-ui-module-common"
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";
import { initPGRComponents } from "@egovernments/digit-ui-module-pgr";
import { initOpenPaymentComponents } from "@egovernments/digit-ui-module-open-payment";

import "@egovernments/digit-ui-css/example/index.css";

// import { pgrCustomizations, overrideComponents } from "./pgr";
import { UICustomizations } from "./Customisations/UICustomizations";

var Digit = window.Digit || {};

const enabledModules = [
  "DSS",
  "HRMS",
  "Workbench",
  "Utilities",
  "PGR",
  "FSM",
  "Sandbox",
  "OpenPayment",
];

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
    window.Digit.SessionStorage.set("User", { access_token: token, info: userType !== "CITIZEN" ? JSON.parse(employeeInfo) : citizenInfo });
  } else {
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

  if (employeeTenantId && employeeTenantId.length) window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
};

const initDigitUI = async() => {
  const { DigitUI, initCoreComponents } = await import("@egovernments/digit-ui-module-core");
  const isMultiRootTenant = window?.globalConfigs?.getConfig("MULTI_ROOT_TENANT") || false;

  if (isMultiRootTenant) {
    const pathname = window.location.pathname;
    const context = window?.globalConfigs?.getConfig("CONTEXT_PATH");
    const start = pathname.indexOf(context) + context.length + 1;
    const employeeIndex = pathname.indexOf("employee");
    const citizenIndex = pathname.indexOf("citizen");
    const end = (employeeIndex !== -1) ? employeeIndex : (citizenIndex !== -1) ? citizenIndex : -1;
    const tenant = end > start ? pathname.substring(start, end).replace(/\/$/, "") : "";
    window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") + `${tenant ? `/${tenant}` : ""}` || "digit-ui";
    window.globalPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  } else {
    window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  }

  window.Digit.Customizations = {
    // PGR: pgrCustomizations,
    commonUiConfig: UICustomizations,
  };
  initEngagementComponents();

  window?.Digit.ComponentRegistryService.setupRegistry({
    ...overrideComponents,
  
  });
  initCoreComponents();
  initDSSComponents();
  initHRMSComponents();
  initUtilitiesComponents();
  initWorkbenchComponents();
  initPGRComponents();
  initOpenPaymentComponents();

  const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  initTokens(stateCode);

  ReactDOM.render(
    <DigitUI
      stateCode={stateCode}
      enabledModules={enabledModules}
      defaultLanding="employee"
      allowedUserTypes={["employee","citizen"]}
      moduleReducers={moduleReducers}
    />,
    document.getElementById("root")
  );
};

initLibraries().then(() => {
  initDigitUI();
});


// import React from "react";
// import ReactDOM from "react-dom";

// Simple test component to verify React is working
// const TestApp = () => {
//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1>React is working! 🎉</h1>
//       <p>If you can see this, the basic setup is correct.</p>
//       <p>Current time: {new Date().toLocaleTimeString()}</p>
//     </div>
//   );
// };

// // Basic render to test
// ReactDOM.render(
//   <React.StrictMode>
//     <TestApp />
//   </React.StrictMode>,
//   document.getElementById('root')
// );