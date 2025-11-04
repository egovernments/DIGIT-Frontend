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
import { UICustomizations } from "./Customizations/UICustomizations";
import { initPropertyTaxComponents } from "@egovernments/digit-ui-module-pt";
import { initBirthComponents } from "@egovernments/digit-ui-module-birth";
import { initDeathComponents } from "@egovernments/digit-ui-module-death";
import { initFirenocComponents } from "@egovernments/digit-ui-module-firenoc";
import { initTLComponents } from "@egovernments/digit-ui-module-tl";
import { initWSComponents } from "@egovernments/digit-ui-module-ws";
import { Loader } from "@egovernments/digit-ui-components";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
import { initReceiptsComponents } from "@egovernments/digit-ui-module-receipts";
import { initPGRComponents } from "@egovernments/digit-ui-module-pgr";
import { initBillsComponents } from "@egovernments/digit-ui-module-bills";
import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
import { initFinanceComponents } from "@egovernments/digit-ui-module-finance";

window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

// Lazy load DigitUI
const DigitUI = React.lazy(() =>
  import("@egovernments/digit-ui-module-core").then((mod) => ({
    default: mod.DigitUI,
  }))
);

const enabledModules = [
  "PT",
  "Birth",
  "Death",
  "FireNOC",
  "TL",
  "HRMS",
  "WS",
  "RECEIPTS",
  "PGR",
  "Bills",
  "BillAmendement",
  "Engagement",
  "Finance"
];

initLibraries().then(() => {
  initDigitUI();
});

const moduleReducers = (initData) => ({
  initData,
});

const initDigitUI = () => {
  window.Digit.ComponentRegistryService.setupRegistry({});
  window.Digit.Customizations = {
    commonUiConfig: UICustomizations,
  };

  initPropertyTaxComponents();
  initBirthComponents();
  initDeathComponents();
  initFirenocComponents();
  initTLComponents();
  initWSComponents();
  initHRMSComponents();
  initReceiptsComponents();
  initPGRComponents();
  initBillsComponents();
  initEngagementComponents();
  initFinanceComponents();
};

function App() {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
  return (
    <Suspense fallback={<Loader page={true} variant={"PageLoader"} />}>
      <DigitUI
        stateCode={stateCode}
        enabledModules={enabledModules}
        moduleReducers={moduleReducers}
        defaultLanding="employee"
        // allowedUserTypes={["employee"]}
      />
    </Suspense>
  );
}

export default App;