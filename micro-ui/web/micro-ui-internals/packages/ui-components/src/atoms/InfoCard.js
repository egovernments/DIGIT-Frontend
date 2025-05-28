import React, { isValidElement, cloneElement } from "react";
import { SVG } from "./SVG";
import StringManipulator from "./StringManipulator";
import PropTypes from "prop-types";
import { Colors } from "../constants/colors/colorconstants";

const InfoCard = ({ label, text, variant, style, textStyle, additionalElements, inline, className, headerWrapperClassName, headerClassName }) => {

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
    <div className={`digit-infobanner-wrap ${variant || "default"} ${className || ""}`} style={style}>
      <div className={`digit-infobanner-header-wrap ${variant || "default"} ${headerWrapperClassName || ""}`} height="24px">
        {icon}
        <h2 className={`digit-infobanner-header ${headerClassName || ""}`}>{displayedLabel}</h2>
      </div>
      {text && <p style={{ ...textStyle }}>{StringManipulator("TOSENTENCECASE", text)}</p>}
      {hasAdditionalElements && (
        <div className={inline ? "additional-elements-inline" : "additional-elements-column"}>
          {/* {additionalElements.map((element, index) => (
            <div className="individualElement" key={index}>
              {element}
            </div>
          ))} */}
          {additionalElements.map((element, index) => {
            // Case 1: Primitive (string, number, boolean)
            if (typeof element !== 'object' || !isValidElement(element)) {
              return (
                <div className="individualElement" key={index}>
                  {element}
                </div>
              );
            }

            const { type, props } = element;

            // Case 2: <img>
            if (type === 'img') {
              const hasAlt = typeof props.alt === 'string' && props.alt.length > 0;
              return (
                <div className="individualElement" key={index}>
                  {cloneElement(element, {
                    alt: hasAlt ? props.alt : 'Image',
                  })}
                </div>
              );
            }

            // Case 3: Non-semantic but interactive (div/span with onClick)
            const isNonSemantic = ['div', 'span', 'p'].includes(type);
            const isInteractive = typeof props.onClick === 'function';

            if (isNonSemantic && isInteractive) {
              return (
                <div
                  className="individualElement"
                  key={index}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      props.onClick?.(e);
                    }
                  }}
                  aria-label={props['aria-label'] || 'Interactive element'}
                >
                  {element}
                </div>
              );
            }

            // ✅ Case 5: Non-semantic & non-interactive (div/span/p)
            if (isNonSemantic && !isInteractive) {
              return (
                <div className="individualElement" key={index}>
                  {element}
                </div>
              );
            }

            // Case 6: All other elements (semantic and/or custom components)
            return (
              <div className="individualElement" key={index}>
                {element}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

InfoCard.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  variant: PropTypes.string,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  additionalElements: PropTypes.arrayOf(PropTypes.node),
  inline: PropTypes.bool,
};

InfoCard.defaultProps = {
  label: "",
  text: "",
  varinat: "",
  styles: {},
  textStyle: {},
  additionalElements: [],
  inline: false,
};

export default InfoCard;
