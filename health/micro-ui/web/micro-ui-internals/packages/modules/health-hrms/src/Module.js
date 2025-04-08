import React from "react";
import { useRouteMatch } from "react-router-dom";

import CreateEmployeePage from "./pages/employee/createEmployee";

import EmployeeApp from "./pages/employee";

import Jurisdictions from "./components/pageComponents/jurisdiction";
import { overrideHooks, updateCustomConfigs } from "./hooks/hook_setup";
import RolesAssigned from "./components/pageComponents/SelectRolesAssigned";
import BoundaryComponent from "./components/pageComponents/SelectEmployeeBoundary";

import AssignCampaign from "./pages/employee/createAssignments";

import ResponseScreen from "./pages/employee/service_response";
import CampaignsAssignment from "./components/pageComponents/CampaignAssignment";
import InboxSearch from "./pages/employee/search_inbox";
import ActionPopUp from "./components/pageComponents/popup";
import EmployeeDetailScreen from "./pages/employee/employeeDetails";

import BreadCrumbs from "./components/pageComponents/BreadCrumb";

export const HRMSModule = ({ stateCode, userType, tenants }) => {
  const modulePrefix= "hcm";
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const moduleCode = ["HR", `boundary-${hierarchyType?.toString().toLowerCase()}`];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language,modulePrefix });
  const tenantId = Digit.ULBService.getCurrentTenantId();
  Digit.SessionStorage.set("HRMS_TENANTS", tenants);

  const { isLoading: isPaymentsModuleInitializing } = Digit.Hooks.hrms.useHrmsInitialization({
    tenantId: tenantId,
  });

  const { path, url } = useRouteMatch();
  if (!Digit.Utils.hrmsAccess()) {
    return null;
  }

  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} />;
  } else return null;
};

const componentsToRegister = {
  EmployeeDetailScreen,
  InboxSearch,

  ActionPopUp,
  CampaignsAssignment,
  BoundaryComponent,

  Jurisdictions,
  RolesAssigned,
  AssignCampaign,
  ResponseScreen,

  HRMSModule,

  

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
