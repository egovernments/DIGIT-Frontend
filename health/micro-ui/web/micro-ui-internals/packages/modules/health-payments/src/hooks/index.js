import utils from "../utils";
const payments = {
};

const Hooks = {
  payments
};

const Utils = {
  browser: {
    payments: () => { },
  },
  payments: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
