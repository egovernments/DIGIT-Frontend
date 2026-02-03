import React from "react";
import { DigitUI, initCoreComponents } from "@egovernments/digit-ui-module-core";
import { initLibraries } from "@egovernments/digit-ui-libraries";
// import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { UICustomizations } from "./Customisations/UICustomizations";
import { initSandboxComponents } from "@egovernments/digit-ui-module-sandbox";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench"; import {
  initPGRComponents,
  PGRReducers,
} from "@egovernments/digit-ui-module-ccrs";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";

window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  "Engagement",
  "Workbench",
  "Sandbox",
  "HRMS",
  "PGR"
];

const moduleReducers = (initData) => ({
  initData, pgr: PGRReducers(initData),
});

const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({});
  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: UICustomizations,
  };
  initPGRComponents();
  initCoreComponents();
  initHRMSComponents();
  initUtilitiesComponents();
  initWorkbenchComponents();
  initSandboxComponents();
  initDSSComponents();
};

initLibraries().then(() => {
  initDigitUI();
});

function App() {
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

  const stateCode = Digit.ULBService.getStateId();
  // const stateCode =
  //   window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
  //   process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
  return (
    <DigitUI
      stateCode={stateCode}
      enabledModules={enabledModules}
      moduleReducers={moduleReducers}
    // defaultLanding="employee"
    />
  );
}

export default App;
