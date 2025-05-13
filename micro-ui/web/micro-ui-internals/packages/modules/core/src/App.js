// import React, { useEffect } from "react";
// import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
// import CitizenApp from "./pages/citizen";
// import EmployeeApp from "./pages/employee";
// import SignUp from "./pages/employee/SignUp";
// import Otp from "./pages/employee/Otp";
// import ViewUrl from "./pages/employee/ViewUrl";
// import CustomErrorComponent from "./components/CustomErrorComponent";
// import DummyLoaderScreen from "./components/DummyLoader";
// // import useStore from "../libraries/src/hooks/useStore"

// export const DigitApp = ({ stateCode, modules, appTenants, logoUrl, logoUrlWhite, initData, defaultLanding = "citizen" }) => {
//   console.log("inside core App")
//   // const history = useHistory();
//   const { pathname } = useLocation();
//   const innerWidth = window.innerWidth;
//   const cityDetails = Digit?.ULBService?.getCurrentUlb();
//   const userDetails = Digit.UserService.getUser();
//   const { data: storeData } = Digit.Hooks.useStore.getInitData();
//   const { stateInfo } = storeData || {};

//   const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
//   let CITIZEN = userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;

//   if (window.location.pathname.split("/").includes("employee")) CITIZEN = false;

//   useEffect(() => {
//     if (!pathname?.includes("application-details")) {
//       if (!pathname?.includes("inbox")) {
//         Digit.SessionStorage.del("fsm/inbox/searchParams");
//       }
//       if (pathname?.includes("search")) {
//         Digit.SessionStorage.del("fsm/search/searchParams");
//       }
//     }
//     if (!pathname?.includes("dss")) {
//       Digit.SessionStorage.del("DSS_FILTERS");
//     }
//     if (pathname?.toString() === `/${window?.contextPath}/employee`) {
//       Digit.SessionStorage.del("SEARCH_APPLICATION_DETAIL");
//       Digit.SessionStorage.del("WS_EDIT_APPLICATION_DETAILS");
//     }
//     if (pathname?.toString() === `/${window?.contextPath}/citizen` || pathname?.toString() === `/${window?.contextPath}/employee`) {
//       Digit.SessionStorage.del("WS_DISCONNECTION");
//     }
//   }, [pathname]);

//   // history.listen(() => {
//   //   window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//   // });

//   const handleUserDropdownSelection = (option) => {
//     option.func();
//   };

//   const mobileView = innerWidth <= 640;
//   let sourceUrl = `${window.location.origin}/citizen`;
//   const commonProps = {
//     stateInfo,
//     userDetails,
//     CITIZEN,
//     cityDetails,
//     mobileView,
//     handleUserDropdownSelection,
//     logoUrl,
//     logoUrlWhite,
//     DSO,
//     stateCode,
//     modules,
//     appTenants,
//     sourceUrl,
//     pathname,
//     initData,
//   };

//   return (
//     <Switch>
//       <Route path={`/${window?.contextPath}/employee`}>
//         <EmployeeApp {...commonProps} />
//       </Route>
//       <Route path={`/${window?.contextPath}/citizen`}>
//         <CitizenApp {...commonProps} />
//       </Route>
//       <Route>
//         <Redirect to={`/${window?.contextPath}/${defaultLanding}`} />
//       </Route>
//     </Switch>
//   );
// };

// export const DigitAppWrapper = ({ stateCode, modules, appTenants, logoUrl, logoUrlWhite, initData, defaultLanding = "citizen" }) => {
//   // const globalPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
//   console.log("inside digitapp wrapper")
//   const { data: storeData } = useStore.getInitData();
//   const { stateInfo } = storeData || {};
//   const userScreensExempted = ["user/profile", "user/error"];
//   const isUserProfile = userScreensExempted.some((url) => location?.pathname?.includes(url));
//   const userDetails = Digit.UserService.getUser();
//   let CITIZEN = userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;
//   const innerWidth = window.innerWidth;
//   const mobileView = innerWidth <= 640;

//   return (
//     <div
//       className={isUserProfile ? "grounded-container" : "loginContainer"}
//       style={
//         isUserProfile ? { padding: 0, paddingTop: CITIZEN ? "0" : mobileView && !CITIZEN ? "3rem" : "80px", marginLeft: CITIZEN || mobileView ? "0" : "40px" } : { "--banner-url": `url(${stateInfo?.bannerUrl})`, padding: "0px" }
//       }
//     >
//       <Switch>
//         <Route exact path={`/${window?.globalPath}/user/invalid-url`}>
//           <CustomErrorComponent />
//         </Route>
//         <Route exact path={`/${window?.globalPath}/user/sign-up`}>
//           <SignUp stateCode={stateCode} />
//         </Route>
//         <Route exact path={`/${window?.globalPath}/user/otp`}>
//           <Otp />
//         </Route>
//         <Route exact path={`/${window?.globalPath}/user/setup`}>
//           <DummyLoaderScreen />
//         </Route>
//         <Route exact path={`/${window?.globalPath}/user/url`}>
//           <ViewUrl />
//         </Route>
//         <Route exact path={`/${window?.globalPath}/home`}>
//          <>Hi</>
//         </Route>
//         {window?.globalPath !== window?.contextPath && (
//           <Route path={`/${window?.contextPath}`}>
//             <DigitApp
//               stateCode={stateCode}
//               modules={modules}
//               appTenants={appTenants}
//               logoUrl={logoUrl}
//               logoUrlWhite={logoUrlWhite}
//               initData={initData}
//               defaultLanding={defaultLanding}
//             />
//           </Route>
//         )}
//         <Route>
//           <Redirect to={`/${window?.globalPath}/user/sign-up`} />
//         </Route>
//       </Switch>
//     </div>
//   );
// };

import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import CitizenApp from "./pages/citizen";
import EmployeeApp from "./pages/employee";
import SignUp from "./pages/employee/SignUp";
import Otp from "./pages/employee/Otp";
import ViewUrl from "./pages/employee/ViewUrl";
import CustomErrorComponent from "./components/CustomErrorComponent";
import DummyLoaderScreen from "./components/DummyLoader";
// import useStore from "../libraries/src/hooks/useStore"
// import useStore from "../libraries/src/hooks/useStore"; // Uncomment if used
export const DigitApp = ({
  stateCode,
  modules,
  appTenants,
  logoUrl,
  logoUrlWhite,
  initData,
  defaultLanding = "citizen",
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const innerWidth = window.innerWidth;
  const cityDetails = Digit?.ULBService?.getCurrentUlb();
  const userDetails = Digit.UserService.getUser();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  const CITIZEN =
    userDetails?.info?.type === "CITIZEN" ||
    !window.location.pathname.split("/").includes("employee");

  useEffect(() => {
    if (!pathname?.includes("application-details")) {
      if (!pathname?.includes("inbox")) {
        Digit.SessionStorage.del("fsm/inbox/searchParams");
      }
      if (pathname?.includes("search")) {
        Digit.SessionStorage.del("fsm/search/searchParams");
      }
    }
    if (!pathname?.includes("dss")) {
      Digit.SessionStorage.del("DSS_FILTERS");
    }
    if (
      pathname?.toString() === `/${window?.contextPath}/employee` ||
      pathname?.toString() === `/${window?.contextPath}/citizen`
    ) {
      Digit.SessionStorage.del("SEARCH_APPLICATION_DETAIL");
      Digit.SessionStorage.del("WS_EDIT_APPLICATION_DETAILS");
      Digit.SessionStorage.del("WS_DISCONNECTION");
    }
  }, [pathname]);

  const handleUserDropdownSelection = (option) => {
    option.func();
  };

  const mobileView = innerWidth <= 640;
  const sourceUrl = `${window.location.origin}/citizen`;

  const commonProps = {
    stateInfo,
    userDetails,
    CITIZEN,
    cityDetails,
    mobileView,
    handleUserDropdownSelection,
    logoUrl,
    logoUrlWhite,
    DSO,
    stateCode,
    modules,
    appTenants,
    sourceUrl,
    pathname,
    initData,
  };

  return (
    <Routes>
      <Route path={`/${window?.contextPath}/employee/*`} element={<EmployeeApp {...commonProps} />} />
      <Route path={`/${window?.contextPath}/citizen/*`} element={<CitizenApp {...commonProps} />} />
      <Route
        path="*"
        element={<Navigate to={`/${window?.contextPath}/${defaultLanding}`} replace />}
      />
    </Routes>
  );
};

export const DigitAppWrapper = ({
  stateCode,
  modules,
  appTenants,
  logoUrl,
  logoUrlWhite,
  initData,
  defaultLanding = "citizen",
}) => {
  const location = useLocation();
  const innerWidth = window.innerWidth;
  const { data: storeData } = useStore.getInitData();
  const { stateInfo } = storeData || {};
  const userDetails = Digit.UserService.getUser();
  const CITIZEN =
    userDetails?.info?.type === "CITIZEN" ||
    !window.location.pathname.split("/").includes("employee");
  const mobileView = innerWidth <= 640;
  const userScreensExempted = ["user/profile", "user/error"];
  const isUserProfile = userScreensExempted.some((url) =>
    location?.pathname?.includes(url)
  );

  return (
    <div
      className={isUserProfile ? "grounded-container" : "loginContainer"}
      style={
        isUserProfile
          ? {
              padding: 0,
              paddingTop: CITIZEN
                ? "0"
                : mobileView && !CITIZEN
                ? "3rem"
                : "80px",
              marginLeft: CITIZEN || mobileView ? "0" : "40px",
            }
          : {
              "--banner-url": `url(${stateInfo?.bannerUrl})`,
              padding: "0px",
            }
      }
    >
      <Routes>
        <Route
          path={`/${window?.globalPath}/user/invalid-url`}
          element={<CustomErrorComponent />}
        />
        <Route
          path={`/${window?.globalPath}/user/sign-up`}
          element={<SignUp stateCode={stateCode} />}
        />
        <Route
          path={`/${window?.globalPath}/user/otp`}
          element={<Otp />}
        />
        <Route
          path={`/${window?.globalPath}/user/setup`}
          element={<DummyLoaderScreen />}
        />
        <Route
          path={`/${window?.globalPath}/user/url`}
          element={<ViewUrl />}
        />
        <Route
          path={`/${window?.globalPath}/home`}
          element={<>Hi</>}
        />
        {window?.globalPath !== window?.contextPath && (
          <Route
            path={`/${window?.contextPath}/*`}
            element={
              <DigitApp
                stateCode={stateCode}
                modules={modules}
                appTenants={appTenants}
                logoUrl={logoUrl}
                logoUrlWhite={logoUrlWhite}
                initData={initData}
                defaultLanding={defaultLanding}
              />
            }
          />
        )}
        <Route
          path="*"
          element={<Navigate to={`/${window?.globalPath}/user/sign-up`} replace />}
        />
      </Routes>
    </div>
  );
};