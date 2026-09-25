import utils from "./hook_setup";
import useProjectSearch from "./useProjectSearch";
import useInboxSearch from "./useInboxSearch";
import useAPIHook from "./useAPIHook";
import useGetChartV2 from "./useGetChartV2";
import useDSSGeoJson from "./useDSSGeoJson";
import useSearchCampaign from "./useSearchCampaign";
import useSimpleElasticsearch from "./useSimpleElasticSearch";
import useUserActivityData from "./useUserActivityData";
import useUserTrackingData from "./useUserTrackingData";
import useReportsInProgress from "./useReportsInProgress";

const DSS = {
  useProjectSearch,
  useInboxSearch,
  useAPIHook,
  useGetChartV2,
  useDSSGeoJson,
  useSearchCampaign,
  useSimpleElasticsearch,
  useUserActivityData,
  useUserTrackingData,
  useReportsInProgress,
};

const Hooks = {
  DSS,
};

const Utils = {
  browser: {
    DSS: () => {},
  },
  DSS: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
