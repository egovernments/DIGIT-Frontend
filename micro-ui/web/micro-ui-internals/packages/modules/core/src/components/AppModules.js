import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // Updated imports for v6

import ChangePassword from "../pages/employee/ChangePassword/index";
import ForgotPassword from "../pages/employee/ForgotPassword/index";
import { AppHome } from "./Home";
// import UserProfile from "./userProfile"; // Commented out as in original

// Assuming `Digit` is a global object as per your original code.
// No changes to `Digit` object's assumed existence or functionality.

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) => codes?.map?.((item) => item.code).includes(tenant.code));
};

export const AppModules = ({ stateCode, userType, modules, appTenants, additionalComponent }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider; // No change to this line
  // const { path } = useRouteMatch(); // Removed: useRouteMatch is not in v6
  const location = useLocation();
  // const history = useHistory(); // Removed: useHistory is not in v6

  const user = Digit.UserService.getUser();

  if (!user || !user?.access_token || !user?.info) {
    // Replaced Redirect with Navigate component
    return <Navigate to={{ pathname: `/${window?.contextPath}/employee/user/login`, state: { from: location.pathname + location.search } }} replace />;
  }

  const appRoutes = modules?.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return Module ? (
      <Route
        key={index}
        // In v6, paths are relative to the parent <Routes> by default.
        // If AppModules is mounted via <Route path="/some-path/*" element={<AppModules />} />
        // then `path="${code.toLowerCase()}/*"` will match /some-path/modulecode/...
        // Adding /* to allow nested routes within each module.
        path={`${code.toLowerCase()}/*`}
        element={<Module stateCode={stateCode} moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />}
      />
    ) : (
      <Route
        key={index}
        path={`${code.toLowerCase()}/*`} // Also adding /* for the error redirect route
        element={
          // Replaced Redirect with Navigate component
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
      <Routes> {/* Replaced Switch with Routes */}
        {appRoutes}
        {/*
          Paths are now relative.
          If AppModules is typically mounted at `/${window?.contextPath}/employee`,
          then these paths will correctly resolve.
        */}
        <Route
          path="login" // Relative path
          element={
            // Replaced Redirect with Navigate component
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
        {/* <Route path="user-profile" element={<UserProfile />} /> */}
      </Routes>
    </div>
  );
};