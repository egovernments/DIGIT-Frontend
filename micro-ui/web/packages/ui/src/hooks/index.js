import utils from "../utils";
import useLocalization from "./useLocalization";

const core = {
  sampleCoreHook: () => {},
  useLocalization
};

const Hooks = {
  core,
};

const Utils = {
  browser: {
    sample: () => {},
  },
  core: {
    ...utils,
    sampleUtil: () => {},
    initCore: () => {
    },
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
