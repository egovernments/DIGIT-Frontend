import { Loader } from "@egovernments/digit-ui-components";
import React from "react";
import { default as EmployeeApp } from "./pages/employee";
import SampleCard from "./components/SampleCard";
import HRMSCard from "./components/HRMSCard";
import ViewEstimateComponent from "./components/ViewEstimateComponent";
import { overrideHooks, updateCustomConfigs } from "./utils";
import AdditionalComponentWrapper from "./components/AdditionalComponent";
import SampleMultiComponent from "./components/SampleMultiComponent";

// SampleModule component manages the initialization and rendering of the module
export const SampleModule = ({ stateCode, userType, tenants }) => {
  // Get the current route path and URL using React Router

  // Get the currently selected tenant ID from DIGIT's ULB Service
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // Define the modules that this component depends on
  const moduleCode = ["sample", "common", "workflow"];

  // Get the current language selected in the DIGIT Store
  const language = Digit.StoreData.getCurrentLanguage();

  // Fetch module-specific store data
  const { isLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  // Display a loader until the data is available
  if (isLoading) {
    return <Loader page={true} variant={"PageLoader"} />;
  }

  // Render the EmployeeApp component with required props
  return <EmployeeApp stateCode={stateCode} userType={userType} tenants={tenants} />;
};

// Register components to be used in DIGIT's Component Registry
const componentsToRegister = {
  UtilitiesModule: SampleModule,
  UtilitiesCard: SampleCard,
  HRMSCard,
  ViewEstimatePage: ViewEstimateComponent,
  SampleAdditionalComponent: AdditionalComponentWrapper,
  SampleMultiComponent: SampleMultiComponent,
};

// Initialize and register module components
export const initSampleComponents = () => {
  // Apply custom hooks overrides
   overrideHooks();

  // Update custom configuratio
   updateCustomConfigs();

  // Register each component with the DIGIT Component Registry
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
