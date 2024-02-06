import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { DigitUI } from "@egovernments/digit-ui-module-core-temp";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { initDSSComponents } from "./Module";

initLibraries().then(() => {
  initDigitUI();
});
initDSSComponents();

const mount = (el, { history, login }) => {
  const moduleReducers = (initData) => {
  };
  const enabledModules=["PT","DSS"]

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  ReactDOM.render(
    <DigitUI stateCode={stateCode} enabledModules={enabledModules}  defaultLanding="employee"  moduleReducers={moduleReducers} />,
    el
  );

};

if (process.env.NODE_ENV === "development") {
  const rootNode = document.querySelector("#dss-module-root");

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
