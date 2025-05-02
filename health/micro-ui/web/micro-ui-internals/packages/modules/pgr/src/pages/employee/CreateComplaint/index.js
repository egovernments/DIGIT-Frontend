import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
// import createWorkOrderConfigMUKTA from "../../../configs/createWorkOrderConfigMUKTA.json";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import CreateComplaintForm from "./createComplaintForm";
import { CreateComplaintConfig } from "../../../configs/CreateComplaintConfig";

const CreateComplaint = () => {
    const {t} = useTranslation();
    const tenant = Digit.ULBService.getStateId();
    const CreateComplaintSession = Digit.Hooks.useSessionStorage("COMPLAINT_CREATE", {});
    const [sessionFormData, setSessionFormData, clearSessionFormData] = CreateComplaintSession;

    
  // Fetch MDMS config for inbox screen (RAINMAKER-PGR.SearchInboxConfig)
  const { data: mdmsData, isLoading } = Digit.Hooks.useCommonMDMS(
    Digit.ULBService.getStateId(),
    "RAINMAKER-PGR",
    ["CreateComplaintConfig"],
    {
      select: (data) => {
        return data?.["RAINMAKER-PGR"]?.CreateComplaintConfig;
      },
      retry: false,
      enable: false, // Disabled fetch by default, fallback to static config
    }
  );

  const configs = mdmsData || CreateComplaintConfig;

    if (isLoading || !configs ) {
      return <Loader />;
    }


    return (
        <React.Fragment>
            {
                <CreateComplaintForm t={t} createComplaintConfig={configs} sessionFormData={sessionFormData} setSessionFormData={setSessionFormData} clearSessionFormData={clearSessionFormData} tenantId={tenant}  preProcessData={{}}></CreateComplaintForm>
            }
        </React.Fragment>
    )
}

export default CreateComplaint;