
import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import ErrorBoundary from "../../components/ErrorBoundaries";
import ErrorComponent from "../../components/ErrorComponent";
import Login from "../citizen/Login";
import UserProfile from "../citizen/Home/UserProfile";
import LocationSelection from "../citizen/Home/LocationSelection";
import LanguageSelection from "../citizen/Home/LanguageSelection";

// import CitizenHome from "./Home";
// import LanguageSelection from "./Home/LanguageSelection";
// import LocationSelection from "./Home/LocationSelection";
// import UserProfile from "./Home/UserProfile";
// import Login from "./Login";


const IndividualApp = ({
  stateInfo,
  userDetails,
  CITIZEN,
  cityDetails,
  mobileView,
  handleUserDropdownSelection,
  logoUrl,
  DSO,
  stateCode,
  modules,
  appTenants,
  sourceUrl,
  pathname,
  initData,
}) => {

  const classname = Digit.Hooks.useRouteSubscription(pathname);
  const { t } = useTranslation();
  const { path } = useRouteMatch();
  const history = useHistory();


  return (
    <div className={classname}>
   

      <div className={`main center-container citizen-home-container mb-25`}>
      <ErrorBoundary initData={initData}>

        <Switch>
          <Route exact path={path}>
            <div>
                landing
            </div>
          </Route>

          <Route exact path={`${path}/select-language`}>
            <LanguageSelection />
          </Route>

          <Route exact path={`${path}/select-location`}>
            <LocationSelection />
          </Route>
          <Route path={`${path}/error`}>
            <ErrorComponent
              initData={initData}
              goToHome={() => {
                history.push(`/${window?.contextPath}/${Digit?.UserService?.getType?.()}`);
              }}
            />
          </Route>
          

          <Route path={`${path}/login`}>
            <Login stateCode={stateCode} />
          </Route>

          <Route path={`${path}/register`}>
            <Login stateCode={stateCode} isUserRegistered={false} />
          </Route>

          <Route path={`${path}/user/profile`}>
            <UserProfile stateCode={stateCode} userType={"citizen"} cityDetails={cityDetails} />
          </Route>

   
          
            
            
        </Switch>
        </ErrorBoundary>

      </div>
      <div className="citizen-home-footer" style={window.location.href.includes("citizen/obps") ? { zIndex: "-1" } : {}}>
        <img
          alt="Powered by DIGIT"
          src={window?.globalConfigs?.getConfig?.("DIGIT_FOOTER")}
          style={{ height: "1.2em", cursor: "pointer" }}
          onClick={() => {
            window.open(window?.globalConfigs?.getConfig?.("DIGIT_HOME_URL"), "_blank").focus();
          }}
        />
      </div>
    </div>
  );
};

export default IndividualApp;
