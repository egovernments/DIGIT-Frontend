import React from "react";
import { RadioButtons } from "@egovernments/digit-ui-components";
import { useCustomT, useCustomTranslate } from "../hooks/useCustomT";

const RadioListTemplate = ({ field, t, isFieldSelected, props }) => {
  const selectedField = field || props?.field;
  const selected = isFieldSelected || props?.isFieldSelected;
  const customT = useCustomTranslate();

  // Allow empty labels - only use defaults if undefined/null
  const radioLabel = selectedField?.label !== undefined && selectedField?.label !== null ? (field ? t : props?.t)(selectedField?.label) : "";

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

  // Get radio options from field data, or generate fallback if no valid data
  const hasValidData = Array.isArray(selectedField?.data) && selectedField.data.length > 0;
  const options = hasValidData
    ? selectedField.data
    : generateFallbackOptions(selectedField?.label || selectedField?.fieldName);

  // Transform options to include translated names
  const transformedOptions = options.map((option) => ({
    ...option,
    name: option.name,
  }));

  return (
    <div className={`radio-list-template ${selected ? `app-preview-selected` : ``}`}>
      {radioLabel && (
        <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          {radioLabel}
          {selectedField?.required && <span style={{ color: "red" }}> *</span>}
        </div>
      )}
      <RadioButtons
        options={transformedOptions}
        optionsKey="name"
        t={field ? t : props?.t}
        onSelect={() => {}}
        selectedOption={selectedField?.value || null}
        disabled={selectedField?.readOnly || false}
        additionalWrapperClass="radio-list-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      />
      {selectedField?.helpText && (
        <div style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
          {(field ? t : props?.t)(selectedField?.helpText)}
        </div>
      )}
      {selectedField?.errorMessage && (
        <div style={{ marginTop: "4px", fontSize: "12px", color: "#d32f2f" }}>
          {(field ? t : props?.t)(selectedField?.errorMessage)}
        </div>
      )}
    </div>
  );
};

export default RadioListTemplate;
