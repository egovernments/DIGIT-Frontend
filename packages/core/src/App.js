import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { Loader } from "./components";
import useAuth from "./hooks/useAuth";
// import Header from "./modules/Header";
import useRouter from "./hooks/useRouter";
import { DigitUI } from "./Module";
import { initLibraries } from "@egovernments/digit-ui-libraries";
// const LandingLazy = lazy(() => import("./modules/Landing"));
const AuthLazy = lazy(() => import("./modules/Auth"));
const DashboardLazy = lazy(() => import("./modules/Dashboard"));

const App = () => {
  const { login, history, isSignedIn$, logout } = useAuth();
  const { navigate } = useRouter();

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
       <DigitUI />
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path="/auth">
              <AuthLazy login={login} history={history} />
            </Route>
            <Route path="/dashboard">
              <DashboardLazy />
            </Route>
            <Route path="/">{/* <LandingLazy /> */}</Route>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

initLibraries().then(() => {
  
});

export default App;

