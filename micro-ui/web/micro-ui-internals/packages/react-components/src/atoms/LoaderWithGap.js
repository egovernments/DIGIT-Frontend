import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const LoaderWithGap = (props) => {
  const { t } = useTranslation();
  return (
    <div className="bg-loader-with-gap-container">
      <div className="bg-loader">
        <div className="bg-loader-inner" />
      </div>
      <div className="bg-loader-text">{t(props.text || "LOADING")}</div>
    </div>
  );
};

LoaderWithGap.propTypes = {
  /**
   * Text to be shown below the loader
   */
  text: PropTypes.string,
};

LoaderWithGap.defaultProps = {
  text: "LOADING",
};

export default LoaderWithGap;