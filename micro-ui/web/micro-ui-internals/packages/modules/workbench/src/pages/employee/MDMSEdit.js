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

  // Fetch Schema Definitions
  const reqCriteriaSchema = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/schema/v1/_search`,
    params: {},
    body: {
      SchemaDefCriteria: {
        tenantId: stateId,
        codes: [`${moduleName}.${masterName}`],
      },
    },
    config: {
      enabled: !!moduleName && !!masterName,
      select: (data) => {
        const uniqueFields = data?.SchemaDefinitions?.[0]?.definition?.["x-unique"] || [];
        const updatesToUiSchema = {};
        uniqueFields.forEach((field) => {
          updatesToUiSchema[field] = { "ui:readonly": true }; // Disable fields dynamically
        });
        // Explicitly disable Complaint Sub-Type Code
        updatesToUiSchema["complaintSubTypeCode"] = { "ui:readonly": true };
        return { schema: data?.SchemaDefinitions?.[0], updatesToUiSchema };
      },
    },
  };

  const { isLoading: isSchemaLoading, data: schemaData } = Digit.Hooks.useCustomAPIHook(reqCriteriaSchema);

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

  const reqCriteriaUpdate = {
    url: Digit.Utils.workbench.getMDMSActionURL(moduleName, masterName, "update"),
    params: {},
    body: {},
    config: { enabled: true },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);

  const handleUpdate = async (formData) => {
    mutation.mutate(
      {
        url: reqCriteriaUpdate.url,
        params: {},
        body: { Mdms: { ...data, data: formData } },
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

  if (isLoading || isFetching || isSchemaLoading || isLocalizationLoading || renderLoader) return <Loader />;

  return (
    <React.Fragment>
      <MDMSAdd
        defaultFormData={finalData?.data}
        screenType={"edit"}
        onSubmitEditAction={handleUpdate}
        updatesToUISchema={schemaData?.updatesToUiSchema} // Pass updatesToUiSchema
      />
      {showToast && <Toast label={t(showToast.label)} error={showToast?.isError} onClose={() => setShowToast(null)} />}
    </React.Fragment>
  );
};

export default MDMSEdit;
