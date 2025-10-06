import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppConfigurationWrapper from "./AppConfigurationWrapper";

const AppConfigurationStore = ({ flow, pageName, onPageChange, addedRoles }) => {
  return (
    <Provider store={store}>
      <AppConfigurationWrapper flow={flow} pageName={pageName} onPageChange={onPageChange} addedRoles={addedRoles} />
    </Provider>
  );
};

export default AppConfigurationStore;
