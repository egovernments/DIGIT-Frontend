import { Loader } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import { overrideHooks, updateCustomConfigs } from "./utils";
import { getHierarchyType } from "./utils/getHierarchyType";
import { ProviderContext } from "./utils/context";
import DSSCard from "./components/DSSCard";
import DateRangePicker from "./components/DateRangePicker";
import DSSCampaignRowCard from "./components/DSSCampaignRowCard";

export const DSSModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  // Recomputed on each render (route changes re-render via useRouteMatch), so picking a
  // campaign swaps in that hierarchy's boundary localizations — moduleCode is part of
  // useStore's react-query key, so a change refetches.
  const hierarchyType = getHierarchyType();
  const moduleCode = ["hcm-campaignmanager","hcm-dss", `hcm-boundary-${hierarchyType}`,"rainmaker-hcm-dss"];
  const modulePrefix = "";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });
  if (isLoading) {
    return <Loader className={"digit-center-loader"}/>;
  } else {
    return (
      <ProviderContext>
        <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />
      </ProviderContext>
    );
  }
};

const componentsToRegister = {
  DSSModule,
  DSSCard,
  DateRangePicker,
  DSSCampaignRowCard
};

export const initDSSComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
