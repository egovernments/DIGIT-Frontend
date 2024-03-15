import React from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";

import {
  initPGRComponents,
  PGRReducers,
} from "@egovernments/digit-ui-module-pgr";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { UICustomizations } from "./Customisations/UICustomizations";
import { pgrCustomizations,pgrComponents } from "./pgr";
window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");
window.Digit.Customizations = {
  UICustomizations,pgrCustomizations
};
const enabledModules = [
  "PGR"
];

const moduleReducers = (initData) => ({
  initData,
  pgr: PGRReducers(initData),
});

const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({
    ...pgrComponents,
  });
  initPGRComponents();
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
      // defaultLanding="employee"
    />
  );
}

export default App;
