import React from "react";
import PropTypes from "prop-types";

const TextBlock = ({
  wrapperClassName,
  headerContentClassName,
  caption,
  captionClassName,
  header,
  headerClasName,
  subHeader,
  subHeaderClasName,
  body,
  bodyClasName,
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
            <div className={`digit-text-block-header ${headerClasName}`}>
              {header}
            </div>
          )}
          {subHeader && (
            <div className={`digit-text-block-subheader ${subHeaderClasName}`}>
              {subHeader}
            </div>
          )}
        </div>
      )}
      {body && (
        <div className={`digit-text-block-body ${bodyClasName}`}>{body}</div>
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
  headerClasName: PropTypes.string,
  subHeader: PropTypes.string,
  subHeaderClasName: PropTypes.string,
  body: PropTypes.string,
  bodyClasName: PropTypes.string,
};

TextBlock.defaultProps = {
  wrapperClassName: "",
  headerContentClassName: "",
  caption: "",
  captionClassName: "",
  header: "",
  headerClasName: "",
  subHeader: "",
  subHeaderClasName: "",
  body: "",
  bodyClasName: "",
};

export default TextBlock;
