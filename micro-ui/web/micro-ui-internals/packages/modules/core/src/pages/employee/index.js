import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, Switch, useLocation, useRouteMatch, useHistory } from "react-router-dom";
import { AppModules } from "../../components/AppModules";
import ErrorBoundary from "../../components/ErrorBoundaries";
import TopBarSideBar from "../../components/TopBarSideBar";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import LanguageSelection from "./LanguageSelection";
import EmployeeLogin from "./Login";
import Otp from "./Otp";
import UserProfile from "../citizen/Home/UserProfile";
import ErrorComponent from "../../components/ErrorComponent";
import { PrivateRoute } from "@egovernments/digit-ui-components";
import ImageComponent from "../../components/ImageComponent";
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
  noTopBar = false
}) => {


  const history = useHistory();
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const location = useLocation();
  const showLanguageChange = location?.pathname?.includes("language-selection");
  const isUserProfile = userScreensExempted.some((url) => location?.pathname?.includes(url));
  useEffect(() => {
    Digit.UserService.setType("employee");
  }, []);

  const additionalComponent = initData?.modules?.filter((i) => i?.additionalComponent)?.map((i) => i?.additionalComponent);
  const isSuperUserWithMultipleRootTenant = Digit.UserService.hasAccess("SUPERUSER") && Digit.Utils.getMultiRootTenant();
  const hideClass = location.pathname.includes(`employee/sandbox/productDetailsPage/`);
  useEffect(() => {
    const isDirectAccess = location.pathname === path || location.pathname === `${path}/`;
    const queryParams = new URLSearchParams(location.search);
    const cameFromButton = queryParams.get("from") === "sandbox";
    if (isSuperUserWithMultipleRootTenant && isDirectAccess && !cameFromButton) {
      history.replace(`${path}/sandbox/productPage`);
    }
  }, [location.pathname, location.search, path, history, isSuperUserWithMultipleRootTenant]);
  return (
    <div className="employee">
      <Switch>
        <Route path={`${path}/user`}>
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
            <Switch>
              {!Digit.Utils.getMultiRootTenant() && (
                <Route exact path={`${path}/user/login`}>
                  <EmployeeLogin stateCode={stateCode} />
                </Route>
              )}
              <Route exact path={`${path}/user/login/otp`}>
                <Otp isLogin={true} />
              </Route>
              <Route path={`${path}/user/forgot-password`}>
                <ForgotPassword stateCode={stateCode}/>
              </Route>
              <Route path={`${path}/user/change-password`}>
                <ChangePassword />
              </Route>
              <PrivateRoute path={`${path}/user/profile`} component={()=><UserProfile stateCode={stateCode} userType={"employee"} cityDetails={cityDetails} />}/>
              <Route path={`${path}/user/error`}>
                <ErrorComponent
                  initData={initData}
                  goToHome={() => {
                    history.push(`/${window?.contextPath}/${Digit?.UserService?.getType?.()}`);
                  }}
                />
              </Route>
              <Route path={`${path}/user/language-selection`}>
                <LanguageSelection />
              </Route>
              <Route>
                <Redirect to={`${path}/user/language-selection`} />
              </Route>
            </Switch>
          </div>
        </Route>
        <Route>
          {!noTopBar && <TopBarSideBar
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
          />}
          <div className={!noTopBar ? `${(isSuperUserWithMultipleRootTenant) ? "" : "main"} ${DSO ? "m-auto" : ""} digit-home-main` : ""}>

            <div className={!noTopBar ? `${(isSuperUserWithMultipleRootTenant && hideClass) ? "" : "employee-app-wrapper"} digit-home-app-wrapper` : ""}>
              {/* <div className="employee-app-wrapper digit-home-app-wrapper"> */}
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
        </Route>
        <Route>
          <Redirect to={`${path}/user/language-selection`} />
        </Route>
      </Switch>
    </div>
  );
};

export default EmployeeApp;
