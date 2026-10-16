import React from "react";

const TextTemplate = ({ field, t, props }) => {
  const selectedField = field || props?.field;
  const translate = field ? t : props?.t;

  // Allow empty labels - only use defaults if undefined/null
  const label = selectedField?.fieldName !== undefined && selectedField?.fieldName !== null ? selectedField?.fieldName : "";
  const translatedLabel = label ? translate(label) : "";

  // properties.style: a style name (e.g. "headingS") adds a CSS class; a style object is applied as-is to the text
  const style = selectedField?.properties?.style;
  const styleVariant = typeof style === "string" ? style : null;
  const styleObject = style && typeof style === "object" ? style : null;

  // isFieldValue (default true) previews "<field> : ********"; false previews only the translated value,
  // as the app shows it (falls back to the field name when the value is filled in at runtime)
  const isFieldValue = selectedField?.properties?.isFieldValue !== false;
  const value = selectedField?.value;
  const hasFixedValue = typeof value === "string" && value !== "" && !value.includes("{{");

  const text = isFieldValue ? translatedLabel : hasFixedValue ? translate(value) : translatedLabel;
  const styledText = styleObject ? <span style={styleObject}>{text}</span> : text;

  const className = `text-template${styleVariant ? ` text-template--${styleVariant}` : ""}`;

  // Field name only: the style object applies to the whole block, so margins etc. take effect
  if (!isFieldValue) {
    return (
      <div className={className} style={styleObject || undefined}>
        {text}
      </div>
    );
  }

  return (
    <div className={className}>
      {translatedLabel ? (
        styleObject ? (
          <>
            {styledText}
            {" : ********"}
          </>
        ) : (
          `${translatedLabel} : ********`
        )
      ) : (
        "********"
      )}
    </div>
  );
};

export default TextTemplate;
