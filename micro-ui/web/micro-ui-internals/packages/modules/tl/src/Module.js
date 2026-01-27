import React from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import { default as CitizenApp } from "./pages/citizen";
import TLCard from "./components/TLCard";
import { overrideHooks, updateCustomConfigs } from "./utils";

export const TLModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();

  const moduleCode = ["TL"];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading) {
    return "";
  }
  Digit.SessionStorage.set("TL_TENANTS", tenants);

  return userType === "employee" ? <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} /> : <CitizenApp />;
};


import TLNewApplication from "./pages/employee/NewApplication";
import TLInfoLabel from "./components/TLInfoLabel";
import TLTradeDetailsEmployee from "./components/TLTradeDetailsEmployee";
import TLTradeUnitsEmployee from "./components/TLTradeUnitsEmployee";
import TLAccessoriesEmployee from "./components/TLAccessoriesEmployee";
import TLOwnerDetailsEmployee from "./components/TLOwnerDetailsEmployee";
import TLDocumentsEmployee from "./components/TLDocumentsEmployee";
import Search from "./pages/employee/Search";

const componentsToRegister = {
  TLModule,
  TLCard,
  TLNewApplication,
  TLInfoLabel,
  TLTradeDetailsEmployee,
  TLTradeUnitsEmployee,
  TLAccessoriesEmployee,
  TLOwnerDetailsEmployee,
  TLDocumentsEmployee,
  SearchLicense: Search,
  TLSearch: Search,
};

export const initTLComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
