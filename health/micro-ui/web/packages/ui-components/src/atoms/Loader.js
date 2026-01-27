import React from "react";
import PropTypes from "prop-types";
import Animation from "./Animation";
import { useTranslation } from "react-i18next";
import theLoaderPrimary2 from "../constants/animations/theLoaderPrimary2.json";
import theLoaderWhite from "../constants/animations/theLoaderWhite.json";

const Loader = ({
  variant,
  className,
  style,
  loaderText,
  animationStyles,
}) => {
  const { t } = useTranslation();

  const renderLoader = () => {
    const commonProps = {
      loop: animationStyles?.noLoop !== true,
      autoplay: animationStyles?.noAutoplay !== true,
      width: animationStyles?.width || "6.25rem",
      height: animationStyles?.height || "6.25rem",
      animationData:
      animationStyles?.animationData !== undefined && animationStyles?.animationData !== null
        ? animationStyles.animationData
        : variant === "OverlayLoader"
        ? theLoaderWhite
        : theLoaderPrimary2,    
    };

    return <Animation {...commonProps} />;
  };

  return (
    <div
      className={`digit-loader-new ${variant || ""} ${className || ""}`}
      style={style || {}}
      role="status"
      aria-live="polite"
    >
      {renderLoader()}
      {loaderText && (
        <div className={`digit-loader-text ${className || ""}`}>
          {`${t(loaderText)}...`}
        </div>
      )}
    </div>
  );
};

Loader.propTypes = {
  /** custom class */
  className: PropTypes.string,
  /** variant */
  variant: PropTypes.string,
  /** custom loader text */
  loaderText: PropTypes.string,
  /** custom styles */
  style: PropTypes.object,
  /** custom styles for animation */
  animationStyles: PropTypes.object,
};

export default Loader;