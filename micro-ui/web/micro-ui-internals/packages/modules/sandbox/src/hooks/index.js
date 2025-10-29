import { useIndividualView } from "./useIndividualView";
import utils from "../utils";
import useDefaultMasterHandler from "./useDefaultMasterHandler";
import { useGetMasterDataCount } from "./useGetMasterDataCount";

const sandbox = {
  useIndividualView,
  useDefaultMasterHandler,
  useGetMasterDataCount,
};

const Hooks = {
  sandbox,
};

const Utils = {
  browser: {
    sandbox: () => {},
  },
  sandbox: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
