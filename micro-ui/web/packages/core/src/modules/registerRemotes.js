//here export a func that basically registers the app using single spa react pkg
//routing and all we have to handle in remote app itself
//need to share history obj i think(we need to rethink the routing part)

import { registerApplication, start } from "single-spa";

export default (queryClient) => {
  registerApplication({
    name: "TQM",
    app: () => import("tqm/TQMModule"),
    activeWhen: "/workbench-ui/employee/tqm",
    customProps: {
      title: "TQM is running on host",
      queryClient,
    },
  });
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
  //   name: "PGR",
  //   app: () => import("pgr/PGRModule"),
  //   activeWhen: "/workbench-ui/employee/pgr",
  //   customProps: {
  //     title: "PGR is running on host",
  //     queryClient,
  //   },
  //  });

  const userType = Digit.UserService.getType();

  // registerApplication({
  //   name: "Common",
  //   app: () => import("common/CommonModule"),
  //   activeWhen: `/workbench-ui/${userType}/common`, //change to userType here
  //   customProps: {
  //     title: "Common Module is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

  registerApplication({
    name: "Dss",
    app: () => import("dss/DSSModule"),
    activeWhen: "/workbench-ui/employee/dss",
    customProps: {
      title: "DSS is running on host",
      queryClient,
    },
  });

  // registerApplication({
  //   name: "app1",
  //   app: () => import("app1/App"),
  //   activeWhen: "/",
  //   customProps: {
  //     title: "App 1 running on host",
  //     queryClient,
  //   },
  // });

  // registerApplication({
  //   name: "HRMS",
  //   app: () => import("hrms/HRMSModule"),
  //   activeWhen: "/workbench-ui/employee/hrms",
  //   customProps: {
  //     title: "HRMS is running on host",
  //     queryClient,
  //   },
  // });

  start();
};
