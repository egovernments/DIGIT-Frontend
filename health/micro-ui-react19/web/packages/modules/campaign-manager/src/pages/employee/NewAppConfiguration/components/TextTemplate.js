import React from "react";

const TextTemplate = ({ field, t, props }) => {
  const selectedField = field || props?.field;
  const translate = field ? t : props?.t;

  // Allow empty labels - only use defaults if undefined/null
  const label = selectedField?.fieldName !== undefined && selectedField?.fieldName !== null ? selectedField?.fieldName : "";
  const translatedLabel = label ? translate(label) : "";

  const styleVariant = selectedField?.properties?.style;
  const className = `text-template${typeof styleVariant === "string" ? ` text-template--${styleVariant}` : ""}`;

  // properties.textStyle (CSS properties, e.g. { fontSize: "16px", color: "#0B4B66" }) is applied inline over
  // the default text template style; the app ignores it and keeps using properties.style
  const textStyle = selectedField?.properties?.textStyle;
  const inlineStyle = textStyle && typeof textStyle === "object" ? textStyle : undefined;

  // isFieldValue (default true) previews "<field> : ********"; false previews only the translated value,
  // as the app shows it (falls back to the field name when the value is filled in at runtime)
  if (selectedField?.properties?.isFieldValue === false) {
    const value = selectedField?.value;
    const hasFixedValue = typeof value === "string" && value !== "" && !value.includes("{{");
    return (
      <div className={className} style={inlineStyle}>
        {hasFixedValue ? translate(value) : translatedLabel}
      </div>
    );
  }

  return (
    <div className={className} style={inlineStyle}>
      {translatedLabel ? `${translatedLabel} : ********` : "********"}
    </div>
  );
};

export default TextTemplate;
