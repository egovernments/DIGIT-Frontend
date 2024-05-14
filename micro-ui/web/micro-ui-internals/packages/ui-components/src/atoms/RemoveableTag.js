import React from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";

const RemoveableTag = ({ className, text, onClick, extraStyles, disabled = false, isErrorTag }) => {
  const tagStyles = extraStyles && extraStyles.tagStyles ? extraStyles.tagStyles : {};
  const textStyles = extraStyles && extraStyles.textStyles ? extraStyles.textStyles : {};
  const closeIconStyles = extraStyles && extraStyles.closeIconStyles ? extraStyles.closeIconStyles : {};

  return (
    <div className={`digit-tag ${isErrorTag ? "errortag" : ""} ${className ? className : ""}`} style={tagStyles}>
      <span className="digit-text" style={textStyles}>
        {text}
      </span>
      <span onClick={disabled ? null : onClick} className="close-icon">
        <SVG.Close fill="#FFFFFF" className="close" style={closeIconStyles} />
      </span>
    </div>
  );
};

RemoveableTag.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  extraStyles: PropTypes.shape({
    tagStyles: PropTypes.object,
    textStyles: PropTypes.object,
    closeIconStyles: PropTypes.object,
  }),
  disabled: PropTypes.bool,
};

export default RemoveableTag;
