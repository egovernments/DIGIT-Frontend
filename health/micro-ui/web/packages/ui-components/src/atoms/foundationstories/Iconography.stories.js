import React from "react";
import * as components from "@egovernments/digit-ui-svg-components";
import { CustomSVG } from "../CustomSVG";

export default {
  title: "Foundations/Iconography",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "16px",
  padding: "16px",
};

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #D6D5D4",
  borderRadius: "8px",
  padding: "16px",
  gap: "8px",
};

const renderIcon = (IconComponent, name) => {
  if (IconComponent) {
    return (
      <div key={name} style={cardStyle}>
        <IconComponent fill="#0B4B66" width="50" height="50" />
        <span className="typography body-l" style={{ color: "#0B4B66" }}>{name}</span>
      </div>
    );
  } else {
    return (
      <div key={name} style={cardStyle}>
        <span style={{ color: "red", fontSize: "14px" }}>Invalid Icon</span>
      </div>
    );
  }
};

export const Iconography = () => {
  const customSvgIcons = Object.entries(CustomSVG);
  const svgIcons = Object.entries(components);

  const allIcons = [...svgIcons, ...customSvgIcons].sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div style={gridStyle}>
      {allIcons.map(([name, IconComponent]) => renderIcon(IconComponent, name))}
    </div>
  );
};
