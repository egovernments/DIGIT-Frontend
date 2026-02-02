import React from "react";
import { Button, CustomSVG } from "@egovernments/digit-ui-components";
import { getFieldPropertyValue, getPropertyOptions } from "../helpers/propertyHelpers";

export const CaptureImage = ({ field, t, fieldTypeMasterData }) => {
  // Get variation and icon from field with fallback to defaults
  const variation = getFieldPropertyValue(field, "type", fieldTypeMasterData);
  const iconName = getFieldPropertyValue(field, "icon", fieldTypeMasterData);

  // Get available options from master config
  const availableVariations = getPropertyOptions(field?.format, "variation", fieldTypeMasterData);
  const availableIcons = getPropertyOptions(field?.format, "icon", fieldTypeMasterData);

  return (
    <Button
      variation={variation || "primary"}
      label={t(field?.label) || "Capture Image"}
      title={t(field?.label) || "Capture Image"}
      onClick={() => {}}
      className="app-preview-action-button"
      icon={iconName}
    />
  );
};
