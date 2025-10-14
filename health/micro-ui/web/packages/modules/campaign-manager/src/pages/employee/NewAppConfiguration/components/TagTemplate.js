import React from "react";
import { Tag } from "@egovernments/digit-ui-components";
const TagTemplate = ({ field, t, fieldTypeConfig }) => {
  const tagConfig = fieldTypeConfig?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "tag");
  const tagTypes = tagConfig?.properties?.find((p) => p.code === "tagType")?.options || ["monochrome"];
  const tagType = field?.additionalProps?.tagType || tagTypes[0];
  const variantMap = {
    success: "success",
    error: "error",
    warning: "warning",
    monochrome: "default",
  };
  return <Tag variant={variantMap[tagType] || "default"} label={field?.value || "Tag"} />;
};
export default TagTemplate;
