import React from "react";

// Values like "{{contextData.0.children.length}}" are filled in on the device;
// anything else in `value` is a localisation key for fixed text.
const isRuntimeValue = (value) => typeof value === "string" && value.includes("{{");
// Counts such as "{{contextData.0.children.length}}" preview as a sample number
const isCountValue = (value) => isRuntimeValue(value) && /\.length\s*}}/.test(value);

// Opt-in via properties.previewMode = "value"; without it the preview stays "<fieldName> : ********"
export const isValuePreview = (field) => field?.properties?.previewMode === "value";

const TextTemplate = ({ field, t, props }) => {
  const selectedField = field || props?.field;
  const translate = field ? t : props?.t;

  // Allow empty labels - only use defaults if undefined/null
  const label = selectedField?.fieldName !== undefined && selectedField?.fieldName !== null ? selectedField?.fieldName : "";
  const translatedLabel = label ? translate(label) : "";
  const maskedContent = translatedLabel ? `${translatedLabel} : ********` : "********";

  const styleVariant = selectedField?.properties?.style;

  if (!isValuePreview(selectedField)) {
    return <div className={`text-template${styleVariant ? ` text-template--${styleVariant}` : ""}`}>{maskedContent}</div>;
  }

  const value = selectedField?.value;
  const colorVariant = selectedField?.properties?.color;

  let content = maskedContent;
  if (value && !isRuntimeValue(value)) {
    // Fixed text, e.g. GV_SESSION_OVERVIEW_TODAY -> "Today's progress"
    content = translate(value);
  } else if (isCountValue(value)) {
    content = "0";
  }

  const className = [
    "text-template",
    styleVariant ? `text-template--pv-${styleVariant}` : "",
    colorVariant ? `text-template--pv-color-${colorVariant}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={className}>{content}</div>;
};

export default TextTemplate;
