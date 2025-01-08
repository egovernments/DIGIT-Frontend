import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import PaymentsCard from "./components/PaymentsCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
import { ProviderContext } from "./utils/context";
import BoundaryComponent from "./components/sample";
import CampaignNameSelection from "./components/campaign_dropdown";
import CustomInboxSearchComposer from "./components/custom_inbox_composer";
import CustomInboxSearchLinks from "./components/custom_comp/link_section";
import CustomSearchComponent from "./components/custom_comp/search_section";
import CustomFilter from "./components/custom_comp/filter_section";
import CustomInboxTable from "./components/custom_comp/table_inbox";

export const PaymentsModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const hierarchyType = "MICROPLAN";

  // const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const moduleCode = ["payments", `boundary-${hierarchyType}`];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });
  let user = Digit?.SessionStorage.get("User");
  const { isLoading: isPaymentsModuleInitializing } = Digit.Hooks.payments.usePaymentsInitialization({
    tenantId: tenantId,
  });

  const { isLoading: isMDMSLoading, data: mdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "HCM",
    [{ name: "BOUNDARYTYPES" }, { name: "paymentsConfig" }],
    {
      cacheTime: Infinity,
    },
    { schemaCode: "PAYMENTS_MASTER_DATA" } //mdmsv2
  );

  const sortedBoundaryData = mdmsData?.MdmsRes?.HCM?.BOUNDARYTYPES?.sort((a, b) => a.order - b.order);
  const paymentsConfig = mdmsData?.MdmsRes?.HCM?.paymentsConfig?.[0];

  Digit.SessionStorage.set("boundaryHierarchyOrder", sortedBoundaryData);
  Digit.SessionStorage.set("paymentsConfig", paymentsConfig);

  if (isPaymentsModuleInitializing || isMDMSLoading) {
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
  PaymentsModule,
  PaymentsCard,
  BoundaryComponent,
  CampaignNameSelection,
  //
  CustomInboxSearchComposer,
  CustomInboxSearchLinks,
  CustomSearchComponent,
  CustomFilter,
  CustomInboxTable,
};

export const initPaymentComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
