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
  
  return <IconComponent fill={color} />;
};

export default IconTemplate;
