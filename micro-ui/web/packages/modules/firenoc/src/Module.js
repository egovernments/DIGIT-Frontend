import React from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import FirenocCard from "./components/FirenocCard";
import { overrideHooks } from "./utils";
import { updateCustomConfigs } from "./utils";

export const FirenocModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = ["FIRENOC"];
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
  FIRENOCCard: FirenocCard,
  FIRENOCModule: FirenocModule
};


export const initFirenocComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
