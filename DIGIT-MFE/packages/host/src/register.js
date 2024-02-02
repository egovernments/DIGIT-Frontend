import { registerApplication, start } from "single-spa";

import { QueryClient } from "react-query";

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

start();
