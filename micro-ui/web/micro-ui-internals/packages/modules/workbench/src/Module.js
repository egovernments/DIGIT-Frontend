// workbench/index.js or similar file
import { TourProvider } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useMatch } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-components";

import EmployeeApp from "./pages/employee";
import { CustomisedHooks } from "./hooks";
import { UICustomizations } from "./configs/UICustomizations";
import HRMSCard from "./components/HRMSCard";
import WorkbenchCard from "./components/WorkbenchCard";
import DigitJSONForm from "./components/DigitJSONForm";
import LevelCards from "./components/LevelCards";
import * as parsingUtils from "../src/utils/ParsingUtils";

const WorkbenchModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = ["workbench", "mdms", "schema", "hcm-admin-schemas"];
  const match = useMatch("/employee/workbench/*");
  const path = match?.pathnameBase || "";

  const language = Digit.StoreData.getCurrentLanguage();
  const modulePrefix = window?.globalConfigs?.getConfig("CORE_UI_MODULE_LOCALE_PREFIX") || "rainmaker";

  Digit.Services = window.Digit.Services;

  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  if (isLoading) {
    return <Loader page={true} variant="PageLoader" />;
  }

  return (
    <TourProvider>
      <EmployeeApp path={path} stateCode={stateCode} />
    </TourProvider>
  );
};

const componentsToRegister = {
  WorkbenchModule,
  WorkbenchCard,
  DigitJSONForm,
  LevelCards,
  DSSCard: null,
  HRMSCard,
};

const setupHooks = (HookName, HookFunction, method, isHook = true) => {
  window.Digit = window.Digit || {};
  const section = isHook ? "Hooks" : "Utils";
  window.Digit[section] = window.Digit[section] || {};
  window.Digit[section][HookName] = window.Digit[section][HookName] || {};
  window.Digit[section][HookName][HookFunction] = method;
};

const setupLibraries = (Library, service, method) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = method;
};

const overrideHooks = () => {
  Object.keys(CustomisedHooks).forEach((ele) => {
    if (ele === "Hooks" || ele === "Utils") {
      const isHook = ele === "Hooks";
      Object.keys(CustomisedHooks[ele]).forEach((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).forEach((method) => {
          setupHooks(hook, method, CustomisedHooks[ele][hook][method], isHook);
        });
      });
    } else {
      Object.keys(CustomisedHooks[ele]).forEach((method) => {
        setupLibraries(ele, method, CustomisedHooks[ele][method]);
      });
    }
  });
};

const updateCustomConfigs = () => {
  setupLibraries("Customizations", "commonUiConfig", {
    ...window?.Digit?.Customizations?.commonUiConfig,
    ...UICustomizations,
  });
  setupLibraries("Utils", "parsingUtils", {
    ...window?.Digit?.Utils?.parsingUtils,
    ...parsingUtils,
  });
};

const initWorkbenchComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export { initWorkbenchComponents, DigitJSONForm };
