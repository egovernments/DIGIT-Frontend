import utils from "../utils";

import useInbox from "./useInbox";

const TL = {
  useInbox
};

const Hooks = {
  TL
};

const Utils = {
  browser: {
    DSS: () => { },
  },
  TL: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};