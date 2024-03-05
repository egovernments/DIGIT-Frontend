import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import App from "./DSSWrapper";
// import { initDSSComponents } from "./Module";
// import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
// initLibraries();
// initDSSComponents();
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
