import { Loader} from "@egovernments/digit-ui-react-components";
import React from "react";

export const Sample2 = ({ stateCode, userType, tenants }) => {
  const tenantId = "mz"
  const moduleCode = ["sample", "common","workflow"];
  const language = Digit.StoreData.getCurrentLanguage();

  return (
           <div>Sample Module </div> 
        )
}

const componentsToRegister = {
  UtilitiesModule:Sample2
};

export const initSample2Components = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
