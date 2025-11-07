import React from "react";

const TextTemplate = ({ field, t }) => {
  const label =  field?.fieldName || "Text";
  return (
    <div
      style={{
        fontSize: "14px",
        color: "#333",
        padding: "4px 0",
      }}
    >
      {`${t(label) || "LABEL"} : ********`}
    </div>
  );
};

export default TextTemplate;
