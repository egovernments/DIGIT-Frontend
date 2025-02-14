import useBoundriesFetch from "./boundaries/useFetchBoundaries";
import utils from "../hooks/hook_setup";
import useHRMSCreate from "./hrms/hrms_create_emp";
import useHRMSSearch from "./hrms/hrms_search_emp";
const hrms = {
  useBoundriesFetch,
  useHRMSCreate,
  useHRMSSearch,
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
  Utils,
};
