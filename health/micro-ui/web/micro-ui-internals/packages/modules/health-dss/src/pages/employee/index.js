import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import CampaignsInbox from "./CampaignsInbox";
import L1Main from "./L1Main";
import L2Main from "./L2Main";
import ViewDashbaord from "./ViewDashboard";
import L1Dashboard from "./L1Dashboard";
import Inbox from "./Inbox";

const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  // TODO : NEED TO UPDATE THESE CRUMBS
  const crumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/past-campaigns`,
      content: t("HCM_BREADCRUMBS_PAST_CAMPAIGNS"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "PAST_CAMPAIGNS",
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/live-campaigns`,
      content: t("HCM_BREADCRUMBS_LIVE_CAMPAIGNS"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "LIVE_CAMPAIGNS",
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/my-campaigns`,
      content: t("ACTION_TEST_MY_CAMPAIGNS"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "MY_CAMPAIGNS",
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/view-dashboard`,
      content: t("VIEW_DASHBOARD"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VIEW_DASHBOARD",
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/l1-dashboard`,
      content: t("L1_DASHBOARD"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "L1_DASHBOARD",
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/level1`,
      content: t("LEVEL_ONE_DASHBOARD"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "LEVEL_ONE_DASHBOARD",
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/level2`,
      content: t("LEVEL_TWO_DASHBOARD"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "LEVEL_TWO_DASHBOARD",
    },
  ];
  return <BreadCrumb crumbs={crumbs} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
  const location = useLocation();

  useEffect(() => {
    Digit.SessionStorage.del("HCM_SELECTED_TAB_INDEX");
  }, []);

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/live-campaigns`} component={() => <CampaignsInbox />} />
        <PrivateRoute path={`${path}/past-campaigns`} component={() => <CampaignsInbox />} />
        <PrivateRoute path={`${path}/my-campaigns`} component={() => <Inbox />} />
        <PrivateRoute path={`${path}/view-dashboard`} component={() => <ViewDashbaord stateCode={stateCode} />} />
        <PrivateRoute path={`${path}/l1-dashboard`} component={() => <L1Dashboard />} />
        {/* TODO: update the dashboard path */}
        <PrivateRoute path={`${path}/level1/:moduleCode`} component={() => <L1Main />} />
        <PrivateRoute path={`${path}/level2/:moduleCode`} component={() => <L2Main />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
