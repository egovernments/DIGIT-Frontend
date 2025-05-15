import utils from "../utils";
import useCampaignsInboxSearch from "./useCampaignsInboxSearch";

const DSS = {
  useCampaignsInboxSearch,
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