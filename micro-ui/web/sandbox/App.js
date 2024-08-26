import React from "react";
import { DigitUI, initCoreComponents } from "@egovernments/digit-ui-module-core";
import { initLibraries } from "@egovernments/digit-ui-libraries";
// import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { UICustomizations } from "./Customisations/UICustomizations";
import { initSandboxComponents } from "@egovernments/digit-ui-module-sandbox";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";

window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  "Engagement",
  "Workbench",
  "Sandbox"
];

const moduleReducers = (initData) => ({
  initData,
});

const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({});
  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: UICustomizations,
  };
  initCoreComponents();
  initUtilitiesComponents();
  initWorkbenchComponents();
  initSandboxComponents();
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
    const end = pathname.indexOf("employee");
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
      defaultLanding="employee"
    />
  );
}

export default App;
