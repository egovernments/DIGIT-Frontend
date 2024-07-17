//here export a func that basically registers the app using single spa react pkg
//routing and all we have to handle in remote app itself
//need to share history obj i think(we need to rethink the routing part)

import { registerApplication, start } from 'single-spa';

export default (queryClient={}) => {
  const userType = "employee";

  // registerApplication({
  //   name: "app1",
  //   app: () => import("app1/App"),
  //   activeWhen: `/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/app`,
  //   customProps: {
  //     title: "App1 is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

  // registerApplication({
  //   name: 'PGR',
  //   app: () => import('pgr/PGRModule'),
  //   activeWhen: `/${
  //     window.contextPath ? window.contextPath : 'core-digit-ui'
  //   }/${userType}/pgr`,
  //   customProps: {
  //     title: 'PGR is running on host',
  //     queryClient,
  //     userType,
  //   },
  // });

  // registerApplication({
  //   name: 'Workbench',
  //   app: () => import('workbench/WorkbenchModule'),
  //   activeWhen: `/${
  //     window.contextPath ? window.contextPath : 'core-digit-ui'
  //   }/employee/workbench`,
  //   customProps: {
  //     title: 'Workbench is running on host',
  //     queryClient,
  //     userType,
  //   },
  // });
  
  // registerApplication({
  //   name: 'Microplan',
  //   app: () => import('microplan/MICROPLANModule'),
  //   activeWhen: `/${
  //     window.contextPath ? window.contextPath : 'core-digit-ui'
  //   }/employee/microplan`,
  //   customProps: {
  //     title: 'Microplan is running on host',
  //     queryClient,
  //     userType,
  //   },
  // });

  registerApplication({
    name: 'app',
    app: () => import('app1/App'),
/* The `activeWhen` property in the `registerApplication` function is used to determine when the
application should be active based on the current URL. */
    // activeWhen: `/${
    //   window.contextPath ? window.contextPath : 'core-digit-ui'
    // }/app`,
    activeWhen: `/app`,
    customProps: {
      title: 'HRMS is running on host',
      queryClient,
      userType,
    },
  });

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

  // registerApplication({
  //   name: "TQM",
  //   app: () => import("tqm/TQMModule"),
  //   activeWhen: `/${window.contextPath ? window.contextPath : "core-digit-ui"}/employee/tqm`,
  //   customProps: {
  //     title: "TQM is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

  // registerApplication({
  //   name: "Engagement",
  //   app: () => import("engagement/EngagementModule"),
  //   activeWhen: [
  //     `/${window.contextPath ? window.contextPath : "core-digit-ui"}/${userType}/engagement`,
  //     `/${window.contextPath ? window.contextPath : "core-digit-ui"}/${userType}/engagement`
  //   ],
  //   customProps: {
  //     title: "Engagement is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

  start();
};
