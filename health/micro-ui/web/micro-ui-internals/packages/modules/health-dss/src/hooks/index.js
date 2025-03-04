import utils from "../utils";
import useDashboardConfig from "./useDashboardConfig";
import useDssInitialization from "./useDssInitialization";
import useGetChart from "./useGetChart";

const DSS = {
  useDssInitialization,
  useDashboardConfig,
  useGetChart,
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
