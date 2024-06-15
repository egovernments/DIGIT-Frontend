import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import SubmissionsResponse from "./SubmissionsResponse";
import SubmissionsCreate from "./SubmissionsCreate";
import SubmissionsSearch from "./SubmissionsSearch";
const bredCrumbStyle={ maxWidth: "min-content" };
const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      path: `/${window?.contextPath}/employee`,
      content: t(location.pathname.split("/").pop()),
      show: true,
    },
  ];
  return <BreadCrumb crumbs={crumbs} spanStyle={bredCrumbStyle} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} />
        </React.Fragment>
        <PrivateRoute path={`${path}/submissions-response`} component={() => <SubmissionsResponse></SubmissionsResponse>} />
        <PrivateRoute path={`${path}/submissions-create`} component={() => <SubmissionsCreate />} />
        <PrivateRoute path={`${path}/submissions-search`} component={() => <SubmissionsSearch></SubmissionsSearch>} />
      </AppContainer>
    </Switch>
  );
};

export default App;
