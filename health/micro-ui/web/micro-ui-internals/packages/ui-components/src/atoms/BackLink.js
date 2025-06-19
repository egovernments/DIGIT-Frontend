import React, { useEffect, useState } from "react";
import { SVG } from "./SVG";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Colors } from "../constants/colors/colorconstants";

const BackLink = ({
  style,
  className = "",
  variant,
  onClick,
  hideIcon = false,
  hideLabel = false,
  disabled = false,
  iconFill,
  label = ""
}) => {
  const { t } = useTranslation();

  const [isMobileView, setIsMobileView] = useState(
    window.innerWidth <= 480
  );
  const onResize = () => {
    if (window.innerWidth <= 480) {
      if (!isMobileView) {
        setIsMobileView(true);
      }
    } else {
      if (isMobileView) {
        setIsMobileView(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const disabledIconColor = Colors.lightTheme.text.disabled;
  const enabledIconColor = Colors.lightTheme.primary[2];
  const fillColor = iconFill || (disabled ? disabledIconColor : enabledIconColor);

  const iconSize = isMobileView ? "1.25rem" : "1.5rem";

  const icon = (() => {
    switch (variant) {
      case "primary":
        return (
          <SVG.DoubleArrow
            width={iconSize}
            height={iconSize}
            fill={fillColor}
            style={{ transform: "rotate(180deg)" }}
          />
        );
      case "secondary":
        return (
          <SVG.ArrowCircleDown
            width={iconSize}
            height={iconSize}
            fill={fillColor}
            style={{ transform: "rotate(90deg)" }}
          />
        );
      default:
        return (
          <SVG.ArrowLeft
            width={iconSize}
            height={iconSize}
            fill={fillColor}
          />
        );
    }
  })();

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      onClick?.(e);
    }
  };

  const handleClick = (e) => {
    if (!disabled) onClick?.(e);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={!hideLabel ? t("CS_COMMON_BACK") : "Back"}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`digit-back-link ${className} ${disabled ? "disabled" : ""}`}
      style={style || {}}
    >
      {!hideIcon && <div className="digit-back-link-icon">{icon}</div>}
      {!hideLabel && (
        <div className="digit-back-link-label">
          {t("CS_COMMON_BACK")}
        </div>
      )}
    </div>
  );
};

BackLink.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  variant: PropTypes.string,
  onClick: PropTypes.func,
  iconFill: PropTypes.string
};

export default BackLink;
