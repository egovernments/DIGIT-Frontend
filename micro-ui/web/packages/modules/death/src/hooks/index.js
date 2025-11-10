import utils from "../utils";

const Death = {
};

const Hooks = {
  Death
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  Death: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};