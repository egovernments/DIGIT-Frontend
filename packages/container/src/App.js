import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { Loader } from "./components";
import useAuth from "./hooks/useAuth";
// import Header from "./modules/Header";
import useRouter from "./hooks/useRouter";
import {AppContainer, Header} from "@egovernments/digit-ui-react-components";
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
        <button onClick={() => navigate("/auth/login")}>Login</button>
      </div>
      <div>
        <Suspense fallback={<Loader />}>
        <AppContainer>
          <Switch>
          <Route path="/route">
            <div style={{width:"100%",height:"200px"}}>
              <Header>Test Components</Header>
              </div>
            </Route>
            <Route path="/auth">
              <Header>Test Components</Header>
              <AuthLazy login={login} history={history} />
            </Route>
            <Route path="/dashboard">
              <DashboardLazy />
            </Route>
            <Route path="/">{/* <LandingLazy /> */}</Route>
          </Switch>
          </AppContainer>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
