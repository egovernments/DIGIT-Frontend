import { Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import MicroplanCard from "./components/MicroplanCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
import MicroplanDetails from "./components/MicroplanDetails";
import CampaignDetails from "./components/CampaignDetails";
import { ProviderContext } from "./utils/context";
export const MicroplanModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { data: BOUNDARY_HIERARCHY_TYPE } = Digit.Hooks.useCustomMDMS(tenantId, "HCM-ADMIN-CONSOLE", [{ name: "hierarchyConfig" }], {
    select: (data) => {
      return data?.["HCM-ADMIN-CONSOLE"]?.hierarchyConfig?.[0]?.hierarchy;
    },
  });
  const moduleCode = ["Microplanning", `boundary-${BOUNDARY_HIERARCHY_TYPE}`, "hcm-admin-schemas"];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <ProviderContext>
      <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />
    </ProviderContext>
  );
};

const componentsToRegister = {
  MicroplanModule,
  MicroplanCard,
  CampaignDetails,
  MicroplanDetails,
};

export const initMicroplanComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
