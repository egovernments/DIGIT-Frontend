import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { DigitUI } from "@egovernments/digit-ui-module-core";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initPGRComponents } from "@egovernments/digit-ui-module-pgr";
import {PGRReducers} from "@egovernments/digit-ui-module-pgr";
import { UICustomizations } from "./Customisations/UICustomizations";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { pgrCustomizations,pgrComponents } from "./pgr";
window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  "HRMS",
  "Engagement",
  "Workbench",
  "PGR"
];



const initDigitUI = () => {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  window.Digit.Customizations = {
    PGR: pgrCustomizations,
    commonUiConfig: UICustomizations
  };

window?.Digit.ComponentRegistryService.setupRegistry({
    ...pgrComponents,
   
  });
  initCoreComponents();
  initDSSComponents();
  initHRMSComponents();
  initEngagementComponents();
  initUtilitiesComponents();
  initWorkbenchComponents();
  initPGRComponents();
  initLibraries().then(() => {
  initDigitUI();
});
const moduleReducers = (initData) =>  ({
    pgr: PGRReducers(initData),
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
    />
  );
}

export default App;
