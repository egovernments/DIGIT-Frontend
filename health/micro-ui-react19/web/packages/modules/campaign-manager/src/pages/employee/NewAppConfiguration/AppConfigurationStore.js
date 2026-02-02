import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppConfigurationWrapper from "./AppConfigurationWrapper";

const AppConfigurationStore = ({ flow, flowName, pageName, campaignNumber }) => {
  return (
    <Provider store={store}>
      <AppConfigurationWrapper flow={flow} flowName={flowName} pageName={pageName} campaignNumber={campaignNumber} />
    </Provider>
  );
};

export default AppConfigurationStore;
