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

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import CreateComplaintForm from "./createComplaintForm";
import { CreateComplaintConfig } from "../../../configs/CreateComplaintConfig";

const CreateComplaint = () => {
  const { t } = useTranslation();

  const tenant = Digit.ULBService.getStateId();

  // Manage form session state using sessionStorage under key "COMPLAINT_CREATE"
  const CreateComplaintSession = Digit.Hooks.useSessionStorage("COMPLAINT_CREATE", {});
  const [sessionFormData, setSessionFormData, clearSessionFormData] = CreateComplaintSession;

  // Fetch MDMS config for Create Complaint screen (RAINMAKER-PGR.CreateComplaintConfig)
  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(
    Digit.ULBService.getStateId(),
    "RAINMAKER-PGR",
    ["CreateComplaintConfig"],
    {
      select: (data) => data?.["RAINMAKER-PGR"]?.CreateComplaintConfig,
      retry: false,
      enable: false, // Disabled fetch by default – relies on fallback config
    }
  );

  // Use MDMS config if available, otherwise fallback to local static config
  const configs = mdmsData || CreateComplaintConfig;

  // Show loader while fetching MDMS config
  if (isLoading || !configs) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <CreateComplaintForm
        t={t}
        createComplaintConfig={configs}
        sessionFormData={sessionFormData}
        setSessionFormData={setSessionFormData}
        clearSessionFormData={clearSessionFormData}
        tenantId={tenant}
        preProcessData={{}} // Reserved for any future data transformation
      />
    </React.Fragment>
  );
};

export default CreateComplaint;
