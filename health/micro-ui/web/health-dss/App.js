import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";

import { DigitUI } from "@egovernments/digit-ui-module-core";

import { UICustomizations } from "./Customisations/UICustomizations";
import { initDSSComponents } from "@egovernments/digit-ui-module-health-dss";

window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  "HRMS",
  "Engagement",
  "Workbench",
  "Microplanning",
  "Microplan",
  "Campaign"
];

const moduleReducers = (initData) => ({
  initData,
});

const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({
    
  });

  // core@1.9.x doesn't register EmployeeSSOLoginOptions; register a stub so
  // FormComposerV2 doesn't crash with React error #130 when the MDMS login
  // config includes that field.
  if (!Digit.ComponentRegistryService?.getComponent("EmployeeSSOLoginOptions")) {
    Digit.ComponentRegistryService.setComponent("EmployeeSSOLoginOptions", () => null);
  }
  // Fallback for useSSOConfig in case libraries version doesn't export it.
  if (!Digit.Hooks?.useSSOConfig) {
    Digit.Hooks.useSSOConfig = () => ({ data: [], isLoading: false });
  }


  initDSSComponents();

  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: {...UICustomizations,HCM_MODULE_NAME:"health-dss"},
  };
};

initLibraries().then(() => {
  initDigitUI();
});

function App() {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
  return (
    <DigitUI
    stateCode={stateCode}
    enabledModules={enabledModules}
    moduleReducers={moduleReducers}
    defaultLanding="employee"
    allowedUserTypes={["employee"]}
  />
  );
}

export default App;
