import React, { useState, useEffect } from "react";
import { SVG } from "./SVG";
import PropTypes from "prop-types";
import Animation from "./Animation";
import successAnimation from "../constants/animations/success.json";
import errorAnimation from "../constants/animations/error.json";
import { Colors} from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";

const Panels = (props) => {

  const primaryColor = Colors.lightTheme.paper.primary;

  const useDeviceType = () => {
    const [deviceType, setDeviceType] = useState("desktop");
  
    useEffect(() => {
      const updateDeviceType = () => {
        const width = window.innerWidth;
        if (width <= 480) {
          setDeviceType("mobile");
        } else if (width > 481 && width <= 768) {
          setDeviceType("tablet");
        } else {
          setDeviceType("desktop");
        }
      };
  
      updateDeviceType();
      window.addEventListener("resize", updateDeviceType);
      return () => window.removeEventListener("resize", updateDeviceType);
    }, []);
  
    return deviceType;
  };

  const deviceType = useDeviceType();
  
  const getAnimationDimensions = () => {
    if (props?.animationProps?.width && props?.animationProps?.height) {
      return {
        width: props.animationProps.width,
        height: props.animationProps.height,
      };
    }
    if(props?.type === "success" && !props?.showAsSvg){
      switch (deviceType) {
        case "mobile":
          return { width: 80, height: 80 };
        case "tablet":
          return { width: 100, height: 100 };
        case "desktop":
        default:
          return { width: 120, height: 120 };
      }
    }
    switch (deviceType) {
      case "mobile":
        return { width: 56, height: 56 };
      case "tablet":
        return { width: 64, height: 64 };
      case "desktop":
      default:
        return { width: 74, height: 74 };
    }
  };

  const { width, height } = getAnimationDimensions();

  const IconRender = (iconReq, iconFill) => {
    const fill = iconFill || primaryColor;
    return iconRender(
      iconReq,
      fill,
      width,
      height,
      "digit-panel-customIcon"
    );
  };

  const icon = IconRender(props?.customIcon, props?.iconFill);


  return (
    <div
      className={`digit-panel-wrapper ${
        props?.className ? props?.className : ""
      } ${props?.type ? props?.type : ""} ${props?.showAsSvg ? "with-svg" : ""}`}
      style={props?.style}
    >
      <div className={`digit-panel-message-wrapper ${props?.type || ""} ${props?.showAsSvg ? "with-svg" : ""}`}>
        {props?.type === "success" ? (
          props?.customIcon ? (
            icon
          ) : props?.showAsSvg ? (
            <SVG.CheckCircleOutline
              fill={primaryColor}
              width={width}
              height={height}
            ></SVG.CheckCircleOutline>
          ) : (
            <Animation
              animationData={successAnimation}
              width={width}
              height={width}
              loop={props?.animationProps?.loop === true ? true : false}
              autoplay={props?.animationProps?.noAutoplay === true ? false : true}
            ></Animation>
          )
        ) : props?.customIcon ? (
          icon
        ) : props?.showAsSvg ? (
          <SVG.ErrorOutline
            fill={primaryColor}
            width={width}
            height={height}
          ></SVG.ErrorOutline>
        ) : (
          <Animation
            animationData={errorAnimation}
            width={width}
            height={height}
            loop={props?.animationProps?.loop === true ? true : false}
            autoplay={props?.animationProps?.noAutoplay === true ? false : true}
          ></Animation>
        )}
        <div className="digit-panel-message">{props?.message}</div>
      </div>
      <div className="digit-panel-info-wrapper">
        <div className="digit-panel-info">{props?.info}</div>
        <div className="digit-panel-response">{props?.response}</div>
        {props?.multipleResponses && (
          <div className="digit-panel-multiple-responses">
            {props?.multipleResponses.map((response) => (
              <div className="digit-panel-response">{response}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Panels.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
  info: PropTypes.string,
  response: PropTypes.string,
  customIcon: PropTypes.string,
  iconFill: PropTypes.string,
  style: PropTypes.object,
  multipleResponses: PropTypes.array,
  showAsSvg:PropTypes.bool
};

Panels.defaultProps = {
  type: "success",
};

export default Panels;
