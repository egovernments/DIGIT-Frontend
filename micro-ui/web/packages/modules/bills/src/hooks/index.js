import utils from "../utils";

const Bills = {
};

const Hooks = {
  Bills
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  Bills: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};