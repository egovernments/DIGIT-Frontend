import utils from "../utils";
const microplan = {
  
};

const Hooks = {
  microplan
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
