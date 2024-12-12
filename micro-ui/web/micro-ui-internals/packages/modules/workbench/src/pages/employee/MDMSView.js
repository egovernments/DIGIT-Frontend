import React, { useState } from 'react'
import MDMSAdd from './MDMSAddV2'
import { Loader, Toast } from '@egovernments/digit-ui-react-components';
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from '@egovernments/digit-ui-components';
import _ from "lodash";

const MDMSView = ({ ...props }) => {
  const history = useHistory()
  const { t } = useTranslation()
  const [showToast, setShowToast] = useState(false);
  let { moduleName, masterName, tenantId, uniqueIdentifier } = Digit.Hooks.useQueryParams();
  let { from, screen, action } = Digit.Hooks.useQueryParams()
  tenantId = Digit.ULBService.getCurrentTenantId();

  const { data: MdmsRes } = Digit.Hooks.useCustomMDMS(
    tenantId,
    "Workbench",
    [{ name: "UISchema" }],
    {
      select: (data) => data?.["Workbench"]?.["UISchema"],
    }
  );

  const additionalParams = { from: from, screen: screen, action: action }
  Object.keys(additionalParams).forEach(key => {
    if (additionalParams[key] === undefined || additionalParams[key] === null) {
      delete additionalParams[key];
    }
  });


  const fetchActionItems = (data) => {
    let actionItems = [{
      action: "EDIT",
      label: "Edit Master"
    }]

    const isActive = data?.isActive
    if (isActive) {
      actionItems.push({ action: "DISABLE", label: "Disable Master" })
    } else {
      actionItems.push({ action: "ENABLE", label: "Enable Master" })
    }

    return actionItems
  }

  const reqCriteria = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: tenantId,
        uniqueIdentifiers: [uniqueIdentifier],
        schemaCode: `${moduleName}.${masterName}`
      },
    },
    config: {
      enabled: moduleName && masterName && true,
      select: (data) => data?.mdms?.[0]
    },
  };

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null)
    }, 5000);
  }

  const { isLoading, data, isFetching, refetch } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  const reqCriteriaUpdate = {
    url: Digit.Utils.workbench.getMDMSActionURL(moduleName, masterName, "update"),
    params: {},
    body: {},
    config: {
      enabled: true,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);

  const handleEnableDisable = async (action) => {
    const onSuccess = (resp) => {
      setShowToast({
        label: `${t(`WBH_SUCCESS_${resp?.mdms?.[0]?.isActive ? "ENA" : "DIS"}_MDMS_MSG`)} ${resp?.mdms?.[0]?.id}`
      });
      closeToast()
      refetch()
    };
    const onError = (resp) => {
      setShowToast({
        label: `${t("WBH_ERROR_MDMS_DATA")} ${t(resp?.response?.data?.Errors?.[0]?.code)}`,
        isError: true
      });
      closeToast()
      refetch()
    };

    mutation.mutate(
      {
        url: reqCriteriaUpdate?.url,
        params: {},
        body: {
          Mdms: {
            ...data,
            isActive: action === "ENABLE"
          },
        },
      },
      {
        onError,
        onSuccess,
      }
    );
  }

  const onActionSelect = (action) => {
    const { action: actionSelected } = action
    if (actionSelected === "EDIT") {
      const additionalParamString = new URLSearchParams(additionalParams).toString();
      history.push(`/${window?.contextPath}/employee/workbench/mdms-edit?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}${additionalParamString ? "&" + additionalParamString : ""}`)
    } else {
      handleEnableDisable(actionSelected)
    }
  }

  let localisableFields = [];
  if (MdmsRes && Array.isArray(MdmsRes)) {
    const schemaDef = MdmsRes.find(item => item.schemaCode === `${moduleName}.${masterName}`);
    localisableFields = schemaDef?.localisation?.localisableFields || [];
  }

  // Ensure that the module matches what was used when upserting localization messages.
  // If your messages have module "DIGIT_MDMS_RAINMAKER-PGR.SERVICEDEFS", replicate that exactly:
  const rawSchemaCode = data?.schemaCode;
  // Convert schema code to match exactly how module was stored in messages.
  // Example: If messages stored module as: DIGIT_MDMS_RAINMAKER-PGR.SERVICEDEFS
  // Convert rawSchemaCode: "RAINMAKER-PGR.ServiceDefs" -> "RAINMAKER-PGR.SERVICEDEFS"
  const properSchema = rawSchemaCode?.replace("ServiceDefs", "SERVICEDEFS");
  const localizationModule = `DIGIT_MDMS_${properSchema}`;

  const createLocalizationCode = (fieldName, fieldValue) => {
    const upperFieldName = fieldName.toUpperCase();
    const transformedValue = (fieldValue || "").replace(/\s+/g, "").toUpperCase();
    return `RAINMAKER-PGR.SERVICEDEFS_${upperFieldName}_${transformedValue}`;
  };

  let localizationCodes = [];
  if (data && data.data && localisableFields.length > 0) {
    localizationCodes = localisableFields.map(field => createLocalizationCode(field.fieldPath, data.data[field.fieldPath]));
    console.log("localizable fields constructed"+localizationCodes);
  }

  const locale = "en_IN";

  const localizationReqCriteria = {
    url: `/localization/messages/v1/_search?locale=${locale}&tenantId=${tenantId}&module=${localizationModule}`,
    params: {},
    body: {
      RequestInfo: {
        apiId: null,
        ver: null,
        ts: null,
        action: "POST",
        did: null,
        key: null,
        msgId: Date.now().toString(),
        authToken: Digit.UserService.getUser()?.access_token || "",
      }
    },
    config: {
      enabled: !!data && !!MdmsRes && !!data?.schemaCode && !!tenantId && localizationCodes.length > 0,
      select: (respData) => {
        let messageMap = {};
        if (Array.isArray(respData?.messages)) {
          respData.messages.forEach(msg => {
            messageMap[msg.code] = msg.message;
          });
        }
        return messageMap;
      },
    },
  };

  const { data: localizationMap, isLoading: isLocalizationLoading } = Digit.Hooks.useCustomAPIHook(localizationReqCriteria);

  // Transform data if localizationMap is available
  let finalData = data;
  if (data && data.data && localizationMap && localisableFields.length > 0) {
    let updatedData = _.cloneDeep(data);
    localisableFields.forEach(field => {
      const code = createLocalizationCode(field.fieldPath, updatedData.data[field.fieldPath]);
      if (localizationMap[code]) {
        updatedData.data[field.fieldPath] = localizationMap[code];
      }
    });
    finalData = updatedData;
  }

  if (isLoading || isFetching || isLocalizationLoading) return <Loader />

  return (
    <React.Fragment>
      <MDMSAdd
        defaultFormData={finalData?.data}
        updatesToUISchema={{ "ui:readonly": true }}
        screenType={"view"}
        onViewActionsSelect={onActionSelect}
        viewActions={fetchActionItems(finalData)}
      />
      <Button
        className={"mdms-view-audit"}
        label="view audit"
        variation="secondary"
        icon={"History"}
        onClick={() => {
          history.push(`../utilities/audit-log?id=${finalData?.id}&tenantId=${tenantId}`)
        }}
      ></Button>
      {showToast && <Toast label={t(showToast.label)} error={showToast?.isError} onClose={() => setShowToast(null)}></Toast>}
    </React.Fragment>
  )
}

export default MDMSView
