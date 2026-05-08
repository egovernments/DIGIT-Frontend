import { useState, useEffect } from "react";
import { Loader } from "@egovernments/digit-ui-components";
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
import HierarchySelection from "./pages/employee/HierarchySelection";
import UserAssignment from "./components/pageComponents/UserAssigment";
import SearchUserToReport from "./components/pageComponents/SearchUserToReport";
import SelectableList from "./components/pageComponents/SelectableList";
import HRMSCard from "./components/HRMSCard";
import CreateEmployeePage from "./pages/employee/createEmployee";

export const HRMSModule = ({ stateCode, userType, tenants }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [hierarchySelected, setHierarchySelected] = useState(null);

  const { data: hierarchies, isLoading: isHierarchyLoading } =
    Digit.Hooks.hrms.useFetchAllBoundaryHierarchies({ tenantId });

  const moduleCode = ["HR"];
  const language = Digit.StoreData.getCurrentLanguage();

  useEffect(() => {
    Digit.SessionStorage.del("HIERARCHY_TYPE_SELECTED");
  }, []);

  const { isLoading } = Digit.Services.useStore({ stateCode, moduleCode, language, modulePrefix: "hcm" });

  Digit.SessionStorage.set("HRMS_TENANTS", tenants);
  Digit.SessionStorage.set("BOUNDARY_HIERARCHIES", hierarchies);

  if (!Digit.Utils.hrmsAccess?.()) return null;

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

  if (userType === "employee") {
    return <EmployeeApp />;
  }

  return null;
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
