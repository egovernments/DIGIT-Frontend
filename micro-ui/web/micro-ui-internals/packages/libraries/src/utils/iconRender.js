// import { CustomSVG } from "@egovernments/digit-ui-components";

export const iconRender = ({iconName, iconFill, width, height, className,CustomSVG,Components}) => {
  try {
    // const components = require("@egovernments/digit-ui-svg-components");
    const DynamicIcon = Components?.[iconName];
    const svgIcon = CustomSVG?.[iconName];
    if (DynamicIcon) {
      const svgElement = DynamicIcon({
        width: width,
        height: height,
        fill: iconFill,
        className: className,
      });
      return svgElement;
    } else if (svgIcon) {
      const svgElement = svgIcon({
        width: width,
        height: height,
        fill: iconFill,
        className: className,
      });
      return svgElement;
    } else {
      console.error("Icon not found");
      return null;
    }
  } catch (error) {
    console.error("Icon not found");
    return null;
  }
};
