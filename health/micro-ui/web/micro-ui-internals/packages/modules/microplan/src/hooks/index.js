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
import useSavedMicroplansWithCampaign from "./useSavedMicroplansWithCampaign";
import usePlanSearchWithCensus from "./usePlanSearchWithCensus";

import useFcilityCatchmentMapping from "./useFacilityCatchmentMapping";
import useCompleteSetUpFlow from "./useCompleteSetUpFlow";

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
  useSavedMicroplansWithCampaign,
  usePlanSearchWithCensus,
  useFcilityCatchmentMapping,
  useCompleteSetUpFlow
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
