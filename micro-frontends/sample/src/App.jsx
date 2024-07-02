import "./App.css";
import Users from "./examples/Users";
import Theme from "./examples/Theme";
import Action from "./examples/Action";
import Optimistic from "./examples/Optimistic";
import FormStatus from "./examples/FormStatus";
import FormState from "./examples/FormState";
// import Test from "./pages/test";
import StatusBar from "./components/statusBar";
import { isOnline, onNetworkChange } from "./idb/networkStatus";
// import TestIdb from "./pages/testIdb";
// import TabForm from "./pages/TabForm";
// import StepperFormScreen from "./pages/StepperForm";
import LanguageSwitcher from "./components/LanguageSelector";
import MyComponent from "./components/SampleComponent";
// import TestIdb from "./pages/TestIdb.jsx";
// import { isOnline, onNetworkChange } from './networkStatus';

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const routes = [
  {
    url: "complex-screen",
    component: lazy(() => import("./pages/test")),
  },
  {
    url: "tab-form",
    component: lazy(() => import("./pages/TabForm")),
  },
  {
    url: "TestIdb",
    component: lazy(() => import("./pages/testIdb")),
  },
  {
    url: "sample",
    component: lazy(() => import("./pages/Sample")),
  },
  {
    url: "stepper-form",
    component: lazy(() => import("./pages/StepperForm")),
  },
];

function App() {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <h1 className="text-2xl text-center font-bold mt-5">Loading...</h1>
          }
        >
          {/* <Action />
          <FormState />
         <FormStatus />
           <Optimistic /> */}
          {/* <Users /> */}
          <Theme>
            <Router>
              <div>
                <nav>
                  <ul>
                    {routes?.map((route) => (
                      <li>
                        <Link to={route?.url}>{route?.url}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    {routes?.map((route) => {
                      const Component = route?.component;
                      return (
                        <Route path={route?.url} element={<Component />} />
                      );
                    })}
                  </Routes>
                </Suspense>
              </div>
            </Router>

            {/* <Sample></Sample>
          <Test></Test>
       <TestIdb></TestIdb>
          </Theme>
          <Theme >
<TabForm></TabForm>
</Theme>
<Theme >
<StepperFormScreen></StepperFormScreen> */}
          </Theme>

          <LanguageSwitcher />
          <MyComponent />

          <StatusBar></StatusBar>
        </Suspense>
      </div>
    </>
  );
}

export default App;
