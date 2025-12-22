import React from "react";
import { Button, CustomSVG, Dropdown, FieldV1 } from "@egovernments/digit-ui-components";
import { getFieldPropertyValue, getPropertyOptions } from "../helpers/propertyHelpers";

const DropdownTemplate = ({ field, t, fieldTypeMasterData, isFieldSelected}) => {
    // Allow empty labels - only use defaults if undefined/null
    const dropdownLabel = field?.label !== undefined && field?.label !== null ? t(field?.label) : "";

    return (
        <FieldV1
        description={t(field?.helpText)}
                error={t(field?.errorMessage)}
                infoMessage={t(field?.tooltip)}
                label={dropdownLabel}
                onChange={function noRefCheck() {}}
                populators={{
                  title: dropdownLabel,
                  prefix: field?.prefixText || null,
                  suffix: field?.suffixText || null,
                  fieldPairClassName: `app-preview-field-pair dropdown-template ${isFieldSelected ? `app-preview-selected` : ``}`,
                  mdmsConfig: field?.isMdms
                    ? {
                        moduleName: field?.schemaCode?.split(".")[0],
                        masterName: field?.schemaCode?.split(".")[1],
                      }
                    : null,
                  mdmsv2: field?.isMdms ? true : false,
                  options: field?.isMdms ? null : field?.dropDownOptions,
                  optionsKey: field?.isMdms ? "code" : "name",
                }}
                required={field?.required}
                type={"dropdown"}
                value={field?.value}
                disabled={field?.readOnly || false}
        ></FieldV1>
    );
};

export default DropdownTemplate;
