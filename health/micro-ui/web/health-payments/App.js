import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";

import { DigitUI } from "@egovernments/digit-ui-module-core";

import { UICustomizations } from "./Customisations/UICustomizations";
import { initPaymentComponents } from "@egovernments/digit-ui-module-health-payments";


const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  "HRMS",
  "Engagement",
  "Workbench",
  "Payments"
];

const moduleReducers = (initData) => ({
  initData,
});

const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({
  });

  initPaymentComponents();

  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: UICustomizations,
  };
};

initLibraries()
  .then(() => {
    initDigitUI();
  })
  .catch((error) => {
    console.error('Failed to initialize application:', error);
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
