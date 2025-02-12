import React from "react";
import { useRouteMatch } from "react-router-dom";
// import HRMSCard from "./components/hrmscard";
// import InboxFilter from "./components/InboxFilter";
// import ActionModal from "./components/Modal";
// import Assignments from "./components/pageComponents/assignment";
// import HRBanner from "./components/pageComponents/Banner";
// import SelectDateofBirthEmployment from "./components/pageComponents/EmployeeDOB";
// import SelectEmployeePhoneNumber from "./components/pageComponents/EmployeePhoneNumber";
// import Jurisdictions from "./components/pageComponents/jurisdiction";
import SelectDateofEmployment from "./components/pageComponents/SelectDateofEmployment";
// import SelectEmployeeEmailId from "./components/pageComponents/SelectEmailId";
// import SelectEmployeeCorrespondenceAddress from "./components/pageComponents/SelectEmployeeCorrespondenceAddress";
// import SelectEmployeeGender from "./components/pageComponents/SelectEmployeeGender";
// import SelectEmployeeId from "./components/pageComponents/SelectEmployeeId";
import SelectEmployeeName from "./components/pageComponents/SelectEmployeeName";
// import SelectEmployeeType from "./components/pageComponents/SelectEmployeeType";

import CreateEmployeePage from "./pages/employee/createEmployee";
import SelectEmployeeId from "./components/pageComponents/SelectEmployeeId";
import SelectEmployeePassword from "./components/pageComponents/SelectEmployeePassword";
import SelectEmployeeDepartment from "./components/pageComponents/SelectEmployeeDepartment";
// import EditEmployee from "./pages/EditEmployee/index";
// import Details from "./pages/EmployeeDetails";
// import Inbox from "./pages/Inbox";
// import Response from "./pages/Response";
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

export const HRMSModule = ({ stateCode, userType, tenants }) => {
  //   const moduleCode = "HR";
  //   const language = Digit.StoreData.getCurrentLanguage();
  //   const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  //   Digit.SessionStorage.set("HRMS_TENANTS", tenants);
  //   const { path, url } = useRouteMatch();
  //   if (!Digit.Utils.hrmsAccess()) {
  //     return null;
  //   }
  //   if (userType === "employee") {
  //     return <EmployeeApp path={path} url={url} />;
  //   } else return null;
  // };

  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const moduleCode = ["HR", `boundary-${hierarchyType?.toString().toLowerCase()}`];
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  Digit.SessionStorage.set("HRMS_TENANTS", tenants);
  const { path, url } = useRouteMatch();
  if (!Digit.Utils.hrmsAccess()) {
    return null;
  }
  if (userType === "employee") {
    return <EmployeeApp path={path} url={url} />;
  } else return null;
};

const componentsToRegister = {
  // HRMSCard,
  // HRMSDetails: Details,
  // SelectEmployeeEmailId,
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
  // SelectEmployeeId,
  // Jurisdictions,
  // Assignments,
  // ActionModal,
  // HRBanner,
  // SelectEmployeePhoneNumber,
  // SelectDateofEmployment,
  // SelectEmployeeType,
  // SelectEmployeeCorrespondenceAddress,
  // SelectEmployeeGender,
  // SelectDateofBirthEmployment,
  SelectDateofBirthEmployment,
  HRMSModule,
  SelectEmployeeId,
  SelectEmployeePassword,
  SelectEmployeePhoneNumber,
  SelectEmployeeGender,
   HRMSResponse: Response,
  // HREditEmpolyee: EditEmployee,
  HRCreateEmployee: CreateEmployeePage,
  // HRInbox: Inbox,
  // HRMS_INBOX_FILTER: (props) => <InboxFilter {...props} />,
};

export const initHRMSComponents = () => {
  overrideHooks();
  updateCustomConfigs();

  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
