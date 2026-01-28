import { Loader } from "@egovernments/digit-ui-components";
import React, { useEffect, useState } from "react";
import { default as EmployeeApp } from "./pages/employee";
import ServiceDesignerCard from "./components/ServiceDesignerCard";
import CreateQuestion from "./components/CreateQuestion";
import CreateQuestionContext from "./components/CreateQuestionContext";

export const TEMPLATE_BASE_CONFIG_MASTER = "FormConfigTemplate";
export const CONSOLE_MDMS_MODULENAME = "Studio";

// Check if specific boundary locale is already cached in localStorage
const isBoundaryLocaleCached = (moduleName) => {
  try {
    return Object.keys(localStorage).some(key =>
      key.startsWith("Digit.Locale.") && key.includes(`digit-boundary-${moduleName}`)
    );
  } catch (e) {
    return false;
  }
};

export const ServiceDesignerModule = ({ stateCode, userType, tenants }) => {
  const language = Digit.StoreData.getCurrentLanguage();

  let moduleCode = ["sample", "common", "workflow", "servicedesigner"];

  const { isLoading: storeLoading, data: store } = Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });

  // Only include boundary modules that are not already cached
  const allBoundaryModules = ["admin", "NEWTEST00222"];
  const boundarymoduleCode = allBoundaryModules.filter(mod => !isBoundaryLocaleCached(mod));

  const { isLoading: boundarystoreLoading, data: boundarystore } =
    Digit.Services.useStore({
      stateCode,
      moduleCode: boundarymoduleCode,
      language,
      modulePrefix: "digit-boundary",
    });

  // Only wait for boundary loading if there are modules to load
  if (storeLoading || (boundarymoduleCode.length > 0 && boundarystoreLoading)) {
    return <Loader page={true} variant={"PageLoader"} />;
  }
  
  // No need to pass path - EmployeeApp should use relative routes
  return <EmployeeApp stateCode={stateCode} userType={userType} tenants={tenants} />;
};

const componentsToRegister = {
  ServiceDesignerModule,
  ServiceDesignerCard,
  CreateQuestion,
  CreateQuestionContext
};

export const initServiceDesignerComponents = () => {
  //updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};