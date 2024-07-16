import React, { lazy, Suspense,useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { DigitUI } from "./Module";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import registerRemotes from "./utils/registerRemotes"
import { useTranslation } from "react-i18next";
// import { queryClient } from "./bootstrap";
import { Loader } from "@digit-ui/digit-ui-react-components";

const initDigitUI = () => {
  // window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "core-digit-ui";
  window.contextPath =  "ui";

  window.Digit.Customizations = {

  };
  window?.Digit.ComponentRegistryService.setupRegistry({
    // PaymentModule,
    // ...paymentConfigs,
    // PaymentLinks,
  });

 // initHRMSComponents();
  const enabledModules=["PT"];

  const moduleReducers = (initData) => initData;

  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  // initTokens(stateCode);

  // return (<DigitUI stateCode={stateCode} enabledModules={enabledModules}       defaultLanding="employee"  moduleReducers={moduleReducers} />);
};

initLibraries()
initDigitUI()



const App = ({queryClient}) => {
  const {t,i18n} = useTranslation()
  const enabledModules=["PT","HRMS","Workbench","DSS","Measurement","PGR","Engagement","Campaign"]
  const moduleReducers = (initData) => initData;
  const { isLoading } = Digit.Hooks.core.useLocalization({
    params:{
      tenantId: Digit.ULBService.getStateId(),
      module: `rainmaker-common,rainmaker-${Digit.ULBService.getCurrentTenantId()},rainmaker-${Digit.ULBService.getStateId()}`,
      locale:i18n.language,
    },
    i18n,
  })
  

  
  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  
  if(isLoading){
    return <Loader />
  }

  return (
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path="/">{
              <div>
                <DigitUI stateCode={stateCode} enabledModules={enabledModules}       defaultLanding="employee"  moduleReducers={moduleReducers} queryClient={queryClient}/>
              </div>
            }</Route>
          </Switch>
        </Suspense>
    
  );
};







export default App;

