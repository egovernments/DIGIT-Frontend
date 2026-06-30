import React from "react";
import { SVG } from "@egovernments/digit-ui-components";
const IconTemplate = ({ field, t }) => {
  const iconName = field?.value || "Home";
  const color = field?.properties?.color || "#C84C0E";
  
  // Check if icon exists in SVG object, otherwise use default
  const IconComponent = (iconName && SVG[iconName]) ? SVG[iconName] : SVG["Home"];
  
  // Additional safety check
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in SVG library`);
    return null; // or return a fallback UI
  }
  
  const iconStyle = field?.properties?.style;
  const wrapperStyle = field?.properties?.wrapperStyle;

  const icon = <IconComponent style={iconStyle} fill={color} />;

  if (wrapperStyle) {
    return <div className="icon-template-bg-wrapper" style={wrapperStyle}>{icon}</div>;
  }

  return icon;
};

export default IconTemplate;
