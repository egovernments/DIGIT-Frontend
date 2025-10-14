import React from "react";
import { PanelCard } from "@egovernments/digit-ui-components";
const PanelCardTemplate = ({ field, t, fieldTypeConfig }) => {
  const panelConfig = fieldTypeConfig?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "panelCard");
  const panelTypes = panelConfig?.properties?.find((p) => p.code === "panelType")?.options || ["success", "error"];
  const panelType = field?.additionalProps?.panelType || panelTypes[0];
  return (
    <PanelCard
      type={panelType}
      message={t(field?.label) || "Panel Title"}
      description={field?.value || "Panel content"}
      showAsSvg={true}
      cardClassName="panel-card-preview"
      style={{ marginBottom: "1rem" }}
    />
  );
};

export default PanelCardTemplate;
