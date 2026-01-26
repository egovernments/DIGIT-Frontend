import React from "react";
import PropTypes from "prop-types";

const TextBlock = ({
  wrapperClassName,
  headerContentClassName,
  caption,
  captionClassName,
  header,
  headerClassName,
  subHeader,
  subHeaderClassName,
  body,
  bodyClassName,
  style
}) => {
  return (
    <div className={`digit-text-block-wrap ${wrapperClassName}`} style={style}>
      {(caption || header || subHeader) && (
        <div
          className={`digit-text-block-header-content ${headerContentClassName}`}
        >
          {caption && (
            <div className={`digit-text-block-caption ${captionClassName}`}>
              {caption}
            </div>
          )}
          {header && (
            <div className={`digit-text-block-header ${headerClassName}`}>
              {header}
            </div>
          )}
          {subHeader && (
            <div className={`digit-text-block-subheader ${subHeaderClassName}`}>
              {subHeader}
            </div>
          )}
        </div>
      )}
      {body && (
        <div className={`digit-text-block-body ${bodyClassName}`}>{body}</div>
      )}
    </div>
  );
};

TextBlock.propTypes = {
  wrapperClassName: PropTypes.string,
  headerContentClassName: PropTypes.string,
  caption: PropTypes.string,
  captionClassName: PropTypes.string,
  header: PropTypes.string,
  headerClassName: PropTypes.string,
  subHeader: PropTypes.string,
  subHeaderClassName: PropTypes.string,
  body: PropTypes.string,
  bodyClassName: PropTypes.string,
};

TextBlock.defaultProps = {
  wrapperClassName: "",
  headerContentClassName: "",
  caption: "",
  captionClassName: "",
  header: "",
  headerClassName: "",
  subHeader: "",
  subHeaderClassName: "",
  body: "",
  bodyClassName: "",
};

export default TextBlock;
