import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BreadCrumbs from "../../components/BreadCrumbs";


const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();

  const local = useLocation();

  const crumbs = [
    {
      internalLink: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      internalLink: `/${window?.contextPath}/employee/pgr/create-complaint`,
      content: t("CREATE_COMPLAINT"),
      show: true,
    }
  ];
  return <BreadCrumbs crumbs={crumbs} />;
};

const EmployeeApp = ({ path, stateCode, userType, tenants }) => {
  console.log("PATH:", path);

  const PGRCreateComplaint = Digit?.ComponentRegistryService?.getComponent("PGRCreateComplaint");
  const PGRComplaintDetails = Digit?.ComponentRegistryService?.getComponent("PGRComplaintDetails");
  const PGRSearchInbox = Digit?.ComponentRegistryService?.getComponent("PGRSearchInbox");
  const PGRResponse = Digit?.ComponentRegistryService?.getComponent("PGRResponse");

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/create-complaint`} component={() => <PGRCreateComplaint />} />
        <PrivateRoute path={`${path}/complaint-success`} component={() => <PGRResponse />} />
        <PrivateRoute path={`${path}/complaint-failed`} component={() => <PGRResponse />} />
        <PrivateRoute path={`${path}/complaint-details/:id`} component={() => <PGRComplaintDetails />} />
        <PrivateRoute path={`${path}/inbox-v2`} component={() => <PGRSearchInbox />} />
      </AppContainer>
    </Switch>
  );
};

export default EmployeeApp;
