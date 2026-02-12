import React from "react";

const TextTemplate = ({ field, t, props }) => {
  const selectedField = field || props?.field;

  // Allow empty labels - only use defaults if undefined/null
  const label = selectedField?.fieldName !== undefined && selectedField?.fieldName !== null ? selectedField?.fieldName : "";
  const translatedLabel = label ? (field ? t : props?.t)(label) : "";

  return (
    <div
      style={{
        fontSize: "0.875rem",
        color: "#333",
      }}
    >
      {translatedLabel ? `${translatedLabel} : ********` : "********"}
    </div>
  );
};

export default TextTemplate;
