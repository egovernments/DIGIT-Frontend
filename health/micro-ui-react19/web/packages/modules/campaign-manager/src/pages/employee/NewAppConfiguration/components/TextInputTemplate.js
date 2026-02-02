import React from "react";
import { FieldV1 } from "@egovernments/digit-ui-components";

const TextInputTemplate = ({ field, t, isFieldSelected, props }) => {
  const selectedField = field || props?.field;
  const selected = isFieldSelected || props?.isFieldSelected;

  // Allow empty labels - only use defaults if undefined/null
  const inputLabel = selectedField?.label !== undefined && selectedField?.label !== null ? (field ? t : props?.t)(selectedField?.label) : "";

  return (
    <FieldV1
      description={(field ? t : props?.t)(selectedField?.helpText)}
      error={(field ? t : props?.t)(selectedField?.errorMessage)}
      infoMessage={(field ? t : props?.t)(selectedField?.tooltip)}
      label={inputLabel}
      onChange={function noRefCheck() {}}
      populators={{
        title: inputLabel,
        prefix: selectedField?.prefixText || null,
        suffix: selectedField?.suffixText || null,
        fieldPairClassName: `app-preview-field-pair ${selected ? `app-preview-selected` : ``}`,
      }}
      required={selectedField?.required}
      type={"text"}
      value={selectedField?.value}
      disabled={selectedField?.readOnly || false}
      placeholder={selectedField?.placeholder ? (field ? t : props?.t)(selectedField?.placeholder) : ""}
    ></FieldV1>
  );
};

export default TextInputTemplate;
