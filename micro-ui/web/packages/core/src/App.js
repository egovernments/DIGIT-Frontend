import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { Loader } from "./components";
import useAuth from "./hooks/useAuth";
// import Header from "./modules/Header";
import useRouter from "./hooks/useRouter";
import { DigitUI } from "./Module";
import { initLibraries } from "@digit-ui/digit-ui-libraries-mfe";
import { QueryClient, QueryClientProvider } from "react-query";
import registerRemotes from "./modules/registerRemotes";

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
//registering remote apps
registerRemotes(queryClient)


const App = () => {
  // const { login, history, isSignedIn$, logout } = useAuth();
  const { navigate } = useRouter();
  const enabledModules = ["PT", "HRMS", "Workbench", "DSS", "Measurement", "PGR"];

  const moduleReducers = (initData) => initData;

  // const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  const stateCode ="pg"
  console.log("stateCode",stateCode);

  return (
    <div>
      <div
        style={{
          height: "60px",
          backgroundColor: "#282c34",
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        {/* <Header isSignedIn$={isSignedIn$} logout={logout} /> */}
        /*<button onClick={() => navigate("/auth/login")}>Login</button>
      </div>

      <div>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path="/">
              {<DigitUI stateCode={stateCode} enabledModules={enabledModules} defaultLanding="employee" moduleReducers={moduleReducers} queryClient={queryClient} />}
            </Route>
          </Switch>
        </Suspense>
      </div>
      </div>
  );
};

const initDigitUI = () => {
  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  window.Digit.Customizations = {};
  window?.Digit.ComponentRegistryService.setupRegistry({
  });

};

export default App;
