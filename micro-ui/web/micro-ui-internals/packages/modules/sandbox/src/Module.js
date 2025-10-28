import { Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import SandboxCard from "./components/SandboxCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
import ModuleCard from "./components/ModuleCard";
import ConfigUploaderComponent from "./pages/employee/tenantMgmt/ConfigUploaderComponent";
import LogoUploaderComponent from "./pages/employee/tenantMgmt/LogoUploaderComponent";

export const SandboxModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleCode = ["digit-sandbox", `rainmaker-mdms`, `rainmaker-workbench`, `rainmaker-schema`];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix: null,
  });


  if (!Digit.Utils.sandboxAccess()) {
    return null;
  }
  if (isLoading) {
    return <Loader />;
  }
  return <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />;
};

const componentsToRegister = {
  SandboxModule,
  SandboxCard,
  WorkbenchCard: null,
  HRMSCard:null,
  SandboxModuleCard: ModuleCard,
  ConfigUploaderComponent,
  LogoUploaderComponent
};

export const initSandboxComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
