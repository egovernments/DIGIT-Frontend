import { BodyContainer } from "@egovernments/digit-ui-components";
import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { getI18n } from "react-i18next";
import { QueryClient, QueryClientProvider, useQuery  } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { DigitApp, DigitAppWrapper } from "./App";
import SelectOtp from "./pages/citizen/Login/SelectOtp";
import ChangeCity from "./components/ChangeCity";
import ChangeLanguage from "./components/ChangeLanguage";
import { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundaries";
import getStore from "./redux/store";
import PrivacyComponent from "./components/PrivacyComponent";
import OtpComponent from "./pages/employee/Otp/OtpCustomComponent";
import { queryClient } from "./queryClient";

// const DigitUIWrapper = ({ stateCode, enabledModules, moduleReducers, defaultLanding }) => {
//   console.log("Inside DigitUIWrapper, QueryClientProvider exists:", QueryClientProvider);
//   const { isLoading, data: initData={} } = Digit.Hooks.useInitStore(stateCode, enabledModules);
//   if (isLoading) {
//     return <Loader page={true} />;
//   }
//   const data=getStore(initData, moduleReducers(initData)) || {};
//   const i18n = getI18n();
//   if(!Digit.ComponentRegistryService.getComponent("PrivacyComponent")){
//     Digit.ComponentRegistryService.setComponent("PrivacyComponent", PrivacyComponent);
//   }
//   return (
//     <Provider store={data}>
//       <Router>
//         <BodyContainer>
//           {Digit.Utils.getMultiRootTenant() ? (
//             <DigitAppWrapper
//               initData={initData}
//               stateCode={stateCode}
//               modules={initData?.modules}
//               appTenants={initData.tenants}
//               logoUrl={initData?.stateInfo?.logoUrl}
//               logoUrlWhite={initData?.stateInfo?.logoUrlWhite}
//               defaultLanding={defaultLanding}
//             />
//           ) : (
//             <DigitApp
//               initData={initData}
//               stateCode={stateCode}
//               modules={initData?.modules}
//               appTenants={initData.tenants}
//               logoUrl={initData?.stateInfo?.logoUrl}
//               defaultLanding={defaultLanding}
//             />
//           )}
//         </BodyContainer>
//       </Router>
//     </Provider>
//   );
// };

// export const DigitUI = ({ stateCode, registry, enabledModules, moduleReducers, defaultLanding }) => {
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     setIsReady(true);
//   }, []);
//   const [privacy, setPrivacy] = useState(Digit.Utils.getPrivacyObject() || {});
//   const userType = Digit.UserService.getType();
//   // const queryClient = new QueryClient({
//   //   defaultOptions: {
//   //     queries: {
//   //       staleTime: 15 * 60 * 1000,
//   //       gcTime: 50 * 60 * 1000,
//   //       retry: false,
//   //       retryDelay: (attemptIndex) => Infinity,
//   //       /*
//   //         enable this to have auto retry incase of failure
//   //         retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
//   //        */
//   //     },
//   //   },
//   // });

//   const ComponentProvider = Digit.Contexts.ComponentProvider;
//   const PrivacyProvider = Digit.Contexts.PrivacyProvider;

//   const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);

//   return (
//     <div>
//         <QueryClientProvider client={queryClient}>
//         <ErrorBoundary>
//           <ComponentProvider.Provider value={registry}>
//             <PrivacyProvider.Provider
//               value={{
//                 privacy: privacy?.[window.location.pathname],
//                 resetPrivacy: (_data) => {
//                   Digit.Utils.setPrivacyObject({});
//                   setPrivacy({});
//                 },
//                 getPrivacy: () => {
//                   const privacyObj = Digit.Utils.getPrivacyObject();
//                   setPrivacy(privacyObj);
//                   return privacyObj;
//                 },
//                 /*  Descoped method to update privacy object  */
//                 updatePrivacyDescoped: (_data) => {
//                   const privacyObj = Digit.Utils.getAllPrivacyObject();
//                   const newObj = { ...privacyObj, [window.location.pathname]: _data };
//                   Digit.Utils.setPrivacyObject({ ...newObj });
//                   setPrivacy(privacyObj?.[window.location.pathname] || {});
//                 },
//                 /**
//                  * Main Method to update the privacy object anywhere in the application
//                  *
//                  * @author jagankumar-egov
//                  *
//                  * Feature :: Privacy
//                  *
//                  * @example
//                  *    const { privacy , updatePrivacy } = Digit.Hooks.usePrivacyContext();
//                  */
//                 updatePrivacy: (uuid, fieldName) => {
//                   setPrivacy(Digit.Utils.updatePrivacy(uuid, fieldName) || {});
//                 },
//               }}
//             >
//               {/* <DigitUIWrapper stateCode={stateCode} enabledModules={enabledModules} moduleReducers={moduleReducers} defaultLanding={defaultLanding} /> */}
//               {isReady ? (
//             <DigitUIWrapper
//               stateCode={stateCode}
//               enabledModules={enabledModules}
//               moduleReducers={moduleReducers}
//               defaultLanding={defaultLanding}
//             />
//           ) : (
//             <Loader page={true} /> // Show a loader until QueryClientProvider is ready
//           )}
//             </PrivacyProvider.Provider>
//           </ComponentProvider.Provider>
//       </ErrorBoundary>
//         </QueryClientProvider>
//     </div>
//   );
// };

// const queryClient = new QueryClient();

// const fetchDummyData = async () => {
//   const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
//   if (!response.ok) throw new Error("Network response was not ok");
//   return response.json();
// };

//   const DummyComponent = () => {
//     const { data, error, isLoading } = useQuery({
//       queryKey: ["dummyData"],
//       queryFn: fetchDummyData,
//     });

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return <div>{JSON.stringify(data, null, 2)}</div>;
// };

const DummyComponent2 = () => {
  console.log(Digit.Hooks.useInitStore);
  const { isLoading, data: initData = {}, error } = Digit.Hooks.useInitStore();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <pre>{JSON.stringify(initData, null, 2)}</pre>;
};

export const DigitUI = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <h2>Testing QueryClientProvider</h2>
      {/* <DummyComponent /> */}
      <DummyComponent2 />
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
