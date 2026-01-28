import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { lazyWithFallback } from "@egovernments/digit-ui-components";

// Create lazy components with fallbacks using the utility
const CitizenApp = lazyWithFallback(
  () => import(/* webpackChunkName: "citizen-app" */ "./pages/citizen"),
  () => require("./pages/citizen").default,
  { loaderText: "Loading Citizen App..." }
);

const EmployeeApp = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-app" */ "./pages/employee"),
  () => require("./pages/employee").default,
  { loaderText: "Loading Employee App..." }
);

const SignUpV2 = lazyWithFallback(
  () => import(/* webpackChunkName: "sign-up-v2" */ "./pages/employee/SignUp-v2"),
  () => require("./pages/employee/SignUp-v2").default,
  { loaderText: "Loading Sign Up..." }
);

const LoginV2 = lazyWithFallback(
  () => import(/* webpackChunkName: "login-v2" */ "./pages/employee/Login-v2"),
  () => require("./pages/employee/Login-v2").default,
  { loaderText: "Loading Login..." }
);

const Otp = lazyWithFallback(
  () => import(/* webpackChunkName: "otp" */ "./pages/employee/Otp"),
  () => require("./pages/employee/Otp").default,
  { loaderText: "Loading OTP..." }
);

const ViewUrl = lazyWithFallback(
  () => import(/* webpackChunkName: "view-url" */ "./pages/employee/ViewUrl"),
  () => require("./pages/employee/ViewUrl").default,
  { loaderText: "Loading View URL..." }
);

const CustomErrorComponent = lazyWithFallback(
  () => import(/* webpackChunkName: "custom-error" */ "./components/CustomErrorComponent"),
  () => require("./components/CustomErrorComponent").default,
  { loaderText: "Loading Error Component..." }
);

const DummyLoaderScreen = lazyWithFallback(
  () => import(/* webpackChunkName: "dummy-loader" */ "./components/DummyLoader"),
  () => require("./components/DummyLoader").default,
  { loaderText: "Loading..." }
);

export const DigitApp = ({
  stateCode,
  modules,
  appTenants,
  logoUrl,
  logoUrlWhite,
  initData,
  defaultLanding = "citizen",
  allowedUserTypes = ["citizen", "employee"],
}) => {
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

  // Session storage cleanup on route changes
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
    if (pathname?.toString() === `/${window?.contextPath}/employee`) {
      Digit.SessionStorage.del("SEARCH_APPLICATION_DETAIL");
      Digit.SessionStorage.del("WS_EDIT_APPLICATION_DETAILS");
    }
    if (pathname?.toString() === `/${window?.contextPath}/citizen` || pathname?.toString() === `/${window?.contextPath}/employee`) {
      Digit.SessionStorage.del("WS_DISCONNECTION");
    }
  }, [pathname]);

  // Scroll to top on route changes
  useEffect(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

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
      {allowedUserTypes?.some((userType) => userType === "employee") && (
        <Route path={`/${window?.contextPath}/employee/*`} element={<EmployeeApp {...commonProps} />} />
      )}
      {allowedUserTypes?.some((userType) => userType === "citizen") && (
        <Route path={`/${window?.contextPath}/citizen/*`} element={<CitizenApp {...commonProps} />} />
      )}
      {allowedUserTypes?.some((userType) => userType === "employee") && (
        <Route path={`/${window?.contextPath}/no-top-bar/employee/*`} element={<EmployeeApp {...commonProps} noTopBar={true} />} />
      )}
      <Route path="*" element={<Navigate to={`/${window?.contextPath}/${defaultLanding}`} replace />} />
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
  allowedUserTypes,
}) => {
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
        isUserProfile
          ? {
              padding: 0,
              paddingTop: CITIZEN ? "0" : mobileView && !CITIZEN ? "3rem" : "80px",
              marginLeft: CITIZEN || mobileView ? "0" : "40px",
            }
          : { "--banner-url": `url(${stateInfo?.bannerUrl})`, padding: "0px" }
      }
    >
      <Routes>
        <Route path={`/${window?.globalPath}/user/invalid-url`} element={<CustomErrorComponent />} />
        <Route path={`/${window?.globalPath}/user/sign-up`} element={<SignUpV2 stateCode={stateCode} />} />
        <Route path={`/${window?.globalPath}/user/login`} element={<LoginV2 stateCode={stateCode} />} />
        <Route path={`/${window?.globalPath}/user/otp`} element={<Otp />} />
        <Route path={`/${window?.globalPath}/user/setup`} element={<DummyLoaderScreen />} />
        <Route path={`/${window?.globalPath}/user/url`} element={<ViewUrl />} />
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
        <Route path="*" element={<Navigate to={`/${window?.globalPath}/user/sign-up`} replace />} />
      </Routes>
    </div>
  );
};