import { Loader,TourProvider } from "@egovernments/digit-ui-react-components";
import React from "react";
// import { useRouteMatch } from "react-router-dom";
import EmployeeApp from "./pages/employee";
// import { CustomisedHooks } from "./hooks";
import { UICustomizations } from "./configs/UICustomizations";
// import HRMSCard from "./components/HRMSCard";
// import WorkbenchCard from "./components/WorkbenchCard";
// import DigitJSONForm from "./components/DigitJSONForm";
// import LevelCards from "./components/LevelCards";
import MyTable from "./components/MyTable";
import SampleCard from "./components/SampleCard";
// import * as parsingUtils from "../src/utils/ParsingUtils"

export const SampleModule = ({ stateCode, userType, tenants }) => {
  console.log('.................');
  // console.log(EmployeeApp);
  const moduleCode = ["workbench","mdms","schema","hcm-admin-schemas"];
  // const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = window?.globalConfigs?.getConfig("CORE_UI_MODULE_LOCALE_PREFIX") || "rainmaker";

  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix
  });
  if (isLoading) {
    return <Loader />;
  }

  return <TourProvider>
    <EmployeeApp />
  </TourProvider>
};

const componentsToRegister = {
  MyTable,
  SampleModule,
  SampleCard : SampleCard
};

// const overrideHooks = () => {
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

/* To Overide any existing hook we need to use similar method */
const setupHooks = (HookName, HookFunction, method, isHook = true) => {
  window.Digit = window.Digit || {};
  window.Digit[isHook ? "Hooks" : "Utils"] = window.Digit[isHook ? "Hooks" : "Utils"] || {};
  window.Digit[isHook ? "Hooks" : "Utils"][HookName] = window.Digit[isHook ? "Hooks" : "Utils"][HookName] || {};
  window.Digit[isHook ? "Hooks" : "Utils"][HookName][HookFunction] = method;
};
/* To Overide any existing libraries  we need to use similar method */
const setupLibraries = (Library, service, method) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = method;
};

/* To Overide any existing config/middlewares  we need to use similar method */
// const updateCustomConfigs = () => {
//   setupLibraries("Customizations", "commonUiConfig", { ...window?.Digit?.Customizations?.commonUiConfig, ...UICustomizations });
//   setupLibraries("Utils","parsingUtils",{...window?.Digit?.Utils?.parsingUtils,...parsingUtils})
// };


 const initSampleComponents = () => {
  console.log("Init Sample Components");
  // overrideHooks();
  // updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export { initSampleComponents };

