//here export a func that basically registers the app using single spa react pkg
//routing and all we have to handle in remote app itself
//need to share history obj i think(we need to rethink the routing part)

import { registerApplication, start } from 'single-spa';

export default (queryClient) => {
  const userType = Digit.UserService.getType();

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
  //     window.contextPath ? window.contextPath : 'ui'
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
  //     window.contextPath ? window.contextPath : 'ui'
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
  //     window.contextPath ? window.contextPath : 'ui'
  //   }/employee/microplan`,
  //   customProps: {
  //     title: 'Microplan is running on host',
  //     queryClient,
  //     userType,
  //   },
  // });

  // registerApplication({
  //   name: 'Campaign',
  //   app: () => import('campaign/CAMPAIGNModule'),
  //   activeWhen: `/${
  //     window.contextPath ? window.contextPath : 'ui'
  //   }/employee/campaign`,
  //   customProps: {
  //     title: 'Campaign is running on host',
  //     queryClient,
  //     userType,
  //   },
  // });

  registerApplication({
    name: 'HRMS',
    app: () => import('hrms/HRMSModule'),
    activeWhen: `/${
      window.contextPath ? window.contextPath : 'ui'
    }/employee/hrms`,
    customProps: {
      title: 'HRMS is running on host',
      queryClient,
      userType,
    },
  });

  // registerApplication({
  //   name: "Common",
  //   app: () => import("common/CommonModule"),
  //   activeWhen: `/${window.contextPath ? window.contextPath : "ui"}/${userType}/payment`, //change to userType here
  //   customProps: {
  //     title: "Common Module is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

  //  registerApplication({
  //   name: "Dss",
  //   app: () => import("dss/DSSModule"),
  //   activeWhen: `/${window.contextPath ? window.contextPath : "ui"}/employee/dss`,
  //   customProps: {
  //     title: "DSS is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

  // // registerApplication({
  // //   name: "TQM",
  // //   app: () => import("tqm/TQMModule"),
  // //   activeWhen: `/${window.contextPath ? window.contextPath : "ui"}/employee/tqm`,
  // //   customProps: {
  // //     title: "TQM is running on host",
  // //     queryClient,
  // //     userType
  // //   },
  // // });

  // registerApplication({
  //   name: "Engagement",
  //   app: () => import("engagement/EngagementModule"),
  //   activeWhen: [
  //     `/${window.contextPath ? window.contextPath : "ui"}/${userType}/engagement`,
  //     `/${window.contextPath ? window.contextPath : "ui"}/${userType}/engagement`
  //   ],
  //   customProps: {
  //     title: "Engagement is running on host",
  //     queryClient,
  //     userType
  //   },
  // });

  start();
};
