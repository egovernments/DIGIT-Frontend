import React from "react";
import { SVG } from "./SVG";
import PropTypes from "prop-types";

const InfoCard = ({ label, text, variant , style, textStyle,additionalElements,inline}) => {

  const getIconAndLabelByVariant = (variant) => {
    switch (variant) {
      case "warning":
        return { icon: <SVG.Warning fill={"#F19100"} />, defaultLabel: "Warning" };
      case "success":
        return { icon: <SVG.CheckCircle fill={"#00703C"} />, defaultLabel: "Success" };
      case "error":
        return { icon: <SVG.Error fill={"#D4351C"} />, defaultLabel: "Error" };
      default:
        return { icon: <SVG.Info fill={"#3498DB"} />, defaultLabel: "Info" };
    }
  };
  const { icon, defaultLabel } = getIconAndLabelByVariant(variant);

  const hasAdditionalElements = additionalElements && additionalElements.length > 0;

  const displayedLabel = label || defaultLabel;


  return (
    <div className={`digit-info-banner-wrap ${variant ? variant : "default"}`} style={style}>
      <div height="24px">
        {icon}
        <h2>{displayedLabel}</h2>
      </div>
      {text && <p style={{ ...textStyle }}>{text}</p>}
      {hasAdditionalElements && (
        <div className={inline ? 'additional-elements-inline' : 'additional-elements-column'}>
          {additionalElements.map((element, index) => (
            <div className="individualElement" key={index}>{element}</div>
          ))}
        </div>
      )}
    </div>
  );
};

InfoCard.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  variant:PropTypes.string,
  style:PropTypes.object,
  textStyle:PropTypes.object,
  additionalElements: PropTypes.arrayOf(PropTypes.node),
  inline: PropTypes.bool,
};

InfoCard.defaultProps = {
  label: "",
  text:"",
  varinat:"",
  styles:{},
  textStyle:{},
  additionalElements: [],
  inline: false,
};

export default InfoCard;
