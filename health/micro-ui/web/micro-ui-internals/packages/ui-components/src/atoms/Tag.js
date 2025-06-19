import React from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";

const Tag = ({
  className,
  label,
  style,
  type,
  icon,
  stroke,
  showIcon,
  labelStyle,
  onClick,
  alignment,
  iconClassName,
  iconColor
}) => {
  const MonochromeIconColor = Colors.lightTheme.primary[2];
  const SuccessIconColor = Colors.lightTheme.alert.success;
  const ErrorIconColor = Colors.lightTheme.alert.error;
  const WarningIconColor = Colors.lightTheme.alert.warning;

  let iconToShow;
  if (icon) {
    iconToShow = iconRender(icon,iconColor || MonochromeIconColor, "1rem", "1rem", `digit-tag-customIcon ${iconClassName}`);;
  } else {
    switch (type) {
      case "error":
        iconToShow = (
          <SVG.Error fill={ErrorIconColor} width={"1rem"} height={"1rem"} />
        );
        break;
      case "warning":
        iconToShow = (
          <SVG.Warning fill={WarningIconColor} width={"1rem"} height={"1rem"} />
        );
        break;
      default:
        iconToShow = (
          <SVG.CheckCircle
            fill={type==="success" ? SuccessIconColor : MonochromeIconColor}
            width={"1rem"}
            height={"1rem"}
          />
        );
    }
  }

  return (
    <div
      tabIndex={0}
      className={`digit-tag-wrapper ${className ? className : ""} ${
        type || ""
      } ${stroke ? "stroke" : ""} ${onClick ? "cp" : ""} ${
        alignment ? alignment : ""
      }`}
      style={style}
      onClick={onClick}
      role="button"
      onKeyDown={(e)=>{
        if (e.key=="Enter" || e.key==" "){
          onClick(e)
        }
      }}
    >
      {showIcon && iconToShow}
      <span className="digit-tag-text" style={labelStyle}>
        {label}
      </span>
    </div>
  );
};

Tag.propTypes = {
  className: PropTypes.string,
  iconClassName:PropTypes.string,
  iconColor:PropTypes.string,
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
  stroke: PropTypes.bool,
  type: PropTypes.string,
};

Tag.defaultProps = {
  className: "",
  style: {},
  type: "monochrome",
  stroke: false,
  showIcon: true,
  labelStyle: {},
  alignment: "center",
  iconColor:"",
  iconClassName:""
};

export default Tag;
