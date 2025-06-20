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


const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  console.log("999 location  ",location.state);
  // TODO : NEED TO UPDATE THESE CRUMBS
  const queryParams = new URLSearchParams(location.search);
const projectTypeId = location.state?.projectTypeId || queryParams.get("projectTypeId");

const moduleCode = location.pathname.split("/").pop(); // gets last part like "level-two-dashboard"

const crumbs = [
  {
    internalLink: `/${window?.contextPath}/employee`,
    content: t("HOME"),
    show: true,
  },
  {
    internalLink: `/${window?.contextPath}/employee/dss/past-campaigns`,
    content: t("HCM_BREADCRUMBS_PAST_CAMPAIGNS"),
    show: moduleCode === "PAST_CAMPAIGNS",
  },
  {
    internalLink: `/${window?.contextPath}/employee/dss/live-campaigns`,
    content: t("HCM_BREADCRUMBS_LIVE_CAMPAIGNS"),
    show: moduleCode === "LIVE_CAMPAIGNS",
  },
  {
    internalLink: `/${window?.contextPath}/employee/dss/my-campaigns`,
    content: t("ACTION_TEST_MY_CAMPAIGN"),
    show: moduleCode === "MY_CAMPAIGNS",
  },
  {
    internalLink: `/${window?.contextPath}/employee/dss/view-dashboard`,
    content: t("VIEW_DASHBOARD"),
    show: moduleCode === "VIEW_DASHBOARD",
  },
  {
    internalLink: `/${window?.contextPath}/employee/dss/l1-dashboard`,
    content: t("L1_DASHBOARD"),
    show: moduleCode === "L1_DASHBOARD",
  },
  {
    internalLink: `/${window?.contextPath}/employee/dss/level1/level-one-dashboard`,
    content: t("LEVEL_ONE_DASHBOARD"),
    query: `projectTypeId=${projectTypeId}`,
    show: ["LEVEL_ONE_DASHBOARD", "LEVEL_TWO_DASHBOARD"].includes(Digit.Utils.locale.getTransformedLocale(moduleCode)),
  },
  {
    internalLink: `/${window?.contextPath}/employee/dss/level2/level-two-dashboard${projectTypeId ? `?projectTypeId=${projectTypeId}` : ""}`,
    content: t("LEVEL_TWO_DASHBOARD"),
    show: Digit.Utils.locale.getTransformedLocale(moduleCode) === "LEVEL_TWO_DASHBOARD",
  },
];

  return <BreadCrumb crumbs={crumbs} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
  const location = useLocation();
  const MyCampaignNew = Digit.ComponentRegistryService.getComponent("MyCampaignNew");
  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/live-campaigns`} component={() => <CampaignsInbox />} />
        <PrivateRoute path={`${path}/past-campaigns`} component={() => <CampaignsInbox />} />
        <PrivateRoute path={`${path}/my-campaigns`} component={() => <MyCampaignNew showDashboardLink={true}/>} />
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