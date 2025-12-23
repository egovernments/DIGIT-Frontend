import { FieldV1 } from "@egovernments/digit-ui-components";
import React, { useEffect, useRef, useMemo } from "react";
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

  const shouldCustomTranslate = !field?.isMdms && (fieldType === "dropdown" || fieldType === "radio" || fieldType === "checkbox");
  
  // Memoize mdmsConfig to ensure stable reference and prevent unnecessary re-renders
  // This is critical to prevent React Hooks violation when field.isMdms or field.schemaCode changes
  const mdmsConfig = useMemo(() => {
    // Check if field has MDMS configuration
    if (!field?.isMdms || !field?.schemaCode) {
      return null;
    }
    
    // Validate schemaCode is a string
    if (typeof field.schemaCode !== 'string') {
      console.warn("Invalid schemaCode type:", typeof field.schemaCode);
      return null;
    }
    
    // Parse schemaCode
    const schemaParts = field?.schemaCode?.split(".");
    
    // Validate we have at least 2 parts and both are non-empty
    if (schemaParts?.length < 2) {
      console.warn("Invalid schemaCode format (missing dot separator):", field.schemaCode);
      return null;
    }
    
    const moduleName = schemaParts[0]?.trim();
    const masterName = schemaParts[1]?.trim();
    
    if (!moduleName || !masterName) {
      console.warn("Invalid schemaCode format (empty parts):", field.schemaCode);
      return null;
    }
    
    return {
      moduleName,
      masterName,
    };
  }, [field?.isMdms, field?.schemaCode]); // Only recalculate when these specific values change
  
  // Memoize mdmsv2 flag separately
  const mdmsv2 = useMemo(() => {
    return mdmsConfig !== null;
  }, [mdmsConfig]);
  
  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => {
    return mdmsConfig ? null : field?.dropDownOptions;
  }, [mdmsConfig, field?.dropDownOptions]);
  
  // Memoize optionsKey
  const optionsKey = useMemo(() => {
    return mdmsConfig ? "code" : "name";
  }, [mdmsConfig]);
  
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
        description={shouldCustomTranslate ? field?.helpText : customT(field?.helpText) || ""}
        error={shouldCustomTranslate ? field?.errorMessage : customT(field?.errorMessage) || null}
        infoMessage={shouldCustomTranslate ? field?.tooltip : customT(field?.tooltip) || null}
        label={
          field?.showLabel === false || fieldType === "checkbox" || field.format === "scanner"
            ? ""
            : shouldCustomTranslate
            ? field?.label
            : customT(field?.label) || ""
        }
        onChange={function noRefCheck() {}}
        placeholder={shouldCustomTranslate ? field?.innerLabel : customT(field?.innerLabel) || ""}
        populators={{
          title: field?.label,
          prefix: field?.prefixText || null,
          suffix: field?.suffixText || null,
          t: shouldCustomTranslate ? customT : null,
          fieldPairClassName: `app-preview-field-pair ${isFieldSelected ? `app-preview-selected` : ``}`,
          labelStyles: field?.format === "checkbox" ? { width: "fit-content" } : null,
          mdmsConfig: mdmsConfig,
          mdmsv2: mdmsv2,
          options: options,
          optionsKey: optionsKey,
        }}
        withoutLabel={field?.format === "checkbox" ? true : false}
        required={getFieldTypeFromMasterData2(field) === "custom" ? null : field?.required}
        type={fieldType}
        value={field?.value === true ? "" : field?.value || ""}
        disabled={field?.readOnly || false}
      />
    </div>
  );
};

export default ComponentToRender;