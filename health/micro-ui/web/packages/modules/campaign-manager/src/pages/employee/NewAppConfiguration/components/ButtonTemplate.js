import React from "react";
import { Button, } from "@egovernments/digit-ui-components";
import { getFieldPropertyValue, } from "../helpers/propertyHelpers";

const ButtonTemplate = ({ field, t, fieldTypeMasterData, props }) => {
  const selectedField = field || props?.field;
  const fieldType = fieldTypeMasterData || props?.fieldTypeMasterData;

  // Get variation and icon from field with fallback to defaults
  const variation = getFieldPropertyValue(selectedField, "type", fieldType);
  const iconName = getFieldPropertyValue(selectedField, "icon", fieldType);

  // Get translated label - allow empty string, only use default if undefined/null
  const buttonLabel = selectedField?.label !== undefined && selectedField?.label !== null
    ? (field ? t : props?.t)(selectedField?.label)
    : "Button";

  return (
    <Button
      variation={variation || "primary"}
      label={buttonLabel}
      onClick={() => {}}
      className="app-preview-action-button"
      style={variation === "tertiary" ? { color: "#c84c0e", height: "1.5rem", width: "fit-content" } : null}
      textStyles={variation === "tertiary" ? { color: "#c84c0e", fontSize: "0.875rem" } : null}
      icon={iconName}
    />
  );
};

export default ButtonTemplate;
