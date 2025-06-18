import React from "react";
import { CustomSVG } from "@egovernments/digit-ui-components";

const iconRender = (iconReq, iconFill, width, height, className) => {
  try {
    const components = require("@egovernments/digit-ui-svg-components");
    const DynamicIcon = components?.[iconReq];
    const svgIcon = CustomSVG?.[iconReq];
    const iconProps = { width, height, fill: iconFill, className };
    console.log(DynamicIcon,svgIcon,"ICONS")
    if (DynamicIcon) return <DynamicIcon {...iconProps} />;
    if (svgIcon) return <svgIcon {...iconProps} />;
    return null;
  } catch (error) {
    return null;
  }
};

const iconMap = {
  "arrow-upward": "ArrowUpward",
  "arrow-downward": "ArrowDownward",
  "dss_health_national_households_registered": "Home", 
  "dss_health_population_administered": "PeopleAlt", 
  "dss_health_drugs_administered": "Vector", 
};

const Icon = ({ type = "", iconColor = "#C84C0E", width = 16, height = 16, className = "" }) => {
  const iconKey = iconMap[type.toLowerCase()];
  console.log(type,"type")
  console.log(iconKey,"iconKey")
  if (!iconKey) return null;

  return iconRender(iconKey, iconColor, width, height, className);
};

export default Icon;
