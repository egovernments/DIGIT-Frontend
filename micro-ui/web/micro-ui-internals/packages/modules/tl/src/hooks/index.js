import utils from "../utils";

const TL = {
};

const Hooks = {
  TL
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  TL: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};