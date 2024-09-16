import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "react-router-dom";
import SandboxResponse from "./SandboxResponse";
import SandboxCreate from "./SandboxCreate";
import SandboxSearch from "./SandboxSearch";
import TenantView from "./tenantMgmt/TenantView";
import TenantCreate from "./tenantMgmt/TenantCreate";
import ApplicationHome from "./applicationMgmt/ApplicationHome";
import ModuleMasterTable from "./applicationMgmt/ModuleMasterTable";
import TenantUpdate from "./tenantMgmt/TenantUpdate";
import SetupMaster from "./applicationMgmt/SetupMaster";
import TenantInfocard from "./tenantMgmt/TenantInfoCard";

const bredCrumbStyle = { maxWidth: "min-content" };

const ProjectBreadCrumb = ({ location, defaultPath }) => {
  const { t } = useTranslation();
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];
  const module = location.href.includes("module=")
    ? location.href
        .replace(defaultPath + "/", "")
        .split("?")?.[1]
        ?.split("=")?.[1]
    : null;

  const crumbs = [
    {
      path: `/${window?.contextPath}/employee`,
      content: t("HOME"),
      show: true,
    },
    {
      path: pathVar === "application-management/home" ? "" : `/${window?.contextPath}/employee/sandbox/application-management/home`,
      content: t("APPLICATION_MANAGEMENT_CRUMB"),
      show: pathVar.includes("application-management") ? true : false,
    },
    {
      path: module ? "" : `/${window?.contextPath}/employee/sandbox/application-management/home`,
      content: t(`APPLICATON_MODULE_CRUMB_${module}`),
      show: module ? true : false,
    },
  ];

  return <BreadCrumb crumbs={crumbs} spanStyle={bredCrumbStyle} />;
};

const App = ({ path, stateCode, userType, tenants }) => {
  return (
    <Switch>
      <AppContainer className="ground-container">
        <React.Fragment>
          <ProjectBreadCrumb location={location} defaultPath={path} />
        </React.Fragment>
        <PrivateRoute path={`${path}/tenant-response`} component={() => <SandboxResponse />} />
        <PrivateRoute path={`${path}/tenant-create`} component={() => <SandboxCreate />} />
        <PrivateRoute path={`${path}/tenant-search`} component={() => <SandboxSearch />} />
        <PrivateRoute path={`${path}/tenant-management/create`} component={() => <TenantCreate />} />
        <PrivateRoute path={`${path}/tenant-management/search`} component={() => <TenantView />} />
        <PrivateRoute path={`${path}/tenant-management/update`} component={() => <TenantUpdate />} />
        <PrivateRoute path={`${path}/tenant-management/info`} component={() => <TenantInfocard />} />
        <PrivateRoute path={`${path}/application-management/home`} component={() => <ApplicationHome />} />
        <PrivateRoute path={`${path}/application-management/module-master`} component={() => <SandboxSearch />} />
        <PrivateRoute path={`${path}/application-management/setup-master`} component={() => <SetupMaster />} />
        <PrivateRoute path={`${path}/application-management/module`} component={() => <ModuleMasterTable />} />
        
      </AppContainer>
    </Switch>
  );
};

export default App;
