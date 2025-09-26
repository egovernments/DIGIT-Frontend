import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-components";

// Try to use lazy loading, with fallback to regular imports
let CitizenApp, EmployeeApp, SignUp, Otp, ViewUrl, CustomErrorComponent, DummyLoaderScreen;

try {
  // Attempt lazy loading (will work in apps with proper webpack setup)
  CitizenApp = lazy(() => import(/* webpackChunkName: "citizen-app" */ "./pages/citizen"));
  EmployeeApp = lazy(() => import(/* webpackChunkName: "employee-app" */ "./pages/employee"));
  SignUp = lazy(() => import(/* webpackChunkName: "sign-up" */ "./pages/employee/SignUp"));
  Otp = lazy(() => import(/* webpackChunkName: "otp" */ "./pages/employee/Otp"));
  ViewUrl = lazy(() => import(/* webpackChunkName: "view-url" */ "./pages/employee/ViewUrl"));
  CustomErrorComponent = lazy(() => import(/* webpackChunkName: "custom-error" */ "./components/CustomErrorComponent"));
  DummyLoaderScreen = lazy(() => import(/* webpackChunkName: "dummy-loader" */ "./components/DummyLoader"));
} catch (e) {
  // Fallback to regular imports if lazy loading is not available
  CitizenApp = require("./pages/citizen").default;
  EmployeeApp = require("./pages/employee").default;
  SignUp = require("./pages/employee/SignUp").default;
  Otp = require("./pages/employee/Otp").default;
  ViewUrl = require("./pages/employee/ViewUrl").default;
  CustomErrorComponent = require("./components/CustomErrorComponent").default;
  DummyLoaderScreen = require("./components/DummyLoader").default;
}

// Helper to wrap components with Suspense only if they're lazy loaded
const withSuspense = (Component, props) => {
  // Check if it's a lazy component
  if (Component._result || Component.$$typeof === Symbol.for('react.lazy')) {
    return (
      <Suspense fallback={<Loader page={true} variant="PageLoader" loaderText={"Loading App"} />}>
        <Component {...props} />
      </Suspense>
    );
  }
  // Regular component, render directly
  return <Component {...props} />;
};

export const DigitApp = ({ stateCode, modules, appTenants, logoUrl, logoUrlWhite, initData, defaultLanding = "citizen", allowedUserTypes = ["citizen", "employee"] }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const innerWidth = window.innerWidth;
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const userDetails = Digit.UserService.getUser();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};

  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  let CITIZEN = userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;

  if (window.location.pathname.split("/").includes("employee")) CITIZEN = false;



  const handleUserDropdownSelection = (option) => {
    option.func();
  };

  const mobileView = innerWidth <= 640;
  let sourceUrl = `${window.location.origin}/citizen`;
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
      {allowedUserTypes?.includes("employee") && (
        <Route path={`/${window?.contextPath}/employee/*`} element={withSuspense(EmployeeApp, commonProps)} />
      )}
      {allowedUserTypes?.includes("citizen") && (
        <Route path={`/${window?.contextPath}/citizen/*`} element={withSuspense(CitizenApp, commonProps)} />
      )}
      {allowedUserTypes?.includes("employee") && (
        <Route path={`/${window?.contextPath}/no-top-bar/employee`} element={withSuspense(EmployeeApp, { ...commonProps, noTopBar: true })} />
      )}
      <Route path="*" element={<Navigate to={`/${window?.contextPath}/${defaultLanding}`} />} />
    </Routes>
  );
};

export const DigitAppWrapper = ({ stateCode, modules, appTenants, logoUrl, logoUrlWhite, initData, defaultLanding = "citizen" ,allowedUserTypes}) => {
  // const globalPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const userScreensExempted = ["user/error"];
  const isUserProfile = userScreensExempted.some((url) => location?.pathname?.includes(url));
  const userDetails = Digit.UserService.getUser();
  let CITIZEN = userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;
  const innerWidth = window.innerWidth;
  const mobileView = innerWidth <= 640;

  return (
    <div
      className={isUserProfile ? "grounded-container" : "loginContainer"}
      style={
        isUserProfile ? { padding: 0, paddingTop: CITIZEN ? "0" : mobileView && !CITIZEN ? "3rem" : "80px", marginLeft: CITIZEN || mobileView ? "0" : "40px" } : { "--banner-url": `url(${stateInfo?.bannerUrl})`, padding: "0px" }
      }
    >
      <Routes>
        <Route path={`/${window?.globalPath}/user/invalid-url`} element={withSuspense(CustomErrorComponent, {})} />
        <Route path={`/${window?.globalPath}/user/sign-up`} element={withSuspense(SignUp, { stateCode })} />
        <Route path={`/${window?.globalPath}/user/otp`} element={withSuspense(Otp, {})} />
        <Route path={`/${window?.globalPath}/user/setup`} element={withSuspense(DummyLoaderScreen, {})} />
        <Route path={`/${window?.globalPath}/user/url`} element={withSuspense(ViewUrl, {})} />
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
                allowedUserTypes={allowedUserTypes}
              />
            }
          />
        )}
        <Route path="*" element={<Navigate to={`/${window?.globalPath}/user/sign-up`} />} />
      </Routes>
    </div>
  );
};