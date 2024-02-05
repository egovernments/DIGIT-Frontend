import * as singleSpa from "single-spa";
// import { registerApplication, start } from "single-spa";

import { QueryClient } from "react-query";
import { initLibraries } from "@egovernments/digit-ui-libraries";
const { registerApplication, start } = singleSpa;
singleSpa.setUnloadMaxTime(100000, true);
singleSpa.setBootstrapMaxTime(1000000, true);
initLibraries();
const queryClient = new QueryClient();

registerApplication({
  name: "app1",
  app: () => import("app1/App"),
  activeWhen: "/",
  customProps: {
    title: "App 1 running on host",
    queryClient,
  },
});

registerApplication({
  name: "app2",
  app: () => import("app2/App"),
  activeWhen: "/",
  customProps: {
    title: "App 2 running on host",
    queryClient,
  },
});

registerApplication({
  name: "app3",
  app: () => import("app3/App"),
  activeWhen: "/",
  customProps: {
    title: "App 3 running on host",
    queryClient,
  },
});

start();
