import utils from "../utils";
import useCampaignsInboxSearch from "./useCampaignsInboxSearch";
import useProjectSearch from "./useProjectSearch";
import useInboxSearch from "./useInboxSearch";
import useAPIHook from "./useAPIHook";

const DSS = {
  useCampaignsInboxSearch,
  useProjectSearch,
  useInboxSearch,
  useAPIHook
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