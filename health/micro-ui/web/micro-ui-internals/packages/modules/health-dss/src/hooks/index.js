import utils from "../utils";
import useCampaignsInboxSearch from "./useCampaignsInboxSearch";
import useProjectSearch from "./useProjectSearch";

const DSS = {
  useCampaignsInboxSearch,
  useProjectSearch
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