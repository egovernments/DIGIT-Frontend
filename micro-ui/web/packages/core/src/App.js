import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { Loader } from "./components";
import useAuth from "./hooks/useAuth";
// import Header from "./modules/Header";
import useRouter from "./hooks/useRouter";
import { DigitUI } from "./Module";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { QueryClient, QueryClientProvider } from "react-query";
import registerRemotes from "./modules/registerRemotes"
import { useTranslation } from "react-i18next";

//import { initHRMSComponents } from "@digit-ui/digit-ui-module-hrms-mfe";
// const LandingLazy = lazy(() => import("./modules/Landing"));
// const AuthLazy = lazy(() => import("./modules/Auth"));
// const DashboardLazy = lazy(() => import("./modules/Dashboard"));
// const HrmsLazy = lazy(()  => import("./modules/Hrms"));
// const WorkbenchLazy = lazy(() => import("./modules/Workbench"));
// const DssLazy = lazy(() => import("./modules/Dss"));
// const MeasurementLazy = lazy(() => import("./modules/Measurement"));


initLibraries().then(() => {
  initDigitUI();
});

//registering remote apps
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      cacheTime: 50 * 60 * 1000,
      retry: false,
      retryDelay: (attemptIndex) => Infinity,
      /*
        enable this to have auto retry incase of failure
        retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
       */
    },
  },
});
registerRemotes(queryClient)


const App = () => {
  const {t} = useTranslation()
  console.log(window.i18next.t("CORE_COMMON_LOGIN"),"In Core Module")
  console.log(window.i18next.store.data.en_IN.translations,"store in core module")
  const { login, history, isSignedIn$, logout } = useAuth();
  const { navigate } = useRouter();
  const enabledModules=["PT","HRMS","Workbench","DSS","Measurement"]

  const moduleReducers = (initData) => initData;
  
  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  

  return (
        <Suspense fallback={<Loader />}>
          <Switch>
            {/* <Route path="/auth">
              <AuthLazy login={login} history={history} />
            </Route>
            <Route path="/dashboard">
              <DashboardLazy />
            </Route>
            <Route path="/hrms">
              <HrmsLazy />
            </Route>
            <Route path="/workbench">
              <WorkbenchLazy />
            </Route>
            <Route path="/dss">
              <DssLazy />
            </Route>
            <Route path="/measurement">
              <MeasurementLazy />
            </Route> */}

            <Route path="/">{
              <DigitUI stateCode={stateCode} enabledModules={enabledModules}       defaultLanding="employee"  moduleReducers={moduleReducers} queryClient={queryClient}/>
            }</Route>
          </Switch>
        </Suspense>
  );
};



const initDigitUI = () => {
  // window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "core-digit-ui";
  window.contextPath =  "core-digit-ui";

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



export default App;

