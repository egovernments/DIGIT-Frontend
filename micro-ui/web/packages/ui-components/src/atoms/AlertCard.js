import React from "react";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import PropTypes from "prop-types";
import { Colors} from "../constants/colors/colorconstants";

const AlertCard = ({ label, text, variant, style, textStyle, additionalElements, inline, className, headerWrapperClassName,headerClassName}) => {

  const warningIconColor = Colors.lightTheme.alert.warning;
  const errorIconColor = Colors.lightTheme.alert.error;
  const successIconColor = Colors.lightTheme.alert.success;
  const infoIconColor = Colors.lightTheme.alert.info;


  const getIconAndLabelByVariant = (variant) => {
    switch (variant) {
      case "warning":
        return { icon: <SVG.Warning fill={warningIconColor} />, defaultLabel: "Warning" };
      case "success":
        return { icon: <SVG.CheckCircle fill={successIconColor} />, defaultLabel: "Success" };
      case "error":
        return { icon: <SVG.Error fill={errorIconColor} />, defaultLabel: "Error" };
      default:
        return { icon: <SVG.Info fill={infoIconColor} />, defaultLabel: "Info" };
    }
  };
  const { icon, defaultLabel } = getIconAndLabelByVariant(variant);

  const hasAdditionalElements = additionalElements && additionalElements.length > 0;

  const displayedLabel = StringManipulator("TOTITLECASE", label) || defaultLabel;

  return (
    <div
      className={`digit-infobanner-wrap ${variant || "default"} ${className || ""}`} style={style}
      role="alert"
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <div className={`digit-infobanner-header-wrap ${variant || "default"} ${headerWrapperClassName || ""}`} height="24px">
        {icon}
        <h2 className={`digit-infobanner-header ${headerClassName || ""}`}>{displayedLabel}</h2>
      </div>
      {text && <p style={{ ...textStyle }}>{StringManipulator("TOSENTENCECASE", text)}</p>}
      {hasAdditionalElements && (
        <div className={inline ? "additional-elements-inline" : "additional-elements-column"}>
          {additionalElements.map((element, index) => (
            <div className="individualElement" key={index}>
              {element}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

AlertCard.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  variant: PropTypes.string,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  additionalElements: PropTypes.arrayOf(PropTypes.node),
  inline: PropTypes.bool,
};

AlertCard.defaultProps = {
  label: "",
  text: "",
  varinat: "",
  style: {},
  textStyle: {},
  additionalElements: [],
  inline: false,
};

export default AlertCard;
