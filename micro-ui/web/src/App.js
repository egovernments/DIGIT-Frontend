import React, { useState, useEffect } from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import {
  paymentConfigs,
  PaymentLinks,
  PaymentModule,
} from "@egovernments/digit-ui-module-common";
import {
  initPGRComponents,
  PGRReducers,
} from "@egovernments/digit-ui-module-pgr";
import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { UICustomizations } from "./Customisations/UICustomizations";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";

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

const moduleReducers = (initData) => ({
  initData, 
  pgr: PGRReducers(initData),
});

function App() {
  const [DigitUI, setDigitUI] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initDigitUI = async () => {
      try {
        // First initialize libraries
        await initLibraries();
        
        // Then import and initialize core components
        const { DigitUI: DigitUIComponent, initCoreComponents } = await import("@egovernments/digit-ui-module-core");
        
        // Setup registry
        window.Digit.ComponentRegistryService.setupRegistry({
          PaymentModule,
          ...paymentConfigs,
          PaymentLinks,
        });
        
        // Initialize all components
        initPGRComponents();
        initCoreComponents();
        initDSSComponents();
        initHRMSComponents();
        initEngagementComponents();
        initUtilitiesComponents();
        initWorkbenchComponents();

        // Set customizations
        window.Digit.Customizations = {
          PGR: {},
          commonUiConfig: UICustomizations,
        };
        
        // Set the DigitUI component
        setDigitUI(() => DigitUIComponent);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize DigitUI:", error);
        setIsInitialized(true); // Set to true even on error to show error message
      }
    };

    initDigitUI();
  }, []);

  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;

  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!DigitUI) {
    return <h1>Failed to load DigitUI component</h1>;
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