import React from "react";
import { renderTemplateComponent } from "../helpers/templateRendererHelpers";

const ListViewTemplate = ({ field, t, fieldTypeMasterData, selectedField, onFieldClick, data }) => {
  // Get the child component that should be rendered in the list
  const childComponent = field.child;

  // If no child component defined, show placeholder
  if (!childComponent) {
    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <p>ListView: No child component defined</p>
        <small>Add a 'child' property to define what to render in the list</small>
      </div>
    );
  }

  // For preview, just render the child component once
  // This shows what one item in the list would look like
  const childWithId = {
    ...childComponent,
    id: childComponent.fieldName || `${field.id}-child`,
  };

  return (
    <div
      // style={{
      //   display: "flex",
      //   width: "100%",
      //   boxSizing: "border-box",
      //   flexDirection: "column",
      //   gap: field.properties?.gap || "8px",
      //   padding: "8px",
      //   borderRadius: "4px",
      //   backgroundColor: "#ffffffff",
      // }}
    >
      {/* Render the child component */}
      {renderTemplateComponent(childWithId, fieldTypeMasterData, selectedField, t, onFieldClick, data, `listview-${field.id}`, 0)}
    </div>
  );
};

export default ListViewTemplate;
