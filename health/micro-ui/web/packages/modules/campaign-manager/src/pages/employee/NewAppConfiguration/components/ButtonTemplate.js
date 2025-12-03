import React from "react";
import { Button, CustomSVG } from "@egovernments/digit-ui-components";
import { getFieldPropertyValue, getPropertyOptions } from "../helpers/propertyHelpers";

const ButtonTemplate = ({ field, t, fieldTypeMasterData }) => {
  // Get variation and icon from field with fallback to defaults
  const variation = getFieldPropertyValue(field, "type", fieldTypeMasterData);
  const iconName = getFieldPropertyValue(field, "icon", fieldTypeMasterData);

  // Get available options from master config
  const availableVariations = getPropertyOptions(field?.format, "variation", fieldTypeMasterData);
  const availableIcons = getPropertyOptions(field?.format, "icon", fieldTypeMasterData);

  // Get translated label - allow empty string, only use default if undefined/null
  const buttonLabel = field?.label !== undefined && field?.label !== null
    ? t(field?.label)
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
