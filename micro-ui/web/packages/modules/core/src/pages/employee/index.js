import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route, useLocation, useNavigate,Navigate } from "react-router-dom"; // Updated imports for v6
import { AppModules } from "../../components/AppModules";
import ErrorBoundary from "../../components/ErrorBoundaries";
import TopBarSideBar from "../../components/TopBarSideBar";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import LanguageSelection from "./LanguageSelection";
import EmployeeLogin from "./Login";
import SignUp from "./SignUp";
import Otp from "./Otp";
import ViewUrl from "./ViewUrl";
import UserProfile from "../citizen/Home/UserProfile";
import ErrorComponent from "../../components/ErrorComponent";
import { PrivateRoute } from "@egovernments/digit-ui-components"; // Assuming PrivateRoute is v6 compatible or will be adapted
import ImageComponent from "../../components/ImageComponent";
// import SkipToMainContent from "./SkipToMainContent/SkipToMainContent.js";
import withAutoFocusMain from "../../hoc/withAutoFocusMain";

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
                <Route path="login" element={<EmployeeLogin stateCode={stateCode} />} /> {/* path is relative */}
                <Route path="login/otp" element={<Otp isLogin={true} />} /> {/* path is relative */}
                <Route path="forgot-password" element={<ForgotPassword stateCode={stateCode} />} /> {/* path is relative */}
                <Route path="change-password" element={<ChangePassword />} /> {/* path is relative */}
                {/* Assuming PrivateRoute is updated for v6 to use `element` prop and `Maps` internally */}
                <Route
                  path="profile"
                  element={<PrivateRoute component={() => <UserProfile stateCode={stateCode} userType={"employee"} cityDetails={cityDetails} />} />}
                />
                <Route
                  path="error"
                  element={
                    <ErrorComponent
                      initData={initData}
                      goToHome={() => {
                        navigate(`/${window?.contextPath}/${Digit?.UserService?.getType?.()}`); // Replaced history.push with navigate
                      }}
                    />
                  }
                />
                <Route path="language-selection" element={<LanguageSelection />} /> {/* path is relative */}
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
            <div className={!noTopBar ? `main ${DSO ? "m-auto" : ""} digit-home-main` : ""}>
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
        {/* The previous redirect to language-selection was inside the /user path,
            this one handles any other unmatched path outside of /user.
            If this component is mounted at `/employee`, then `language-selection`
            here will resolve to `/employee/language-selection`.
        */}
        <Route path="*" element={<Navigate to={`user/language-selection`} replace />} />
      </Routes>
    </div>
  );
};

export default withAutoFocusMain(EmployeeApp, ".digit-home-main");