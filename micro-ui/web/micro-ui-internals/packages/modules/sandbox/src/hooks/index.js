import { useIndividualView } from "./useIndividualView";
import utils from "../utils";
import useDefaultMasterHandler from "./useDefaultMasterHandler";
const sandbox = {
  useIndividualView,
  useDefaultMasterHandler,
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
