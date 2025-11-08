import React from "react";
import ReactDOM from "react-dom";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { UICustomizations } from "./Customisations/UICustomizations";
import { initPublicServiceComponents } from "@egovernments/digit-ui-module-public-services";
import { initOpenPaymentComponents } from "@egovernments/digit-ui-module-open-payment";
import { initServiceDesignerComponents } from "@egovernments/digit-ui-module-service-designer";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";
import "@egovernments/digit-ui-sample-css/example/index.css";
import "./index.css";

window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  // "HRMS",
  "Engagement",
  "Workbench",
  "HCMWORKBENCH",
  "PublicServices",
  "OpenPayment",
  "ServiceDesigner",
  "HRMS"

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
  initPublicServiceComponents();
  initOpenPaymentComponents();
  initServiceDesignerComponents();
  initHRMSComponents();
  initWorkbenchComponents();
};

// First, initialize libraries
initLibraries().then(() => {
  initDigitUI();

  // Dynamically import DigitUI and render
  import("@egovernments/digit-ui-module-core").then(({ DigitUI }) => {
    const stateCode =
      window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
      process.env.REACT_APP_STATE_LEVEL_TENANT_ID;

    if (!stateCode) {
      ReactDOM.render(<h1>stateCode is not defined</h1>, document.getElementById("root"));
      return;
    }

    ReactDOM.render(
      <DigitUI
        stateCode={stateCode}
        enabledModules={enabledModules}
        moduleReducers={moduleReducers}
        defaultLanding="employee"
      />,
      document.getElementById("root")
    );
  });
});
