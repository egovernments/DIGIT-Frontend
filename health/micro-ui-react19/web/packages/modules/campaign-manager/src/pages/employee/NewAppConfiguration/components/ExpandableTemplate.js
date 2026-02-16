import React, { useState } from "react";
import { Button } from "@egovernments/digit-ui-components";
import { renderTemplateComponent } from "../helpers/templateRendererHelpers";

/**
 * ExpandableTemplate - Component that shows/hides children on button click
 *
 * Config properties:
 * - expandLabel: Label when collapsed (shows children on click)
 * - collapseLabel: Label when expanded (hides children on click)
 * - children: Array of child components to show/hide
 * - controlsField: Field that controls the data
 *
 * Example:
 * {
 *   "format": "expandable",
 *   "type": "template",
 *   "expandLabel": "VIEW_PAST_CYCLES",
 *   "collapseLabel": "HIDE_PAST_CYCLES",
 *   "children": [...]
 * }
 */
const ExpandableTemplate = ({ field, t, fieldTypeMasterData, selectedField, onFieldClick, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const children = field.children || [];
  const properties = field.properties || {};

  // Get labels from field config
  const expandLabel = field.expandLabel || "VIEW_MORE";
  const collapseLabel = field.collapseLabel || "HIDE";

  // Toggle expanded state
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine button label and icon based on expanded state
  const buttonLabel = isExpanded ? t(collapseLabel) : t(expandLabel);
  const buttonIcon = isExpanded ? "ArrowUpward" : "ArrowDownward";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" ,width:"100%"}}>
      {/* Toggle Button */}
      <Button
        label={buttonLabel}
        title={buttonLabel}
        onClick={handleToggle}
        variation="link"
        icon={buttonIcon}
        isSuffix={true}
        style={{
          color: "#c84c0e",
          height: "1.5rem",
          width: "fit-content",
          padding: 0
        }}
        textStyles={{
          color: "#c84c0e",
          fontSize: "0.875rem"
        }}
      />

      {/* Children - Only render when expanded */}
      {isExpanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: properties.gap || "1rem" ,width:"100%"}}>
          {children.map((child, index) => {
            // Ensure child has proper id
            const childWithId = {
              ...child,
              id: child.id || child.fieldName || `expandable-${field.id}-child-${index}`,
            };

            return renderTemplateComponent(
              childWithId,
              fieldTypeMasterData,
              selectedField,
              t,
              onFieldClick,
              data,
              `expandable-${field.id}`,
              index
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpandableTemplate;
