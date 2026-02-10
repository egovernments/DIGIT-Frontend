import React from "react";
import { Card } from "@egovernments/digit-ui-components";
import { renderTemplateComponent } from "../helpers/templateRendererHelpers";
import { getFieldPropertyValue, getPropertyOptions } from "../helpers/propertyHelpers";

const CardTemplate = ({ field, t, fieldTypeMasterData, selectedField, onFieldClick, data }) => {
  // Get cardType from field.properties or field.additionalProps with fallback to default
  const cardType = getFieldPropertyValue(field, "cardType", fieldTypeMasterData);

  const children = field?.children || [];

  // Get available card types from master config (for debugging/validation)
  const availableCardTypes = getPropertyOptions(field?.format, "cardType", fieldTypeMasterData);

  return (
    <Card
      type={cardType || "primary"}
      className={`card-type-${cardType || "primary"}`}
      style={{
        padding: "4px",
        marginBottom: "4px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children.map((child, index) => {
        // Ensure child has proper id
        const childWithId = {
          ...child,
          id: child.id || child.fieldName || `card-${field.id}-child-${index}`,
        };

        return renderTemplateComponent(childWithId, fieldTypeMasterData, selectedField, t, onFieldClick, data, `card-${field.id}`, index);
      })}
    </Card>
  );
};

export default CardTemplate;
