import { Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import SampleCard from "./components/SampleCard";
import HRMSCard from "./components/HRMSCard";
import ViewEstimateComponent from "./components/ViewEstimateComponent";
import { overrideHooks, updateCustomConfigs } from "./utils";
import AdditionalComponentWrapper from "./components/AdditionalComponent";
import SampleMultiComponent from "./components/SampleMultiComponent";

export const SampleModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const moduleCode = ["sample", "common", "workflow"];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading) {
    return <Loader />;
  }
  return <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />;
};

const componentsToRegister = {
  SampleModule,
  SampleCard,
  HRMSCard,
  ViewEstimatePage: ViewEstimateComponent,
  SampleAdditionalComponent: AdditionalComponentWrapper,
  SampleMultiComponent: SampleMultiComponent,
};

export const initSampleComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
