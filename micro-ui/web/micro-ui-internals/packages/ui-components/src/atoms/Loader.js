import React from "react";
import PropTypes from "prop-types";

export const Loader = ({ page = false }) => {
  return (
    <div className={`digit-${page ? "page" : "module"}-loader`}
      role="status"
      aria-live="polite"
    >
      <div className="digit-loadingio-spinner-rolling-frame">
        <div className="digit-ldio-pjg92h09b2o">
          <div></div>
        </div>
      </div>
    </div>
  );
};

Loader.propTypes = {
  /**
   * Is this is page or a module?
   */
  page: PropTypes.bool,
};

Loader.defaultProps = {
  page: false,
};
