import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazyWithFallback } from "@egovernments/digit-ui-components";
import DynamicModuleLoader from "./DynamicModuleLoader";

// Create lazy components with fallbacks using the utility
const ChangePassword = lazyWithFallback(
  () => import(/* webpackChunkName: "app-change-password" */ "../pages/employee/ChangePassword/index"),
  () => require("../pages/employee/ChangePassword/index").default,
  { loaderText: "Loading Change Password..." }
);

const ForgotPassword = lazyWithFallback(
  () => import(/* webpackChunkName: "app-forgot-password" */ "../pages/employee/ForgotPassword/index"),
  () => require("../pages/employee/ForgotPassword/index").default,
  { loaderText: "Loading Forgot Password..." }
);

const AppHome = lazyWithFallback(
  () => import(/* webpackChunkName: "app-home" */ "./Home").then(module => ({ default: module.AppHome })),
  () => require("./Home").AppHome,
  { loaderText: "Loading Home..." }
);

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes?.map?.((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants, additionalComponent }) => {
  const location = useLocation();
  const user = Digit.UserService.getUser();

  // Super user with multi-root tenant check
  const isSuperUserWithMultipleRootTenant = Digit.UserService.hasAccess("SUPERUSER") && Digit.Utils.getMultiRootTenant();

  // Check if on product details page for conditional styling
  const hideClass = location.pathname.includes(`/${window?.contextPath}/${userType}/productDetailsPage/`);

  if (!user || !user?.access_token || !user?.info) {
    return (
      <Navigate
        to={`/${window?.contextPath}/${userType}/user/login`}
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // Create app routes with dynamic module loading
  const appRoutes = modules?.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);

    if (Module) {
      return (
        <Route
          key={index}
          path={`${code.toLowerCase()}/*`}
          element={
            <Module
              stateCode={stateCode}
              moduleCode={code}
              userType={userType}
              tenants={getTenants(tenants, appTenants)}
            />
          }
        />
      );
    }

    // If module not found, redirect to error page
    return (
      <Route
        key={index}
        path={`${code.toLowerCase()}/*`}
        element={
          <Navigate
            to={`/${window?.contextPath}/${userType}/user/error?type=notfound&module=${code}`}
            replace
          />
        }
      />
    );
  });

  return (
    <div className={isSuperUserWithMultipleRootTenant && hideClass ? "" : "ground-container digit-home-ground"}>
      <Routes>
        {appRoutes}
        <Route
          path="login"
          element={
            <Navigate
              to={`/${window?.contextPath}/${userType}/user/login`}
              state={{ from: location.pathname + location.search }}
              replace
            />
          }
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route
          path="*"
          element={
            <AppHome
              userType={userType}
              modules={modules}
              additionalComponent={additionalComponent}
            />
          }
        />
      </Routes>
    </div>
  );
};