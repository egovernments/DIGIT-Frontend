
import useSearchCampaign from "./useSearchCampaign";
import utils from "../utils/utilities";
import useFileDownload from "./useFileDownload";

import useSearchHRMSEmployee from "./useSearchHRMSEmployee";

const payments = {
  useSearchCampaign,
  useSearchHRMSEmployee,
  // useFileDownload,
};

const Hooks = {
  payments,
};

const Utils = {
  payments: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
