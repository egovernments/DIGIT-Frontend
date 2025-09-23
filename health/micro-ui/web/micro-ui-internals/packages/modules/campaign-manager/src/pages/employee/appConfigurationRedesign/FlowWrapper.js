import React from "react";
import { Provider } from "react-redux";
import { store } from "./service/store";
import AppConfigurationFlowManager from "./AppConfigurationFlowManager";

const FlowWrapper = () => {
  return (
    <Provider store={store}>
      <AppConfigurationFlowManager />
    </Provider>
  );
};

export default FlowWrapper;
