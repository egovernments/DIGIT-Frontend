import React from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardText, FieldV1, Button } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "../../../components/MobileBezelFrame";
import { getFieldTypeFromMasterData } from "./helpers";

/**
 * Helper function to get component name from field master data
 * @param {Object} field - Field object with type and format
 * @param {Array} fieldTypeMasterData - Array of field type configurations
 * @returns {string|null} - Component name or null
 */
const getComponentName = (field, fieldTypeMasterData) => {
  if (!field || !fieldTypeMasterData || fieldTypeMasterData.length === 0) {
    return null;
  }

  // Find matching field type config by type and format
  const fieldTypeConfig = fieldTypeMasterData.find(
    (item) => item?.metadata?.type === field?.type && item?.metadata?.format === field?.format
  );

  return fieldTypeConfig?.component || null;
};

/**
 * Helper function to check if a field is selected
 * @param {Object} field - Field to check
 * @param {Object} selectedField - Currently selected field
 * @returns {boolean} - True if field is selected
 */
const isFieldSelected = (field, selectedField) => {
  if (!selectedField || !field) return false;

  // Check by unique componentName
  if (field.componentName && selectedField.componentName) {
    return field.componentName === selectedField.componentName;
  }

  // Check by id
  if (field.id && selectedField.id) {
    return field.id === selectedField.id;
  }

  // Reference equality
  return field === selectedField;
};

/**
 * Render a single template component
 * @param {Object} field - Field configuration
 * @param {Object} fieldTypeMasterData - Field type master data
 * @param {Object} selectedField - Currently selected field
 * @param {Function} t - Translation function
 * @param {Function} onFieldClick - Click handler
 * @param {Object} data - Full page data
 * @param {string} sectionName - Section name (body/footer)
 * @param {number} index - Field index
 * @returns {JSX.Element|null} - Rendered component or null
 */
const renderTemplateComponent = (field, fieldTypeMasterData, selectedField, t, onFieldClick, data, sectionName, index) => {
  if (!field || field.hidden) return null;

  const isSelected = isFieldSelected(field, selectedField);
  const uniqueKey = field.id || field.componentName || `${sectionName}-${index}`;

  // Get component name from field master
  const componentName = getComponentName(field, fieldTypeMasterData);

  // If component name exists, try to get it from ComponentRegistryService
  let Component = null;
  if (componentName) {
    Component = Digit.ComponentRegistryService.getComponent(componentName);
  }

  // If no component found, fallback to FieldV1 with fieldType
  if (!Component) {
    const fieldType = getFieldTypeFromMasterData(field, fieldTypeMasterData);

    return (
      <div
        key={uniqueKey}
        onClick={(e) => {
          e.stopPropagation();
          onFieldClick && onFieldClick(field, data, null, index, null);
        }}
        style={{
          cursor: "pointer",
          border: isSelected ? "2px solid #0B4B66" : "2px solid transparent",
          borderRadius: "4px",
          padding: "8px",
          margin: "4px 0",
          backgroundColor: isSelected ? "#f0f8ff" : "transparent",
          transition: "all 0.2s ease",
        }}
      >
        <FieldV1
          type={fieldType}
          label={t(field?.label)}
          value={field?.value || ""}
          placeholder={t(field?.innerLabel) || ""}
          onChange={() => {}}
          disabled={field?.readOnly || false}
          populators={{
            fieldPairClassName: "app-preview-field-pair",
          }}
        />
      </div>
    );
  }

  // Render custom component from ComponentRegistryService
  return (
    <div
      key={uniqueKey}
      onClick={(e) => {
        e.stopPropagation();
        onFieldClick && onFieldClick(field, data, null, index, null);
      }}
      style={{
        cursor: "pointer",
        border: isSelected ? "2px solid #0B4B66" : "2px solid transparent",
        borderRadius: "4px",
        padding: "8px",
        margin: "4px 0",
        backgroundColor: isSelected ? "#f0f8ff" : "transparent",
        transition: "all 0.2s ease",
      }}
    >
      <Component field={field} t={t} />
    </div>
  );
};

/**
 * Render a section (body or footer)
 * @param {Array} section - Array of card objects or field objects
 * @param {string} sectionName - Section name (body/footer)
 * @param {Object} fieldTypeMasterData - Field type master data
 * @param {Object} selectedField - Currently selected field
 * @param {Function} t - Translation function
 * @param {Function} onFieldClick - Click handler
 * @param {Object} data - Full page data
 * @returns {JSX.Element|null} - Rendered section or null
 */
const renderSection = (section, sectionName, fieldTypeMasterData, selectedField, t, onFieldClick, data) => {
  if (!section || section.length === 0) return null;

  // Handle body structure: body[0].fields[] or footer: footer[]
  let fieldsToRender = [];

  if (sectionName === "body") {
    // Body has nested structure: body[0].fields[]
    section.forEach((card) => {
      if (card.fields && Array.isArray(card.fields)) {
        fieldsToRender = [...fieldsToRender, ...card.fields];
      }
    });
  } else {
    // Footer has direct structure: footer[]
    fieldsToRender = section;
  }

  if (fieldsToRender.length === 0) return null;

  return (
    <>
      {fieldsToRender
        .filter((field) => !field.hidden)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((field, index) => {
          // Ensure field has an id
          const fieldWithId = {
            ...field,
            id: field.id || `${sectionName}-${field.componentName || field.format}-${index}`,
          };
          return renderTemplateComponent(fieldWithId, fieldTypeMasterData, selectedField, t, onFieldClick, data, sectionName, index);
        })}
    </>
  );
};

/**
 * Main NewLayoutRenderer Component
 * Renders template-based layouts with components fetched from ComponentRegistryService
 */
const NewLayoutRenderer = ({ data = {}, selectedField, t, onFieldClick }) => {
  // Get field type master data from Redux
  console.log("fields in  data in new layout renderer", data);
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  const fieldTypeMasterData = byName?.fieldTypeMappingConfig || [];

  return (
    <MobileBezelFrame>
      <div className="mobile-bezel-child-container">
        <Card className="app-card" style={{}}>
          {/* RENDERING HEADER AND SUB-HEADING */}
          {data?.heading && <CardHeader>{t(data.heading)}</CardHeader>}
          {data?.description && <CardText className="app-preview-sub-heading">{t(data.description)}</CardText>}

          {/* RENDERING BODY */}
          {data?.body && renderSection(data.body, "body", fieldTypeMasterData, selectedField, t, onFieldClick, data)}

          {/* RENDERING FOOTER */}
          {data?.footer?.length > 0 &&
            data.footer.map((footer_item, index) => (
              <Button
                key={index}
                className="app-preview-action-button"
                variation="primary"
                label={t(footer_item?.label)}
                title={t(footer_item?.label)}
                onClick={() => {}}
              />
            ))}
        </Card>
      </div>
    </MobileBezelFrame>
  );
};

export default NewLayoutRenderer;
