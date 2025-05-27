import useBoundriesFetch from "./boundaries/useFetchBoundaries";
import utils from "../hooks/hook_setup";
import useHRMSCreate from "./hrms/useHRMSCreate";
import useHRMSSearch from "./hrms/useHRMSSearch";
import useHrmsInitialization from "./project/project_search";
import useHRMSStaffCreate from "./hrms/useHRMSStaffCreate";
import useHRMSUpdate from "./hrms/useHRMSUpdate";
import useHRMSStaffDelete from "./hrms/useHRMSStaffDelete";
import useHRMSStaffSearch from "./hrms/useHRMSStaffSearch";
import useHrmsEmployeeDetail from "./hrms/useHRMSEmployeeDetail";

const hrms = {
  useBoundriesFetch,
  useHRMSCreate,
  useHRMSSearch,
  useHrmsInitialization,
  useHRMSStaffCreate,
  useHRMSUpdate,
  useHRMSStaffDelete,
  useHRMSStaffSearch,
  useHrmsEmployeeDetail,
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
