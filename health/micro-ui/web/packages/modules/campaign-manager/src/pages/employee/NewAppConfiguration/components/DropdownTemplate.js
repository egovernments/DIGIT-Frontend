import React from "react";
import { FieldV1, Loader } from "@egovernments/digit-ui-components";

const DropdownTemplate = ({ field, t, fieldTypeMasterData, isFieldSelected, props }) => {
    const selectedField = field || props?.field;
    const fieldType = fieldTypeMasterData || props?.fieldTypeMasterData;
    const selected = isFieldSelected || props?.isFieldSelected;

    // Check if MDMS is enabled
    const isMdmsEnabled = !!selectedField?.isMdms && !!selectedField?.schemaCode;

    // Fetch MDMS data if schemaCode exists
    const { isLoading, data } = Digit?.Hooks.useCustomMDMS(
      Digit?.ULBService?.getStateId(),
      selectedField?.schemaCode?.split(".")[0],
      [{ name: selectedField?.schemaCode?.split(".")[1] }],
      {
        select: (data) => {
          const optionsData = _.get(data, `${selectedField?.schemaCode?.split(".")[0]}.${selectedField?.schemaCode?.split(".")[1]}`, []);
          return optionsData
            .filter((opt) => (opt?.hasOwnProperty("active") ? opt.active : true))
            .map((opt) => ({
              ...opt,
              name: `${Digit.Utils.locale.getTransformedLocale(opt.code)}`,
            }));
        },
        enabled: isMdmsEnabled,
      },
      isMdmsEnabled // mdmsv2
    );

    // Check if field is null but props?.field is not null
    const shouldHideLabels = !field && props?.field;

    // Allow empty labels - only use defaults if undefined/null
    const dropdownLabel = shouldHideLabels
      ? ""
      : (selectedField?.label !== undefined && selectedField?.label !== null ? (field ? t : props?.t)(selectedField?.label) : "");

    if (isLoading) return <Loader />;

    // Determine options based on MDMS or enums
    const options = isMdmsEnabled && data
      ? data
      : (Array.isArray(selectedField?.enums) ? selectedField.enums.filter((o) => o.isActive !== false) : null)
        || selectedField?.dropDownOptions
        || [];

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
