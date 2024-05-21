import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
// import { DigitUI } from "@digit-ui/digit-ui-module-core-base";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { initWorkbenchComponents } from "./Module";
import EmployeeApp from "./pages/employee";
import { QueryClientProvider,QueryClient } from "react-query";
initLibraries()
// initDigitUI()
initWorkbenchComponents();

const mount = (el, { history, login }) => {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15 * 60 * 1000,
        cacheTime: 50 * 60 * 1000,
        retry: false,
        retryDelay: (attemptIndex) => Infinity,
        /*
          enable this to have auto retry incase of failure
          retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
         */
      },
    },
  });

  const moduleReducers = (initData) => {};
  const enabledModules = ["PT", "Workbench", "PGR", "TQM"];

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  ReactDOM.render(<QueryClientProvider client={queryClient}>
    <Router>
      <EmployeeApp path={`/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/hrms/`}/>
    </Router>
  </QueryClientProvider>, el);
};

if (process.env.NODE_ENV === "development") {
  const rootNode = document.querySelector("#workbench-module-root");

  if (rootNode) {
    mount(rootNode, {
      history: createBrowserHistory(),
      login: () => {},
    });
  }
}

// const initDigitUI = () => {
//   window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
//   window.Digit.Customizations = {};
//   window?.Digit.ComponentRegistryService.setupRegistry({
//     // PaymentModule,
//     // ...paymentConfigs,
//     // PaymentLinks,
//   });

//   // initHRMSComponents();
//   const enabledModules = ["PT", "TQM"];

//   const moduleReducers = (initData) => initData;

//   const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
//   // initTokens(stateCode);

//   // return (<DigitUI stateCode={stateCode} enabledModules={enabledModules}       defaultLanding="employee"  moduleReducers={moduleReducers} />);
// };

export { mount };
