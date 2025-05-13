// import React from "react";
// import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// import ChangePassword from "../pages/employee/ChangePassword/index";
// import ForgotPassword from "../pages/employee/ForgotPassword/index";
// import { AppHome } from "./Home";
// // import UserProfile from "./userProfile";

// const getTenants = (codes, tenants) => {
//   return tenants.filter((tenant) => codes?.map?.((item) => item.code).includes(tenant.code));
// };

// export const AppModules = ({ stateCode, userType, modules, appTenants, additionalComponent }) => {
//   const ComponentProvider = Digit.Contexts.ComponentProvider;
//   const { path } = useRouteMatch();
//   const location = useLocation();

//   const user = Digit.UserService.getUser();

//   if (!user || !user?.access_token || !user?.info) {
//     return <Redirect to={{ pathname: `/${window?.contextPath}/employee/user/login`, state: { from: location.pathname + location.search } }} />;
//   }

//   const appRoutes = modules?.map(({ code, tenants }, index) => {
//     const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
//     return Module ? (
//       <Route key={index} path={`${path}/${code.toLowerCase()}`}>
//         <Module stateCode={stateCode} moduleCode={code} userType={userType} tenants={getTenants(tenants, appTenants)} />
//       </Route>
//     ) : (
//       <Route key={index} path={`${path}/${code.toLowerCase()}`}>
//         <Redirect
//           to={`/${window?.contextPath}/employee/user/error?type=notfound&module=${code}` }
//         />
//       </Route>
//     );
//   });

//   return (
//     <div className="ground-container digit-home-ground">
//       <Switch>
//         {appRoutes}
//         <Route path={`${path}/login`}>
//           <Redirect to={{ pathname: `/${window?.contextPath}/employee/user/login`, state: { from: location.pathname + location.search } }} />
//         </Route>
//         <Route path={`${path}/forgot-password`}>
//           <ForgotPassword />
//         </Route>
//         <Route path={`${path}/change-password`}>
//           <ChangePassword />
//         </Route>
//         <Route>
//           <AppHome userType={userType} modules={modules} additionalComponent={additionalComponent} />
//         </Route>
//         {/* <Route path={`${path}/user-profile`}> <UserProfile /></Route> */}
//       </Switch>
//     </div>
//   );
// };

import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import ChangePassword from "../pages/employee/ChangePassword/index";
import ForgotPassword from "../pages/employee/ForgotPassword/index";
import { AppHome } from "./Home";
// import UserProfile from "./userProfile";

const getTenants = (codes, tenants) => {
  return tenants.filter((tenant) =>
    codes?.map?.((item) => item.code).includes(tenant.code)
  );
};

export const AppModules = ({ stateCode, userType, modules, appTenants, additionalComponent }) => {
  const ComponentProvider = Digit.Contexts.ComponentProvider;
  const location = useLocation();


  const user = Digit.UserService.getUser();

  if (!user || !user?.access_token || !user?.info) {
    return (
      <Navigate
        to={`/${window?.contextPath}/employee/user/login`}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  const appRoutes = modules?.map(({ code, tenants }, index) => {
    const Module = Digit.ComponentRegistryService.getComponent(`${code}Module`);
    return Module ? (
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
              to={`/${window?.contextPath}/employee/user/login`}
              replace
              state={{ from: location.pathname + location.search }}
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