import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { initMicroplanningComponents } from "./Module.js";

import { QueryClientProvider,QueryClient } from 'react-query';
import EmployeeApp from './pages/employee/index';
import { ProviderContext } from './utils/context';
import { TourProvider } from "@digit-ui/digit-ui-react-components";

initLibraries()

initMicroplanningComponents();

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

const mount = (el, { history,login }) => {
  
  const moduleReducers = (initData) => {
  };
  const enabledModules=["PT","HRMS" ,"MICROPLAN"]

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "mz";
  ReactDOM.render(
    // <DigitUI stateCode={stateCode} enabledModules={enabledModules}  defaultLanding="employee"  moduleReducers={moduleReducers} />,
    <QueryClientProvider client={queryClient}>
      <Router>
        <ProviderContext>
          <TourProvider>
            <EmployeeApp
              path={`/${
                window.contextPath ? window.contextPath : 'core-digit-ui'
              }/employee/microplan`}
            />
          </TourProvider>
        </ProviderContext>
      </Router>
    </QueryClientProvider>,
    el
  );
};


if (process.env.NODE_ENV === "development") {
  const rootNode = document.querySelector("#microplanning-module-root");

  if (rootNode) {
    mount(rootNode, {
      history: createBrowserHistory(),
      login: () => {},
    });
  }
}
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


export { mount };
