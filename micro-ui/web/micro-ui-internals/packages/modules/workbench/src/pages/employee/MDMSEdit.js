import React, { useState } from "react";
import MDMSAdd from "./MDMSAddV2";
import { Toast } from "@egovernments/digit-ui-components";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { buildLocalizationMessages } from "./localizationUtility";
import _ from "lodash";
import { Loader } from "@egovernments/digit-ui-components";


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
          updatesToUiSchema[field] = { "ui:readonly": true };
        });
        return { schema: data?.SchemaDefinitions?.[0], updatesToUiSchema };
      },
    },
  };

  const { isLoading: isSchemaLoading, data: schemaData } = Digit.Hooks.useCustomAPIHook(reqCriteriaSchema);

  const tranformLocModuleName = (localModuleName) => {
    if (!localModuleName) return null;
      return localModuleName.replace(/[^a-zA-Z0-9]/g, "-").toUpperCase();
  };

  // Localization Search
  const localizationModule = tranformLocModuleName(`DIGIT_MDMS_${data?.schemaCode}`).toLowerCase();
  let locale=Digit.StoreData.getCurrentLanguage();

  const localizationReqCriteria = {
    url: `/localization/messages/v1/_search?locale=${locale}&tenantId=${stateId}&module=${localizationModule}`,
    params: {},
    body: {},
    config: {
      enabled: !!data,
      select: (respData) => {
        const messageMap = {};
        if (Array.isArray(respData?.messages)) {
          respData.messages.forEach((msg) => {
            messageMap[msg.code] = msg.message;
          });
        }
        return messageMap;
      },
    },
  };

  const { data: localizationMap, isLoading: isLocalizationLoading } = Digit.Hooks.useCustomAPIHook(localizationReqCriteria);

  // Replace values with localized messages
  let finalData = data;
  if (data?.data && localizationMap) {
    const updatedData = _.cloneDeep(data);
    Object.keys(updatedData.data).forEach((field) => {
      const localizationKey = tranformLocModuleName(`${data.schemaCode}_${field}_${updatedData.data[field]}`);
      if (localizationMap[localizationKey]) {
        updatedData.data[field] = localizationMap[localizationKey];
      }
    });
    finalData = updatedData;
  }

  const localizationUpsertMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/localization/messages/v1/_upsert`,
    params: {},
    body: {},
    config: { enabled: false },
  });

  const reqCriteriaUpdate = {
    url: Digit.Utils.workbench.getMDMSActionURL(moduleName, masterName, "update"),
    params: {},
    body: {},
    config: { enabled: true },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);
  const handleUpdate = async (formData, additionalProperties) => {
    const schemaCodeToValidate = `${moduleName}.${masterName}`;
    let transformedData = await Digit?.Customizations?.["commonUiConfig"]?.["AddMdmsConfig"]?.[schemaCodeToValidate]?.getTransformedData(formData, data) ;
    transformedData = transformedData && transformedData !== undefined && transformedData !== "undefined" ? transformedData : formData;
    const validation = await Digit?.Customizations?.["commonUiConfig"]?.["AddMdmsConfig"]?.[schemaCodeToValidate]?.validateForm(transformedData, { tenantId: stateId });

    if (validation && !validation?.isValid) {
      setShowToast({
        label: t(validation?.message),
        type: "error"
      });
      return;
    }

    const transformedFormData = { ...transformedData };
    const locale = Digit.StoreData.getCurrentLanguage();
  
    // Prepare Localization Messages using the utility function
    const messages = buildLocalizationMessages(additionalProperties, localizationModule, locale);
  
    try {
      if (messages.length > 0) {
        await localizationUpsertMutation.mutateAsync({
          body: { tenantId: stateId, messages },
        });
      }
    } catch (err) {
      console.error("Localization Upsert Failed:", err);
      setShowToast({ label: t("WBH_ERROR_LOCALIZATION"), type:"error" });
      closeToast();
      return;
    }
  
    // Perform MDMS Update
    mutation.mutate(
      {
        url: reqCriteriaUpdate?.url,
        params: {},
        body: { Mdms: { ...data, data: transformedFormData } },
      },
      {
        onError: (resp) => {
          setShowToast({ label: t("WBH_ERROR_MDMS_DATA"), type:"error" });
          closeToast();
        },
        onSuccess: () => {
          setShowToast({ label: t("WBH_SUCCESS_UPD_MDMS_MSG") });
          setTimeout(() => {
             gotoView();
          }, 1000);
        },
      }
    );
  };

  if (isLoading || isFetching || isSchemaLoading || isLocalizationLoading || renderLoader) return  <Loader page={true} variant={"PageLoader"} />;
  

  return (
    <React.Fragment>
      <MDMSAdd
        defaultFormData={finalData?.data}
        screenType={"edit"}
        onSubmitEditAction={handleUpdate}
        updatesToUISchema={schemaData?.updatesToUiSchema}
      />
      {showToast && <Toast label={t(showToast?.label)} type={showToast?.type} onClose={() => setShowToast(null)} />}
    </React.Fragment>
  );
};

export default MDMSEdit;
