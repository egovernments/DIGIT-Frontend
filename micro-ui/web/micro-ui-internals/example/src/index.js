import React from "react";
import ReactDOM from "react-dom";
import { PGRReducers } from "@egovernments/digit-ui-module-pgr";
import { initLibraries } from "@egovernments/digit-ui-libraries";
// import { paymentConfigs, PaymentLinks, PaymentModule } from "@egovernments/digit-ui-module-common";


import "@egovernments/digit-ui-css/example/index.css";

import { pgrCustomizations, overrideComponents } from "./pgr";
import { UICustomizations } from "./UICustomizations";

var Digit = window.Digit || {};

const enabledModules = [
  "DSS",
  "HRMS",
  "Workbench",
  //  "Engagement", "NDSS","QuickPayLinks", "Payment",
  "Utilities",
  "PGR",
  //added to check fsm
  // "FSM"
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
    // if (!window.Digit.SessionStorage.get("User")?.extraRoleInfo) window.Digit.SessionStorage.set("User", { access_token: token, info: citizenInfo });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

  if (employeeTenantId && employeeTenantId.length) window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
};

const initDigitUI = async () => {
  // const { DigitUI, initCoreComponents } = window.Digit;
  const { DigitUI, initCoreComponents } = await "@egovernments/digit-ui-module-core";
  const { initDSSComponents } = await "@egovernments/digit-ui-module-dss";
  const { initEngagementComponents } = await "@egovernments/digit-ui-module-engagement";
  const { initHRMSComponents } = await "@egovernments/digit-ui-module-hrms";
  const { initUtilitiesComponents } = await "@egovernments/digit-ui-module-utilities";
  const { initWorkbenchComponents } = await "@egovernments/digit-ui-module-workbench";
  const { initPGRComponents } = await "@egovernments/digit-ui-module-pgr";
  const { initOpenPaymentComponents } = await "@egovernments/digit-ui-module-open-payment";
  const { initSandboxComponents } = await "@egovernments/digit-ui-module-sandbox";
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
    PGR: pgrCustomizations,
    commonUiConfig: UICustomizations,
  };
  initEngagementComponents();

  window?.Digit.ComponentRegistryService.setupRegistry({
    ...overrideComponents,
    // PaymentModule,
    // ...paymentConfigs,
    // PaymentLinks,
  });
  initCoreComponents();
  initDSSComponents();
  initHRMSComponents();
  initUtilitiesComponents();
  initWorkbenchComponents();
  initPGRComponents();
  initOpenPaymentComponents();
  initSandboxComponents();

  const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  // const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  const stateCode = Digit.ULBService.getStateId();
  initTokens(stateCode);

  ReactDOM.render(
    <DigitUI
      stateCode={stateCode}
      enabledModules={enabledModules}
      defaultLanding="employee"
      allowedUserTypes={["employee", "citizen"]}
      moduleReducers={moduleReducers}
    />,
    document.getElementById("root")
  );
};

initLibraries().then(() => {
  initDigitUI();
});
