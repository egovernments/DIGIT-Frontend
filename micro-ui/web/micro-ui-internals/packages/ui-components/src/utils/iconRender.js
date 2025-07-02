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
      console.warn(`Icon not found, ${iconReq}`);
      return null;
    }
  } catch (error) {
    console.warn(`Icon not found, ${iconReq}`);
    return null;
  }
};
