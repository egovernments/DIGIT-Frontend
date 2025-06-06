import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import CampaignsInbox from "./CampaignsInbox";
// import L1Main from "./L1Main";


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
      internalLink: `/${window?.contextPath}/employee/dss/landing`,
      content: t("HCM_BREADCRUMBS_LANDING"),
      show:Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "LANDING"
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/past-campaigns`,
      content: t("HCM_BREADCRUMBS_PAST_CAMPAIGNS"),
      show:Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "PAST_CAMPAIGNS"
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/live-campaigns`,
      content: t("HCM_BREADCRUMBS_LIVE_CAMPAIGNS"),
      show:Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "LIVE_CAMPAIGNS"
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/my-campaigns`,
      content: t("HCM_BREADCRUMBS_MY_CAMPAIGNS"),
      show:Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "MY_CAMPAIGNS"
    }
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
        <PrivateRoute path={`${path}/my-campaigns`} component={() => <MyCampaignNew />} />
        {/* <PrivateRoute path={`${path}/landing/:moduleCode`} component={() => <L1Main stateCode={stateCode} />} /> */}
      </AppContainer>
    </Switch>
  );
};

export default App;