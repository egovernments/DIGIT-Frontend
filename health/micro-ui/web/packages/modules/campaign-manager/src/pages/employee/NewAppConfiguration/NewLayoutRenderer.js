import React from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardText, Button } from "@egovernments/digit-ui-components";
import MobileBezelFrame from "../../../components/MobileBezelFrame";
import { isFieldSelected, renderTemplateComponent } from "./helpers/templateRendererHelpers";

/**
 * Render a section (body or footer)
 */
const renderSection = (section, sectionName, fieldTypeMasterData, selectedField, t, onFieldClick, data) => {
  if (!section || section.length === 0) return null;

  return (
    <>
      {section
        .filter((field) => !field.hidden)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((field, index) => {
          // Ensure field has an id for React keys
          const fieldWithId = {
            ...field,
            id: field.id || field.fieldName || `${sectionName}-${field.format}-${index}`,
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
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  const fieldTypeMasterData = byName?.fieldTypeMappingConfig || [];

  return (
    <MobileBezelFrame>
      <div
        className="mobile-bezel-child-container"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#eee",
        }}
      >
        <Card
          className="app-card"
          style={{
            flex: 1,
            boxShadow: "none",
            backgroundColor: "#eee",
            overflow: "auto",
          }}
        >
          {/* HEADER */}
          {data?.heading && <CardHeader>{t(data.heading)}</CardHeader>}
          {data?.description && <CardText className="app-preview-sub-heading">{t(data.description)}</CardText>}

          {/* BODY */}
          {data?.body &&
            data?.body?.[0]?.fields &&
            renderSection(data?.body?.[0]?.fields, "body", fieldTypeMasterData, selectedField, t, onFieldClick, data)}
        </Card>

        {/* FOOTER */}
        {data?.footer?.length > 0 && (
          <div
            style={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "#fff",
              borderTop: "1px solid #e0e0e0",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            {data.footer.map((footerItem, index) => {
              return renderTemplateComponent(footerItem, fieldTypeMasterData, selectedField, t, onFieldClick, data, "footer", index);
            })}
          </div>
        )}
      </div>
    </MobileBezelFrame>
  );
};

export default NewLayoutRenderer;
