import React from "react";

const TextTemplate = ({ field, t }) => {
  // Allow empty labels - only use defaults if undefined/null
  const label = field?.fieldName !== undefined && field?.fieldName !== null ? field?.fieldName : "";
  const translatedLabel = label ? t(label) : "";

  return (
    <div
      style={{
        fontSize: "14px",
        color: "#333",
        padding: "4px 0",
      }}
    >
      {translatedLabel ? `${translatedLabel} : ********` : "********"}
    </div>
  );
};

export default TextTemplate;
