import { Loader } from "@egovernments/digit-ui-components";
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import PaymentsCard from "./components/PaymentsCard";
import { overrideHooks, updateCustomConfigs } from "./utils";
import { ProviderContext } from "./utils/context";
import BoundaryComponent from "./components/BoundaryComponent";
import AttendanceInboxComponent from "./components/attendance_inbox/attendance_inbox";
import InboxSearchLinkHeader from "./components/InboxSearchLinkHeader";
import SearchResultsPlaceholder from "./components/SearchResultsPlaceholder";
// import HierarchySelection from "./components/HierachySelection";
import AttendeeBoundaryComponent from "./components/SearchAttendeeBoundary";
import CampaignCard from "./components/CampaignCard";

export const PaymentsModule = ({ stateCode, userType, tenants }) => {
  // const [hierarchySelected, setHierarchySelected] = useState(null);

  const location = useLocation();

  // Derive path from location pathname (replaces useRouteMatch)
  // Expected pattern: /{contextPath}/employee/payments/...
  // We need: /{contextPath}/employee/payments
  const path = useMemo(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 3) {
      return `/${pathParts.slice(0, 3).join("/")}`;
    }
    return `/${window?.contextPath}/employee/payments`;
  }, [location.pathname]);

  const tenantId = Digit.ULBService.getCurrentTenantId();

  const hierarchyType = window?.globalConfigs?.getConfig("HIERARCHY_TYPE") || "ADMIN";
  const moduleCode = ["payments", `boundary-${hierarchyType}`];
  const modulePrefix = "hcm";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
    modulePrefix,
  });
  let user = Digit?.SessionStorage.get("User");
  const { isLoading: isPaymentsModuleInitializing } = Digit.Hooks.payments.usePaymentsInitialization({
    tenantId: tenantId,
  });

  // const { data: hierarchies,
  //   isLoading : isHierarchyLoading,
  //    } = Digit.Hooks.hrms.useFetchAllBoundaryHierarchies({tenantId});

  //    Digit.SessionStorage.set("BOUNDARY_HIERARCHIES", hierarchies);

  // useEffect(() => {
  //     Digit.SessionStorage.del("HIERARCHY_TYPE_SELECTED");
  //   }, []);

  const { isLoading: isMDMSLoading, data: mdmsData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "HCM",
    [{ name: "paymentsConfig" }],
    {
      gcTime: Infinity,
    },
    { schemaCode: "PAYMENTS_MASTER_DATA" } //mdmsv2
  );

  const paymentsConfig = mdmsData?.MdmsRes?.HCM?.paymentsConfig?.[0];

  Digit.SessionStorage.set("paymentsConfig", paymentsConfig);

  const paths = window.location.pathname;

  const isEmployeeHome = paths.endsWith("/employee");

  if (isEmployeeHome) {
    Digit.SessionStorage.del("selectedPeriod");
  }

  // if (!hierarchySelected) {
  //   return (
  //     <HierarchySelection
  //       onHierarchyChosen={(hier) => {
  //         Digit.SessionStorage.set("HIERARCHY_TYPE_SELECTED", hier);
  //         setHierarchySelected(hier);
  //       }}
  //     />
  //   );
  // }

  if (isLoading || isPaymentsModuleInitializing || isMDMSLoading) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;
  } else {
    return (
      <ProviderContext>
        <EmployeeApp path={path} stateCode={stateCode} userType={userType} tenants={tenants} />
      </ProviderContext>
    );
  }
};

const componentsToRegister = {
  CampaignCard,
  PaymentsModule,
  PaymentsCard,
  BoundaryComponent,
  AttendanceInboxComponent,
  InboxSearchLinkHeader,
  SearchResultsPlaceholder,
  // HierarchySelection,
  AttendeeBoundaryComponent,
};

export const initPaymentComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
