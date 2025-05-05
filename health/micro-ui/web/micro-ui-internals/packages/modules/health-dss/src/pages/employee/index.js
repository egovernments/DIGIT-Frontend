import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import Inbox from "./Inbox";


const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const local = useLocation();
  const { fromCampaignSupervisor } = local?.state || false;
  const crumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee/payments/project-selection`,
      content: t("HCM_AM_BREADCRUMBS_PROJECT_SELECTION"),
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "REGISTERS_INBOX" || ((Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VIEW_ATTENDANCE" ||
          Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "EDIT_ATTENDANCE") && !fromCampaignSupervisor)
    },
    {
      internalLink: `/${window?.contextPath}/employee/payments/project-and-aggregation-selection`,
      content: t("HCM_AM_BREADCRUMBS_PROJECT_AND_AGGREGATION_SELECTION"),
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "GENERATE_BILL" || ((Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VIEW_ATTENDANCE" ||
          Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "EDIT_ATTENDANCE") && fromCampaignSupervisor)
    },
    {
      internalLink: fromCampaignSupervisor ? `/${window?.contextPath}/employee/payments/generate-bill` : `/${window?.contextPath}/employee/payments/registers-inbox`,
      content: fromCampaignSupervisor ? t("HCM_AM_BREADCRUMBS_GENERATE_BILLS") : t("HCM_AM_BREADCRUMBS_REGISTERS_INBOX"),
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "VIEW_ATTENDANCE" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "EDIT_ATTENDANCE"
    },
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t(`HCM_AM_BREADCRUMBS_${Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop())}`),
      show: true,
    }
  ];
  return <BreadCrumb crumbs={crumbs} />;
};

const App = ({ path, stateCode, userType, tenants }) => {

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/live-campaigns`} component={() => <Inbox />} />
        <PrivateRoute path={`${path}/past-campaigns`} component={() => <Inbox />} />
      </AppContainer>
    </Switch>
  );
};

export default App;