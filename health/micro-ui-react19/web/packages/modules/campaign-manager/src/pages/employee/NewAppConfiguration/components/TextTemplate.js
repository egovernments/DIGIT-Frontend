import React from "react";

// Opt-in via properties.previewMode = "value": fixed text (a localisation key in `value`) previews as the
// translated text. Runtime values like "{{contextData.0.children.length}}" are filled in on the device and
// keep the original "<fieldName> : ********" preview.
export const isValuePreview = (field) => {
  const value = field?.value;
  return field?.properties?.previewMode === "value" && typeof value === "string" && value !== "" && !value.includes("{{");
};

const TextTemplate = ({ field, t, props }) => {
  const selectedField = field || props?.field;
  const translate = field ? t : props?.t;
  const styleVariant = selectedField?.properties?.style;

  if (isValuePreview(selectedField)) {
    const colorVariant = selectedField?.properties?.color;
    const className = [
      "text-template",
      styleVariant ? `text-template--pv-${styleVariant}` : "",
      colorVariant ? `text-template--pv-color-${colorVariant}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    return <div className={className}>{translate(selectedField.value)}</div>;
  }

  // Allow empty labels - only use defaults if undefined/null
  const label = selectedField?.fieldName !== undefined && selectedField?.fieldName !== null ? selectedField?.fieldName : "";
  const translatedLabel = label ? translate(label) : "";

  return (
    <div className={`text-template${styleVariant ? ` text-template--${styleVariant}` : ""}`}>
      {translatedLabel ? `${translatedLabel} : ********` : "********"}
    </div>
  );
};

export default TextTemplate;
