// debugger
// import React from "react";
// import ReactDOM from "react-dom";
// import { createBrowserHistory } from "history";
// import { QueryClient, QueryClientProvider } from "react-query";
// import App from "./TQMWrapper";
// debugger
// //registering remote apps
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 15 * 60 * 1000,
//       cacheTime: 50 * 60 * 1000,
//       retry: false,
//       retryDelay: (attemptIndex) => Infinity,
//       /*
//         enable this to have auto retry incase of failure
//         retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
//        */
//     },
//   },
// });

// const mount = (el, { history, login }) => {
//   ReactDOM.render(
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>,
//     el
//   );
// };

// if (process.env.NODE_ENV === "development") {
//   debugger
//   const rootNode = document.querySelector("#tqm-module-root");

//   if (rootNode) {
//     mount(rootNode, {
//       history: createBrowserHistory(),
//       login: () => {},
//     });
//   }
// }

// export { mount };
debugger;
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { initTQMComponents } from "./Module";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./TQMWrapper";

initLibraries().then(() => {
  initDigitUI();
});
initTQMComponents();

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
const mount = (el, { history, login }) => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
    el
  );
};

if (process.env.NODE_ENV === "development") {
  debugger
  const rootNode = document.querySelector("#tqm-module-root");

  if (rootNode) {
    mount(rootNode, {
      history: createBrowserHistory(),
      login: () => {},
    });
  }
}

const initDigitUI = () => {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  window.Digit.Customizations = {};
  window?.Digit.ComponentRegistryService.setupRegistry({
    // PaymentModule,
    // ...paymentConfigs,
    // PaymentLinks,
  });

  // initHRMSComponents();
  const enabledModules = ["PT", "TQM"];

  const moduleReducers = (initData) => initData;

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  // initTokens(stateCode);

  // return (<DigitUI stateCode={stateCode} enabledModules={enabledModules}       defaultLanding="employee"  moduleReducers={moduleReducers} />);
};

export { mount };
