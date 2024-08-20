import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import SandboxResponse from "./SandboxResponse";
import SandboxCreate from "./SandboxCreate";
import SandboxSearch from "./SandboxSearch";
import ApplicationHome from "./applicationMgmt/ApplicationHome";
import ModuleMasterTable from "./applicationMgmt/ModuleMasterTable";
const bredCrumbStyle = { maxWidth: "min-content" };
const ProjectBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      path: `/${window?.contextPath}/application-management/home`,
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
        <PrivateRoute path={`${path}/tenant-response`} component={() => <SandboxResponse />} />
        <PrivateRoute path={`${path}/tenant-create`} component={() => <SandboxCreate />} />
        <PrivateRoute path={`${path}/tenant-search`} component={() => <SandboxSearch />} />
        <PrivateRoute path={`${path}/tenant-management/create`} component={() => <SandboxCreate />} />
        <PrivateRoute path={`${path}/tenant-management/search`} component={() => <SandboxSearch />} />
        <PrivateRoute path={`${path}/application-management/home`} component={() => <ApplicationHome />} />
        <PrivateRoute path={`${path}/application-management/module-master`} component={() => <SandboxSearch />} />
        <PrivateRoute path={`${path}/application-management/module`} component={() => <ModuleMasterTable />} />
      </AppContainer>
    </Switch>
  );
};

export default App;
