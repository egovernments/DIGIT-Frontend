import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import DeathCard from "./components/DeathCard";
import { overrideHooks } from "./utils";
import { updateCustomConfigs } from "./utils";

export const DeathModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = ["Death"];
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

DeathCard,
DeathModule
};


export const initDeathComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
