import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import { initLibraries } from "@egovernments/digit-ui-libraries";

import { Loader } from "@egovernments/digit-ui-components";
import { UICustomizations } from "./UICustomizations";
import "@egovernments/digit-ui-urban-css/example/index.css";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { initPropertyTaxComponents } from "@egovernments/digit-ui-module-pt";
import { initBirthComponents } from "@egovernments/digit-ui-module-birth";
import { initDeathComponents } from "@egovernments/digit-ui-module-death";
import { initFirenocComponents } from "@egovernments/digit-ui-module-firenoc";
import { initTLComponents } from "@egovernments/digit-ui-module-tl";
import { initWSComponents } from "@egovernments/digit-ui-module-ws";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initPGRComponents } from "@egovernments/digit-ui-module-pgr";
import { initReceiptsComponents } from "@egovernments/digit-ui-module-receipts";

var Digit = window.Digit || {};

// Lazy load DigitUI
const DigitUI = React.lazy(() =>
  import("@egovernments/digit-ui-module-core").then((mod) => ({
    default: mod.DigitUI,
  }))
);
const enabledModules = [
  "PT",
  "Birth",
  "Death",
  "FIRENOC",
  "TL",
  "WS",
  "HRMS",
  "PGR",
  "RECEIPTS",
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

const initDigitUI = () => {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "mSeva-ui" || "digit-ui";
  window.Digit.Customizations = {
    commonUiConfig: UICustomizations
  };
  window?.Digit.ComponentRegistryService.setupRegistry({
  });
  initUtilitiesComponents();
  initPropertyTaxComponents();
  initBirthComponents();
  initDeathComponents();
  initFirenocComponents();
  initTLComponents();
  initHRMSComponents();
  initPGRComponents();
  initWSComponents();
  initReceiptsComponents();

  const moduleReducers = (initData) => initData;


  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  initTokens(stateCode);

  ReactDOM.render(<Suspense fallback={<Loader page={true} variant={"PageLoader"} />}>
    <DigitUI stateCode={stateCode} enabledModules={enabledModules} defaultLanding="employee" moduleReducers={moduleReducers} />
  </Suspense>, document.getElementById("root"));
};

initLibraries().then(() => {
  initDigitUI();
});