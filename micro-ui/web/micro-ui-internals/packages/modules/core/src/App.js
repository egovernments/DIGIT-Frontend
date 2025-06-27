import React, { useEffect } from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import CitizenApp from "./pages/citizen";
import EmployeeApp from "./pages/employee";
// import SignUp from "./pages/employee/SignUp";
import Otp from "./pages/employee/Otp";
import ViewUrl from "./pages/employee/ViewUrl";
import CustomErrorComponent from "./components/CustomErrorComponent";
import DummyLoaderScreen from "./components/DummyLoader";
import SignUpV2 from "./pages/employee/SignUp-v2";
import LoginV2 from "./pages/employee/Login-v2";

export const DigitApp = ({ stateCode, modules, appTenants, logoUrl, logoUrlWhite, initData, defaultLanding = "citizen",allowedUserTypes=["citizen","employee"] }) => {
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
    <Switch>
     {allowedUserTypes?.some(userType=>userType=="employee")&& <Route path={`/${window?.contextPath}/employee`}>
        <EmployeeApp {...commonProps} />
      </Route>}
      {allowedUserTypes?.some(userType=>userType=="citizen")&& <Route path={`/${window?.contextPath}/citizen`}>
        <CitizenApp {...commonProps} />
      </Route>}
      {allowedUserTypes?.some(userType=>userType=="employee")&& <Route path={`/${window?.contextPath}/no-top-bar/employee`}>
        <EmployeeApp  {...commonProps} noTopBar={true} />
      </Route>}
      <Route>
        <Redirect to={`/${window?.contextPath}/${defaultLanding}`} />
      </Route>
    </Switch>
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
      <Switch>
        <Route exact path={`/${window?.globalPath}/user/invalid-url`}>
          <CustomErrorComponent />
        </Route>
        <Route exact path={`/${window?.globalPath}/user/sign-up`}>
          <SignUpV2 stateCode={stateCode} />
        </Route>
        <Route exact path={`/${window?.globalPath}/user/login`}>
          <LoginV2 stateCode={stateCode} />
        </Route>
        {/* <Route exact path={`/${window?.globalPath}/user/sign-up`}>
          <SignUp stateCode={stateCode} />
        </Route> */}
        <Route exact path={`/${window?.globalPath}/user/otp`}>
          <Otp />
        </Route>
        <Route exact path={`/${window?.globalPath}/user/setup`}>
          <DummyLoaderScreen />
        </Route>
        <Route exact path={`/${window?.globalPath}/user/url`}>
          <ViewUrl />
        </Route>
        {window?.globalPath !== window?.contextPath && (
          <Route path={`/${window?.contextPath}`}>
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
          </Route>
        )}
        <Route>
          <Redirect to={`/${window?.globalPath}/user/sign-up`} />
        </Route>
      </Switch>
    </div>
  );
};
