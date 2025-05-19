// import React from "react";
// import { initLibraries } from "@egovernments/digit-ui-libraries";
// import {
//   paymentConfigs,
//   PaymentLinks,
//   PaymentModule,
// } from "@egovernments/digit-ui-module-common"; 
// import {
//   initPGRComponents,
//   PGRReducers,
// } from "@egovernments/digit-ui-module-pgr";
// import { DigitUI,initCoreComponents } from "@egovernments/digit-ui-module-core";
// import { initDSSComponents } from "@egovernments/digit-ui-module-dss";
// import { initEngagementComponents } from "@egovernments/digit-ui-module-engagement";
// import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";
// import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
// import { UICustomizations } from "./Customisations/UICustomizations";
// import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";

// window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");

// const enabledModules = [
//   "DSS",
//   "NDSS",
//   "Utilities",
//   "HRMS",
//   "Engagement",
//   // "Workbench",
//   "PGR"
// ];

// const moduleReducers = (initData) => ({
//   initData, pgr: PGRReducers(initData),
// });

// const initDigitUI = () => {
//   window.Digit.ComponentRegistryService.setupRegistry({
//     PaymentModule,
//     ...paymentConfigs,
//     PaymentLinks,
//   });
//   initPGRComponents();
//   initCoreComponents();
//   initDSSComponents();
//   initHRMSComponents();
//   initEngagementComponents();
//   initUtilitiesComponents();
//   initWorkbenchComponents();

//   window.Digit.Customizations = {
//     PGR: {},
//     commonUiConfig: UICustomizations,
//   };
// };

// initLibraries().then(() => {
//   initDigitUI();
// });

// function App() {
//   window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH");
//   const stateCode =
//     window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
//     process.env.REACT_APP_STATE_LEVEL_TENANT_ID;
//   if (!stateCode) {
//     return <h1>stateCode is not defined</h1>;
//   }
//   return (
//     <DigitUI
//       stateCode={stateCode}
//       enabledModules={enabledModules}
//       moduleReducers={moduleReducers}
//       // defaultLanding="employee"
//     />
//   );
// }

// export default App;

// import React from 'react'
// import { initLibraries } from "@egovernments/digit-ui-libraries";


// const App = () => {
//   initLibraries().then(() => {
//       initDigitUI();
//     });
//   return (
//     <div><NewApp/></div>
//   )
// }

// export default App

import React, {Suspense} from "react";
import {initGlobalConfigs} from "./globalConfig"; // adjust if needed
import { initLibraries } from "@egovernments/digit-ui-libraries";

const App = () => {
  initGlobalConfigs();

  return <DigitAppWrapper />;
};

const DigitAppWrapper = () => {
  const [DigitUIComponent, setDigitUIComponent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadApp = async () => {
      await initLibraries();

      const module = await import("@egovernments/digit-ui-module-core");
      const DigitUI = module?.DigitUI || module?.default;

      setDigitUIComponent(() => DigitUI);
      setLoading(false);
    };

    loadApp();
  }, []);

  if (loading || !DigitUIComponent) {
    return <div>Loading App...</div>;
  }

  return (
    <DigitUIComponent
      stateCode="pb"
      enabledModules={[]}
      defaultLanding="employee"
      moduleReducers={{}}
    />
  );
};

export default App;