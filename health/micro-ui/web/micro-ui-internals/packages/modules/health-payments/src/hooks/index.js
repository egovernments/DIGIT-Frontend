import utils from "../utils";
import useAttendanceBoundarySearch from "./attendance/attendance_boundary";
import useProjectSearch from "./project/useProjectSearch";
import usePaymentsInitialization from "./project/usePaymentsInitialization";
import useAttendanceBoundaryRegisterSearch from "./attendance/attendance_register_search";
import useDeleteAttendeeFromRegister from "./attendance/delete_attendee_register";
import useCreateAttendeeFromRegister from "./attendance/create_attendee_register";
import useSearchIndividualForRegister from "./attendance/search_individual";
import { useSearchCampaign } from "./project/useCampaignSearch";
import usePaymentSetUpForCampaign from "./payement_setup/payement_setup_create";
import useMDMSRatesCreate from "./payement_setup/payment_mdms_rate_create";
import useMDMSRatesUpdate from "./payement_setup/payment_mdms_rate_update";
import usePaymentSetUpForCampaignUpdate from "./payement_setup/payment_setup_update";

const payments = {
  useProjectSearch,
  usePaymentsInitialization,
  useAttendanceBoundarySearch,
  useAttendanceBoundaryRegisterSearch,
  useDeleteAttendeeFromRegister,
  useCreateAttendeeFromRegister,
  useSearchIndividualForRegister,
  useSearchCampaign,
  // for payment setup
  usePaymentSetUpForCampaign,
  useMDMSRatesCreate,
  useMDMSRatesUpdate,
  usePaymentSetUpForCampaignUpdate,
};

const Hooks = {
  payments,
};

const Utils = {
  browser: {
    payments: () => {},
  },
  payments: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
