/**
 * CreateComplaint - Container component for Create Complaint screen
 *
 * Purpose:
 * Loads configuration (MDMS or static fallback) for the complaint form,
 * manages session storage for preserving form data across navigation,
 * and renders the CreateComplaintForm component.
 *
 * Functionalities:
 * - Fetches dynamic form configuration from MDMS
 * - Falls back to static config if MDMS fetch is disabled or unavailable
 * - Manages form session state using Digit's useSessionStorage
 * - Renders the CreateComplaintForm with appropriate props
 */

import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-components";
import CreateComplaintForm from "./createComplaintForm";
import { CreateComplaintConfig } from "../../../configs/CreateComplaintConfig";
import { useLocation } from "react-router-dom";

const CreateComplaint = () => {
  const { t } = useTranslation();

  // Get current ULB tenant ID
  const tenantId = Digit.ULBService.getCurrentTenantId();
  // Manage form session state using sessionStorage under key "COMPLAINT_CREATE"
  const CreateComplaintSession = Digit.Hooks.useSessionStorage("COMPLAINT_CREATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = CreateComplaintSession;

  // Fetch MDMS config for Create Complaint screen (RAINMAKER-PGR.CreateComplaintConfig)
  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(
    Digit.ULBService.getStateId(),
    "RAINMAKER-PGR",
    ["CreateComplaintConfig"],
    {
      select: (data) => data?.["RAINMAKER-PGR"]?.CreateComplaintConfig?.[0],
      retry: false,
      enable: false, // Disabled fetch by default – relies on fallback config
    }
  );

     // Fetch the list of service definitions (e.g., complaint types) for current tenant
    //  const serviceDefs = Digit.Hooks.pgr.useServiceDefs(tenantId, "PGR");

  // Use MDMS config if available, otherwise fallback to local static config
  const configs = mdmsData || CreateComplaintConfig?.CreateComplaintConfig?.[0];
  
   /**
    * Preprocess config using translation and inject complaint types into the serviceCode dropdown
    */


  // Show loader while fetching MDMS config
  if (isLoading || !configs) {
    return <Loader variant={"PageLoader"} className={"digit-center-loader"} />;;
  }

  return (
    <React.Fragment>
      <CreateComplaintForm
        t={t}
        createComplaintConfig={configs}
        sessionFormData={sessionFormData}
        setSessionFormData={setSessionFormData}
        clearSessionFormData={clearSessionFormData}
        tenantId={tenantId}
        preProcessData={{}} // Reserved for any future data transformation
      />
    </React.Fragment>
  );
};

export default CreateComplaint;
