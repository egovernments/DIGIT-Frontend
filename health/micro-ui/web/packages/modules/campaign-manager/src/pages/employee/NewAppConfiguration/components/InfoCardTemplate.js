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
  return (
    <AlertCard
      populators={{ name: "infocard" }}
      variant="default"
      className="cmn-help-info-card"
      label={t(field.label) || "Info Card"}
      text={t(field?.description) || "This is an info card template"}
    />
  );
};

export default InfoCardTemplate;
