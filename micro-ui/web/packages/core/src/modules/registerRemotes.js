//here export a func that basically registers the app using single spa react pkg
//routing and all we have to handle in remote app itself
//need to share history obj i think(we need to rethink the routing part)

import { registerApplication,start } from "single-spa";

export default (queryClient) => {

  // registerApplication({
  //   name: "Workbench",
  //   app: () => import("workbench/WorkbenchModule"),
  //   activeWhen: "/workbench-ui/employee/workbench",
  //   customProps: {
  //     title: "Workbench is running on host",
  //     queryClient,
  //   },
  // });

  // registerApplication({
  //   name: "app1",
  //   app: () => import("app1/App"),
  //   activeWhen: "/",
  //   customProps: {
  //     title: "App 1 running on host",
  //     queryClient,
  //   },
  // });

  // start();
}

