import React from "react";
import { FieldV1 } from "@egovernments/digit-ui-components";
import { getFieldTypeFromMasterData } from "./getFieldTypeFromMasterData";
import { getComponentName as getComponentNameFromHelper } from "./propertyHelpers.js";

/**
 * Get component name from field master data
 * Uses the property helper for consistency
 */
export const getComponentName = (field, fieldTypeMasterData) => {
  if (!field || !fieldTypeMasterData || fieldTypeMasterData.length === 0) {
    return null;
  }

  return getComponentNameFromHelper(field?.format, fieldTypeMasterData);
};

/**
 * Check if a field is selected
 */
export const isFieldSelected = (field, selectedField) => {
  if (!selectedField || !field) return false;

  if (field.fieldName && selectedField.fieldName) {
    return field.fieldName === selectedField.fieldName;
  }

  if (field.id && selectedField.id) {
    return field.id === selectedField.id;
  }

  return field === selectedField;
};

/**
 * Render a single template component
 * This is the core rendering function that all components use
 */
export const renderTemplateComponent = (
  field, 
  fieldTypeMasterData, 
  selectedField, 
  t, 
  onFieldClick, 
  data, 
  sectionName = "body", 
  index = 0
) => {
  if (!field || field.hidden) return null;

  const isSelected = isFieldSelected(field, selectedField);
  const uniqueKey = field.id || field.fieldName || `${sectionName}-${index}`;

  // Get component name from field master
  const componentName = getComponentName(field, fieldTypeMasterData);

  // Try to get component from ComponentRegistryService
  let Component = null;
  if (componentName) {
    Component = Digit.ComponentRegistryService.getComponent(componentName);
  }

  // Wrapper with selection highlighting and click handling
  const wrapperStyle = {
    cursor: "pointer",
    border: isSelected ? "2px solid #0B4B66" : "2px solid transparent",
    borderRadius: "4px",
    padding: "4px",
    // margin: "4px 0",
    backgroundColor: isSelected ? "#f0f8ff" : "transparent",
    transition: "all 0.2s ease",
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onFieldClick && onFieldClick(field, data, null, index, null);
  };

  // If custom component found, render it
  if (Component) {
    return (
      <div key={uniqueKey} onClick={handleClick} style={wrapperStyle}>
        <Component 
          field={field} 
          t={t} 
          fieldTypeMasterData={fieldTypeMasterData}
          selectedField={selectedField}
          onFieldClick={onFieldClick}
          data={data}
        />
      </div>
    );
  }

  // Fallback to FieldV1 for standard form fields
  const fieldType = getFieldTypeFromMasterData(field, fieldTypeMasterData);

  return (
        <div
      key={uniqueKey}
      onClick={handleClick}
      style={{
        ...wrapperStyle,
        background: "#fafafa",
        color: "#999",
        fontStyle: "italic",
        border: "1px dashed #ccc",
        textAlign: "center",
        padding: "8px",
      }}
    >
      {`${fieldType} Component will be available soon...`}
    </div>
  );
};