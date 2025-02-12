import useBoundriesFetch from "./boundaries/useFetchBoundaries";
import utils from "../hooks/hook_setup";
import useHRMSCreate from "./hrms/hrms_create_emp";
const hrms = {
  useBoundriesFetch,
  useHRMSCreate
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
