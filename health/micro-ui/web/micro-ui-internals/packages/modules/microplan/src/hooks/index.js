import utils from "../utils";
import useCreatePlanConfig from "./useCreatePlanConfig";
import useSearchPlanConfig from "./useSearchPlanConfig";
import useUpdatePlanConfig from "./useUpdatePlanConfig";
import useSavedMicroplans from "./useSavedMicroplans";
import useSearchCampaign from "./useSearchCampaign";
import { useGenerateIdCampaign } from "./useGenerateIdCampaign";
import useCreateCampaign from "./useCreateCampaign";
import useUpdateCampaign from "./useUpdateCampaign";

const microplanv1 = {
  useCreatePlanConfig,
  useSearchPlanConfig,
  useUpdatePlanConfig,
  useSavedMicroplans,
  useSearchCampaign,
  useGenerateIdCampaign,
  useCreateCampaign,
  useUpdateCampaign
};

const Hooks = {
  microplanv1,
};

const Utils = {
  browser: {
    sample: () => {},
  },
  microplanv1: {
    sampleUtil:()=>{

    },
    ...utils
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
