import React, { useEffect } from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import EmployeeApp from "./pages/employee";
import IndividualApp from "./pages/individual";

export const DigitApp = ({ stateCode, modules, appTenants, logoUrl, initData ,defaultLanding="citizen"}) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const innerWidth = window.innerWidth;
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const userDetails = Digit.UserService.getUser();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  let CITIZEN = userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;

  if (window.location.pathname.split("/").includes("employee")) CITIZEN = false;

  history.listen(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  });

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
    DSO,
    stateCode,
    modules,
    appTenants,
    sourceUrl,
    pathname,
    initData,
  };
  return (
    <Switch>
      <Route path={`/${window?.contextPath}/employee`}>
        <EmployeeApp {...commonProps} />
      </Route>
      <Route path={`/${window?.contextPath}/individual`}>
        <IndividualApp {...commonProps} />
      </Route>
      <Route>
        <Redirect to={`/${window?.contextPath}/${defaultLanding}`} />
      </Route>
    </Switch>
  );
};
