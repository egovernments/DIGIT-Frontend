//here export a func that basically registers the app using single spa react pkg
//routing and all we have to handle in remote app itself
//need to share history obj i think(we need to rethink the routing part)

import { registerApplication,start } from "single-spa";

export default (queryClient) => {

  const userType = Digit.UserService.getType();


  // registerApplication({
  //   name: "Workbench",
  //   app: () => import("workbench/WorkbenchModule"),
  //   activeWhen: `/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/workbench`,
  //   customProps: {
  //     title: "Workbench is running on host",
  //     queryClient,
  //     userType
  //   },
  // });


  // registerApplication({
  //   name: "Common",
  //   app: () => import("common/CommonModule"),
  //   activeWhen: `/${window.contextPath ? window.contextPath : "core-digit-ui"}/${userType}/payment`, //change to userType here
  //   customProps: {
  //     title: "Common Module is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

  // registerApplication({
  //   name: "PGR",
  //   app: () => import("pgr/PGRModule"),
  //   activeWhen: `/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/pgr/`,
  //   customProps: {
  //     title: "PGR is running on host",
  //     queryClient,
  //     userType
  //   },
  //  });

  //  registerApplication({
  //   name: "Dss",
  //   app: () => import("dss/DSSModule"),
  //   activeWhen: `/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/dss`,
  //   customProps: {
  //     title: "DSS is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

    registerApplication({
    name: "HRMS",
    app: () => import("hrms/HRMSModule"),
    activeWhen: `/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/hrms`,
    customProps: {
      title: "HRMS is running on host",
      queryClient,
      userType
    },
  }); 

  start();
}

