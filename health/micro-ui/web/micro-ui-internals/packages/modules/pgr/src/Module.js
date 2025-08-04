import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import PGRCard from "./components/PGRCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
import { ProviderContext } from "./utils/context";
import BoundaryComponent from "./components/BoundaryComponent";
import PGRDetails from "./pages/employee/PGRDetails";
import TimelineWrapper from "./components/TimeLineWrapper";
import AssigneeComponent from "./components/AssigneeComponent";
import PGRSearchInbox from "./pages/employee/PGRInbox";
import CreateComplaint from "./pages/employee/CreateComplaint";
import Response from "./components/Response";
import BreadCrumbs from "./components/BreadCrumbs";
import HierarchySelection from "./components/HierarchySelection";

export const PGRModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [hierarchySelected, setHierarchySelected] = useState(null);

  const { data: hierarchies,
    isLoading: isHierarchyLoading,
  } = Digit.Hooks.pgr.useFetchAllBoundaryHierarchies({ tenantId });
  const moduleCode = ["pgr",];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();
  useEffect(() => {
    Digit.SessionStorage.del("HIERARCHY_TYPE_SELECTED");
  }, []);
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  Digit.SessionStorage.set("BOUNDARY_HIERARCHIES", hierarchies);
  let user = Digit?.SessionStorage.get("User");


  if (isLoading  || isHierarchyLoading) {
    return <Loader />;
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
    return (
      <ProviderContext>
        <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />
      </ProviderContext>
    );
  }
};

const componentsToRegister = {
  PGRModule,
  PGRCard,
  PGRBoundaryComponent: BoundaryComponent,
  PGRComplaintDetails: PGRDetails,
  PGRTimeLineWrapper: TimelineWrapper,
  PGRAssigneeComponent: AssigneeComponent,
  PGRSearchInbox,
  PGRCreateComplaint: CreateComplaint,
  PGRResponse: Response,
  PGRBreadCrumbs: BreadCrumbs,
  PGRHierarchySelection: HierarchySelection,
};

export const initPGRComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
