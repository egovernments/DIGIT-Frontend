import { FieldV1 } from "@egovernments/digit-ui-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getFieldTypeFromMasterData, getComponentFromMasterData } from "../pages/employee/NewAppConfiguration/helpers";

const ComponentToRender = ({ field, t: customT, selectedField }) => {
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  const { t } = useTranslation();
  // Get field type mapping from the field master data
  const fieldTypeMasterData = byName?.fieldTypeMappingConfig || [];

  // Get the field type
  const fieldType = getFieldTypeFromMasterData(field, fieldTypeMasterData);

  // Get component from fieldTypeMasterData, fallback to null
  const component = fieldType === "component" ? getComponentFromMasterData(field, fieldTypeMasterData) : null;

  console.log("component", fieldType, component);
  return (
    <FieldV1
      charCount={field?.charCount}
      component={component}
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
        prefix: field?.prefixText || null,
        suffix: field?.suffixText || null,
        t: field?.isMdms ? null : customT,
        fieldPairClassName: `app-preview-field-pair ${
          selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath
            ? `app-preview-selected`
            : selectedField?.id && selectedField?.id === field?.id
            ? `app-preview-selected`
            : ``
        }`,
      }}
      required={getFieldTypeFromMasterData(field) === "custom" ? null : field?.required}
      type={fieldType}
      value={field?.value === true ? "" : field?.value || ""}
      disabled={field?.readOnly || false}
    />
  );
};

export default ComponentToRender;
