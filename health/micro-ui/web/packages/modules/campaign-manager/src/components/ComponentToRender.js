import { FieldV1 } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// Simple helper function to get field type
const getFieldType = (field, fieldTypeMasterData) => {
  if (!fieldTypeMasterData || !Array.isArray(fieldTypeMasterData)) {
    return "textInput";
  }

  // Find matching field type based on type and format
  const matched = fieldTypeMasterData.find((item) => item?.metadata?.type === field.type && item?.metadata?.format === field.format);

  return matched?.fieldType || "textInput";
};

const ComponentToRender = ({ field, t: customT, selectedField }) => {
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  const { t } = useTranslation();
  console.log("responsePanelComponent", field, byName);
  // Get field type mapping from the field master data
  const fieldTypeMasterData = byName?.FieldTypeMappingConfig || [];

  // Get the field type
  const fieldType = getFieldType(field, fieldTypeMasterData);

  console.log("fieldType", fieldType);

  return (
    <FieldV1
      charCount={field?.charCount}
      config={{
        step: "",
      }}
      description={field?.isMdms ? t(field?.helpText) : field?.helpText || null}
      error={field?.isMdms ? t(field?.errorMessage) : field?.errorMessage || null}
      infoMessage={field?.isMdms ? t(field?.tooltip) : field?.tooltip || null}
      label={field?.label}
      onChange={function noRefCheck() {}}
      placeholder={t(field?.innerLabel) || ""}
      populators={{
        t: field?.isMdms ? null : customT,
        fieldPairClassName: `app-preview-field-pair ${
          selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
            ? `app-preview-selected`
            : selectedField?.id && selectedField?.id === field?.id
            ? `app-preview-selected`
            : ``
        }`,
      }}
      required={getFieldType(field) === "custom" ? null : field?.["toArray.required"]}
      type={fieldType}
      value={field?.value === true ? "" : field?.value || ""}
      disabled={field?.readOnly || false}
    />
  );
};

export default ComponentToRender;
