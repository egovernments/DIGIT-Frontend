import { useIndividualView } from "./useIndividualView";
import utils from "../utils";
const sandbox = {
  useIndividualView
};

const Hooks = {
  sandbox
};

const Utils = {
  browser: {
    sandbox: () => { },
  },
  sandbox: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
