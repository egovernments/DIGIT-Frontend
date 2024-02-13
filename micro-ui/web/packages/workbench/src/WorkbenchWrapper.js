import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { DigitUI } from "@digit-ui/digit-ui-module-core-base";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { initWorkbenchComponents } from "./Module";
import { QueryClientProvider } from "react-query";


// initLibraries().then(() => {
//   initDigitUI();
// });
// initWorkbenchComponents();

const App = ({queryClient,title}) => {
  debugger
  initLibraries().then(() => {
    initDigitUI();
  });
  initWorkbenchComponents();
  debugger
//   const moduleReducers = (initData) => {};
//   const enabledModules = ["PT", "Workbench"];
//   const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
//   
  return (
    <QueryClientProvider client={queryClient}>
      {/* <DigitUI stateCode={stateCode} moduleReducers={moduleReducers} enabledModules={enabledModules} client={queryClient} /> */}
      <div> Running Workbench </div>
    </QueryClientProvider>
  );
};

const initDigitUI = () => {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  window.Digit.Customizations = {

  };
  window?.Digit.ComponentRegistryService.setupRegistry({
    // PaymentModule,
    // ...paymentConfigs,
    // PaymentLinks,
  });

 // initHRMSComponents();
  const enabledModules=["PT"]

  const moduleReducers = (initData) => initData;

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  // initTokens(stateCode);

  // return (<DigitUI stateCode={stateCode} enabledModules={enabledModules}       defaultLanding="employee"  moduleReducers={moduleReducers} />);
};

// if (process.env.NODE_ENV === "development") {
//   const rootNode = document.querySelector("#workbench-module-root");

//   if (rootNode) {
//     mount(rootNode, {
//       history: createBrowserHistory(),
//       login: () => {},
//     });
//   }
// }

// const initDigitUI = () => {
//   window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
//   window.Digit.Customizations = {

//   };
//   window?.Digit.ComponentRegistryService.setupRegistry({
//     // PaymentModule,
//     // ...paymentConfigs,
//     // PaymentLinks,
//   });

//  // initHRMSComponents();
//   const enabledModules=["PT"]

//   const moduleReducers = (initData) => initData;

//   const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
//   // initTokens(stateCode);

//   // return (<DigitUI stateCode={stateCode} enabledModules={enabledModules}       defaultLanding="employee"  moduleReducers={moduleReducers} />);
// };

// export { mount };
export default App;