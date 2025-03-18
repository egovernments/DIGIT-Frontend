import utils from "../utils";
import useProjectSearch from "./project/useProjectSearch";
import usePGRInitialization from "./project/usePGRInitialization";
import useFetchBoundaries from "./boundary/useFetchBoundaries";
import useCreateComplaint from "./pgr/useCreateComplaint";
const pgr = {
  useProjectSearch,
  usePGRInitialization,
  useFetchBoundaries,
  useCreateComplaint,
};


const Hooks = {
  pgr
};

const Utils = {
  browser: {
    pgr: () => { },
  },
  pgr: {
    ...utils,
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};

