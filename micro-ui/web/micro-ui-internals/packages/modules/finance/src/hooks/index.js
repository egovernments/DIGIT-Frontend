import utils from "../utils";

const Finance = {
};

const Hooks = {
  Finance
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  Finance: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};