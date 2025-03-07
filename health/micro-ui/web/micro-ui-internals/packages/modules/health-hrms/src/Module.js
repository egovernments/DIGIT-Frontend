import React from "react";
import { useRouteMatch } from "react-router-dom";

import SelectDateofEmployment from "./components/pageComponents/SelectDateofEmployment";
import SelectEmployeeName from "./components/pageComponents/SelectEmployeeName";
import CreateEmployeePage from "./pages/employee/createEmployee";
import SelectEmployeeId from "./components/pageComponents/SelectEmployeeId";
import SelectEmployeePassword from "./components/pageComponents/SelectEmployeePassword";
import SelectEmployeeDepartment from "./components/pageComponents/SelectEmployeeDepartment";
import SelectEmployeePhoneNumber from "./components/pageComponents/SelectEmployeePhoneNumber";
import SelectEmployeeGender from "./components/pageComponents/SelectEmployeeGender";
import SelectDateofBirthEmployment from "./components/pageComponents/EmployeeDOB";
import SelectEmployeeEmailId from "./components/pageComponents/SelectEmailId";
import SelectEmployeeCorrespondenceAddress from "./components/pageComponents/SelectEmployeeCorrespondenceAddress";
import SelectEmployeeType from "./components/pageComponents/SelectEmployeeType";
import EmployeeApp from "./pages/employee";
import SelectEmployeeDesignation from "./components/pageComponents/SelectEmployeeDesignation";
import Jurisdictions from "./components/pageComponents/jurisdiction";
import { overrideHooks, updateCustomConfigs } from "./hooks/hook_setup";
import RolesAssigned from "./components/pageComponents/SelectRolesAssigned";
import BoundaryComponent from "./components/pageComponents/SelectEmployeeBoundary";
import Response from "./pages/employee/response";
import AssignCampaign from "./pages/employee/createAssignments";

import ResponseScreen from "./pages/employee/service_response";
import CampaignsAssignment from "./components/pageComponents/CampaignAssignment";
import InboxSearch from "./pages/employee/search_inbox";
import ActionPopUp from "./components/pageComponents/popup";
import EmployeeDetailScreen from "./pages/employee/employeeDetails";

export const HRMSModule = ({ stateCode, userType, tenants }) => {
  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const moduleCode = ["HR", `boundary-${hierarchyType?.toString().toLowerCase()}`];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
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
  SelectEmployeeName,
  SelectEmployeeEmailId,
  SelectEmployeeCorrespondenceAddress,
  SelectEmployeeType,
  SelectDateofEmployment,
  SelectEmployeeDepartment,
  SelectEmployeeDesignation,
  Jurisdictions,
  RolesAssigned,
  AssignCampaign,
  ResponseScreen,

  SelectDateofBirthEmployment,
  HRMSModule,
  SelectEmployeeId,
  SelectEmployeePassword,
  SelectEmployeePhoneNumber,
  SelectEmployeeGender,
  HRMSResponse: Response,

  HRCreateEmployee: CreateEmployeePage,
};

export const initHRMSComponents = () => {
  overrideHooks();
  updateCustomConfigs();

  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
