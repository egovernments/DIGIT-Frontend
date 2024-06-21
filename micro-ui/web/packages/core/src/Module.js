import { Body, Loader } from "@digit-ui/digit-ui-react-components";
import React from "react";
import { getI18n } from "react-i18next";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DigitApp } from "./pages/index";
import SelectOtp from "./pages/citizen/Login/SelectOtp";
import { useState } from "react";
import ErrorBoundary from "./components/ErrorBoundaries";
import getStore from "./redux/store";
//here add react-query dev tools
// import { ReactQueryDevtools } from 'react-query/devtools';

const DigitUIWrapper = ({ stateCode="pg", enabledModules, moduleReducers,defaultLanding,queryClient }) => {

  const { isLoading, data: initData } = Digit.Hooks.useInitStore(stateCode, enabledModules);
  // const reduxRsp = getStore(initData, moduleReducers(initData))
  
  if (isLoading) {
    return <Loader page={true} />;
  }
  // const i18n = getI18n();
  return (
    <Provider store={getStore(initData, moduleReducers(initData))}>
      <Router>
        <Body>
          <DigitApp
            initData={initData}
            stateCode={stateCode}
            modules={initData?.modules}
            appTenants={initData.tenants}
            logoUrl={initData?.stateInfo?.logoUrl}
            defaultLanding={defaultLanding}
            queryClient={queryClient}
          />
        </Body>
      </Router>
    </Provider>
  );
};

export const DigitUI = ({stateCode="pg", registry, enabledModules, moduleReducers ,defaultLanding,queryClient}) => {
  
  const [privacy, setPrivacy] = useState(Digit.Utils.getPrivacyObject() || {});
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const PrivacyProvider = Digit.Contexts.PrivacyProvider;


  return (
    <div>
      <ErrorBoundary>
        {/* <QueryClientProvider client={queryClient}> */}
          <ComponentProvider.Provider value={registry}>
            <PrivacyProvider.Provider
              value={{
                privacy: privacy?.[window.location.pathname],
                resetPrivacy: (_data) => {
                  Digit.Utils.setPrivacyObject({});
                  setPrivacy({});
                },
                getPrivacy: () => {
                  const privacyObj = Digit.Utils.getPrivacyObject();
                  setPrivacy(privacyObj);
                  return privacyObj;
                },
                /*  Descoped method to update privacy object  */
                updatePrivacyDescoped: (_data) => {
                  const privacyObj = Digit.Utils.getAllPrivacyObject();
                  const newObj = { ...privacyObj, [window.location.pathname]: _data };
                  Digit.Utils.setPrivacyObject({ ...newObj });
                  setPrivacy(privacyObj?.[window.location.pathname] || {});
                },
                /**
                 * Main Method to update the privacy object anywhere in the application
                 *
                 * @author jagankumar-egov
                 *
                 * Feature :: Privacy
                 *
                 * @example
                 *    const { privacy , updatePrivacy } = Digit.Hooks.usePrivacyContext();
                 */
                updatePrivacy: (uuid, fieldName) => {
                  setPrivacy(Digit.Utils.updatePrivacy(uuid, fieldName) || {});
                },
              }}
            >

              <DigitUIWrapper stateCode={Digit.ULBService.getStateId()} enabledModules={enabledModules} moduleReducers={moduleReducers} defaultLanding={defaultLanding} queryClient={queryClient} />
              {/* <div>Core Module Dummy</div> */}

              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </PrivacyProvider.Provider>
          </ComponentProvider.Provider>
        {/* </QueryClientProvider> */}
      </ErrorBoundary>
    </div>
  );

};

const componentsToRegister = {
  SelectOtp,
};


export const initCoreComponents = () => {
  
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
