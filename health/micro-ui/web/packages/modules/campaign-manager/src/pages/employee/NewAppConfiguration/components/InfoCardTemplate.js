import React from "react";
// import { InfoCard } from "@egovernments/digit-ui-components";
const InfoCardTemplate = ({ field, t, fieldTypeMasterData }) => {
  const infoConfig = fieldTypeMasterData?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "infoCard");
  const infoTypes = infoConfig?.properties?.find((p) => p.code === "infoCardType")?.options || ["info"];
  const infoType = field?.properties?.infoCardType || infoTypes[0];
  const variantMap = {
    info: "default",
    success: "success",
    error: "error",
    warning: "warning",
  };
  return (
    <div />
    // <InfoCard
    //   populators={{
    //     name: field?.fieldName || "infocard",
    //   }}
    //   variant={variantMap[infoType] || "default"}
    //   text={field?.value || "Information message"}
    //   label={field?.label ? t(field.label) : undefined}
    //   style={{ marginBottom: "8px" }}
    // />
  );
};

export default InfoCardTemplate;
