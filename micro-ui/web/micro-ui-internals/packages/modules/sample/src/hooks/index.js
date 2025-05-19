import { useIndividualView } from "./useIndividualView";
import useEstimateDetailsScreen from "./useEstimateDetailsScreen";
import * as utils from "../utils/index"
const sample = {
  useIndividualView
};
const estimates = {
  useEstimateDetailsScreen
}

const Hooks = {
  sample,
  estimates
};

const Utils = {
  browser: {
    sample: () => {},
  },
  sample: () => {
    try {
      return { ...utils };
    } catch (error) {
      console.error("Error while spreading utils:", error);
      return {};
    }
  },
};


export const CustomisedHooks = {
  Hooks,
  Utils,
};
