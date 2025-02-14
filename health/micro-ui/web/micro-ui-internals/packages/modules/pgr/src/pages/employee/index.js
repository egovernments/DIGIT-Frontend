import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BreadCrumbs from "../../components/BreadCrumbs";
import Response from "../../components/Response";
import { CreateComplaint } from "./createComplaint";


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
      internalLink: `/${window?.contextPath}/employee/pgr/create-complaint`,
      content: t("PGR_BREADCRUMB_CREATE_COMPLAINT"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee/pgr/search-complaint`,
      content: t("PGR_BREADCRUMB_SEARCH_COMPLAINT"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee/pgr/view-complaint`,
      content: t("PGR_BREADCRUMB_VIEW_COMPLAINT"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t(`PGR_BREADCRUMB_${Digit.Utils.locale.getTransformedLocale(location.pathname.split("/").pop())}`),
      show: true,
    }
  ];
  return <BreadCrumbs crumbs={crumbs} />;
};

const App = ({ path, stateCode, userType, tenants }) => {


  useEffect(() => {
    if (window.location.pathname !== `/${window.contextPath}/employee/`) {
      window.Digit.SessionStorage.del("selectedLevel");
      window.Digit.SessionStorage.del("selectedProject");
      window.Digit.SessionStorage.del("selectedBoundaryCode");
      window.Digit.SessionStorage.del("boundary");
      window.Digit.SessionStorage.del("selectedValues");
    }
  }, []);

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/create-complaint`} component={() => <CreateComplaint />} />
        {/* <PrivateRoute path={`${path}/search-complaint`} component={() => <ViewAttendance editAttendance={true} />} /> */}
        <PrivateRoute path={`${path}/pgr-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/pgr-failure`} component={() => <Response />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
