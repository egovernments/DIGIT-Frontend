import React from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import BillsCard from "./components/BillsCard";
import { overrideHooks } from "./utils";
import { updateCustomConfigs } from "./utils";

export const BillsModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = ["bill-amend"];
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

BillsCard,
BillsModule
};


export const initBillsComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
