import React, { Fragment, useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const mdms_context_path = window?.globalConfigs?.getConfig("MDMS_V2_CONTEXT_PATH") || "mdms-v2";

const AppConfigurationFlowManager = () => {
  const searchParams = new URLSearchParams(location.search);
  const masterName = searchParams.get("masterName");
  const campaignNumber = searchParams.get("campaignNumber");
  const MODULE_CONSTANTS = "HCM-ADMIN-CONSOLE";
  const formId = searchParams.get("formId");

  const reqCriteriaTab = {
    url: `/${mdms_context_path}/v2/_search`,
    changeQueryName: `APPCONFIG-${campaignNumber}`,
    body: {
      MdmsCriteria: {
        tenantId: Digit.ULBService.getCurrentTenantId(),
        schemaCode: `${MODULE_CONSTANTS}.${masterName}`,
        filters: {
          project: campaignNumber,
        },
      },
    },
    config: {
      enabled: formId ? true : false,
      cacheTime: 0,
      staleTime: 0,
      select: (data) => {
        console.log("data?.mdms", data);
        return data?.mdms;
      },
    },
  };

  const { isLoading: isFlowLoading, data: flowData, refetch: refetchFlow, revalidate: revalidateFlow } = Digit.Hooks.useCustomAPIHook(reqCriteriaTab);

  console.log("flowData", flowData);
  return <div>AppConfigurationFlowManager</div>;
};

export default AppConfigurationFlowManager;
