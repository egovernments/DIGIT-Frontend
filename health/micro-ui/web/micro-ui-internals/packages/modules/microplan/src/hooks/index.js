import useCreatePlanConfig from "./useCreatePlanConfig";
import useSearchPlanConfig from "./useSearchPlanConfig";
import useUpdatePlanConfig from "./useUpdatePlanConfig";
import useSavedMicroplans from "./useSavedMicroplans";
import useSearchCampaign from "./useSearchCampaign";
import { useGenerateIdCampaign } from "./useGenerateIdCampaign";
import useCreateCampaign from "./useCreateCampaign";
import useUpdateCampaign from "./useUpdateCampaign";
import useCreateUpdatePlanProject from "./useCreateUpdatePlanProject";
import utils from "../utils/utilities";
import useFileDownload from "./useFileDownload";
import usePlanSearchEmployee from "./usePlanSearchEmployee";
import useCensusSearch from "./useCensusSearch";

import useSearchHRMSEmployee from "./useSearchHRMSEmployee";
import usePlanEmployeeCreate from "./usePlanEmployeeCreate";
import usePlanEmployeeUpdate from "./usePlanEmployeeUpdate";
import usePlanSearchEmployeeWithTagging from "./usePlanSearchEmployeeWithTagging";

const microplanv1 = {
  useCreatePlanConfig,
  useSearchPlanConfig,
  useUpdatePlanConfig,
  useSavedMicroplans,
  useSearchCampaign,
  useGenerateIdCampaign,
  useCreateCampaign,
  useUpdateCampaign,
  useCreateUpdatePlanProject,
  useSearchHRMSEmployee,
  useFileDownload,
  useCensusSearch,
  usePlanEmployeeCreate,
  usePlanEmployeeUpdate,
  usePlanSearchEmployee,
  usePlanSearchEmployeeWithTagging,
};

const Hooks = {
  microplanv1,
};

const Utils = {
  microplanv1: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
