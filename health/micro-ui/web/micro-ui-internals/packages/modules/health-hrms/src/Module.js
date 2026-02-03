import React, { useEffect, useMemo, useState } from "react";
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
import HierarchySelection from "./pages/employee/HierarchySelection";
import UserAssignment from "./components/pageComponents/UserAssigment";
import SearchUserToReport from "./components/pageComponents/SearchUserToReport";
import SelectableList from "./components/pageComponents/SelectableList";
import HRMSCard from "./components/HRMSCard";

export const HRMSModule = ({ stateCode, userType, tenants }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const modulePrefix = "hcm";
  const [hierarchySelected, setHierarchySelected] = useState(null);


  const { data: hierarchies,
    isLoading: isHierarchyLoading,
  } = Digit.Hooks.hrms.useFetchAllBoundaryHierarchies({ tenantId });

  const moduleCode = ["HR",];
  const language = Digit.StoreData.getCurrentLanguage();

  useEffect(() => {
    Digit.SessionStorage.del("HIERARCHY_TYPE_SELECTED");
  }, []);
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode: moduleCode, language, modulePrefix });
  Digit.SessionStorage.set("HRMS_TENANTS", tenants);
  Digit.SessionStorage.set("BOUNDARY_HIERARCHIES", hierarchies);

  const { path, url } = useRouteMatch();
  if (!Digit.Utils.hrmsAccess()) {
    return null;
  }

  if (isLoading || isHierarchyLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  }

  if (!hierarchySelected) {
    return (
      <HierarchySelection
        onHierarchyChosen={(hier) => {
          Digit.SessionStorage.set("HIERARCHY_TYPE_SELECTED", hier);
          setHierarchySelected(hier);
        }}
      />
    );
  }

  else {
    if (userType === "employee") {
      return <EmployeeApp path={path} url={url} />;
    }
  }
};

const componentsToRegister = {
  EmployeeDetailScreen,
  InboxSearch,
  HRMSCard,
  ActionPopUp,
  BoundaryComponent,
  ResponseScreen,
  AssignCampaignInbox,
  HRMSModule,
  Jurisdictions,
  HRCreateEmployee: CreateEmployeePage,
  BreadCrumbs,
  HierarchySelection,
  UserAssignment,
  SearchUserToReport,
  SelectableList,

};

export const initHRMSComponents = () => {
  overrideHooks();
  updateCustomConfigs();

  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
