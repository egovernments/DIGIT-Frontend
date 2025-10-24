// import React from "react";
// import { useRouteMatch } from "react-router-dom";

// import { default as EmployeeApp } from "./pages/employee";
// import TLCard from "./components/TLCard";

// export const TLModule = ({ stateCode, userType, tenants }) => {
//   const { path, url } = useRouteMatch();

//   const moduleCode = ["tl"];
//   const language = Digit.StoreData.getCurrentLanguage();
//   const { isLoading, data: store } = Digit.Services.useStore({
//     stateCode,
//     moduleCode,
//     language,
//   });

//   if (isLoading) {
//     return "";
//   }

//   return userType === "employee" ? <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} /> : null;
// };

// const componentsToRegister = {
//   TLModule,
//   TLCard,
// };

// export const initTLComponents = () => {
//   Object.entries(componentsToRegister).forEach(([key, value]) => {
//     Digit.ComponentRegistryService.setComponent(key, value);
//   });
// };


import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import TLCard from "./components/TLCard";
import { overrideHooks } from "./utils";
import { updateCustomConfigs } from "./utils";

export const TLModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = ["tl"];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading) {
    return "";
  }

  return userType === "employee" ? <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} /> : null;
};

const componentsToRegister = {

TLCard,
TLModule
};


export const initTLComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
