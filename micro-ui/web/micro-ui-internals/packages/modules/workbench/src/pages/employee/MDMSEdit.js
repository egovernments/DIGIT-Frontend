import React, { useState } from "react";
import MDMSAdd from "./MDMSAddV2";
import { Loader, Toast } from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const MDMSEdit = ({ ...props }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { moduleName, masterName, from, uniqueIdentifier } = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const [showToast, setShowToast] = useState(false);

  const closeToast = () => {
    setTimeout(() => {
      setShowToast(null);
    }, 5000);
  };

  const gotoView = () => {
    history.push(
      `/${window?.contextPath}/employee/workbench/mdms-view?moduleName=${moduleName}&masterName=${masterName}&uniqueIdentifier=${uniqueIdentifier}${
        from ? `&from=${from}` : ""
      }`
    );
  };

  // Fetch MDMS data
  const reqCriteria = {
    url: `/${Digit.Hooks.workbench.getMDMSContextPath()}/v2/_search`,
    params: {},
    body: {
      MdmsCriteria: {
        tenantId,
        uniqueIdentifiers: [uniqueIdentifier],
        schemaCode: `${moduleName}.${masterName}`,
      },
    },
    config: {
      enabled: moduleName && masterName && true,
      select: (data) => data?.mdms?.[0],
    },
  };
  const { isLoading, data, isFetching } = Digit.Hooks.useCustomAPIHook(reqCriteria);

  // Fetch UISchema data
  const { data: MdmsRes } = Digit.Hooks.useCustomMDMS(tenantId, "Workbench", [{ name: "UISchema" }], {
    select: (data) => data?.["Workbench"]?.["UISchema"],
  });

  // Prepare Localization Data
  const rawSchemaCode = data?.schemaCode || "";
  const firstPartModule = `DIGIT_MDMS_${rawSchemaCode}`.toUpperCase();
  const secondPartModule = rawSchemaCode.split(".")[0].toLowerCase();
  const schemaPart = rawSchemaCode.split(".")[1]?.toUpperCase() || "";

  const createLocalizationCode = (prefix, fieldName, fieldValue) => {
    const upperFieldName = fieldName.toUpperCase();
    const transformedValue = (fieldValue || "").replace(/\s+/g, "").toUpperCase();
    return `${prefix}_${upperFieldName}_${transformedValue}`.toUpperCase();
  };

  let localisableFields = [];
  if (MdmsRes && Array.isArray(MdmsRes)) {
    const schemaDef = MdmsRes.find((item) => item.schemaCode === `${moduleName}.${masterName}`);
    localisableFields = schemaDef?.localisation?.localisableFields || [];
  }

  const reqCriteriaUpdate = {
    url: Digit.Utils.workbench.getMDMSActionURL(moduleName, masterName, "update"),
    params: {},
    body: {},
    config: {
      enabled: true,
    },
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCriteriaUpdate);

  const upsertMutation = Digit.Hooks.useCustomAPIMutationHook({
    url: `/localization/messages/v1/_upsert`,
    params: {},
    body: {},
    config: { enabled: false },
  });

  const handleUpdate = async (formData) => {
    const additionalProperties = {};
    localisableFields.forEach((field) => {
      const fieldValue = formData[field.fieldPath];
      if (fieldValue) {
        additionalProperties[field.fieldPath] = {
          mdmsCode: fieldValue.replace(/\s+/g, "").toUpperCase(),
          firstFormatLocalizationCode: createLocalizationCode("RAINMAKER-PGR.SERVICEDEFS", field.fieldPath, fieldValue),
          secondFormatLocalizationCode: `${schemaPart}.${fieldValue.replace(/\s+/g, "").toUpperCase()}`,
          localizationMessage: fieldValue,
        };
      }
    });

    // Construct First Format Messages
    const firstFormatMessages = Object.values(additionalProperties).map(({ firstFormatLocalizationCode, localizationMessage }) => ({
      code: firstFormatLocalizationCode,
      message: localizationMessage,
      module: firstPartModule,
      locale: "en_IN",
    }));

    // Construct Second Format Messages
    const secondFormatMessages = Object.values(additionalProperties).map(({ secondFormatLocalizationCode, localizationMessage }) => ({
      code: secondFormatLocalizationCode,
      message: localizationMessage,
      module: secondPartModule,
      locale: "en_IN",
    }));

    try {
      if (firstFormatMessages.length > 0) {
        await upsertMutation.mutateAsync({
          body: {
            tenantId,
            messages: firstFormatMessages,
          },
        });
        console.log("First localization upsert successful!");
      }

      if (secondFormatMessages.length > 0) {
        await upsertMutation.mutateAsync({
          body: {
            tenantId,
            messages: secondFormatMessages,
          },
        });
        console.log("Second localization upsert successful!");
      }
    } catch (err) {
      console.error("Error during localization upsert:", err);
      setShowToast({
        label: t("WBH_ERROR_LOCALIZATION"),
        isError: true,
      });
      closeToast();
      return;
    }

    // Proceed with MDMS update
    mutation.mutate(
      {
        url: reqCriteriaUpdate?.url,
        params: {},
        body: {
          Mdms: {
            ...data,
            data: formData,
          },
        },
      },
      {
        onError: (resp) => {
          setShowToast({
            label: `${t("WBH_ERROR_MDMS_DATA")} ${t(resp?.response?.data?.Errors?.[0]?.code)}`,
            isError: true,
          });
          closeToast();
        },
        onSuccess: (resp) => {
          setShowToast({
            label: `${t("WBH_SUCCESS_UPD_MDMS_MSG")} ${resp?.mdms?.[0]?.id}`,
          });
          gotoView();
        },
      }
    );
  };

  if (isLoading || isFetching) return <Loader />;

  return (
    <React.Fragment>
      <MDMSAdd
        defaultFormData={data?.data}
        screenType={"edit"}
        onSubmitEditAction={handleUpdate}
        updatesToUISchema={{ "ui:readonly": false }}
      />
      {showToast && <Toast label={t(showToast.label)} error={showToast?.isError} onClose={() => setShowToast(null)} />}
    </React.Fragment>
  );
};

export default MDMSEdit;
