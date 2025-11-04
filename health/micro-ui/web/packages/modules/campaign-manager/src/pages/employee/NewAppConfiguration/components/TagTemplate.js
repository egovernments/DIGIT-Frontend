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

  return <Tag className={"campaign-tag"} variant={variantMap[tagType] || "default"} label={field?.fieldName || "Tag"} stroke={true} icon={"Info"}/>;
};

export default TagTemplate;
