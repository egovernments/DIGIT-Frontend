import React, { useEffect, Suspense, useMemo } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Loader } from "@egovernments/digit-ui-components";
import CustomErrorComponent from "./components/CustomErrorComponent";
import LazyErrorBoundary from "./components/LazyErrorBoundary";
import { Navigate } from "react-router-dom";

// Keep login/home pages in main bundle for faster initial load, lazy load admin pages
import SignUp from "./pages/employee/SignUp";

// Lazy load heavy/less frequently used components for better performance  
const CitizenApp = React.lazy(() => import("./pages/citizen"));
const EmployeeApp = React.lazy(() => import("./pages/employee")); 
const Otp = React.lazy(() => import("./pages/employee/Otp"));
const ViewUrl = React.lazy(() => import("./pages/employee/ViewUrl"));
const DummyLoaderScreen = React.lazy(() => import("./components/DummyLoader"));

export const DigitApp = React.memo(({ stateCode, modules, appTenants, logoUrl, logoUrlWhite, initData, defaultLanding = "citizen", allowedUserTypes = ["citizen", "employee"] }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // Memoize expensive calculations
  const innerWidth = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1024;
  }, []);
  
  const cityDetails = useMemo(() => Digit.ULBService.getCurrentUlb(), []);
  const userDetails = useMemo(() => Digit.UserService.getUser(), []);
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};

  // Memoize user permissions to prevent recalculation
  const DSO = useMemo(() => Digit.UserService.hasAccess(["FSM_DSO"]), []);
  const CITIZEN = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee");
  }, [userDetails?.info?.type]);

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

  // history.listen(() => {
  //   window?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  // });

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
    <LazyErrorBoundary>
      <Suspense fallback={<Loader page={true} variant="PageLoader" />}>
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
      </Suspense>
    </LazyErrorBoundary>
  );
});

export const DigitAppWrapper = React.memo(({ stateCode, modules, appTenants, logoUrl, logoUrlWhite, initData, defaultLanding = "citizen", allowedUserTypes }) => {
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  
  // Memoize expensive calculations
  const userScreensExempted = useMemo(() => ["user/error"], []);
  const isUserProfile = useMemo(() => 
    userScreensExempted.some((url) => location?.pathname?.includes(url)), 
    [userScreensExempted]
  );
  
  const userDetails = useMemo(() => Digit.UserService.getUser(), []);
  const CITIZEN = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return userDetails?.info?.type === "CITIZEN" || !window.location.pathname.split("/").includes("employee");
  }, [userDetails?.info?.type]);
  
  const innerWidth = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1024;
  }, []);
  const mobileView = useMemo(() => innerWidth <= 640, [innerWidth]);

  return (
    <div
      className={isUserProfile ? "grounded-container" : "loginContainer"}
      style={
        isUserProfile ? { padding: 0, paddingTop: CITIZEN ? "0" : mobileView && !CITIZEN ? "3rem" : "80px", marginLeft: CITIZEN || mobileView ? "0" : "40px" } : { "--banner-url": `url(${stateInfo?.bannerUrl})`, padding: "0px" }
      }
    >
      <LazyErrorBoundary>
        <Suspense fallback={<Loader page={true} variant="PageLoader" />}>
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
        </Suspense>
      </LazyErrorBoundary>
    </div>
  );
});
