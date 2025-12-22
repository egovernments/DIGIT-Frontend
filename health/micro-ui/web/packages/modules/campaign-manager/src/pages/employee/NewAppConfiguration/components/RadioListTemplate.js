import React from "react";
import { RadioButtons } from "@egovernments/digit-ui-components";

const RadioListTemplate = ({ field, t, isFieldSelected }) => {
  // Allow empty labels - only use defaults if undefined/null
  const radioLabel = field?.label !== undefined && field?.label !== null ? t(field?.label) : "";

  // Get radio options from field data
  const options = field?.data || [];

  // Transform options to include translated names
  const transformedOptions = options.map((option) => ({
    ...option,
    name: t(option.name),
  }));

  return (
    <div className={`radio-list-template ${isFieldSelected ? `app-preview-selected` : ``}`}>
      {radioLabel && (
        <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          {radioLabel}
          {field?.required && <span style={{ color: "red" }}> *</span>}
        </div>
      )}
      <RadioButtons
        options={transformedOptions}
        optionsKey="code"
        t={t}
        onSelect={() => {}}
        selectedOption={field?.value || null}
        disabled={field?.readOnly || false}
        additionalWrapperClass="radio-list-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      />
      {field?.helpText && (
        <div style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
          {t(field?.helpText)}
        </div>
      )}
      {field?.errorMessage && (
        <div style={{ marginTop: "4px", fontSize: "12px", color: "#d32f2f" }}>
          {t(field?.errorMessage)}
        </div>
      )}
    </div>
  );
};

export default RadioListTemplate;
