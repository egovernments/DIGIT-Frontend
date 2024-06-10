import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
// import App from "./CampaignWrapper"; 
import App from "./CampaignWrapper";
const appLifeCycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary() {
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