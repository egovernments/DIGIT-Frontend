import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppConfigurationWrapper from "./AppConfigurationWrapper";

const AppConfigurationStore = ({ children }) => {
  return (
    <Provider store={store}>
      <AppConfigurationWrapper />
    </Provider>
  );
};

export default AppConfigurationStore;
