import { Loader } from "@egovernments/digit-ui-components";
import React, { useEffect } from "react";
import { default as EmployeeApp } from "./pages/employee";
import PGRCard from "./components/PGRCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
import { CustomisedHooks } from "./hooks";
import { ProviderContext } from "./utils/context";
import BoundaryComponent from "./components/BoundaryComponent";
import BoundaryComponentWithCard from "./components/BoundaryComponentWithCard";
import DatePickerComponent from "./components/DatePickerComponent";
import PGRDetails from "./pages/employee/PGRDetails";
import TimelineWrapper from "./components/TimeLineWrapper";
import AssigneeComponent from "./components/AssigneeComponent";
import PGRSearchInbox from "./pages/employee/PGRInbox";
import CreateComplaint from "./pages/employee/CreateComplaint";
import Response from "./components/Response";
import BreadCrumbs from "./components/BreadCrumbs";
import UploadFileComponent from "./components/UploadFileComponent";

export const PGRModule = ({ stateCode, userType, tenants }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();

  useEffect(() => {
    Digit.SessionStorage.del("filtersForInbox");
    Digit.SessionStorage.del("HIERARCHY_TYPE_SELECTED");
  }, []);

  const { data: hierarchies, isLoading: isHierarchyLoading } =
    Digit.Hooks.pgr.useFetchAllBoundaryHierarchies({ tenantId });

  Digit.SessionStorage.set("BOUNDARY_HIERARCHIES", hierarchies);

  const moduleCode = ["pgr"];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();

  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  if (isLoading || isHierarchyLoading) {
    return (
      <Loader variant={"PageLoader"} className={"digit-center-loader"} />
    );
  }

  return (
    <ProviderContext>
      <EmployeeApp stateCode={stateCode} userType={userType} tenants={tenants} />
    </ProviderContext>
  );
};

const componentsToRegister = {
  PGRModule,
  PGRCard,
  PGRBoundaryComponent: BoundaryComponent,
  BoundaryComponentWithCard: BoundaryComponentWithCard,
  DatePickerComponent: DatePickerComponent,
  PGRComplaintDetails: PGRDetails,
  PGRTimeLineWrapper: TimelineWrapper,
  PGRAssigneeComponent: AssigneeComponent,
  PGRSearchInbox,
  PGRCreateComplaint: CreateComplaint,
  PGRResponse: Response,
  PGRBreadCrumbs: BreadCrumbs,
  UploadFileComponent
};

export const initPGRComponents = () => {
  overrideHooks(CustomisedHooks);
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
