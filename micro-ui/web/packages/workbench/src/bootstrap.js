import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
// import { DigitUI } from "@digit-ui/digit-ui-module-core-base";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { initWorkbenchComponents } from "./Module";

initLibraries().then(() => {
  initDigitUI();
});
initWorkbenchComponents();

const mount = (el, { history, login }) => {
  const moduleReducers = (initData) => {
  };
  const enabledModules=["PT","Workbench", "PGR"]

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  //console.log(stateCode,'ststcode');
  ReactDOM.render(
    <div>Workbench in isolation</div>,
    el
  );
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
