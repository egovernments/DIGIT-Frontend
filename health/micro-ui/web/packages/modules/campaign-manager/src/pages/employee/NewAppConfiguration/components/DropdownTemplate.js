import React from "react";
import {FieldV1 } from "@egovernments/digit-ui-components";

const DropdownTemplate = ({ field, t, fieldTypeMasterData, isFieldSelected, props }) => {
    const selectedField = field || props?.field;
    const fieldType = fieldTypeMasterData || props?.fieldTypeMasterData;
    const selected = isFieldSelected || props?.isFieldSelected;

    // Check if field is null but props?.field is not null
    const shouldHideLabels = !field && props?.field;

    // Allow empty labels - only use defaults if undefined/null
    const dropdownLabel = shouldHideLabels
      ? ""
      : (selectedField?.label !== undefined && selectedField?.label !== null ? (field ? t : props?.t)(selectedField?.label) : "");

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
                  mdmsConfig: selectedField?.isMdms
                    ? {
                        moduleName: selectedField?.schemaCode?.split(".")[0],
                        masterName: selectedField?.schemaCode?.split(".")[1],
                      }
                    : null,
                  mdmsv2: selectedField?.isMdms ? true : false,
                  options: selectedField?.isMdms ? null : selectedField?.dropDownOptions,
                  optionsKey: selectedField?.isMdms ? "code" : "name",
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
