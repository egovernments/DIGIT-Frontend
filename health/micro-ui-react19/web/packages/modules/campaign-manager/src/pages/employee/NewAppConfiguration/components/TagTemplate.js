import React from "react";
import { Tag } from "@egovernments/digit-ui-components";
import { getFieldPropertyValue, getPropertyOptions } from "../helpers/propertyHelpers";

const TagTemplate = ({ field, t, fieldTypeMasterData, }) => {
  // Get tagType from field with fallback to default from master config
  const tagType = getFieldPropertyValue(field, "tagType", fieldTypeMasterData);

  // Get available tag types from master config
  const availableTagTypes = getPropertyOptions(field?.format, "tagType", fieldTypeMasterData);

  // Map tagType to variant for the Tag component
  const variantMap = {
    success: "success",
    error: "error",
    warning: "warning",
    monochrome: "monochrome",
  };

  // Allow empty labels - only use defaults if undefined/null
  const tagLabel = field?.label !== undefined && field?.label !== null ? t(field?.label) : (field?.fieldName ? t(field?.fieldName) : "");

  // Render as a real tag pill (variant background + stroke); a white background
  // made delivery statuses read as plain text in the preview
  return <Tag type={field?.properties?.tagType ? field?.properties?.tagType === "info" ? "monochrome" : field?.properties?.tagType : "monochrome"} label={tagLabel} stroke={true} />;
};

export default TagTemplate;
