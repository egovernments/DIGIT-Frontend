import _ from "lodash";
import { UICustomizations } from "../configs/UICustomizations";


import { CustomisedHooks } from "../hooks";



export const overrideHooks = () => {
    Object.keys(CustomisedHooks).map((ele) => {
      if (ele === "Hooks") {
        Object.keys(CustomisedHooks[ele]).map((hook) => {
          Object.keys(CustomisedHooks[ele][hook]).map((method) => {
            setupHooks(hook, method, CustomisedHooks[ele][hook][method]);
          });
        });
      } else if (ele === "Utils") {
        Object.keys(CustomisedHooks[ele]).map((hook) => {
          Object.keys(CustomisedHooks[ele][hook]).map((method) => {
            setupHooks(hook, method, CustomisedHooks[ele][hook][method], false);
          });
        });
      } else {
        Object.keys(CustomisedHooks[ele]).map((method) => {
          setupLibraries(ele, method, CustomisedHooks[ele][method]);
        });
      }
    });
  };
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
 export const updateCustomConfigs = () => {
    setupLibraries("Customizations", "commonUiConfig", { ...window?.Digit?.Customizations?.commonUiConfig, ...UICustomizations });
    // setupLibraries("Utils", "parsingUtils", { ...window?.Digit?.Utils?.parsingUtils, ...parsingUtils });
  };



export default {};