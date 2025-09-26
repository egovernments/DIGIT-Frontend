import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazyWithFallback } from "../utils/lazyWithFallback";

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

  if (!user || !user?.access_token || !user?.info) {
    return <Navigate to={{ pathname: `/${window?.contextPath}/employee/user/login`, state: { from: location.pathname + location.search } }} replace />;
  }

  const appRoutes = modules?.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return Module ? (
      <Route
        key={index}
        path={`${code.toLowerCase()}/*`}
        element={<Module stateCode={stateCode} moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />}
      />
    ) : (
      <Route
        key={index}
        path={`${code.toLowerCase()}/*`}
        element={
          <Navigate
            to={`/${window?.contextPath}/employee/user/error?type=notfound&module=${code}`}
            replace
          />
        }
      />
    );
  });

  return (
    <div className="ground-container digit-home-ground">
      <Routes>
        {appRoutes}
        <Route
          path="login"
          element={
            <Navigate
              to={{ pathname: `/${window?.contextPath}/employee/user/login`, state: { from: location.pathname + location.search } }}
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