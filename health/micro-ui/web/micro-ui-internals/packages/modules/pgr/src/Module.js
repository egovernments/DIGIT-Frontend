import { Loader } from "@egovernments/digit-ui-components";
import React, { useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import PGRCard from "./components/PGRCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
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
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  useEffect(() => {
    Digit.SessionStorage.del("filtersForInbox");
  }, []);

 

  // Fetch hierarchy type from MDMS v2
  const { isLoading: isMDMSLoading, data: HierarchySelectedForPGR } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "PGR",
    [{ name: "HierarchySelectedForPGR" }],
    {
      select: (data) => {
        // Extract hierarchyTypeCode from MDMS response
        const hierarchyTypeCode = data?.PGR?.HierarchySelectedForPGR?.[0]?.hierarchyTypeCode;
        return hierarchyTypeCode;
      },
    },
    {
      schemaCode: "PGR.HierarchySelectedForPGR",
      limit: 10,
      offset: 0
    }
  );

  const { data: hierarchies,
    isLoading: isHierarchyLoading,
  } = Digit.Hooks.pgr.useFetchAllBoundaryHierarchies({ tenantId, config:{refetchKey: HierarchySelectedForPGR, enabled: !!HierarchySelectedForPGR} });

  // Set hierarchy in SessionStorage when both hierarchies and HierarchySelectedForPGR are available
  useEffect(() => {
    if (hierarchies && HierarchySelectedForPGR) {
      // Find the matching hierarchy from hierarchies data
      const selectedHierarchy = hierarchies.find(h => h.hierarchyType === HierarchySelectedForPGR);
      if (selectedHierarchy) {
        // Store the complete hierarchy object in sessionStorage
        Digit.SessionStorage.set("HIERARCHY_TYPE_SELECTED", selectedHierarchy);
      }
    }
  }, [hierarchies, HierarchySelectedForPGR]);


  const moduleCode = ["pgr",];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();

  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });

  Digit.SessionStorage.set("BOUNDARY_HIERARCHIES", hierarchies);
  let user = Digit?.SessionStorage.get("User");


  if (isLoading || isHierarchyLoading || isMDMSLoading) {
    return (
      <Loader variant={"PageLoader"} className={"digit-center-loader"} />
    );
  }

  return (
    <ProviderContext>
      <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />
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
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
