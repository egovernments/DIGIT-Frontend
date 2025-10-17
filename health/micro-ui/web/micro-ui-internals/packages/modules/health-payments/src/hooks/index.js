import utils from "../utils";
import useAttendanceBoundarySearch from "./attendance/attendance_boundary";
import useProjectSearch from "./project/useProjectSearch";
import usePaymentsInitialization from "./project/usePaymentsInitialization";
import useAttendanceBoundaryRegisterSearch from "./attendance/attendance_register_search";
import useDeleteAttendeeFromRegister from "./attendance/delete_attendee_register";
import useCreateAttendeeFromRegister from "./attendance/create_attendee_register";
import useSearchIndividualForRegister from "./attendance/search_individual";

const payments = {
  useProjectSearch,
  usePaymentsInitialization,
  useAttendanceBoundarySearch,
  useAttendanceBoundaryRegisterSearch,
  useDeleteAttendeeFromRegister,
  useCreateAttendeeFromRegister,
  useSearchIndividualForRegister
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
