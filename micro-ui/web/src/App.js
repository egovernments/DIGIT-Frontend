import React from "react";
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
// import { DigitUI,initCoreComponents } from "@egovernments/digit-ui-module-core";
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
  // "Workbench",
  "PGR"
];

const moduleReducers = (initData) => ({
  initData, pgr: PGRReducers(initData),
});

const initDigitUI = async() => {
  // const { DigitUI, initCoreComponents } = await import("@egovernments/digit-ui-module-core");
  window.Digit.ComponentRegistryService.setupRegistry({
    PaymentModule,
    ...paymentConfigs,
    PaymentLinks,
  });
  initPGRComponents();
  initCoreComponents();
  initDSSComponents();
  initHRMSComponents();
  initEngagementComponents();
  initUtilitiesComponents();
  initWorkbenchComponents();

  window.Digit.Customizations = {
    PGR: {},
    commonUiConfig: UICustomizations,
  };
};

const LazyDigitUI = lazy(() => import("@egovernments/digit-ui-module-core").then(m => ({ default: m.DigitUI })));

function App() {
  const [libsReady, setLibsReady] = useState(false);

  useEffect(() => {
    initLibraries().then(() => setLibsReady(true));
  }, []);
  if (!libsReady) return <h1>Loading...</h1>;
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
  return (
    <Suspense fallback={<h2>Loading Digit UI...</h2>}>
      <LazyDigitUI
        stateCode={stateCode}
        enabledModules={enabledModules}
        moduleReducers={moduleReducers}
      />
    </Suspense>
  );
}

export default App;