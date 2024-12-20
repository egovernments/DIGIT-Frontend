import utils from "../utils";
import useProjectSearch from "./project/useProjectSearch";
import useProjectStaffSearch from "./project/useProjectStaffSearch";
const payments = {
  useProjectSearch,
  useProjectStaffSearch,
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
