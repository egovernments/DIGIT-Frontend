import { FieldV1 } from "@egovernments/digit-ui-components";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  getAppTypeFromMasterData,
  getFieldTypeFromMasterData,
  getFieldTypeFromMasterData2,
} from "../pages/employee/NewAppConfiguration/helpers/getFieldTypeFromMasterData";
import { getComponentFromMasterData } from "../pages/employee/NewAppConfiguration/helpers/getComponentFromMasterData";

const ComponentToRender = ({ field, t: customT, selectedField, isSelected }) => {
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  const { t } = useTranslation();
  const fieldRef = useRef(null);

  // Get field type mapping from the field master data
  const fieldTypeMasterData = byName?.fieldTypeMappingConfig || [];

  // Get the field type
  const fieldType = getFieldTypeFromMasterData(field, fieldTypeMasterData);

  // Get component from fieldTypeMasterData, fallback to null
  const component = fieldType === "component" ? getComponentFromMasterData(field, fieldTypeMasterData) : null;

  // Check if this field is selected
  const isFieldSelected =
    (selectedField?.jsonPath && selectedField?.jsonPath === field?.jsonPath) ||
    (selectedField?.id && selectedField?.id === field?.id) ||
    isSelected;

  // Auto-scroll to the selected field
  useEffect(() => {
    if (isFieldSelected && fieldRef.current) {
      fieldRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isFieldSelected]);

  return (
    <div ref={fieldRef}>
      <FieldV1
        charCount={field?.charCount}
        component={component}
        config={{
          step: "",
          customProps: {
            field: field,
            t: customT,
            type: field?.type,
            fieldType: getAppTypeFromMasterData(field, fieldTypeMasterData),
          },
        }}
        description={field?.isMdms ? t(field?.helpText) : customT(field?.helpText) || null}
        error={field?.isMdms ? t(field?.errorMessage) : customT(field?.errorMessage) || null}
        infoMessage={field?.isMdms ? t(field?.tooltip) : customT(field?.tooltip) || null}
        label={customT(field?.label)}
        onChange={function noRefCheck() {}}
        placeholder={customT(field?.innerLabel) || ""}
        populators={{
          prefix: field?.prefixText || null,
          suffix: field?.suffixText || null,
          t: !field?.isMdms && (fieldType === "dropdown" || fieldType === "radio" || fieldType === "checkbox") ? customT : null,
          fieldPairClassName: `app-preview-field-pair ${isFieldSelected ? `app-preview-selected` : ``}`,
          mdmsConfig: field?.isMdms
            ? {
                moduleName: field?.schemaCode?.split(".")[0],
                masterName: field?.schemaCode?.split(".")[1],
              }
            : null,
          options: field?.isMdms ? null : field?.dropDownOptions,
          optionsKey: field?.isMdms ? "code" : "name",
        }}
        required={getFieldTypeFromMasterData2(field) === "custom" ? null : field?.required}
        type={fieldType}
        value={field?.value === true ? "" : field?.value || ""}
        disabled={field?.readOnly || false}
      />
    </div>
  );
};

export default ComponentToRender;
