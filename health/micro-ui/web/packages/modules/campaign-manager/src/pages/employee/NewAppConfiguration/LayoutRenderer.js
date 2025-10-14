import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardText,
  Button,
  Switch,
  FieldV1,
  InfoCard,
  PanelCard,
  Tag,
  RoundedLabel,
  CustomSVG,
} from "@egovernments/digit-ui-components";
import MobileBezelFrame from "../../../components/MobileBezelFrame";
// Template Component Implementations
const SearchBarComponent = ({ field, t }) => (
  <FieldV1
    onChange={() => {}}
    placeholder={t(field?.innerLabel) || "Search..."}
    type="search"
    value={field?.value || ""}
    populators={{
      fieldPairClassName: "app-preview-field-pair",
    }}
  />
);
const FilterComponent = ({ field, t }) => {
  const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.250666 1.61C2.27067 4.2 6.00067 9 6.00067 9V15C6.00067 15.55 6.45067 16 7.00067 16H9.00067C9.55067 16 10.0007 15.55 10.0007 15V9C10.0007 9 13.7207 4.2 15.7407 1.61C16.2507 0.95 15.7807 0 14.9507 0H1.04067C0.210666 0 -0.259334 0.95 0.250666 1.61Z"
        fill="#C84C0E"
      />
    </svg>
  );
  return (
    <div
      className="digit-search-action"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        backgroundColor: "#fff",
        cursor: "pointer",
        fontSize: "14px",
        width: "100%",
      }}
    >
      <FilterIcon />
      <span className="digit-search-text">{t(field?.label) || "Filter"}</span>
      {field?.value && Array.isArray(field.value) && field.value.length > 0 && <RoundedLabel count={field.value.length} />}
    </div>
  );
};
const SwitchComponent = ({ field, t }) => (
  <Switch label={t(field?.label) || "Toggle"} onToggle={() => {}} isCheckedInitially={field?.value || false} shapeOnOff />
);
const ButtonComponent = ({ field, t, fieldTypeConfig }) => {
  // Get icon component if specified
  const iconName = field?.additionalProps?.icon;
  let IconComponent = null;

  if (iconName) {
    // Direct icon name mapping - the CustomSVG component expects these exact names
    // Based on common DIGIT UI patterns
    IconComponent = () => <CustomSVG name={iconName} />;
  }
  return (
    <Button
      variation={field?.additionalProps?.variation || "primary"}
      label={t(field?.label) || "Button"}
      onClick={() => {}}
      className="app-preview-action-button"
      icon={IconComponent}
    />
  );
};
const PanelCardComponent = ({ field, t, fieldTypeConfig }) => {
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
const CardComponent = ({ field, t, fieldTypeConfig }) => {
  const cardConfig = fieldTypeConfig?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "card");
  const cardTypes = cardConfig?.properties?.find((p) => p.code === "cardType")?.options || ["primary", "secondary"];
  const cardType = field?.additionalProps?.cardType || cardTypes[0];
  return (
    <Card
      className={`card-type-${cardType}`}
      style={{
        padding: "16px",
        marginBottom: "8px",
        border: cardType === "secondary" ? "1px solid #e0e0e0" : "none",
        boxShadow: cardType === "primary" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {field?.label && <div style={{ fontWeight: "500", marginBottom: "8px" }}>{t(field.label)}</div>}
      <div>{field?.value || "Card content"}</div>
    </Card>
  );
};
const InfoCardComponent = ({ field, t, fieldTypeConfig }) => {
  const infoConfig = fieldTypeConfig?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "infoCard");
  const infoTypes = infoConfig?.properties?.find((p) => p.code === "infoCardType")?.options || ["info"];
  const infoType = field?.additionalProps?.infoCardType || infoTypes[0];
  const variantMap = {
    info: "default",
    success: "success",
    error: "error",
    warning: "warning",
  };
  return (
    <InfoCard
      populators={{
        name: field?.componentName || "infocard",
      }}
      variant={variantMap[infoType] || "default"}
      text={field?.value || "Information message"}
      label={field?.label ? t(field.label) : undefined}
      style={{ marginBottom: "8px" }}
    />
  );
};
const TagComponent = ({ field, t, fieldTypeConfig }) => {
  const tagConfig = fieldTypeConfig?.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === "tag");
  const tagTypes = tagConfig?.properties?.find((p) => p.code === "tagType")?.options || ["monochrome"];
  const tagType = field?.additionalProps?.tagType || tagTypes[0];
  const variantMap = {
    success: "success",
    error: "error",
    warning: "warning",
    monochrome: "default",
  };
  return <Tag variant={variantMap[tagType] || "default"} label={field?.value || "Tag"} />;
};
// Main LayoutRenderer Component - matching AppPreview signature
const LayoutRenderer = ({ data = {}, selectedField, t, onFieldClick }) => {
  console.log("Rendering LayoutRenderer with data:", data);
  // Get fieldTypeConfig from Redux
  const { byName } = useSelector((state) => state.fieldTypeMaster);
  console.log("Field Type Master byName:", byName);
  const fieldTypeConfig = byName?.fieldTypeMappingConfig || [];
  console.log("Field Type Config:", fieldTypeConfig);
  // Extract template components from fieldTypeConfig
  const templateComponents = useMemo(() => {
    return fieldTypeConfig.filter((item) => item?.metadata?.type === "template");
  }, [fieldTypeConfig]);
  // Build component registry dynamically
  const templateComponentRegistry = useMemo(() => {
    const registry = {
      Column: "Column",
      Row: "Row",
    };
    templateComponents.forEach((component) => {
      const format = component.metadata.format;
      switch (format) {
        case "switch":
          registry[format] = SwitchComponent;
          break;
        case "searchBar":
          registry[format] = SearchBarComponent;
          break;
        case "filter":
          registry[format] = FilterComponent;
          break;
        case "button":
          registry[format] = ButtonComponent;
          break;
        case "panelCard":
          registry[format] = PanelCardComponent;
          break;
        case "card":
          registry[format] = CardComponent;
          break;
        case "infoCard":
          registry[format] = InfoCardComponent;
          break;
        case "tag":
          registry[format] = TagComponent;
          break;
      }
    });
    return registry;
  }, [templateComponents]);
  // Get allowed children for layout components
  const getLayoutChildrenOptions = (layoutType) => {
    const layoutConfig = fieldTypeConfig.find((item) => item?.metadata?.type === "template" && item?.metadata?.format === layoutType);
    return layoutConfig?.properties?.find((p) => p.code === "children")?.options || [];
  };
  // Check if a field is selected - simplified since componentNames are unique
  const isFieldSelected = (field) => {
    if (!selectedField || !field) return false;

    // Primary check: unique componentName (most reliable for template components)
    if (field.componentName && selectedField.componentName) {
      return field.componentName === selectedField.componentName;
    }

    // Fallback: check by id if available
    if (field.id && selectedField.id) {
      return field.id === selectedField.id;
    }

    // Last resort: reference equality
    return field === selectedField;
  };
  // Render individual template component
  const renderTemplateComponent = (field, sectionName, index, depth = 0) => {
    if (!field || field.hidden) return null;
    const componentType = field.format || field.type;
    const isSelected = isFieldSelected(field);
    // Handle Row and Column layout components
    if (componentType === "Row" || componentType === "Column") {
      return renderLayoutComponent(field, sectionName, index, depth);
    }
    // Get the component from registry
    const Component = templateComponentRegistry[componentType];
    if (!Component) {
      console.warn(`Component type "${componentType}" not found in registry`);
      return null;
    }
    // Generate unique key for this component
    const uniqueKey = field.id || field.componentName || `${sectionName}-${componentType}-${index}`;
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
        <Component field={field} t={t} fieldTypeConfig={fieldTypeConfig} />
      </div>
    );
  };
  // Render Row or Column layout components
  const renderLayoutComponent = (field, sectionName, index, depth = 0) => {
    const isRow = field.format === "Row";
    const isSelected = isFieldSelected(field);

    const childrenToRender = field.children || [];
    const allowedChildren = getLayoutChildrenOptions(field.format);

    // Generate unique key for this layout component
    const uniqueKey = field.id || field.componentName || `${sectionName}-${field.format}-${index}`;
    return (
      <div
        key={uniqueKey}
        onClick={(e) => {
          e.stopPropagation();
          onFieldClick && onFieldClick(field, data, null, index, null);
        }}
        style={{
          display: "flex",
          flexDirection: isRow ? "row" : "column",
          gap: "8px",
          border: isSelected ? "2px solid #0B4B66" : "1px dashed #d0d0d0",
          borderRadius: "4px",
          padding: "12px",
          margin: "8px 0",
          backgroundColor: isSelected ? "#f0f8ff" : "rgba(250, 250, 250, 0.5)",
          minHeight: "60px",
          width: "100%",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Layout type indicator */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "8px",
            fontSize: "11px",
            color: "#666",
            backgroundColor: "#fff",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid #d0d0d0",
            fontWeight: "500",
          }}
        >
          {isRow ? "↔ Row" : "↕ Column"}
          {allowedChildren.length > 0 && (
            <span style={{ fontSize: "10px", marginLeft: "4px", color: "#999" }}>({allowedChildren.length} types)</span>
          )}
        </div>
        {/* Render children components */}
        {childrenToRender.length > 0 ? (
          childrenToRender.map((child, childIndex) => {
            if (isRow) {
              return (
                <div key={`${uniqueKey}-child-${childIndex}`} style={{ flex: 1 }}>
                  {renderTemplateComponent(child, `${sectionName}-${uniqueKey}`, childIndex, depth + 1)}
                </div>
              );
            }
            return renderTemplateComponent(child, `${sectionName}-${uniqueKey}`, childIndex, depth + 1);
          })
        ) : (
          <div
            style={{
              color: "#999",
              fontSize: "13px",
              textAlign: "center",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40px",
              fontStyle: "italic",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div>Empty {isRow ? "Row" : "Column"}</div>
            {allowedChildren.length > 0 && (
              <div style={{ fontSize: "11px", color: "#bbb" }}>
                Can add: {allowedChildren.slice(0, 3).join(", ")}
                {allowedChildren.length > 3 && "..."}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  // Render sections (body, footer)
  const renderSection = (fields, sectionName) => {
    if (!fields || fields.length === 0) return null;
    return (
      <>
        {fields
          .filter((field) => !field.hidden)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((field, index) => {
            // For footer buttons, ensure unique identification
            const fieldWithId = {
              ...field,
              id: field.id || `${sectionName}-${field.componentName || field.format}-${index}`,
            };
            return renderTemplateComponent(fieldWithId, sectionName, index);
          })}
      </>
    );
  };
  return (
    <MobileBezelFrame>
      <div
        className="mobile-bezel-child-container"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        <Card
          className="app-card"
          style={{
            flex: 1,
            overflow: "auto",
            marginBottom: data?.footer?.length > 0 ? "80px" : "0",
          }}
        >
          {/* RENDERING HEADER AND SUB-HEADING */}
          {data.heading && <CardHeader>{t(data.heading)}</CardHeader>}
          {data.description && <CardText className="app-preview-sub-heading">{t(data.description)}</CardText>}

          {/* RENDERING BODY */}
          {data?.body && renderSection(data.body, "body")}
        </Card>
        {/* RENDERING FOOTER - Fixed at bottom */}
        {data?.footer?.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: 60,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              padding: "16px",
              borderTop: "1px solid #e0e0e0",
              boxShadow: "0 -2px 4px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {renderSection(data.footer, "footer")}
          </div>
        )}
      </div>
    </MobileBezelFrame>
  );
};
export default LayoutRenderer;
