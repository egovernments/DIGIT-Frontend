import utils from "../utils";

const Birth = {
};

const Hooks = {
  Birth
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  Birth: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};