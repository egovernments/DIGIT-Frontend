import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BreadCrumb } from "@egovernments/digit-ui-components";
import L1Main from "./L1Main";
import L2Main from "./L2Main";
import ViewDashboard from "./ViewDashboard";
import Inbox from "./Inbox";
import UserActivity from "../../components/UserActivityTracking/UserActivity";
import ReportsListPage from "./ReportsListPage";
import ReportDetailPage from "./ReportDetailPage";

const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const dashboardId = Digit.SessionStorage.get("dashboardData")?.[0]?.id || "";
  const selectedDashboard = Digit.SessionStorage.get("selectedDashboard");
  const campaignNumber = Digit.SessionStorage.get("campaignSelected")?.campaignNumber;
  const boundaryType = Digit.SessionStorage.get("projectSelected")?.project?.address?.boundaryType?.toLowerCase();
  const boundaryValue = Digit.SessionStorage.get("projectSelected")?.boundaryCodeResponse?.message || t(Digit.SessionStorage.get("projectSelected")?.project?.address?.boundary);
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
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "MY_CAMPAIGNS" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").slice(-2, -1)[0]) === "LEVEL_ONE" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").slice(-2, -1)[0]) === "LEVEL_TWO" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "CAMPAIGN_REPORTS" ||
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "REPORT_DETAIL",
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
      internalLink: `/${window?.contextPath}/employee/dss/level-one/${dashboardId}`,
      content: t("LEVEL_ONE_DASHBOARD"),
      query: `campaignNumber=${campaignNumber}&boundaryType=${boundaryType}&boundaryValue=${boundaryValue}`,
      show:
        Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").slice(-2, -1)[0]) === "LEVEL_ONE" ||
        (Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").slice(-2, -1)[0]) === "LEVEL_TWO" && selectedDashboard?.level === "level-one"),
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/level-two`,
      content: t("LEVEL_TWO_DASHBOARD"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").slice(-2, -1)[0]) === "LEVEL_TWO",
    },
    {
      internalLink: `/${window?.contextPath}/employee/dss/user-activity-tracking`,
      content: t("USER_ACTIVITY_TRACKING"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "USER_ACTIVITY_TRACKING",
    },
    {
      internalLink: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "CAMPAIGN_REPORTS" ? "" : `/${window?.contextPath}/employee/dss/campaign-reports`,
      content: t("HCM_CAMPAIGN_REPORTS"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "CAMPAIGN_REPORTS" || Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "REPORT_DETAIL",
    },
    {
      internalLink: "",
      content: t("HCM_REPORT_DETAIL"),
      show: Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop()) === "REPORT_DETAIL",
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
        <PrivateRoute path={`${path}/my-campaigns`} component={() => <Inbox />} />
        <PrivateRoute path={`${path}/view-dashboard`} component={() => <ViewDashboard stateCode={stateCode} />} />
        <PrivateRoute path={`${path}/level-one/:moduleCode`} component={() => <L1Main />} />
        <PrivateRoute path={`${path}/level-two/:moduleCode`} component={() => <L2Main />} />
        <PrivateRoute path={`${path}/user-activity-tracking`} component={() => <UserActivity />} />
        <PrivateRoute path={`${path}/campaign-reports`} component={() => <ReportsListPage />} />
        <PrivateRoute path={`${path}/report-detail`} component={() => <ReportDetailPage />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
