import { logoutV1 } from "./logout";
import { UICreateConfigGenerator, getMDMSContextPath, getMDMSSchema } from "./workbench";
import utils from "../utils";
import useLocalisationSearch from "./useLocalisationSearch";
import { useWorkbenchFormContext } from "./useWorkbenchFormContext";
import usePureSchemaDefinition from "./fetchPureSchemaDefinition";

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
};

const contracts = {};

const Hooks = {
  attendance: {
    update: () => {},
  },
  workbench,
  contracts,
};

const Utils = {
  browser: {
    sample: () => {},
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
