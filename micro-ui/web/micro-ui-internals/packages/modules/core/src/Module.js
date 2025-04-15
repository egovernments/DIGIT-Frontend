import { BodyContainer } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { getI18n } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DigitApp, DigitAppWrapper } from "./App";
import SelectOtp from "./pages/citizen/Login/SelectOtp";
import ChangeCity from "./components/ChangeCity";
import ChangeLanguage from "./components/ChangeLanguage";
import { useState } from "react";
import ErrorBoundary from "./components/ErrorBoundaries";
import getStore from "./redux/store";
import PrivacyComponent from "./components/PrivacyComponent";
import OtpComponent from "./pages/employee/Otp/OtpCustomComponent";
// import {useInitStore} from "../libraries/src/hooks/store" 
// import {initWorkbenchComponents} from "@egovernments/digit-ui-module-workbench"
import { initWorkbenchComponents } from "../../workbench/src/Module";
// import {Hooks} from "@egovernments/digit-ui-libraries"
// import Hooks from "../../../libraries/src/hooks";
import { initI18n } from "@egovernments/digit-ui-libraries";

console.log("inside module.js of core")
console.log(Digit.Hooks);

const DigitUIWrapper = ({ stateCode, enabledModules, defaultLanding }) => {
  console.log("inside DigitUIWrapper of core");
  // window.Digit["Hooks"] = Hooks || {};
  const { isLoading, data: initData={} } = Digit.Hooks.useInitStore(stateCode, enabledModules);
  console.log("seeeeeeee")
  if (isLoading) {
    return <Loader page={true} />;
  }
  const data=getStore(initData) || {};
  const i18n = getI18n();
  initWorkbenchComponents();
  if(!Digit.ComponentRegistryService.getComponent("PrivacyComponent")){
    Digit.ComponentRegistryService.setComponent("PrivacyComponent", PrivacyComponent);
  }
  return (
    <Provider store={data}>
      <Router>
        <BodyContainer>
          {Digit.Utils.getMultiRootTenant() ? (
            <DigitAppWrapper
              initData={initData}
              stateCode={stateCode}
              // modules={[
              //   {
              //     "module": "assignment",
              //     "code": "assignment",
              //     "active": true,
              //     "order": 13,
              //     "tenants": [
              //       {
              //         "code": "mz"
              //       }
              //     ]
              //   },
              //   {
              //     "module": "HRMS",
              //     "code": "HRMS",
              //     "active": true,
              //     "order": 4,
              //     "tenants": [
              //       {
              //         "code": "mz"
              //       }
              //     ]
              //   }
              // ]}
              modules={initData?.modules}
              appTenants={initData.tenants}
              logoUrl={initData?.stateInfo?.logoUrl}
              logoUrlWhite={initData?.stateInfo?.logoUrlWhite}
              defaultLanding={defaultLanding}
            />
          ) : (
            <DigitApp
              initData={initData}
              stateCode={stateCode}
              modules={initData?.modules}
              appTenants={initData.tenants}
              logoUrl={initData?.stateInfo?.logoUrl}
              defaultLanding={defaultLanding}
            />
          )}
        </BodyContainer>
      </Router>
    </Provider>
  );
};

export const DigitUI = ({ stateCode, registry, enabledModules, moduleReducers, defaultLanding }) => {
  console.log("inside digitui of core");
  var Digit = window.Digit || {};
  initI18n();
  console.log("usestate", useState);
  const [privacy, setPrivacy] = useState(Digit.Utils.getPrivacyObject() || {});
  const userType = Digit.UserService.getType();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15 * 60 * 1000,
        gcTime: 50 * 60 * 1000,
        retry: false,
        retryDelay: (attemptIndex) => Infinity,
        /*
          enable this to have auto retry incase of failure
          retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
         */
      },
    },
  });

  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const PrivacyProvider = Digit.Contexts.PrivacyProvider;

  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
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
              <DigitUIWrapper stateCode={stateCode} enabledModules={enabledModules} defaultLanding={defaultLanding} />
            </PrivacyProvider.Provider>
          </ComponentProvider.Provider>
      </ErrorBoundary>
      </QueryClientProvider>
  );
};

const componentsToRegister = {
  SelectOtp,
  ChangeCity,
  ChangeLanguage,
  PrivacyComponent,
  OtpComponent,
};

export const initCoreComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
