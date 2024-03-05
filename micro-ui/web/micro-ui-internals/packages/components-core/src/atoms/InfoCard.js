import React from "react";
import { SVG } from "./SVG";
import PropTypes from "prop-types";

const InfoCard = ({ label, text, variant , style, textStyle,additionalElements}) => {

  const getIconByVariant = (variant) => {
    switch (variant) {
      case "warning":
        return <SVG.Warning fill={"#F19100"}/>;
      case "success":
        return <SVG.CheckCircle fill={"#00703C"} />;
      case "error":
        return <SVG.Error fill={"#D4351C"} />;
      default:
        return <SVG.Info fill={"#3498DB"} />;
    }
  };

  const icon = getIconByVariant(variant);

  return (
    <div className={`digit-info-banner-wrap ${variant ? variant : "default"}`} style={style}>
      <div>
        {icon}
        <h2>{label}</h2>
      </div>
      {text && <p style={{ ...textStyle }}>{text}</p>}
      {additionalElements &&
        additionalElements.map((element, index) => (
          <div key={index}>{element}</div>
        ))}
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
};

InfoCard.defaultProps = {
  label: "",
  text:"",
  varinat:"",
  styles:{},
  textStyle:{},
  additionalElements: [],
};

export default InfoCard;
