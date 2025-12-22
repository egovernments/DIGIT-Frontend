import React from "react";
import { FieldV1 } from "@egovernments/digit-ui-components";

const TextInputTemplate = ({ field, t, isFieldSelected }) => {
  // Allow empty labels - only use defaults if undefined/null
  const inputLabel = field?.label !== undefined && field?.label !== null ? t(field?.label) : "";

  return (
    <FieldV1
      description={t(field?.helpText)}
      error={t(field?.errorMessage)}
      infoMessage={t(field?.tooltip)}
      label={inputLabel}
      onChange={function noRefCheck() {}}
      populators={{
        title: inputLabel,
        prefix: field?.prefixText || null,
        suffix: field?.suffixText || null,
        fieldPairClassName: `app-preview-field-pair ${isFieldSelected ? `app-preview-selected` : ``}`,
      }}
      required={field?.required}
      type={"text"}
      value={field?.value}
      disabled={field?.readOnly || false}
      placeholder={field?.placeholder ? t(field?.placeholder) : ""}
    ></FieldV1>
  );
};

export default TextInputTemplate;
