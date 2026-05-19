import React from "react";
import { Redirect, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";

import ChangePassword from "../pages/employee/ChangePassword/index";
import ForgotPassword from "../pages/employee/ForgotPassword/index";
import { AppHome } from "./Home";
// import UserProfile from "./userProfile";

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes?.map?.((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants, additionalComponent }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const { path } = useRouteMatch();
  const location = useLocation();

  const user = Digit.UserService.getUser();
  const isLoggedIn = user && user?.access_token && user?.info;
  const fromSandbox = new URLSearchParams(location.search).get("from") === "sandbox";

  if (fromSandbox) {
    const segs = location.pathname.split("/");
    const empIdx = segs.indexOf("employee");
    const urlTenant = empIdx > 0 ? segs[empIdx - 1] : null;
    const userTenant = user?.info?.tenantId;
    const isTenantMismatch = isLoggedIn && urlTenant && userTenant && userTenant !== urlTenant;
    if (!isLoggedIn || isTenantMismatch) {
      return <Redirect to={`/${window?.globalPath}/user/login`} />;
    }
  } else if (!isLoggedIn) {
    return <Redirect to={{ pathname: `/${window?.contextPath}/employee/user/login`, state: { from: location.pathname + location.search } }} />;
  }

  const appRoutes = modules?.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return Module ? (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Module stateCode={stateCode} moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
      </Route>
    ) : (
      <Route key={index} path={`${path}/${code.toLowerCase()}`}>
        <Redirect
          to={`/${window?.contextPath}/employee/user/error?type=notfound&module=${code}` }
        />
      </Route>
    );
  });
  const isSuperUserWithMultipleRootTenant = Digit.UserService.hasAccess("SUPERUSER") && Digit.Utils.getMultiRootTenant();
   const hideClass =
    location.pathname.includes(`${path}/productDetailsPage/`);

  return (
    <div className={isSuperUserWithMultipleRootTenant ? "" : "ground-container digit-home-ground"}>
      <Switch>
        {appRoutes}
        <Route path={`${path}/login`}>
          <Redirect to={{ pathname: `/${window?.contextPath}/employee/user/login`, state: { from: location.pathname + location.search } }} />
        </Route>
        <Route path={`${path}/forgot-password`}>
          <ForgotPassword />
        </Route>
        <Route path={`${path}/change-password`}>
          <ChangePassword />
        </Route>
        <Route>
          <AppHome userType={userType} modules={modules} additionalComponent={additionalComponent} />
        </Route>
        {/* <Route path={`${path}/user-profile`}> <UserProfile /></Route> */}
      </Switch>
    </div>
  );
};
