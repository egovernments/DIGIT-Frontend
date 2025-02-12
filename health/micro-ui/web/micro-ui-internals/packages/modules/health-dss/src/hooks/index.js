import utils from "../utils";
import useDssInitialization from "./useDssInitialization";
// import useAttendanceBoundarySearch from "./attendance/attendance_boundary";
// import useProjectSearch from "./project/useProjectSearch";
// import usePaymentsInitialization from "./project/usePaymentsInitialization";
// import useAttendanceBoundaryRegisterSearch from "./attendance/attendance_register_search";
const DSS = {
  useDssInitialization,
};

const Hooks = {
  DSS
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  DSS: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
