import * as utils from "../utils";

import useInbox from "./useInbox";
import useTenants from "./useTenants";

const tl = {
  useInbox,
  useTenants
};

const Hooks = {
  tl
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  tl: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};

const setupLibraries = (Library, service, method, func) => {
  window.Digit = window.Digit || {};
  window.Digit[Library] = window.Digit[Library] || {};
  window.Digit[Library][service] = window.Digit[Library][service] || {};
  window.Digit[Library][service][method] = func;
};

export const overrideHooks = () => {
  Object.keys(CustomisedHooks).map((ele) => {
    if (ele === "Hooks") {
      Object.keys(CustomisedHooks[ele]).map((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).map((method) => {
          setupLibraries("Hooks", hook, method, CustomisedHooks[ele][hook][method]);
        });
      });
    } else if (ele === "Utils") {
      Object.keys(CustomisedHooks[ele]).map((hook) => {
        Object.keys(CustomisedHooks[ele][hook]).map((method) => {
          setupLibraries("Utils", hook, method, CustomisedHooks[ele][hook][method]);
        });
      });
    }
  });
};