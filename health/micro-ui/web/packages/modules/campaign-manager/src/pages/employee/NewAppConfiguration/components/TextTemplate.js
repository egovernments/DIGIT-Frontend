import React from "react";

const TextTemplate = ({ field, t }) => {
  const label = field?.label ? (field.label) : field?.fieldName || "Text";

  console.log("TextTemplate rendering:", { 
    fieldName: field.fieldName, 
    label
  });

  return (
    <div style={{
      fontSize: "14px",
      color: "#333",
      padding: "4px 0"
    }}>
      {label}
    </div>
  );
};

export default TextTemplate;