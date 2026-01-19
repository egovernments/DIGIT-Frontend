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
  const tenantId = Digit.ULBService.getCurrentTenantId();

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

  // Parse schemaCode to get moduleName and masterName
  const { moduleName, masterName, isValidSchema } = useMemo(() => {
    if (!field?.isMdms || !field?.schemaCode || typeof field.schemaCode !== 'string') {
      return { moduleName: null, masterName: null, isValidSchema: false };
    }

    const schemaParts = field.schemaCode.split(".");
    if (schemaParts.length < 2) {
      return { moduleName: null, masterName: null, isValidSchema: false };
    }

    return {
      moduleName: schemaParts[0]?.trim(),
      masterName: schemaParts[1]?.trim(),
      isValidSchema: true,
    };
  }, [field?.isMdms, field?.schemaCode]);

  // Fetch MDMS data if field has valid MDMS configuration
  const { data: mdmsData } = Digit.Hooks.useCustomMDMS(
    tenantId,
    moduleName,
    [{ name: masterName }],
    {
      enabled: isValidSchema && !!moduleName && !!masterName,
      select: (data) => {
        // Extract the data from the MDMS response
        if (data && moduleName && masterName) {
          return data?.[moduleName]?.[masterName] || [];
        }
        return [];
      },
    },
    {
      schemaCode: isValidSchema ? `${moduleName}.${masterName}` : undefined,
    }
  );

  // Memoize options - use MDMS data if available, otherwise use dropDownOptions
  const options = useMemo(() => {
    if (field?.isMdms && isValidSchema && mdmsData) {
      return mdmsData;
    }
    return field?.dropDownOptions || [];
  }, [field?.isMdms, field?.dropDownOptions, isValidSchema, mdmsData]);

  // Memoize optionsKey - use "code" for MDMS data, "name" for regular dropdowns
  const optionsKey = useMemo(() => {
    return field?.isMdms && isValidSchema ? "code" : "name";
  }, [field?.isMdms, isValidSchema]);

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
          options: options,
          optionsKey: optionsKey,
          showToolTip: true,
        }}
        withoutLabel={field?.format === "checkbox" ? true : false}
        required={getFieldTypeFromMasterData2(field) === "custom" ? null : field?.required}
        type={fieldType}
        value={field?.value === true ? "" : field?.value || ""}
        disabled={field?.readOnly || false}
        showToolTip={true}
      />
    </div>
  );
};

export default ComponentToRender;
