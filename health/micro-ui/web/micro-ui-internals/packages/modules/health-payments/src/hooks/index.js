import utils from "../utils";
import useAttendanceBoundarySearch from "./attendance/attendance_boundary";
import useProjectSearch from "./project/useProjectSearch";
import useProjectStaffSearch from "./project/useProjectStaffSearch";
import useAttendanceBoundaryRegisterSearch from "./attendance/attendance_register_search";
const payments = {
  useProjectSearch,
  useProjectStaffSearch,
  useAttendanceBoundarySearch,
  useAttendanceBoundaryRegisterSearch
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
