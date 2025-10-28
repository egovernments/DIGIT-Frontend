import { logoutV1 } from "./logout";
import { UICreateConfigGenerator , getMDMSContextPath,getMDMSSchema,isSchemaCodeInMDMSAction } from "./workbench";
import utils from "../utils";
import useLocalisationSearch from "./useLocalisationSearch";
import {useWorkbenchFormContext} from "./useWorkbenchFormContext";
import usePureSchemaDefinition from "./fetchPureSchemaDefinition";
import useMDMSPopupSearch from "./inbox";
import useUpsertLocalisation from "./useUpsertLocalisation";

const UserService = {
  logoutV1,
};

const workbench = {
  UICreateConfigGenerator,
  useLocalisationSearch,
  getMDMSContextPath,
  useWorkbenchFormContext,
  getMDMSSchema,
  usePureSchemaDefinition,
  isSchemaCodeInMDMSAction,
  useUpsertLocalisation
};

const contracts = {};

const Hooks = {
  attendance: {
    update: () => { },
  },
  workbench,
  contracts,
  inbox:{
    useMDMSPopupSearch,
  }
};

const Utils = {
  browser: {
    sample: () => { },
  },
  workbench: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  UserService,
  Utils,
};
