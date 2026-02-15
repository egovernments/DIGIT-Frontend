import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store";
import AppConfigurationWrapper from "./AppConfigurationWrapper";
import { setCurrentPageName } from "./AIAssistant/aiAssistantSlice";

const PageNameTracker = ({ pageName }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrentPageName(pageName));
  }, [pageName, dispatch]);
  return null;
};

const AppConfigurationStore = ({ flow, flowName, pageName, campaignNumber }) => {
  return (
    <Provider store={store}>
      <PageNameTracker pageName={pageName} />
      <AppConfigurationWrapper flow={flow} flowName={flowName} pageName={pageName} campaignNumber={campaignNumber} />
    </Provider>
  );
};

export default AppConfigurationStore;
