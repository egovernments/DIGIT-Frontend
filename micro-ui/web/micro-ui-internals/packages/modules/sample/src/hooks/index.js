import { useIndividualView } from "./useIndividualView";
import useEstimateDetailsScreen from "./useEstimateDetailsScreen";
import * as utils from "../utils";
const sample = {
  useIndividualView
};
const estimates={
  useEstimateDetailsScreen
}

const Hooks = {
  sample,
  estimates
};

const Utils = {
  browser: {
    sample: () => { },
  },
  sample: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
