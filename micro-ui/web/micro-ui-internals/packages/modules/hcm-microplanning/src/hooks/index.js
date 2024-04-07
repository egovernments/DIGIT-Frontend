import { logoutV1 } from "./logout";
import utils from "../utils";
import useCreatePlanConfig from "./useCreatePlanConfig";
import useSearchPlanConfig from "./useCreatePlanConfig";
import useUpdatePlanConfig from "./useCreatePlanConfig";

const UserService = {
  logoutV1,
};

const microplan = {
  useCreatePlanConfig,
  useSearchPlanConfig,
  useUpdatePlanConfig,
};

const contracts = {};

const Hooks = {
  attendance: {
    update: () => {},
  },
  microplan,
  contracts,
};

const Utils = {
  browser: {
    sample: () => {},
  },
  microplan: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  UserService,
  Utils,
};
