import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import PaymentsCard from "./components/PaymentsCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
import { ProviderContext } from "./utils/context";
import Sample from "./components/sample";
import CampaignNameSelection from "./components/campaign_dropdown";
import CustomInboxSearchComposer from "./components/custom_inbox_composer";
import CustomInboxSearchLinks from "./components/custom_comp/link_section";
import CustomSearchComponent from "./components/custom_comp/search_section";
import CustomFilter from "./components/custom_comp/filter_section";
import CustomInboxTable from "./components/custom_comp/table_inbox";

export const PaymentsModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const moduleCode = ["payments"];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });
  let user = Digit?.SessionStorage.get("User");
  const staffs = Digit.Hooks.payments.useProjectStaffSearch({
    data: {
    "ProjectStaff": {
      "staffId": [user?.info?.uuid]
      }
    },
    params: {
      "tenantId": tenantId,
      "offset": 0,
      "limit": 100
    },
    config: {
      select: (data) => {
        return data?.map(item => {
          return {
          "id" : item.projectId,
          "tenantId": tenantId,
          };
        })
      }
    }
});

const staffProjects = staffs?.data;

const assignedProjects = Digit.Hooks.payments.useProjectSearch({
  data: {
  "Projects": staffProjects
  },
  params: {
    "tenantId": tenantId,
    "offset": 0,
    "limit": 100
  },
  config: {
    enabled: staffProjects?.length > 0 ? true : false
  }
});

 Digit.SessionStorage.set("staffProjects", assignedProjects?.data); 



  if (isLoading || staffs?.isLoading || assignedProjects?.isLoading) {
    return <Loader />;
  }
  else{
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
  Sample,
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
