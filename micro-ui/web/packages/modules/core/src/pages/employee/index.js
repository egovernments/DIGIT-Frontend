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
  { loaderText: "CORE_LOADING_CHANGE_PASSWORD" }
);

const ForgotPassword = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-forgot-password" */ "./ForgotPassword"),
  () => require("./ForgotPassword").default,
  { loaderText: "CORE_LOADING_FORGOT_PASSWORD" }
);

const LanguageSelection = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-language-selection" */ "./LanguageSelection"),
  () => require("./LanguageSelection").default,
  { loaderText: "CORE_LOADING_LANGUAGE_SELECTION" }
);

const EmployeeLogin = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-login" */ "./Login"),
  () => require("./Login").default,
  { loaderText: "CORE_LOADING_LOGIN" }
);

const Otp = lazyWithFallback(
  () => import(/* webpackChunkName: "employee-otp" */ "./Otp"),
  () => require("./Otp").default,
  { loaderText: "CORE_LOADING_OTP" }
);

const UserProfile = lazyWithFallback(
  () => import(/* webpackChunkName: "user-profile" */ "../citizen/Home/UserProfile"),
  () => require("../citizen/Home/UserProfile").default,
  { loaderText: "CORE_LOADING_USER_PROFILE" }
);

const ErrorComponent = lazyWithFallback(
  () => import(/* webpackChunkName: "error-component" */ "../../components/ErrorComponent"),
  () => require("../../components/ErrorComponent").default,
  { loaderText: "CORE_LOADING_ERROR_COMPONENT" }
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
  stateCode,
  modules,
  appTenants,
  sourceUrl,
  pathname, // This prop seems unused, consider removing
  initData,
  noTopBar = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const showLanguageChange = location?.pathname?.includes("language-selection");
  const isUserProfile = userScreensExempted.some((url) => location?.pathname?.includes(url));

  useEffect(() => {
    Digit.UserService.setType("employee");
  }, []);

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
                <Route path="login" element={<EmployeeLogin stateCode={stateCode} />} />
                <Route path="login/otp" element={<Otp isLogin={true} />} />
                <Route path="forgot-password" element={<ForgotPassword stateCode={stateCode} />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route
                  path="profile"
                  element={ <UserProfile stateCode={stateCode} userType={"employee"} cityDetails={cityDetails} />}
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
          </>}
        />

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
            <div className={!noTopBar ? `main digit-home-main` : ""}>
              <div className="employee-app-wrapper digit-home-app-wrapper">
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
        }/>

        <Route path="*" element={<Navigate to={`user/language-selection`} replace />} />
      </Routes>
    </div>
  );
};

export default withAutoFocusMain(EmployeeApp, ".digit-home-main");