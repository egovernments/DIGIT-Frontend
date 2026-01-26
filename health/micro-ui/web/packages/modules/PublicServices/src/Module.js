import { Loader } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import { default as EmployeeApp } from "./pages/employee";
import { default as CitizenApp } from "./pages/citizen";
import PublicServicesCard from "./components/PublicServicesCard";
import { updateCustomConfigs } from "./utils";
import axios from "axios";
import MapWithInput from "./components/MapWithInput";
import DynamicLoginComponent from "./components/DynamicLoginComponent";
import MDMSDependentDropdown from "./components/MDMSDependentDropdown";
import HierarchyDropdown from "./components/HierarchyDropdown";

export const PublicServicesModule = ({ stateCode, userType, tenants }) => {
  // const location = useLocation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const language = Digit.StoreData.getCurrentLanguage();

  const [serviceData, setServiceData] = useState(null);
  const [moduleListLoading, setModuleListLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const queryStrings = Digit.Hooks.useQueryParams();
  const serviceCode = queryStrings?.serviceCode;

  // Extract module and service from URL path for citizen routes like /citizen/publicservices/:module/:service/Apply
  const pathParts = window.location.pathname.split('/');
  const publicServicesIndex = pathParts.findIndex(part => part === 'publicservices');
  const pathModule = publicServicesIndex !== -1 ? pathParts[publicServicesIndex + 1] : null;
  const pathService = publicServicesIndex !== -1 ? pathParts[publicServicesIndex + 2] : null;

  // Use query params first, fallback to path params
  const urlModule = queryStrings?.module || pathModule;
  const urlService = queryStrings?.service || pathService;

  // Get current user and their roles for filtering
  const userInfo = Digit.UserService.getUser();
  const userRoles = userInfo?.info?.roles?.map((roleData) => roleData?.code) || [];

  // Admin roles that have access to all services
  const adminRoles = ["STUDIO_ADMIN", "LOC_ADMIN", "MDMS_ADMIN", "STUDIO_DESIGNER", "HRMS_ADMIN", "STUDIO_EMPLOYEE", "STUDIO_CITIZEN", "CITIZEN"];

  // Check if user has ONLY admin roles (no service-specific roles)
  const hasOnlyAdminRoles = userRoles.length > 0 && userRoles.every(role => adminRoles.includes(role));

  // Check if user has any non-admin roles (service-specific roles)
  const hasNonAdminRoles = userRoles.some(role => !adminRoles.includes(role));

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setModuleListLoading(true);
        const response = await axios.get("/public-service-init/v1/service", {
          params: { tenantId },
          headers: {
            "X-Tenant-Id": tenantId,
            "auth-token":
              window?.localStorage?.getItem("Employee.token") ||
              window?.localStorage?.getItem("token"),
          },
        });
        setServiceData(response.data);
      } catch (err) {
        console.error("API fetch error:", err);
        setApiError(err);
      } finally {
        setModuleListLoading(false);
      }
    };

    fetchServiceData();
  }, [tenantId]);

  let moduleList = [];
  if (serviceData) {
    let services = serviceData?.Services || [];

    // Filter to only include ACTIVE services
    services = services.filter((service) => service?.status === "ACTIVE");

    // Role-based filtering: Filter services based on user roles
    // Apply filtering if user has any non-admin (service-specific) roles
    if (hasNonAdminRoles && userRoles.length > 0) {
      services = services.filter((service) => {
        const moduleName = service?.module || '';
        const serviceName = service?.businessService || '';

        // Create prefix from module and service
        const modulePrefix = moduleName.replace(/\s+/g, '_').toUpperCase();
        const servicePrefix = serviceName.replace(/\s+/g, '_').toUpperCase();
        const expectedPrefix = `${modulePrefix}_${servicePrefix}_`;

        // Check if any user role starts with this prefix
        return userRoles.some(role => role.startsWith(expectedPrefix));
      });
    }

    if ((urlModule && urlService) || serviceCode) {
      // Case 1: module+service or serviceCode
      const filtered = services.find(
        (mod) =>
          (mod?.module === urlModule && mod?.businessService === urlService) ||
          mod?.serviceCode === serviceCode
      );
      if (filtered?.module) moduleList = [filtered.module];
    } else if (urlModule) {
      // Case 2: only module
      const filtered = services.find((mod) => mod?.module === urlModule);
      if (filtered?.module) moduleList = [filtered.module];
    } else {
      // Case 3: default - only modules user has access to (already filtered above)
      moduleList = [...new Set(services.map((ob) => ob?.module))];
    }
  }

  let moduleCode = [
    "sample",
    "common",
    "workflow",
    "digit-boundary-admin",
    "digit-boundary-kano",
    "digit-boundary-NEWTEST00222",
  ];

  moduleList.forEach((ob) => moduleCode.push(`studio-${ob}`));
  moduleCode.push("studio-newtl-checklist");

  const { isLoading: storeLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  let boundarymoduleCode = ["admin", "NEWTEST00222"];
  const { isLoading: boundarystoreLoading, data: boundarystore } =
    Digit.Services.useStore({
      stateCode,
      moduleCode: boundarymoduleCode,
      language,
      modulePrefix: "digit-boundary",
    });

  if (storeLoading || moduleListLoading || boundarystoreLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  if (apiError) {
    return <div>Error loading services: {apiError.message}</div>;
  }

  if (window.location.href.includes("digit-studio/citizen"))
    return (
      <CitizenApp
        stateCode={stateCode}
        userType={userType}
        tenants={tenants}
      />
    );
  return (
    <EmployeeApp
      stateCode={stateCode}
      userType={userType}
      tenants={tenants}
    />
  );
};

const componentsToRegister = {
  PublicServicesModule,
  PublicServicesCard,
  MapWithInput,
  DynamicLoginComponent,
  MDMSDependentDropdown,
  HierarchyDropdown
};

export const initPublicServiceComponents = () => {
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};