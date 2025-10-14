import React from "react";
import { InfoCard } from "@egovernments/digit-ui-components";
const InfoCardTemplate = ({ field, t, fieldTypeConfig }) => {
  const infoConfig = fieldTypeConfig?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "infoCard");
  const infoTypes = infoConfig?.properties?.find((p) => p.code === "infoCardType")?.options || ["info"];
  const infoType = field?.additionalProps?.infoCardType || infoTypes[0];
  const variantMap = {
    info: "default",
    success: "success",
    error: "error",
    warning: "warning",
  };
  return (
    <InfoCard
      populators={{
        name: field?.componentName || "infocard",
      }}
      variant={variantMap[infoType] || "default"}
      text={field?.value || "Information message"}
      label={field?.label ? t(field.label) : undefined}
      style={{ marginBottom: "8px" }}
    />
  );
};

export default InfoCardTemplate;
