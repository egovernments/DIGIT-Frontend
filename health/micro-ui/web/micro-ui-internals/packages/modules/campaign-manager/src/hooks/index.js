import utils from "../utils";
import { useSearchCampaign } from "./services/useSearchCampaign";
import useCreateCampaign from "./useCreateCampaign";
import { useProductList } from "./useProductList";
import useUpdateCampaign from "./useUpdateCampaign";
import { useGenerateIdCampaign } from "./useGenerateIdCampaign";
import { useResourceData } from "./useResourceData";
import useCreateProductVariant from "./useCreateProductVariant";
import useCreateProduct from "./useCreateProduct";
import useParallelSearch from "./useParallelSearch";
import useProjectSearchWithBoundary from "./useProjectSearchWithBoundary";
import useProjectUpdateWithBoundary from "./useProjectUpdateWithBoundary";
import useCreateChecklist from "./useCreateChecklist";
import useUpsertLocalisation from "./useUpsertLocalisation";
import useTypeOfChecklist from "./useTypeOfChecklist";
import { useBoundaryRelationshipSearch } from "./useBoundaryRelationshipSearch";
import useUpdateChecklist from "./useUpdateChecklist";
import useMDMSServiceSearch from "./useMDMSServiceSearch";
import useBoundaryHome from "./useBoundaryHome";
import useFetchFromMicroplan from "./useFetchFromMicroplan";

const UserService = {};

const workbench = {};

const contracts = {};

const campaign = {
  useProductList,
  useCreateCampaign,
  useSearchCampaign,
  useUpdateCampaign,
  useGenerateIdCampaign,
  useResourceData,
  useCreateProduct,
  useCreateProductVariant,
  useParallelSearch,
  useProjectSearchWithBoundary,
  useProjectUpdateWithBoundary,
  useCreateChecklist,
  useUpsertLocalisation,
  useTypeOfChecklist,
  useBoundaryRelationshipSearch,
  useUpdateChecklist,
  useMDMSServiceSearch,
  useBoundaryHome,
  useFetchFromMicroplan
};

const Hooks = {
  campaign,
};

const Utils = {
  browser: {
    sample: () => { },
  },
  workbench: {
    ...utils,
  },
  campaign: {
    ...utils
  }
};

export const CustomisedHooks = {
  Hooks,
  UserService,
  Utils,
};
