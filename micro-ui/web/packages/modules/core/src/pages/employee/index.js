import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { AppModules } from "../../components/AppModules";
import ErrorBoundary from "../../components/ErrorBoundaries";
import TopBarSideBar from "../../components/TopBarSideBar";
import { PrivateRoute } from "@egovernments/digit-ui-components";
import ImageComponent from "../../components/ImageComponent";
import withAutoFocusMain from "../../hoc/withAutoFocusMain";
import { lazyWithFallback } from "@egovernments/digit-ui-components";

// Create lazy components with fallbacks using the utility
const ChangePassword = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-change-password" */ "./ChangePassword"),
  () => require("./ChangePassword").default,
  { loaderText: "Loading Change Password..." }
);

const ForgotPassword = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-forgot-password" */ "./ForgotPassword"),
  () => require("./ForgotPassword").default,
  { loaderText: "Loading Forgot Password..." }
);

const LanguageSelection = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-language-selection" */ "./LanguageSelection"),
  () => require("./LanguageSelection").default,
  { loaderText: "Loading Language Selection..." }
);

const EmployeeLogin = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-login" */ "./Login"),
  () => require("./Login").default,
  { loaderText: "Loading Login..." }
);

const Otp = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-otp" */ "./Otp"),
  () => require("./Otp").default,
  { loaderText: "Loading OTP..." }
);

const UserProfile = lazyWithFallback(
  () => import(/* webpackChunkName: "user-profile" */ "../citizen/Home/UserProfile"),
  () => require("../citizen/Home/UserProfile").default,
  { loaderText: "Loading User Profile..." }
);

const ErrorComponent = lazyWithFallback(
  () => import(/* webpackChunkName: "error-component" */ "../../components/ErrorComponent"),
  () => require("../../components/ErrorComponent").default,
  { loaderText: "Loading Error Component..." }
);

const userScreensExempted = ["user/landing", "user/profile", "user/error", "user/productPage"];

const EmployeeApp = ({
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
  noTopBar = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const showLanguageChange = location?.pathname?.includes("language-selection");
  const isUserProfile = userScreensExempted.some((url) => location?.pathname?.includes(url));

  // Get the base path for employee routes
  const basePath = `/${window?.contextPath}/employee`;

  // Super user with multi-root tenant check
  const isSuperUserWithMultipleRootTenant = Digit.UserService.hasAccess("SUPERUSER") && Digit.Utils.getMultiRootTenant();
  
  // Check if on product details page for conditional styling
  const hideClass = location.pathname.includes(`employee/sandbox/productDetailsPage/`);

  useEffect(() => {
    Digit.UserService.setType("employee");
  }, []);

  // Super user redirect logic
  useEffect(() => {
    const isDirectAccess = location.pathname === basePath || location.pathname === `${basePath}/`;
    const queryParams = new URLSearchParams(location.search);
    const cameFromButton = queryParams.get("from") === "sandbox";
    if (isSuperUserWithMultipleRootTenant && isDirectAccess && !cameFromButton) {
      navigate(`${basePath}/sandbox/productPage`, { replace: true });
    }
  }, [location.pathname, location.search, basePath, navigate, isSuperUserWithMultipleRootTenant]);

  const additionalComponent = initData?.modules?.filter((i) => i?.additionalComponent)?.map((i) => i?.additionalComponent);

  return (
    <div className="employee">
      <Routes>
        <Route path="user/*" element={
          <>
            {isUserProfile && (
              <TopBarSideBar
                t={t}
                stateInfo={stateInfo}
                userDetails={userDetails}
                CITIZEN={CITIZEN}
                cityDetails={cityDetails}
                mobileView={mobileView}
                handleUserDropdownSelection={handleUserDropdownSelection}
                logoUrl={logoUrl}
                logoUrlWhite={logoUrlWhite}
                showSidebar={isUserProfile ? true : false}
                showLanguageChange={!showLanguageChange}
              />
            )}
            <div
              className={isUserProfile ? "grounded-container" : "loginContainer"}
              style={
                isUserProfile
                  ? { padding: 0, paddingTop: "0", marginLeft: mobileView ? "0" : "0" }
                  : { "--banner-url": `url(${stateInfo?.bannerUrl})`, padding: "0px" }
              }
            >
              <Routes>
                {/* Login route - only available if NOT multi-root tenant */}
                {!Digit.Utils.getMultiRootTenant() && (
                  <Route path="login" element={<EmployeeLogin stateCode={stateCode} />} />
                )}
                <Route path="login/otp" element={<Otp isLogin={true} />} />
                <Route path="forgot-password" element={<ForgotPassword stateCode={stateCode} />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route
                  path="profile"
                  element={
                    <PrivateRoute element={<UserProfile stateCode={stateCode} userType={"employee"} cityDetails={cityDetails} />} />
                  }
                />
                <Route
                  path="error"
                  element={
                    <ErrorComponent
                      initData={initData}
                      goToHome={() => {
                        navigate(`/${window?.contextPath}/${Digit?.UserService?.getType?.()}`);
                      }}
                    />
                  }
                />
                <Route path="language-selection" element={<LanguageSelection />} />
                <Route path="*" element={<Navigate to="language-selection" replace />} />
              </Routes>
            </div>
          </>
        } />

        <Route path="*" element={
          <>
            {!noTopBar && (
              <TopBarSideBar
                t={t}
                stateInfo={stateInfo}
                userDetails={userDetails}
                CITIZEN={CITIZEN}
                cityDetails={cityDetails}
                mobileView={mobileView}
                handleUserDropdownSelection={handleUserDropdownSelection}
                logoUrl={logoUrl}
                logoUrlWhite={logoUrlWhite}
                modules={modules}
              />
            )}
            <div className={!noTopBar ? `${isSuperUserWithMultipleRootTenant ? "" : "main"} ${DSO ? "m-auto" : ""} digit-home-main` : ""}>
              <div className={!noTopBar ? `${isSuperUserWithMultipleRootTenant && hideClass ? "" : "employee-app-wrapper"} digit-home-app-wrapper` : ""}>
                <ErrorBoundary initData={initData}>
                  <AppModules
                    stateCode={stateCode}
                    userType="employee"
                    modules={modules}
                    appTenants={appTenants}
                    additionalComponent={additionalComponent}
                  />
                </ErrorBoundary>
              </div>
              <div className="employee-home-footer">
                <ImageComponent
                  alt="Powered by DIGIT"
                  src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER")}
                  style={{ height: "1.1em", cursor: "pointer" }}
                  onClick={() => {
                    window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
                  }}
                />
              </div>
            </div>
          </>
        } />

        <Route path="*" element={<Navigate to="user/language-selection" replace />} />
      </Routes>
    </div>
  );
};

export default withAutoFocusMain(EmployeeApp, ".digit-home-main");