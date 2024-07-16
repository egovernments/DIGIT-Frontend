import Theme from "./examples/Theme";
import StatusBar from "./components/statusBar";
import LanguageSwitcher from "./components/LanguageSelector";
import MyComponent from "./components/SampleComponent";
import { useQuery } from "@tanstack/react-query";
import { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import withAuth from "./hoc/withAuth";
import Drawer from "./components/Drawer";
import ClickableScreen from "./components/ClickableScreen";
import { clearAllStorages } from "./state/useClearAll";
const basePath = import.meta.env.BASE_URL;
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const routes = [
  {
    url: "complex-screen",
    withAuth: true,
    component: lazy(() => import("./pages/test")),
  },
  {
    url: "tab-form",
    withAuth: true,
    component: lazy(() => import("./pages/TabForm")),
  },
  {
    url: "TestIdb",
    withAuth: true,
    component: lazy(() => import("./pages/testIdb")),
  },
  {
    url: "sample",
    withAuth: true,
    component: lazy(() => import("./pages/Sample")),
  },
  {
    url: "stepper-form",
    withAuth: false,
    component: lazy(() => import("./pages/StepperForm")),
  },
];
const fetchTodo = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return response.json();
};

export const TodoComponent = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["todo"],
    queryFn: fetchTodo,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.title}</div>;
};

function App() {
  const [state,setState]=useState(false);
  return (
    <>
    <ClickableScreen>
      <div>
        <TodoComponent></TodoComponent>
        <Drawer></Drawer>
        <Suspense
          fallback={
            <h1 className="text-2xl text-center font-bold mt-5">Loading...</h1>
          }
        >
          <Theme>
            <Router>
              <div>
                <nav>
                  <ul>
                    {routes?.map((route) => (
                      <li>
                        <Link to={`${basePath}${route?.url}`}>
                          {route?.url}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    {routes?.map((route) => {
                      const Component = route?.withAuth
                        ? withAuth(route?.component)
                        : route?.component;
                      return (
                        <Route
                          path={`${basePath}${route?.url}`}
                          element={<Component />}
                        />
                      );
                    })}
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </Theme>
          <LanguageSwitcher />
          <MyComponent />
          <StatusBar></StatusBar>
        </Suspense>
      </div>
      <button onClick={()=>clearAllStorages()}>claer</button>
      <button onClick={()=>setState(!state)}>debug query</button>
        <ReactQueryDevtools initialIsOpen={state} />

      </ClickableScreen>
    </>
  );
}




export default App;
