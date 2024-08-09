import React from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import ErrorMessage from "./ErrorMessage";
import { Colors} from "../constants/colors/colorconstants";

const Chip = ({
  className,
  text,
  onTagClick,
  onClick,
  extraStyles,
  disabled = false,
  isErrorTag,
  error,
  onErrorClick,
}) => {
  const tagStyles = extraStyles ? extraStyles?.tagStyles : {};
  const textStyles = extraStyles ? extraStyles?.textStyles : {};
  const closeIconStyles = extraStyles ? extraStyles?.closeIconStyles : {};
  const IconColor = Colors.lightTheme.paper.primary;

  return (
    <div
      className={`digit-tag-error-container ${
        !disabled && onTagClick ? "cp" : ""
      }`}
      onClick={disabled ? null : onTagClick}
    >
      <div
        className={`digit-tag ${isErrorTag ? "errortag" : ""} ${
          className ? className : ""
        }`}
        style={tagStyles}
      >
        <span className="digit-text" style={textStyles}>
          {text}
        </span>
        <span
          onClick={disabled ? null : onClick}
          className={`close-icon ${disabled ? "disabled" : ""}`}
        >
          <SVG.Close fill={IconColor} className="close" style={closeIconStyles} />
        </span>
      </div>
      <div className={`${onErrorClick ? "cp" : "nonclickable"}`} onClick={onErrorClick}>
        {error && (
          <ErrorMessage
            message={error}
            truncateMessage={true}
            maxLength={256}
            className="digit-tag-error-message"
            wrapperClassName="digit-tag-error"
            showIcon={true}
          />
        )}
      </div>
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
};

export default Chip;
