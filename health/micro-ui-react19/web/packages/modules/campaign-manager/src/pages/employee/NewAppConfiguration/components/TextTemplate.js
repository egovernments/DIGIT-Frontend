import React from "react";

const TextTemplate = ({ field, t, props }) => {
  const selectedField = field || props?.field;

  // Allow empty labels - only use defaults if undefined/null
  const label = selectedField?.fieldName !== undefined && selectedField?.fieldName !== null ? selectedField?.fieldName : "";
  const translatedLabel = label ? (field ? t : props?.t)(label) : "";

  const styleVariant = selectedField?.properties?.style;

  return (
    <div className={`text-template${styleVariant ? ` text-template--${styleVariant}` : ""}`}>
      {translatedLabel ? `${translatedLabel} : ********` : "********"}
    </div>
  );
};

export default TextTemplate;
