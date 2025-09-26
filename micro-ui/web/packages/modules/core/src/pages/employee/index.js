import React, { useEffect, useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation, useNavigate,Navigate } from "react-router-dom"; // Updated imports for v6
import { AppModules } from "../../components/AppModules";
import ErrorBoundary from "../../components/ErrorBoundaries";
import TopBarSideBar from "../../components/TopBarSideBar";
import { PrivateRoute, Loader } from "@egovernments/digit-ui-components"; // Assuming PrivateRoute is v6 compatible or will be adapted
import ImageComponent from "../../components/ImageComponent";
import withAutoFocusMain from "../../hoc/withAutoFocusMain";

// Try to use lazy loading, but have a fallback strategy
let ChangePassword, ForgotPassword, LanguageSelection, EmployeeLogin, Otp, UserProfile, ErrorComponent;

try {
  // Attempt lazy loading (will work in apps with proper webpack setup)
  ChangePassword = lazy(() => import(/* webpackChunkName: "employee-change-password" */ "./ChangePassword"));
  ForgotPassword = lazy(() => import(/* webpackChunkName: "employee-forgot-password" */ "./ForgotPassword"));
  LanguageSelection = lazy(() => import(/* webpackChunkName: "employee-language-selection" */ "./LanguageSelection"));
  EmployeeLogin = lazy(() => import(/* webpackChunkName: "employee-login" */ "./Login"));
  Otp = lazy(() => import(/* webpackChunkName: "employee-otp" */ "./Otp"));
  UserProfile = lazy(() => import(/* webpackChunkName: "user-profile" */ "../citizen/Home/UserProfile"));
  ErrorComponent = lazy(() => import(/* webpackChunkName: "error-component" */ "../../components/ErrorComponent"));
} catch (e) {
  // Fallback to regular imports if lazy loading is not available
  ChangePassword = require("./ChangePassword").default;
  ForgotPassword = require("./ForgotPassword").default;
  LanguageSelection = require("./LanguageSelection").default;
  EmployeeLogin = require("./Login").default;
  Otp = require("./Otp").default;
  UserProfile = require("../citizen/Home/UserProfile").default;
  ErrorComponent = require("../../components/ErrorComponent").default;
}

// Helper to wrap components with Suspense only if they're lazy loaded
const withSuspense = (Component, props) => {
  // Check if it's a lazy component
    const { t } = useTranslation();

  if (Component._result || Component.$$typeof === Symbol.for('react.lazy')) {
    return (
      <Suspense fallback={<Loader page={true} variant="PageLoader" loaderText={t("CORE_LOADING_EMPLOYEE_APP")} />}>
        <Component {...props} />
      </Suspense>
    );
  }
  // Regular component, render directly
  return <Component {...props} />;
};

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
  const navigate = useNavigate(); // Replaced useHistory with useNavigate
  const { t } = useTranslation();
  // `useRouteMatch` is removed in v6. The base path for routing is typically handled by
  // how this component is rendered within its parent Routes structure.
  // For nested routes, the `path` prop within <Route> is relative.
  const location = useLocation();
  const showLanguageChange = location?.pathname?.includes("language-selection");
  const isUserProfile = userScreensExempted.some((url) => location?.pathname?.includes(url));

  useEffect(() => {
    Digit.UserService.setType("employee");
  }, []);

  const additionalComponent = initData?.modules?.filter((i) => i?.additionalComponent)?.map((i) => i?.additionalComponent);

  return (
    <div className="employee">
      <Routes> {/* Replaced Switch with Routes */}
        {/*
          Nested Routes for `/user` paths
          Note: In v6, when you have a parent Route like <Route path="user/*" element={<SomeComponent />} />,
          then inside SomeComponent, a <Route path="login" element={<LoginComponent />} /> will match "/user/login".
          The `path` prop is relative to the parent route.
        */}
        <Route path="user/*" element={ // `/*` means it will match any path starting with /user
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
              <Routes> {/* Nested Routes for /user/* paths */}
                <Route path="login" element={withSuspense(EmployeeLogin, { stateCode })} /> {/* path is relative */}
                <Route path="login/otp" element={withSuspense(Otp, { isLogin: true })} /> {/* path is relative */}
                <Route path="forgot-password" element={withSuspense(ForgotPassword, { stateCode })} /> {/* path is relative */}
                <Route path="change-password" element={withSuspense(ChangePassword, {})} /> {/* path is relative */}
                {/* Assuming PrivateRoute is updated for v6 to use `element` prop and `Maps` internally */}
                <Route
                  path="profile"
                  element={<PrivateRoute component={() => withSuspense(UserProfile, { stateCode, userType: "employee", cityDetails })} />}
                />
                <Route
                  path="error"
                  element={withSuspense(ErrorComponent, {
                    initData,
                    goToHome: () => {
                      navigate(`/${window?.contextPath}/${Digit?.UserService?.getType?.()}`); // Replaced history.push with navigate
                    }
                  })}
                />
                <Route path="language-selection" element={withSuspense(LanguageSelection, {})} /> {/* path is relative */}
                {/* Default redirect for /user/ anything that doesn't match above */}
                <Route path="*" element={<Navigate to="language-selection" replace />} /> {/* Replaced Redirect with Navigate, `replace` for history */}
              </Routes>
            </div>
          </>}
        />

        {/* Routes for paths not starting with /user */}
        <Route path="*" element={ // This `*` catches all other paths not handled by the /user/* route
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

        {/* Global Redirect for any unmatched path, usually placed last */}

        <Route path="*" element={<Navigate to={`user/language-selection`} replace />} />
      </Routes>
    </div>
  );
};

export default withAutoFocusMain(EmployeeApp, ".digit-home-main");