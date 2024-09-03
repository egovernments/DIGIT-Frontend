import utils from "../utils";
const microplanv1 = {
  hook:() => {
    
  }
};

const Hooks = {
  microplanv1
};

const Utils = {
  browser: {
    microplan: () => { },
  },
  microplanv1: {
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
