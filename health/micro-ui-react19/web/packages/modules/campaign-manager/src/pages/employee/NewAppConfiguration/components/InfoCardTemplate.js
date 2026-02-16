import React from "react";
import { AlertCard } from "@egovernments/digit-ui-components";
const InfoCardTemplate = ({ field, t, fieldTypeMasterData }) => {
  const infoConfig = fieldTypeMasterData?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "infoCard");
  const infoTypes = infoConfig?.properties?.find((p) => p.code === "infoCardType")?.options || ["info"];
  const infoType = field?.properties?.infoCardType || infoTypes[0];
  const variantMap = {
    info: "info",
    success: "success",
    error: "error",
    warning: "warning",
  };
  // Allow empty labels - only use defaults if undefined/null
  const infoLabel = field?.label !== undefined && field?.label !== null ? t(field.label) : "";
  const infoText = field?.description !== undefined && field?.description !== null ? t(field?.description) : "";

  return (
    <AlertCard
      populators={{ name: "infocard" }}
      variant="default"
      className="cmn-help-info-card"
      label={infoLabel}
      text={infoText}
      style={{margin:"0rem"}}
    />
  );
};

export default InfoCardTemplate;
