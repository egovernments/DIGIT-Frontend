import utils from "../utils";
import useProjectSearch from "./useProjectSearch";
import useInboxSearch from "./useInboxSearch";
import useAPIHook from "./useAPIHook";
import useGetChartV2 from "./useGetChartV2";
import useDSSGeoJson from "./useDSSGeoJson";

const DSS = {
  useProjectSearch,
  useInboxSearch,
  useAPIHook,
  useGetChartV2,
  useDSSGeoJson
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