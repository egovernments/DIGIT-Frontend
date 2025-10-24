import utils from "../utils";

const HRMS = {
};

const Hooks = {
  HRMS
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  HRMS: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};