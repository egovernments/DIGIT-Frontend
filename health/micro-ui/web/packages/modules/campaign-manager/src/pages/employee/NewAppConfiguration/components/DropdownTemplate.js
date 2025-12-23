import React from "react";
import {FieldV1 } from "@egovernments/digit-ui-components";

const DropdownTemplate = ({ field, t, fieldTypeMasterData, isFieldSelected, props }) => {
    const selectedField = field || props?.field;
    const fieldType = fieldTypeMasterData || props?.fieldTypeMasterData;
    const selected = isFieldSelected || props?.isFieldSelected;

    // Allow empty labels - only use defaults if undefined/null
    const dropdownLabel = selectedField?.label !== undefined && selectedField?.label !== null ? (field ? t : props?.t)(selectedField?.label) : "";

    return (
        <FieldV1
        description={(field ? t : props?.t)(selectedField?.helpText)}
                error={(field ? t : props?.t)(selectedField?.errorMessage)}
                infoMessage={(field ? t : props?.t)(selectedField?.tooltip)}
                label={dropdownLabel}
                onChange={function noRefCheck() {}}
                populators={{
                  title: dropdownLabel,
                  prefix: selectedField?.prefixText || null,
                  suffix: selectedField?.suffixText || null,
                  fieldPairClassName: `app-preview-field-pair ${selected ? `app-preview-selected` : ``}`,
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
                required={selectedField?.required}
                type={"dropdown"}
                value={selectedField?.value}
                disabled={selectedField?.readOnly || false}
        ></FieldV1>
    );
};

export default DropdownTemplate;
