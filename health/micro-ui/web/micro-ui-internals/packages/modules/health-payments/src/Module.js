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

  // const hierarchyType = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "ADMIN";
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
            "id": item.projectId,
            "tenantId": tenantId,
            "userId": item.userId,
          };
        })
      }
    }
  });

  const staffProjects = staffs?.data;

  const assignedProjects = Digit.Hooks.payments.useProjectSearch({
    data: {
      "Projects": staffProjects?.map((staff) => {
        return {
          "id": staff?.id,
          "tenantId": tenantId,
        };
      })
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

  const IndividualRequestCriteria = {
    url: `/health-individual/v1/_search`,
    params: {
      tenantId: tenantId,
      offset: 0,
      limit: 100,
    },
    body: {
      Individual: {
        userUuid: staffProjects?.map((staff) => {
          return staff.userId;
        })
      }
    },
    config: {
      enabled: staffProjects?.length > 0 ? true : false,
      select: (data) => {
        return data;
      },
    },
  };

  const { isLoading: isIndividualsLoading, data: IndividualData } = Digit.Hooks.useCustomAPIHook(IndividualRequestCriteria);


  Digit.SessionStorage.set("staffProjects", assignedProjects?.data);
  Digit.SessionStorage.set("UserIndividual", IndividualData?.Individual);


  if (isLoading || staffs?.isLoading || assignedProjects?.isLoading || isIndividualsLoading) {
    return <Loader />;
  }
  else {
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