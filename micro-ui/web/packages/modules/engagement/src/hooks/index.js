import utils from "../utils";

const Engagement = {
};

const Hooks = {
  Engagement
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  Engagement: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};