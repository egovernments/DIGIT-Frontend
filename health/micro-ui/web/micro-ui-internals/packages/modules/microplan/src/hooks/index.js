import utils from "../utils";
import useSavedMicroplans from "./useSavedMicroplans";
const microplanv1 = {
  useSavedMicroplans
};

const Hooks = {
  microplanv1
};

const Utils = {
  browser: {
    microplan: () => { },
  },
  microplan: {
    ...utils,
    he:()=>{
      console.log("he");
    }
  },
};

export const CustomisedHooks = {
  Hooks,
  Utils,
};
