import { AppContainer, BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import SandboxResponse from "./SandboxResponse";
import SandboxCreate from "./SandboxCreate";
import SandboxSearch from "./SandboxSearch";
import TenantView from "./tenantMgmt/TenantView";
import TenantCreate from "./tenantMgmt/TenantCreate";
import ApplicationHome from "./applicationMgmt/ApplicationHome";
import ModuleMasterTable from "./applicationMgmt/ModuleMasterTable";
import TenantUpdate from "./tenantMgmt/TenantUpdate";
import SetupMaster from "./applicationMgmt/SetupMaster";
import TenantConfigUpload from "./tenantMgmt/TenantConfigUpload";
import ProductPage from "./ProductPage";
import ProductDetails from "./ProductDetails";
import Landing from "./Landing";
import RoleLanding from "./RoleLanding";


const bredCrumbStyle = { maxWidth: "min-content" };

const ProjectBreadCrumb = ({ location, defaultPath }) => {
  
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const module = location.pathname.split('/').pop();
  const pathVar = location.pathname.replace(defaultPath + "/", "").split("?")?.[0];

  const crumbs = [
    {
      path: `/${window?.contextPath}/employee/sandbox/landing`,
      content: t("HOME"),
      show: true,
    },
    {
      path: `/${window?.contextPath}/employee/sandbox/productPage`,
      content: t("SANDBOX_PRODUCTS"),
      show: location.pathname.includes("productDetailsPage") || location.pathname.includes("productPage") ? true : false,
    },
    {
      path: `/${window?.contextPath}/employee/sandbox/productDetailsPage/${module}`,
      content: t(`${module.toUpperCase()}_PRODUCT_DETAILS_HEADER`),
      show: location.pathname.includes("productDetailsPage") ? true : false,
    },
    {
      path: pathVar === "application-management/home" ? "" : `/${window?.contextPath}/employee/sandbox/application-management/home`,
      content: t("APPLICATION_MANAGEMENT_CRUMB"),
      show: false,
    },
    {
      path: searchParams.get("module") ? "" : `/${window?.contextPath}/employee/sandbox/application-management/home`,
      content: t(`APPLICATON_MODULE_CRUMB_${searchParams.get("module")}`),
      show: !!searchParams.get("module"),
    },
  ];

  return <BreadCrumb crumbs={crumbs} spanStyle={bredCrumbStyle} />;
};



const App = ({ path, stateCode, userType, tenants }) => {
  const location = useLocation();

  const hideClass =
    location.pathname.includes(`${path}/productDetailsPage/`);
    
  return (
    <div className="employee-ui">
      <Switch>
        <AppContainer className= {hideClass ? "" : "ground-container" }>
          <React.Fragment>
            <ProjectBreadCrumb location={location} defaultPath={path} />
          </React.Fragment>
          <PrivateRoute path={`${path}/tenant-response`} component={() => <SandboxResponse />} />
          <PrivateRoute path={`${path}/tenant-create`} component={() => <SandboxCreate />} />
          <PrivateRoute path={`${path}/tenant-search`} component={() => <SandboxSearch />} />
          <PrivateRoute path={`${path}/tenant-management/create`} component={() => <TenantCreate />} />
          <PrivateRoute path={`${path}/tenant-management/search`} component={() => <TenantView />} />
          <PrivateRoute path={`${path}/tenant-management/update`} component={() => <TenantUpdate />} />
          <PrivateRoute path={`${path}/tenant-management/config/upload`} component={() => <TenantConfigUpload />} />
          <PrivateRoute path={`${path}/application-management/home`} component={() => <ApplicationHome />} />
          <PrivateRoute path={`${path}/application-management/module-master`} component={() => <SandboxSearch />} />
          <PrivateRoute path={`${path}/application-management/setup-master`} component={() => <SetupMaster />} />
          <PrivateRoute path={`${path}/application-management/module`} component={() => <ModuleMasterTable />} />
          <PrivateRoute path={`${path}/landing`}>
            <div className="sandbox-landing-wrapper">
              <Landing />
            </div>
          </PrivateRoute>
          <PrivateRoute path={`${path}/productPage`}>
            <div className="sandbox-landing-wrapper">
              <ProductPage />
            </div>
          </PrivateRoute>
          {/* <PrivateRoute path={`${path}/productDetailsPage/:module`}>
            <div className="employee-app-wrapper sandbox-landing-wrapper">
              <ProductDetails />
            </div>
          </PrivateRoute> */}
          <PrivateRoute path={`${path}/landing/select-role`}>
            <div className="employee-app-wrapper sandbox-landing-wrapper">
              <RoleLanding />
            </div>
          </PrivateRoute>
          <React.Fragment>
            <PrivateRoute path={`${path}/productDetailsPage/:module`}>
              <div>
                <ProductDetails isUpdated={true}/>
              </div>
            </PrivateRoute>
          </React.Fragment>

        </AppContainer>
      </Switch>
    </div>
  );
};

export default App;
