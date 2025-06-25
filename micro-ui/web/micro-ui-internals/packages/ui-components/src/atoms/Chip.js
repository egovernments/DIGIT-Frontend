import React from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import ErrorMessage from "./ErrorMessage";
import { Colors} from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";

const Chip = ({
  className,
  text,
  onTagClick,
  onClick,
  extraStyles,
  disabled = false,
  isErrorTag,
  error,
  hideClose,
  onErrorClick,
  iconReq
}) => {
  const tagStyles = extraStyles ? extraStyles?.tagStyles : {};
  const textStyles = extraStyles ? extraStyles?.textStyles : {};
  const closeIconStyles = extraStyles ? extraStyles?.closeIconStyles : {};
  const IconColor = Colors.lightTheme.paper.primary;

  const IconRender = (iconReq,isErrorTag) => {
    const iconFill = isErrorTag ? "#B91900" : "#787878";
    return iconRender(
      iconReq,
      iconFill,
      "1.25rem",
      "1.25rem",
      ""
    );
  };

  return (
    <div
      className={`digit-tag-error-container ${
        !disabled && onTagClick ? "cp" : ""
      }`}
      onClick={disabled ? null : onTagClick}
    >
      <div
        className={`digit-tag ${isErrorTag ? "errortag" : ""} ${hideClose ? "noClose" : ""} ${!iconReq ? "noIcon" : ""} ${onTagClick || onClick ? "clickable" : ""} ${
          className ? className : ""
        }`}
        style={tagStyles}
      >
        {iconReq && IconRender(iconReq,isErrorTag)}
        <span className="digit-text" style={textStyles}>
          {text}
        </span>
        {
          !hideClose &&         <span
          onClick={disabled ? null : onClick}
          className={`close-icon ${disabled ? "disabled" : ""} ${hideClose ? "hideClose" : ""}`}
        >
          <SVG.Close
            fill={IconColor}
            className="close"
            style={closeIconStyles}
          />
        </span>
        }
      </div>
      {error && (
        <div
          className={`${onErrorClick ? "cp" : "nonclickable"}`}
          onClick={onErrorClick}
        >
          <ErrorMessage
            message={error}
            truncateMessage={true}
            maxLength={256}
            className="digit-tag-error-message"
            wrapperClassName="digit-tag-error"
            showIcon={true}
          />
        </div>
      )}
    </div>
  );
};

Chip.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  extraStyles: PropTypes.shape({
    tagStyles: PropTypes.object,
    textStyles: PropTypes.object,
    closeIconStyles: PropTypes.object,
  }),
  disabled: PropTypes.bool,
  isErrorTag: PropTypes.bool,
  error: PropTypes.string,
  hideClose:PropTypes.bool
};


Chip.defaultProps = {
  hideClose:true
};


export default Chip;
