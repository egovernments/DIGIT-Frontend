import useBoundriesFetch from "./boundaries/useFetchBoundaries";
import utils from "../hooks/hook_setup";
import useHRMSCreate from "./hrms/hrms_create_emp";
import useHRMSSearch from "./hrms/hrms_search_emp";
import useHrmsInitialization from "./project/project_search";
import useHRMSStaffCreate from "./hrms/hrms_create_staff";

const hrms = {
  useBoundriesFetch,
  useHRMSCreate,
  useHRMSSearch,
  useHrmsInitialization,
  useHRMSStaffCreate,
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
