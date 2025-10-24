import utils from "../utils";

const FireNOC = {
};

const Hooks = {
  FireNOC
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  FireNOC: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};