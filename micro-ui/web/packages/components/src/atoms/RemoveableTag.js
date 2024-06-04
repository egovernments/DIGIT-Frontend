import React from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import ErrorMessage from "./ErrorMessage";

const RemoveableTag = ({
  className,
  text,
  onTagClick,
  onClick,
  extraStyles,
  disabled = false,
  isErrorTag,
  error,
}) => {
  const tagStyles = extraStyles ? extraStyles?.tagStyles : {};
  const textStyles = extraStyles ? extraStyles?.textStyles : {};
  const closeIconStyles = extraStyles ? extraStyles?.closeIconStyles : {};

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
          <SVG.Close fill="#FFFFFF" className="close" style={closeIconStyles} />
        </span>
      </div>
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
  isErrorTag: PropTypes.bool,
  error: PropTypes.string,
};

export default RemoveableTag;
