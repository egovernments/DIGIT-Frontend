import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import { overrideHooks, updateCustomConfigs } from "./utils";
import { ProviderContext } from "./utils/context";
import DSSCard from "./components/DSSCard";

export const DSSModule = ({ stateCode, userType, tenants }) => {

  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const moduleCode = ["dss", `boundary-${hierarchyType}`];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();

  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });
  let user = Digit?.SessionStorage.get("User");
  const { isLoading: isDSSInitializing } = Digit.Hooks.DSS.useDssInitialization({
    tenantId: tenantId,
  });

  const { isLoading: isMDMSLoading, data: mdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "HCM-PROJECT-TYPES",
    [{ name: "projectTypes" }],
    {
      cacheTime: Infinity,
    },
    { schemaCode: "HCM-PROJECT-TYPES" } //mdmsv2
  );

  useEffect(() => {

    if (mdmsData) {
      const projectTypes = mdmsData?.Mdms?.["HCM-PROJECT-TYPES"]?.projectTypes;
      console.log(mdmsData?.Mdms?.["HCM-PROJECT-TYPES"], 'ttttttttttttttttttttttttttt');
      Digit.SessionStorage.set("projectTypes", projectTypes);
    }

  }, [mdmsData])

  if (isLoading || isDSSInitializing || isMDMSLoading) {
    return <Loader />;
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
};

export const initDSSComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
