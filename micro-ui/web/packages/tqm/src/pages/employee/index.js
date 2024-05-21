import React, { useEffect, useReducer, Fragment } from "react";
import { Switch, useLocation, useRouteMatch, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute, AppContainer, BreadCrumb, BackButton } from "@digit-ui/digit-ui-react-components";
import SampleComp from "./SampleComp";
import TQMPendingTask from "./TQMPendingTask";
import TQMLanding from "./TQMLanding";
import TqmSearch from "./search-test-results/TqmSearch";
import TestDetails from "./test-details/TestDetails";
import TqmHome from "./home/TqmHome";
import Create from "./add-test-results/CreateAddTestResult";
import Test from "./test";
// import TqmHeader from "../../components/TqmHeader";
import TqmAdminNotification from "./TqmAdminNotification";
import HowItWorks from "./howItWorks";

// import TQMSummary from "../../components/TQMSummary";

const TqmBreadCrumb = ({ location, defaultPath }) => {
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];
  const { t } = useTranslation();
  const search = useLocation().search;
  const fromScreen = new URLSearchParams(search).get("from") || null;
  const isInbox = location?.pathname?.includes("inbox");
  const isViewTestResults = location?.pathname?.includes("view-test-results");
  const isSearchTest = location?.pathname?.includes("search-test-results");
  const isaddTest = location?.pathname?.includes("add-test-result");

  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("TQM_BREAD_HOME"),
      show: true,
    },
    {
      path: pathVar.includes("inbox") ? "" : `/${window.contextPath}/employee/tqm/inbox`,
      content: t(`TQM_BREAD_INBOX`),
      show: isInbox || fromScreen === "TQM_BREAD_INBOX" ? true : false,
    },
    {
      path: pathVar.includes("search-test-results") ? "" : `/${window.contextPath}/employee/tqm/search-test-results`,
      show: isSearchTest || fromScreen === "TQM_BREAD_PAST_TESTS" ? true : false,
      content: t("TQM_BREAD_PAST_TESTS"),
    },
    {
      path: pathVar.includes("add-test-result") ? "" : `/${window.contextPath}/employee/tqm/add-test-result`,
      content: t(`TQM_BREAD_CREATE_TEST`),
      show: isaddTest ? true : false,
    },
    {
      path: pathVar.includes("search-devices") ? "" : `/${window.contextPath}/employee/tqm/add-test-result`,
      // content:  t(`TQM_BREAD_SENSOR`) ,
      show: pathVar.includes("search-devices") ? true : false,
      content: fromScreen ? `${t(fromScreen)} / ${t("TQM_BREAD_SENSOR")}` : t("TQM_BREAD_SENSOR"),
    },
    {
      path: pathVar.includes("view-test-results") ? "" : `/${window.contextPath}/employee/tqm/view-test-results`,
      show: isViewTestResults ? true : false,
      content: isViewTestResults ? t("TQM_BREAD_VIEW_TEST_RESULTS") : t("TQM_BREAD_VIEW_TEST_RESULTS"),
    },
  ];
  return <BreadCrumb className="workbench-bredcrumb" crumbs={crumbs} spanStyle={{ maxWidth: "min-content" }} />;
};

const App = ({ path }) => {
  const match = useRouteMatch()
  
  const { t } = useTranslation();
  const location = useLocation();
  const isPlantOperatorLoggedIn = Digit.Utils.tqm.isPlantOperatorLoggedIn();
  const isUlbAdminLoggedIn = Digit.Utils.tqm.isUlbAdminLoggedIn();
  const TqmInbox = Digit?.ComponentRegistryService?.getComponent("TqmInbox");
  const TqmResponse = Digit?.ComponentRegistryService?.getComponent("TqmResponse");
  const TqmViewTestResults = Digit?.ComponentRegistryService?.getComponent("TqmViewTestResults");
  const TQMSummary = Digit?.ComponentRegistryService?.getComponent("TQMSummary");
  const SensorScreen = Digit?.ComponentRegistryService?.getComponent("SensorScreen");
  let isMobile = window.Digit.Utils.browser.isMobile();

  //here adding a useEffect hook to manually clear sessionStorages
  // TQM_INBOX_SESSION -> don't delete when -> inbox, test-details
  // TQM_SEARCH_SESSION -> don't delete when -> search-test-results,summary
  useEffect(() => {
    const pathVar = location.pathname.replace(path + "/", "").split("?")?.[0];
    Digit.Utils.tqm.destroySessionHelper(pathVar,["inbox","test-details","view-test-results"],"TQM_INBOX_SESSION");
    Digit.Utils.tqm.destroySessionHelper(pathVar,["search-test-results","summary","view-test-results"],"TQM_SEARCH_SESSION");
    Digit.Utils.tqm.destroySessionHelper(pathVar,["add-test-result"],"CREATE_ADHOC_TEST");
    Digit.Utils.tqm.destroySessionHelper(pathVar,["test-details"],"UPDATE_TEST_SESSION_SCHEDULED");
    Digit.Utils.tqm.destroySessionHelper(pathVar,["test-details"],"UPDATE_TEST_SESSION_PENDINGRESULTS");
    
  }, [location])
  

  return (
    <>
      {/* {isUlbAdminLoggedIn && isMobile ? <BackButton>{t("CS_COMMON_BACK")}</BackButton> : !isPlantOperatorLoggedIn ? <TqmBreadCrumb location={location} defaultPath={path} /> : null} */}
      {/* {isPlantOperatorLoggedIn && (location.pathname.includes("/response") ? null : <BackButton>{t("CS_COMMON_BACK")}</BackButton>)} */}
      {/* {isPlantOperatorLoggedIn && <TqmHeader location={location} defaultPath={path} />} */}

      <Switch>
        <AppContainer className="tqm">
          <Route path={`${path}/landing`} component={() => <TQMLanding />} />
          <Route path={`${path}/home`} component={() => <TqmHome {...{ path }} />} />
          <Route path={`${path}/sample`} component={() => <SampleComp />} />
          <Route path={`${path}/check`} component={() => <TQMPendingTask />} />
          <Route path={`${path}/inbox`} component={() => <TqmInbox />} />
          <Route path={`${path}/search-test-results`} component={() => <TqmSearch {...{ path }} />} />
          <Route path={`${path}/add-test-result`} component={() => <Create />} />
          <Route path={`${path}/test-details`} component={() => <TestDetails />} />
          <Route path={`${path}/response`} component={() => <TqmResponse />} />
          <Route path={`${path}/view-test-results`} component={() => <TqmViewTestResults />} />
          {/* for testing purpose */}
          <Route path={`${path}/notification`} component={() => <TqmAdminNotification />} />
          <Route path={`${path}/summary`} component={() => <TQMSummary />} />
          <Route path={`${path}/search-devices`} component={() => <SensorScreen />} />
          <Route path={`${path}/how-it-works`} component={() => <HowItWorks />} />
        </AppContainer>
      </Switch>
    </>
  );
};

export default App;
