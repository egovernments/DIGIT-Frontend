import { Loader} from "@egovernments/digit-ui-react-components";
import React from "react";

export const AssignmentModule = ({ stateCode, userType, tenants }) => {
  console.log("I'm assignment module");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleCode = ["assignment","sample", "common","workflow"];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

if (isLoading) {
    return <Loader />;
  }
  return ( <Switch>
  <AppContainer className="ground-container">
           <div>Assignment Module </div> 
  </AppContainer>
  </Switch>)
}
  
const componentsToRegister = {
  HRMS:AssignmentModule,
};
export const initAssignmentComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
