/**
 * The above code initializes various Digit UI modules and components, sets up customizations, and
 * renders the DigitUI component based on the enabled modules and state code.
 * @returns The `App` component is being returned, which renders the `DigitUI` component with the
 * specified props such as `stateCode`, `enabledModules`, `moduleReducers`, and `defaultLanding`. The
 * `DigitUI` component is responsible for rendering the UI based on the provided configuration and
 * modules.
 */
import React, { Suspense } from "react";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import { Loader } from "@egovernments/digit-ui-components";
import { UICustomizations } from "./Customisations/UICustomizations";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";
import { initCampaignComponents } from "@egovernments/digit-ui-module-campaign-manager";
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { initWorkbenchHCMComponents } from "@egovernments/digit-ui-module-hcmworkbench";


window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

const enabledModules = [
  "DSS",
  "NDSS",
  "Utilities",
  // "HRMS",
  "Engagement",
  "Workbench",
  "HCMWORKBENCH",
  "Campaign"
];
const HCM_MODULE_NAME = "campaign";
export const OverrideUICustomizations = {
  HCM_MODULE_NAME,
}
// Lazy load DigitUI
const DigitUI = React.lazy(() =>
  import("@egovernments/digit-ui-module-core").then((mod) => ({
    default: mod.DigitUI,
  }))
);

const setupLibraries = (Library, service, method) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = method;
};
/* To Overide any existing config/middlewares  we need to use similar method */
const updateCustomConfigs = () => {
  setupLibraries("Customizations", "commonUiConfig", { ...window?.Digit?.Customizations?.commonUiConfig, ...OverrideUICustomizations });
};

let initializationError = null;

const handleInitError = (error) => {
  console.error('Failed to initialize libraries:', error);
  initializationError = error;
};

const initDigitUI = () => {

  try {
    window.Digit.ComponentRegistryService.setupRegistry({});
    window.Digit.Customizations = {
      PGR: {},
      commonUiConfig: UICustomizations,
    };
    // initHRMSComponents();
    initUtilitiesComponents();
    initWorkbenchComponents();
    initWorkbenchHCMComponents();
    initCampaignComponents();
    updateCustomConfigs();
  } catch (error) {
    console.error('Failed to initialize DigitUI:', error);
    // Consider showing a user-friendly error message
  }
};

initLibraries().then(() => {
  initDigitUI();
}).catch(handleInitError);

const moduleReducers = (initData) => ({
  initData,
});


function App() {

  const [stateCode, setStateCode] = React.useState(null);

  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    // Add any necessary initialization checks here
    window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");
    const code =
      window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
      process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
    setStateCode(code);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  // Consider adding this to your App component:
  if (initializationError) {
    return <div>Failed to initialize application. Please refresh the page.</div>;
  }
  if (!stateCode) {
    return (
      <div className="error-container">
        <h1>Configuration Error</h1>
        <p>State code is not defined. Please check your configuration.</p>
      </div>
    );
  }
  return (
    <Suspense fallback={<Loader page={true} variant={"PageLoader"} />}>
      <DigitUI
        stateCode={stateCode}
        enabledModules={enabledModules}
        moduleReducers={moduleReducers}
        defaultLanding="employee"
        allowedUserTypes={["employee"]}
      />
    </Suspense>
  );
}

export default App;
