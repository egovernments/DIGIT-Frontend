import React, { useState } from 'react'
import MDMSAdd from './MDMSAddV2'
import { Toast } from "@egovernments/digit-ui-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from '@egovernments/digit-ui-components';
import _ from "lodash";
import { Loader } from "@egovernments/digit-ui-components";

const MDMSView = ({ ...props }) => {
  const history = useHistory()
  const { t } = useTranslation()
  const [showToast, setShowToast] = useState(false);
  const { moduleName, masterName, uniqueIdentifier } = Digit.Hooks.useQueryParams();
  const { from, screen, action } = Digit.Hooks.useQueryParams()
  const tenantId = Digit.ULBService.getCurrentTenantId();

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

  let propsToSendButtons = {
    moduleName,
    masterName,
  };

  const fetchActionItems = (data) => Digit?.Customizations?.["commonUiConfig"]?.["ViewMdmsConfig"]?.fetchActionItems(data, propsToSendButtons);

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
        type: "error"
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

  let propsToSend = {
    moduleName,
    masterName,
    tenantId,
    uniqueIdentifier,
    data,
    history,
    handleEnableDisable,
    additionalParams
  };

  const onActionSelect = (action) => Digit?.Customizations?.["commonUiConfig"]?.["ViewMdmsConfig"]?.onActionSelect(action, propsToSend);

  let localisableFields = [];
  if (MdmsRes && Array.isArray(MdmsRes)) {
    const schemaDef = MdmsRes.find(item => item.schemaCode === `${moduleName}.${masterName}`);
    localisableFields = schemaDef?.localisation?.localisableFields || [];
  }

  const rawSchemaCode = data?.schemaCode;

  const tranformLocModuleName = (localModuleName) => {
    if (!localModuleName) return null;
    return localModuleName.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
  };

  const localizationModule = tranformLocModuleName(`DIGIT-MDMS-${rawSchemaCode}`).toLowerCase();

  const createLocalizationCode = (fieldName, fieldValue) => {
    const upperFieldName = fieldName.toUpperCase();
    const transformedValue = (fieldValue || "").replace(/\s+/g, "").toUpperCase();
    return tranformLocModuleName(`${rawSchemaCode}_${upperFieldName}_${transformedValue}`);
  };

  let localizationCodes = [];
  if (data?.data && localisableFields?.length > 0) {
    localizationCodes = localisableFields.map(field => createLocalizationCode(field.fieldPath, data.data[field.fieldPath]));
  }

  const locale = Digit.StoreData.getCurrentLanguage();
  const localizationReqCriteria = {
    url: `/localization/messages/v1/_search?locale=${locale}&tenantId=${tenantId}&module=${localizationModule}`,
    params: {},
    body: {},
    config: {
      enabled: !!data && !!MdmsRes && !!data?.schemaCode && !!tenantId && localizationCodes.length > 0,
      select: (respData) => {
        const messageMap = {};
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

  let finalData = data;
  if (data && data.data && localizationMap && localisableFields?.length > 0) {
    const updatedData = _.cloneDeep(data);
    localisableFields.forEach(field => {
      const code = createLocalizationCode(field.fieldPath, updatedData.data[field.fieldPath]);
      if (localizationMap[code]) {
        updatedData.data[field.fieldPath] = localizationMap[code];
      }
    });
    finalData = updatedData;
  }

  if (isLoading || isFetching || isLocalizationLoading) return <Loader page={true} variant={"PageLoader"} />;

  // ✅ Function to render toast cleanly
  const renderToast = () => {
    if (!showToast) return null;
    return (
      <Toast
        label={showToast?.label}
        type={showToast?.type}
        isDleteBtn={true}
        onClose={() => setShowToast(null)}
        style={{
          position: "fixed",
          bottom: "5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999999,
          width: "max-content",
          maxWidth: "90%",
        }}
      />
    );
  };

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
          history.push(`../utilities/audit-log?id=${finalData?.id}&tenantId=${tenantId}`);
        }}
      />
      {renderToast()}
    </React.Fragment>
  )
};

export default MDMSView;
