import React from "react";
import { Card } from "@egovernments/digit-ui-components";
const CardTemplate = ({ field, t, fieldTypeConfig }) => {
  const cardConfig = fieldTypeConfig?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "card");
  const cardTypes = cardConfig?.properties?.find((p) => p.code === "cardType")?.options || ["primary", "secondary"];
  const cardType = field?.additionalProps?.cardType || cardTypes[0];
  return (
    <Card
      className={`card-type-${cardType}`}
      style={{
        padding: "16px",
        marginBottom: "8px",
        border: cardType === "secondary" ? "1px solid #e0e0e0" : "none",
        boxShadow: cardType === "primary" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {field?.label && <div style={{ fontWeight: "500", marginBottom: "8px" }}>{t(field.label)}</div>}
      <div>{field?.value || "Card content"}</div>
    </Card>
  );
};

export default CardTemplate;
