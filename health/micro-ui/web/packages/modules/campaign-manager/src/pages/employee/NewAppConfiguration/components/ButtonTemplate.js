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
  
  console.log("ButtonTemplate rendering:", { 
    fieldName: field.fieldName, 
    variation,
    iconName,
    availableVariations,
    availableIcons,
    label: field?.label
  });


  return (
    <Button
      variation={variation || "primary"}
      label={t(field?.label) || "Button"}
      onClick={() => {}}
      className="app-preview-action-button"
      icon={iconName}
    />
  );
};

export default ButtonTemplate;