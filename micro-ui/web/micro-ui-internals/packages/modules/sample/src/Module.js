import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import SampleCard from "./components/SampleCard";
import HRMSCard from "./components/HRMSCard";
import ViewEstimateComponent from "./components/ViewEstimateComponent";
// import { overrideHooks, updateCustomConfigs } from "./utils";
import AdditionalComponentWrapper from "./components/AdditionalComponent";
import SampleMultiComponent from "./components/SampleMultiComponent";

// SampleModule component manages the initialization and rendering of the module
export const SampleModule = ({ stateCode, userType, tenants }) => {
  // Get the current route path and URL using React Router
  console.log("Sample sampleModule is Hitting")
  const { path, url } = useRouteMatch();

  // Get the currently selected tenant ID from DIGIT's ULB Service
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Define the modules that this component depends on
  const moduleCode = ["sample", "common", "workflow"];

  // Get the current language selected in the DIGIT Store
  const language = Digit.StoreData.getCurrentLanguage();

  // Fetch module-specific store data
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  // Display a loader until the data is available
  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  // Render the EmployeeApp component with required props
  return <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />;
};

// Register components to be used in DIGIT's Component Registry
const componentsToRegister = {
  SampleModule,
  SampleCard,
  UtilitiesModule: SampleModule,
  UtilitiesCard: SampleCard,
  HRMSCard,
  ViewEstimatePage: ViewEstimateComponent,
  SampleAdditionalComponent: AdditionalComponentWrapper,
  SampleMultiComponent: SampleMultiComponent,
};

// Initialize and register module components
export const initSampleComponents = () => {
  console.log("Sample initSampleComponent is Hitting")
  // Apply custom hooks overrides
  // overrideHooks();

  // Update custom configurations
  // updateCustomConfigs();

  // Register each component with the DIGIT Component Registry
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
// import { CustomisedHooks } from "./hooks";

// import HRMSCard from "./components/HRMSCard";
// import { Loader } from "@egovernments/digit-ui-react-components";
// import React from "react";
// import { updateCustomConfigs } from "./utils";
// import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";

// const setupHooks = (HookName, HookFunction, method, isHook = true) => {
//   window.Digit = window.Digit || {};
//   window.Digit[isHook ? "Hooks" : "Utils"] = window.Digit[isHook ? "Hooks" : "Utils"] || {};
//   window.Digit[isHook ? "Hooks" : "Utils"][HookName] = window.Digit[isHook ? "Hooks" : "Utils"][HookName] || {};
//   window.Digit[isHook ? "Hooks" : "Utils"][HookName][HookFunction] = method;
// };
// export const overrideHooks = () => {
//   Object.keys(CustomisedHooks).map((ele) => {
//     if (ele === "Hooks") {
//       Object.keys(CustomisedHooks[ele]).map((hook) => {
//         Object.keys(CustomisedHooks[ele][hook]).map((method) => {
//           setupHooks(hook, method, CustomisedHooks[ele][hook][method]);
//         });
//       });
//     } else if (ele === "Utils") {
//       Object.keys(CustomisedHooks[ele]).map((hook) => {
//         Object.keys(CustomisedHooks[ele][hook]).map((method) => {
//           setupHooks(hook, method, CustomisedHooks[ele][hook][method], false);
//         });
//       });
//     } else {
//       Object.keys(CustomisedHooks[ele]).map((method) => {
//         setupLibraries(ele, method, CustomisedHooks[ele][method]);
//       });
//     }
//   });
// };
// // SampleModule component
// export const SampleModule = ({ stateCode, userType, tenants }) => {
//   const tenantId = Digit.ULBService.getCurrentTenantId();
//   const moduleCode = ["sample", "common", "workflow"];
//   const language = Digit.StoreData.getCurrentLanguage();

//   const { isLoading, data: store } = Digit.Services.useStore({
//     stateCode,
//     moduleCode,
//     language,
//   });

//   if (isLoading) {
//     return <Loader />;
//   }

//   return (
//     <AppContainer className="ground-container">
//       {console.log("i am")}
//       <div>Sample Module</div>
//     </AppContainer>
//   );
// };

// // Component registry for DIGIT framework
// const componentsToRegister = {
//   UilitiesSampleModule: SampleModule,
  
// };

// // Init function to register your module component with DIGIT
// export const initSampleComponents = () => {
//   overrideHooks();
//   updateCustomConfigs();

//   Object.entries(componentsToRegister).forEach(([key, value]) => {
//     Digit.ComponentRegistryService.setComponent(key, value);
//   });
// };
