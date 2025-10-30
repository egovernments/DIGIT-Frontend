import React from "react";
import { PanelCard } from "@egovernments/digit-ui-components";
import { getFieldPropertyValue, getPropertyOptions } from "../helpers/propertyHelpers";

const PanelCardTemplate = ({ field, t, fieldTypeMasterData }) => {
  // Get panelType from field with fallback to default
  const panelType = getFieldPropertyValue(field, "panelType", fieldTypeMasterData);
  
  // Get available panel types from master config
  const availablePanelTypes = getPropertyOptions(field?.format, "panelType", fieldTypeMasterData);
  
  console.log("PanelCardTemplate rendering:", { 
    fieldName: field.fieldName, 
    panelType,
    availablePanelTypes,
    label: field?.label,
    value: field?.value
  });

  return (
    <PanelCard
      type={panelType || "success"}
      message={t(field?.label) || "Panel Title"}
      description={field?.value || "Panel content"}
      showAsSvg={true}
      cardClassName="panel-card-preview"
      style={{ marginBottom: "1rem" }}
    />
  );
};

export default PanelCardTemplate;