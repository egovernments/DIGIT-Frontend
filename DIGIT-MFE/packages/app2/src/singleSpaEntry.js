import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
// import HRMSWrapper from "./ModuleWrapper";
// import Dummy from "./Dummy";
import App from "./ModuleWrapper";
// singleSpaReact.millis(1000000000);
const appLifeCycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary() {
    // https://reactjs.org/docs/error-boundaries.html
    return <div>This renders when a catastrophic error occurs</div>;
  },
});

export function bootstrap(props) {
  return appLifeCycles.bootstrap(props);
}

export function mount(props) {
  return appLifeCycles.mount(props);
}

export function unmount(props) {
  return appLifeCycles.unmount(props);
}
