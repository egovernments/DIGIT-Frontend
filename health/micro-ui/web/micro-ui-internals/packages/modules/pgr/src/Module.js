import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
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
import CreateComplaint from "./pages/employee/CreateComplaintNew";
import Response from "./components/Response";

export const PGRModule = ({ stateCode, userType, tenants }) => {
  const { path, url } = useRouteMatch();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const hierarchyType =  "HIERARCHYTEST";
  const moduleCode = ["pgr", `boundary-${hierarchyType}`];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });
  let user = Digit?.SessionStorage.get("User");
  const { isLoading: isPGRInitializing } = Digit.Hooks.pgr.usePGRInitialization({
    tenantId: tenantId,
  });

  console.log("PGR INITIALIZING", isPGRInitializing);

  if (isLoading || isPGRInitializing ) {
    return <Loader />;
  } else {
    console.log("return Employee App");
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
};

export const initPGRComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
