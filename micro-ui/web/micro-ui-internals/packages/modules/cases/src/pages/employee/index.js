import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import CasesResponse from "./CasesResponse";
import CasesCreate from "./CasesCreate";
import CasesSearch from "./CasesSearch";
import JoinCaseHome from "./JoinCaseHome";
import AdvocateRegistration from "./advocateRegistration";
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
        <PrivateRoute path={`${path}/cases-response`} component={() => <CasesResponse></CasesResponse>} />
        <PrivateRoute path={`${path}/cases-create`} component={() => <CasesCreate />} />
        <PrivateRoute path={`${path}/cases-search`} component={() => <CasesSearch></CasesSearch>} />
        <PrivateRoute path={`${path}/join-case`} component={() => <JoinCaseHome />} />
        <PrivateRoute path={`${path}/advocate-registration`} component={() => <AdvocateRegistration></AdvocateRegistration>} />

      </AppContainer>
    </Switch>
  );
};

export default App;
