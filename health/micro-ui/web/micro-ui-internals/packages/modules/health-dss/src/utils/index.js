import _ from "lodash";
import axios from "axios";
import { CustomisedHooks } from "../hooks";
import { UICustomizations } from "../configs/UICustomizations";



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

const FRENCH_LANGUAGE_CODES = ["fr", "fr_NG", "fr_FR", "fr_IN"];

const getNumberLocale = () => {
  const selectedLanguage = window?.Digit?.SessionStorage?.get("initData")?.selectedLanguage;
  return FRENCH_LANGUAGE_CODES.includes(selectedLanguage) ? "fr-FR" : "en-US";
};

/* To Overide any existing config/middlewares  we need to use similar method */
export const updateCustomConfigs = () => {
  setupLibraries("Customizations", "commonUiConfig", { ...window?.Digit?.Customizations?.commonUiConfig, ...UICustomizations });
  const _originalFormatter = window?.Digit?.Utils?.dss?.formatter;
  setupLibraries("Utils", "dss", {
    ...window?.Digit?.Utils?.dss,
    formatter: (value, symbol, unit, commaSeparated = true, t) => {
      if (!value && value !== 0) return "";
      const locale = getNumberLocale();
      if (symbol === "number") {
        if (!commaSeparated) return parseInt(value);
        return new Intl.NumberFormat(locale).format(value);
      }
      if (symbol === "percentage") {
        return `${new Intl.NumberFormat(locale, { maximumSignificantDigits: 3 }).format(Number(value).toFixed(2))} %`;
      }
      return _originalFormatter ? _originalFormatter(value, symbol, unit, commaSeparated, t) : "";
    },
  });
};

export default {};