import React from "react";
import { PanelCard } from "@egovernments/digit-ui-components";
import { getFieldPropertyValue, getPropertyOptions } from "../helpers/propertyHelpers";
import { renderTemplateComponent } from "../helpers/templateRendererHelpers";

const PanelCardTemplate = ({ field, t, selectedField, fieldTypeMasterData, onFieldClick, data}) => {
  // Get panelType from field with fallback to default
  const panelType = getFieldPropertyValue(field, "panelType", fieldTypeMasterData);

  // Get available panel types from master config
  const availablePanelTypes = getPropertyOptions(field?.format, "panelType", fieldTypeMasterData);

  const footerChildren = [];

  // Add secondary action first (will appear above primary)
  if (field?.secondaryAction) {
    const secondaryActionWithId = {
      ...field?.secondaryAction,
      id: field?.secondaryAction.id || field?.secondaryAction.fieldName || `${field?.fieldName}-secondary-action`,
      properties: {
        ...field?.secondaryAction.properties,
        variation: "secondary", // Make it secondary style button
        size: "large",
        style: { width: "100%", marginBottom: "8px" }
      }
    };

    footerChildren.push(
      <div key="secondary-action" style={{ width: "100%" }}>
        {renderTemplateComponent(
          secondaryActionWithId,
          fieldTypeMasterData,
          selectedField,
          t,
          onFieldClick,
          data,
          `panelcard-${field?.fieldName}`,
          0
        )}
      </div>
    );
  }

  // Add primary action last (will appear at bottom)
  if (field?.primaryAction) {
    const primaryActionWithId = {
      ...field?.primaryAction,
      id: field?.primaryAction.id || field?.primaryAction.fieldName || `${field?.fieldName}-primary-action`,
      properties: {
        ...field?.primaryAction.properties,
        variation: "primary", // Make it primary style button
        size: "large",
        style: { width: "100%" }
      }
    };

    footerChildren.push(
      <div key="primary-action" style={{ width: "100%" }}>
        {renderTemplateComponent(
          primaryActionWithId,
          fieldTypeMasterData,
          selectedField,
          t,
          onFieldClick,
          data,
          `panelcard-${field?.fieldName}`,
          1
        )}
      </div>
    );
  }

  return (
    <PanelCard
      type={panelType || "success"}
      message={t(field?.label) || "Panel Title"}
      description={t(field?.description) || "Panel content"}
      footerChildren={footerChildren}
      showAsSvg={true}
      cardClassName="panel-card-preview"
      footerStyles={{width: "100%"}}
      style={{ marginBottom: "1rem" }}
    />
  );
};

export default PanelCardTemplate;
