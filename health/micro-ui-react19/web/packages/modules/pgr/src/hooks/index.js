import utils from "../utils";
import useProjectSearch from "./project/useProjectSearch";
import useFetchBoundaries from "./boundary/useFetchBoundaries";
import useCreateComplaint from "./pgr/useCreateComplaint";
import usePGRSearch from "./pgr/usePGRSearch";
import usePGRUpdate from "./pgr/usePGRUpdate";
import useServiceDefs from "./pgr/useServiceDefs";
import { useFetchAllBoundaryHierarchies } from "./boundary/useFetchAllHierarchies";

const pgr = {
  useProjectSearch,
  useFetchBoundaries,
  useCreateComplaint,
  usePGRSearch,
  usePGRUpdate,
  useServiceDefs,
  useFetchAllBoundaryHierarchies,
};




const Hooks = {
  pgr,
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

