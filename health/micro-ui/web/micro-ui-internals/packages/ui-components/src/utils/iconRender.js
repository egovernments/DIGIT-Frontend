import { CustomSVG } from "../atoms/CustomSVG";

export const iconRender = (iconReq, iconFill, width, height, className) => {
  try {
    const components = require("@egovernments/digit-ui-svg-components");
    const DynamicIcon = components?.[iconReq];
    const svgIcon = CustomSVG?.[iconReq];

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
