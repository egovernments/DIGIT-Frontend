import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";

import { DigitUI } from "@egovernments/digit-ui-module-core";

import { UICustomizations } from "./Customisations/UICustomizations";
import { initMicroplanningComponents } from "@egovernments/digit-ui-module-hcmmicroplanning";
import { initMicroplanComponents } from "@egovernments/digit-ui-module-microplan";
import { initCampaignComponents } from "@egovernments/digit-ui-module-campaign-manager";
// import { initDSSComponents } from "@egovernments/digit-ui-module-health-dss";

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

  initCampaignComponents();
  initMicroplanningComponents()
  initMicroplanComponents();
  // initDSSComponents();

  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: {...UICustomizations,HCM_MODULE_NAME:"microplan"},
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
