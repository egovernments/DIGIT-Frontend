import utils from "../utils";
import useMDMS from "./useMDMS";

const PT = {
  useMDMS
};

const Hooks = {
  PT
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  PT: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};