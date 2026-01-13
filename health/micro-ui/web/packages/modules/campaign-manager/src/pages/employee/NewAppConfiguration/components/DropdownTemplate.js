import React, { useMemo } from "react";
import { FieldV1, Loader } from "@egovernments/digit-ui-components";
import { useCustomT, useCustomTranslate } from "../hooks/useCustomT";

const DropdownTemplate = ({ field, t, fieldTypeMasterData, isFieldSelected, props }) => {
    const selectedField = field || props?.field;
    const fieldType = fieldTypeMasterData || props?.fieldTypeMasterData;
    const selected = isFieldSelected || props?.isFieldSelected;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const customT = useCustomTranslate();

    // Parse schemaCode to get moduleName and masterName
    const { moduleName, masterName, isValidSchema } = useMemo(() => {
      if (!selectedField?.isMdms || !selectedField?.schemaCode || typeof selectedField.schemaCode !== 'string') {
        return { moduleName: null, masterName: null, isValidSchema: false };
      }

      const schemaParts = selectedField.schemaCode.split(".");
      if (schemaParts.length < 2) {
        return { moduleName: null, masterName: null, isValidSchema: false };
      }

      return {
        moduleName: schemaParts[0]?.trim(),
        masterName: schemaParts[1]?.trim(),
        isValidSchema: true,
      };
    }, [selectedField?.isMdms, selectedField?.schemaCode]);

    // Fetch MDMS data if field has valid MDMS configuration
    const { isLoading, data: mdmsData } = Digit?.Hooks.useCustomMDMS(
      tenantId,
      moduleName,
      [{ name: masterName }],
      {
        enabled: isValidSchema && !!moduleName && !!masterName,
        select: (data) => {
          // Extract the data from the MDMS response
          if (data && moduleName && masterName) {
            const optionsData = data?.[moduleName]?.[masterName] || [];
            return optionsData
              .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
              .map((opt) => ({
                ...opt,
                name: `${Digit.Utils.locale.getTransformedLocale(opt.code)}`,
              }));
          }
          return [];
        },
      },
      {
        schemaCode: isValidSchema ? `${moduleName}.${masterName}` : undefined,
      }
    );

    // Check if field is null but props?.field is not null
    const shouldHideLabels = !field && props?.field;

    // Allow empty labels - only use defaults if undefined/null
    const dropdownLabel = shouldHideLabels
      ? ""
      : (selectedField?.label !== undefined && selectedField?.label !== null ? (field ? t : props?.t)(selectedField?.label) : "");

    if (isLoading) return <Loader />;

    // Helper function to generate fallback options based on label
    const generateFallbackOptions = (label) => {
      if (!label) return [];
      const baseLabel = label;
      return [
        { code: `${baseLabel}_OPTION_1`, name: `${customT(baseLabel)} 1` },
        { code: `${baseLabel}_OPTION_2`, name: `${customT(baseLabel)} 2` },
        { code: `${baseLabel}_OPTION_3`, name: `${customT(baseLabel)} 3` },
      ];
    };

    // Check if we have valid static data
    const hasValidMdmsData = isValidSchema && mdmsData && mdmsData.length > 0;
    const hasValidEnums = Array.isArray(selectedField?.enums) && selectedField.enums.length > 0;
    const hasValidDropdownOptions = Array.isArray(selectedField?.dropDownOptions) && selectedField.dropDownOptions.length > 0;

    // Determine options based on MDMS or enums
    let options = [];

    if (hasValidMdmsData) {
      options = mdmsData;
    } else if (hasValidEnums) {
      options = selectedField.enums.filter((o) => o.isActive !== false);
    } else if (hasValidDropdownOptions) {
      options = selectedField.dropDownOptions.filter((o) => o.isActive !== false);
    } else {
      // No valid static data - generate fallback options from label
      options = generateFallbackOptions(selectedField?.label || selectedField?.fieldName);
    }

    return (
        <FieldV1
        description={shouldHideLabels ? "" : (field ? t : props?.t)(selectedField?.helpText)}
                error={(field ? t : props?.t)(selectedField?.errorMessage)}
                infoMessage={(field ? t : props?.t)(selectedField?.tooltip)}
                label={dropdownLabel}
                onChange={function noRefCheck() {}}
                populators={{
                  title: shouldHideLabels ? "" : dropdownLabel,
                  prefix: selectedField?.prefixText || null,
                  suffix: selectedField?.suffixText || null,
                  fieldPairClassName: `app-preview-field-pair dropdown-template ${selected ? `app-preview-selected` : ``}`,
                  options: options,
                  optionsKey: "name",
                }}
                withoutLabel={shouldHideLabels ? true : false}
                required={selectedField?.required}
                type={"dropdown"}
                value={selectedField?.value}
                disabled={selectedField?.readOnly || false}
        ></FieldV1>
    );
};

export default DropdownTemplate;
