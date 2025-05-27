import React from "react";
import { useRouteMatch } from "react-router-dom";

import CreateEmployeePage from "./pages/employee/createEmployee";

import EmployeeApp from "./pages/employee";

import { overrideHooks, updateCustomConfigs } from "./hooks/hook_setup";
import BoundaryComponent from "./components/pageComponents/SelectEmployeeBoundary";
import ResponseScreen from "./pages/employee/Response";
import InboxSearch from "./pages/employee/Inbox";
import ActionPopUp from "./components/pageComponents/popup";
import EmployeeDetailScreen from "./pages/employee/employeeDetails";
import AssignCampaignInbox from "./pages/employee/CampaignAssignmentInbox";
import Jurisdictions from "./components/pageComponents/Jurisdictions";

import BreadCrumbs from "./components/pageComponents/BreadCrumb";
import { Loader } from "@egovernments/digit-ui-components";

export const HRMSModule = ({ stateCode, userType, tenants }) => {
  const modulePrefix = "hcm";
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "HIERARCHYTEST";
  const moduleCode = ["HR", `boundary-${hierarchyType?.toString().toLowerCase()}`];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language, modulePrefix });
  const tenantId = Digit.ULBService.getCurrentTenantId();
  Digit.SessionStorage.set("HRMS_TENANTS", tenants);

  const { isLoading: isPaymentsModuleInitializing } = Digit.Hooks.hrms.useHrmsInitialization({
    tenantId: tenantId,
  });

  const { path, url } = useRouteMatch();
  if (!Digit.Utils.hrmsAccess()) {
    return null;
  }

  if (isLoading || isPaymentsModuleInitializing) {
      return <Loader />;
    } else {
  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} />;
  } 
}
};

const componentsToRegister = {
  EmployeeDetailScreen,
  InboxSearch,

  ActionPopUp,
  BoundaryComponent,
  ResponseScreen,
  AssignCampaignInbox,
  HRMSModule,
  Jurisdictions,
  HRCreateEmployee: CreateEmployeePage,
  BreadCrumbs,
};

export const initHRMSComponents = () => {
  overrideHooks();
  updateCustomConfigs();

  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
