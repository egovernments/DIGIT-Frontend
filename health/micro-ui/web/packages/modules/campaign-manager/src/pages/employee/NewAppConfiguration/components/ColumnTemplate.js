import React from "react";
import { renderTemplateComponent } from "../helpers/templateRendererHelpers";
import { getAllowedChildren, isChildAllowed } from "../helpers/propertyHelpers";

const ColumnTemplate = ({ field, t, fieldTypeMasterData, selectedField, onFieldClick, data }) => {
  const children = field.children || [];
  const properties = field.properties || {};
  
  // Get allowed children from master config
  const allowedChildren = getAllowedChildren(field?.format, fieldTypeMasterData);
  
  console.log("ColumnTemplate rendering:", { 
    fieldName: field.fieldName, 
    childrenCount: children.length,
    properties,
    allowedChildren: allowedChildren.length > 0 ? allowedChildren : "All children allowed"
  });

  // Filter out children that are not allowed (if restrictions exist)
  const validChildren = children.filter((child, index) => {
    const allowed = isChildAllowed(field?.format, child?.format, fieldTypeMasterData);
    if (!allowed) {
      console.warn(`Child at index ${index} with format "${child?.format}" is not allowed in Column. Allowed: [${allowedChildren.join(", ")}]`);
    }
    return allowed;
  });
  
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: properties.gap || "8px",
      justifyContent: properties.mainAxisAlignment === "spaceBetween" ? "space-between" : 
                      properties.mainAxisAlignment === "spaceAround" ? "space-around" :
                      properties.mainAxisAlignment === "spaceEvenly" ? "space-evenly" :
                      properties.mainAxisAlignment === "center" ? "center" :
                      properties.mainAxisAlignment === "end" ? "flex-end" : "flex-start",
      alignItems: properties.crossAxisAlignment === "start" ? "flex-start" :
                  properties.crossAxisAlignment === "end" ? "flex-end" :
                  properties.crossAxisAlignment === "stretch" ? "stretch" :
                  properties.crossAxisAlignment === "center" ? "center" : "flex-start"
    }}>
      {validChildren.map((child, index) => {
        // Ensure child has proper id
        const childWithId = {
          ...child,
          id: child.id || child.fieldName || `column-${field.id}-child-${index}`
        };
        
        return renderTemplateComponent(
          childWithId, 
          fieldTypeMasterData, 
          selectedField, 
          t, 
          onFieldClick, 
          data, 
          `column-${field.id}`, 
          index
        );
      })}
    </div>
  );
};

export default ColumnTemplate;