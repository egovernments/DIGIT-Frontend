import React from "react";
import { SVG } from "@egovernments/digit-ui-components";

// Configs use Flutter Material icon names; alias the ones the web SVG library lacks
// to their closest available equivalent so the preview matches the app.
const ICON_ALIASES = {
  CameraAltRounded: "CameraEnhance",
  PermScanWifi: "Wifi",
};

const IconTemplate = ({ field, t }) => {
  const rawIconName = field?.value || "Home";
  const iconName = SVG[rawIconName] ? rawIconName : ICON_ALIASES[rawIconName] || rawIconName;
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
