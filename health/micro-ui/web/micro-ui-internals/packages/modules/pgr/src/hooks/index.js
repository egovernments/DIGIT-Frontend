import utils from "../utils";
import usePGRInitialization from "./project/usePGRInitialization";
const pgr = {
  usePGRInitialization
};

const Hooks = {
  pgr
};

const Utils = {
  browser: {
    pgr: () => { },
  },
  pgr: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
