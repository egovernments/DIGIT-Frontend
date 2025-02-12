import useBoundriesFetch from "./boundaries/useFetchBoundaries";
import utils from "../hooks/hook_setup";
const hrms = {
  useBoundriesFetch,
};

const Hooks = {
  hrms,
};

const Utils = {
  browser: {
    hrms: () => {},
  },
  hrms: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils
};
