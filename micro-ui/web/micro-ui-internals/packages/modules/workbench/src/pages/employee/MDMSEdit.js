import React, { useState } from "react";
import MDMSAdd from "./MDMSAddV2";
import { Loader, Toast } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import _ from "lodash";

const MDMSEdit = ({ ...props }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { moduleName, masterName, tenantId, uniqueIdentifier, from } = Digit.Hooks.useQueryParams();
  const stateId = Digit.ULBService.getCurrentTenantId();

  const [showToast, setShowToast] = useState(false);
  const [renderLoader, setRenderLoader] = useState(false);

  const closeToast = () => {
    setTimeout(() => setShowToast(null), 5000);
  };

  const gotoView = () => {
    setRenderLoader(true);
    history.push(
      `/${window?.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}${
        from ? `&from=${from}` : ""
      }`
    );
  };

  // Fetch MDMS Data
  const reqCriteria = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId: stateId,
        uniqueIdentifiers: [uniqueIdentifier],
        schemaCode: `${moduleName}.${masterName}`,
      },
    },
    config: {
      enabled: !!moduleName && !!masterName,
      select: (data) => data?.mdms?.[0],
    },
  };

  const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Fetch UISchema to identify localisable fields
  const { data: MdmsRes } = Digit.Hooks.useCustomMDMS(stateId, "Workbench", [{ name: "UISchema" }], {
    select: (data) => data?.["Workbench"]?.["UISchema"],
  });

  const localisableFields = MdmsRes?.find((item) => item.schemaCode === `${moduleName}.${masterName}`)?.localisation
    ?.localisableFields || [];

  // Localization Search Preparation
  const rawSchemaCode = data?.schemaCode;
  const localizationModule = `DIGIT_MDMS_${rawSchemaCode}`.toUpperCase();
  const locale = "en_IN";
  const createLocalizationCode = (fieldName, fieldValue) => {
    const upperFieldName = fieldName.toUpperCase();
    const transformedValue = (fieldValue || "").replace(/\s+/g, "").toUpperCase();
    return `${rawSchemaCode}_${upperFieldName}_${transformedValue}`.toUpperCase();
  };

  const localizationCodes =
    data?.data && localisableFields.length > 0
      ? localisableFields.map((field) => createLocalizationCode(field.fieldPath, data.data[field.fieldPath]))
      : [];

  const localizationReqCriteria = {
    url: `/localization/messages/v1/_search?locale=${locale}&tenantId=${stateId}&module=${localizationModule}`,
    params: {},
    body: { RequestInfo: { authToken: Digit.UserService.getUser()?.access_token || "" } },
    config: {
      enabled: !!data && localizationCodes.length > 0,
      select: (respData) => {
        let messageMap = {};
        if (Array.isArray(respData?.messages)) {
          respData.messages.forEach((msg) => (messageMap[msg.code] = msg.message));
        }
        return messageMap;
      },
    },
  };

  const { data: localizationMap, isLoading: isLocalizationLoading } = Digit.Hooks.useCustomAPIHook(localizationReqCriteria);

  let finalData = data;
  if (data?.data && localizationMap) {
    const updatedData = _.cloneDeep(data);
    localisableFields.forEach((field) => {
      const code = createLocalizationCode(field.fieldPath, updatedData.data[field.fieldPath]);
      if (localizationMap[code]) {
        updatedData.data[field.fieldPath] = localizationMap[code];
      }
    });
    finalData = updatedData;
  }

  // MDMS Update Mutation
  const reqCriteriaUpdate = {
    url: Digit.Utils.workbench.getMDMSActionURL(moduleName, masterName, "update"),
    params: {},
    body: {},
    config: { enabled: true },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);

  // Localization Upsert Mutation
  const localizationUpsertMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/localization/messages/v1/_upsert`,
    params: {},
    body: {},
    config: { enabled: false },
  });

  const handleUpdate = async (formData, additionalProperties) => {
    const transformedFormData = { ...formData };

    // Prepare Localization Messages
    const messages = [];
    if (additionalProperties && typeof additionalProperties === "object") {
      for (const fieldName in additionalProperties) {
        if (additionalProperties.hasOwnProperty(fieldName)) {
          const fieldProps = additionalProperties[fieldName];
          if (fieldProps?.localizationCode && fieldProps?.localizationMessage) {
            const mdmsCode = (fieldProps.localizationMessage || "").replace(/\s+/g, "").toUpperCase();
            messages.push({
              code: `${rawSchemaCode}_${fieldName}_${mdmsCode}`.toUpperCase(),
              message: fieldProps.localizationMessage,
              module: localizationModule,
              locale: "en_IN",
            });
            transformedFormData[fieldName] = mdmsCode; // Update mdmsCode
          }
        }
      }
    }

    try {
      // Perform Localization Upsert
      if (messages.length > 0) {
        await localizationUpsertMutation.mutateAsync({
          body: { tenantId: stateId, messages },
        });
      }
    } catch (err) {
      console.error("Localization Upsert Failed:", err);
      setShowToast({ label: t("WBH_ERROR_LOCALIZATION"), isError: true });
      closeToast();
      return;
    }

    // Perform MDMS Update
    mutation.mutate(
      {
        url: reqCriteriaUpdate.url,
        params: {},
        body: { Mdms: { ...data, data: transformedFormData } },
      },
      {
        onError: (resp) => {
          setShowToast({ label: t("WBH_ERROR_MDMS_DATA"), isError: true });
          closeToast();
        },
        onSuccess: () => {
          setShowToast({ label: t("WBH_SUCCESS_UPD_MDMS_MSG") });
          gotoView();
        },
      }
    );
  };

  if (isLoading || isFetching || isLocalizationLoading || renderLoader) return <Loader />;

  return (
    <React.Fragment>
      <MDMSAdd
        defaultFormData={finalData?.data}
        screenType={"edit"}
        onSubmitEditAction={handleUpdate}
        updatesToUISchema={{ "ui:readonly": false }}
      />
      {showToast && <Toast label={t(showToast.label)} error={showToast?.isError} onClose={() => setShowToast(null)} />}
    </React.Fragment>
  );
};

export default MDMSEdit;
