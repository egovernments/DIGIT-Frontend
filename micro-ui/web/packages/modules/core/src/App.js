import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
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

const SignUp = lazyWithFallback(
  () => import(/* webpackChunkName: "sign-up" */ "./pages/employee/SignUp"),
  () => require("./pages/employee/SignUp").default,
  { loaderText: "Loading Sign Up..." }
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
        <Route path={`/${window?.contextPath}/employee/*`} element={<EmployeeApp {...commonProps} />} />
      )}
      {allowedUserTypes?.includes("citizen") && (
        <Route path={`/${window?.contextPath}/citizen/*`} element={<CitizenApp {...commonProps} />} />
      )}
      {allowedUserTypes?.includes("employee") && (
        <Route path={`/${window?.contextPath}/no-top-bar/employee`} element={<EmployeeApp {...commonProps} noTopBar />} />
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
        <Route path={`/${window?.globalPath}/user/invalid-url`} element={<CustomErrorComponent />} />
        <Route path={`/${window?.globalPath}/user/sign-up`} element={<SignUp stateCode={stateCode} />} />
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
        <Route path="*" element={<Navigate to={`/${window?.globalPath}/user/sign-up`} />} />
      </Routes>
    </div>
  );
};