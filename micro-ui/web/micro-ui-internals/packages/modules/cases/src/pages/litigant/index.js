import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import JoinCaseHome from "./JoinCaseHome";
import caseAndFilingSearch from "../employee/CaseAndFilingSearch";
import CasesResponse from "./CasesResponse";
import CasesCreate from "./CasesCreate";
import CasesSearch from "./CasesSearch";
const bredCrumbStyle = { maxWidth: "min-content" };
const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: `/${window?.contextPath}/litigant`,
      content: t("HOME"),
      show: true,
    },
    {
      path: `/${window?.contextPath}/litigant`,
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
        <PrivateRoute path={`${path}/join-case`} component={() => <JoinCaseHome></JoinCaseHome>} />
      </AppContainer>
    </Switch>
  );
};

export default App;
