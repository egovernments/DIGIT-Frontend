import { Loader } from "@egovernments/digit-ui-components";
import React, { useEffect, useMemo } from "react";
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
  }, []);

 

  // Fetch every hierarchy type PGR is configured for, in the order configured in MDMS
  const { isLoading: isMDMSLoading, data: allowedHierarchyCodes } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "PGR",
    [{ name: "HierarchySelectedForPGR" }],
    {
      select: (data) =>
        (data?.PGR?.HierarchySelectedForPGR || []).map((item) => item?.hierarchyTypeCode).filter(Boolean),
    },
    {
      schemaCode: "PGR.HierarchySelectedForPGR",
      limit: 10,
      offset: 0
    }
  );

  // Fetch all hierarchy definitions (unfiltered) so every configured hierarchy can be selected
  const { data: allHierarchies,
    isLoading: isHierarchyLoading,
  } = Digit.Hooks.pgr.useFetchAllBoundaryHierarchies({ tenantId, config: { enabled: !!allowedHierarchyCodes?.length } });

  // Keep only the configured hierarchies, preserving the MDMS order
  const hierarchies = useMemo(
    () =>
      (allowedHierarchyCodes || [])
        .map((code) => (allHierarchies || []).find((hierarchy) => hierarchy?.hierarchyType === code))
        .filter(Boolean),
    [allHierarchies, allowedHierarchyCodes]
  );

  // Publish the allowed hierarchies, and seed the selection with the first configured hierarchy only
  // when there is no valid selection yet - so a hierarchy chosen on a screen is not overwritten.
  useEffect(() => {
    if (!hierarchies?.length) return;
    Digit.SessionStorage.set("BOUNDARY_HIERARCHIES", hierarchies);
    const currentSelection = Digit.SessionStorage.get("HIERARCHY_TYPE_SELECTED");
    const isStillValid = hierarchies.some((hierarchy) => hierarchy?.hierarchyType === currentSelection?.hierarchyType);
    if (!isStillValid) {
      Digit.SessionStorage.set("HIERARCHY_TYPE_SELECTED", hierarchies[0]);
    }
  }, [hierarchies]);


  const moduleCode = ["pgr",];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();

  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  let user = Digit?.SessionStorage.get("User");


  if (isLoading || isHierarchyLoading || isMDMSLoading) {
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
