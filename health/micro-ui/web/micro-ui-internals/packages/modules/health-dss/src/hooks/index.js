import utils from "../utils";
import useCampaignsInboxSearch from "./useCampaignsInboxSearch";
import useProjectSearch from "./useProjectSearch";
import useInboxSearch from "./useInboxSearch";
import useAPIHook from "./useAPIHook";
import useGetChartV2 from "./useGetChartV2";

const DSS = {
  useCampaignsInboxSearch,
  useProjectSearch,
  useInboxSearch,
  useAPIHook,
  useGetChartV2
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