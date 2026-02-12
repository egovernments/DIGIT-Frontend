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

    // Add primary action last (will appear at bottom)
  if (field?.primaryAction && !(field?.primaryAction?.hidden) ) {
    const primaryActionWithId = {
      ...field?.primaryAction,
      id: field?.primaryAction.id || field?.primaryAction.fieldName || `${field?.fieldName}-primary-action`,
      properties: {
        ...field?.primaryAction.properties,
        type: "primary",
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

  // Add secondary action first (will appear above primary)
  if (field?.secondaryAction && !(field?.secondaryAction?.hidden) ) {
    const secondaryActionWithId = {
      ...field?.secondaryAction,
      id: field?.secondaryAction.id || field?.secondaryAction.fieldName || `${field?.fieldName}-secondary-action`,
      properties: {
        ...field?.secondaryAction.properties,
        variation: "secondary", // Make it secondary style button
        size: "large",
        type: "secondary",
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


  // Allow empty labels - only use defaults if undefined/null
  const message = field?.label !== undefined && field?.label !== null ? t(field?.label) : "";
  const description = field?.description !== undefined && field?.description !== null ? t(field?.description) : "";

  return (
    <PanelCard
      type={panelType || "success"}
      message={message}
      description={description}
      footerChildren={footerChildren}
      showAsSvg={true}
      cardClassName="panel-card-preview"
      footerStyles={{width: "100%"}}
      style={{}}
    />
  );
};

export default PanelCardTemplate;
