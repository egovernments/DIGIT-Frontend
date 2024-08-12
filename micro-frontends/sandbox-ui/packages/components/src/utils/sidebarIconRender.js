export const sidebarIconRender = (iconReq, iconFill, width, height,className) => {
    try {
      const components = require("@egovernments/digit-ui-components");
      const DynamicIcon = components?.[iconReq];
      console.log("name", iconReq);
      if (DynamicIcon) {
        const svgElement = DynamicIcon({
          width: width,
          height: height,
          fill: iconFill,
          className:className,
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
