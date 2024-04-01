
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { initTQMComponents } from "./Module";
import { QueryClient } from "react-query";
import App from "./TQMWrapper";

const initDigitUI = () => {
  window.contextPath = "core-digit-ui"
  window.Digit.Customizations = {};
  window?.Digit.ComponentRegistryService.setupRegistry({
    // PaymentModule,
    // ...paymentConfigs,
    // PaymentLinks,
  });

  // initHRMSComponents();
  const enabledModules = ["TQM"];

  const moduleReducers = (initData) => initData;

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pg";
  // initTokens(stateCode);

  // return (<DigitUI stateCode={stateCode} enabledModules={enabledModules}       defaultLanding="employee"  moduleReducers={moduleReducers} />);
};

initLibraries().then(() => {
  // initDigitUI();
});

// initTQMComponents();

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
  initDigitUI()
  ReactDOM.render(
    <App queryClient={queryClient}/>,
    // <div>TQM MODULE</div>,
    el
  );
};

if (process.env.NODE_ENV === "development") {
  const rootNode = document.querySelector("#tqm-module-root");

  if (rootNode) {
    mount(rootNode, {
      history: createBrowserHistory(),
      login: () => {},
    });
  }
}



export { mount };
