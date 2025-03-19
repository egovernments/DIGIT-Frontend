import { AppContainer, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BreadCrumbs from "../../components/BreadCrumbs";
import Response from "../../components/Response";
import CreateComplaintNew from "../employee/CreateComplaintNew";


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

  const PGRComplaintDetails = Digit?.ComponentRegistryService?.getComponent("PGRComplaintDetails");

  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/create-complaint`} component={() => <CreateComplaintNew />} />
        <PrivateRoute path={`${path}/complaint-success`} component={() => <Response />} />
        <PrivateRoute path={`${path}/complaint-failed`} component={() => <Response />} />
        <PrivateRoute path={`${path}/complaint-details/:id`} component={() => <PGRComplaintDetails />} />
      </AppContainer>
    </Switch>
  );
};

export default EmployeeApp;
