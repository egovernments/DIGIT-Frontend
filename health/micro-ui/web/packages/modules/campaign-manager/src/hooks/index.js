import utils from "../utils";
import { useSearchCampaign } from "./services/useSearchCampaign";
import useCreateCampaign from "./useCreateCampaign";
import { useProductList } from "./useProductList";
import useUpdateCampaign from "./useUpdateCampaign";
import { useGenerateIdCampaign } from "./useGenerateIdCampaign";
import { useResourceData } from "./useResourceData";
import useCreateProductVariant from "./useCreateProductVariant";
import useCreateProduct from "./useCreateProduct";
import useProjectSearchWithBoundary from "./useProjectSearchWithBoundary";
import useProjectUpdateWithBoundary from "./useProjectUpdateWithBoundary";
import useCreateChecklist from "./useCreateChecklist";
import useUpsertLocalisation from "./useUpsertLocalisation";
import useUpsertLocalisationParallel from "./useUpsertLocalisationParallel";
import useTypeOfChecklist from "./useTypeOfChecklist";
import { useBoundaryRelationshipSearch } from "./useBoundaryRelationshipSearch";
import useUpdateChecklist from "./useUpdateChecklist";
import useMDMSServiceSearch from "./useMDMSServiceSearch";
import useFetchFromMicroplan from "./useFetchFromMicroplan";
import { useReadExcelData, useUpdateAndUploadExcel } from "./useReadExcelData";
import { useSearchLocalisation } from "./useSearchLocalisation";
import useUpsertFormBuilderConfig from "./useUpsertFormBuilderConfig";
import { useMDMSV2Search } from "./useMDMSV2Search";
import useUpdateFormBuilderConfig from "./useUpdateFormBuilderConfig";
import useUpsertSchemaConfig from "./useUpsertSchemaConfig";
import useUpdateAppConfig from "./useUpdateAppConfig";
import useUpdateAppConfigForFeatures from "./useUpdateAppConfigForFeatures";
import { useProcessData } from "./useProcessData";

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
  useProjectSearchWithBoundary,
  useProjectUpdateWithBoundary,
  useCreateChecklist,
  useUpsertLocalisation,
  useUpsertLocalisationParallel,
  useTypeOfChecklist,
  useBoundaryRelationshipSearch,
  useUpdateChecklist,
  useMDMSServiceSearch,
  useFetchFromMicroplan,
  useReadExcelData,
  useUpdateAndUploadExcel,
  useSearchLocalisation,
  useUpsertFormBuilderConfig,
  useMDMSV2Search,
  useUpdateFormBuilderConfig,
  useUpdateAppConfig,
  useUpsertSchemaConfig,
  useUpdateAppConfigForFeatures,
  useProcessData
};

const Hooks = {
  campaign,
};

const Utils = {
  browser: {
    sample: () => {},
  },
  workbench: {
    ...utils,
  },
  campaign: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  UserService,
  Utils,
};
