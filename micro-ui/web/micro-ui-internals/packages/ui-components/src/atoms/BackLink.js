import React,{useEffect,useState} from "react";
import { SVG } from "./SVG";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Colors} from "../constants/colors/colorconstants";

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

  const diabledIconColor = Colors.lightTheme.text.disabled;
  const iconColor = Colors.lightTheme.primary[2];

  const icon =
    variant === "primary" ? (
      <SVG.ArrowLeft
        width={isMobileView ? "1.25rem" : "1.5rem"}
        height={isMobileView ? "1.25rem" : "1.5rem"}
        fill={iconFill ? iconFill : disabled ? diabledIconColor : iconColor}
      ></SVG.ArrowLeft>
    ) : variant === "secondary" ? (
      <SVG.ArrowCircleDown
        width={isMobileView ? "1.25rem" : "1.5rem"}
        height={isMobileView ? "1.25rem" : "1.5rem"}
        fill={iconFill ? iconFill : disabled ? diabledIconColor : iconColor}
        style={{ transform: "rotate(90deg)" }}
      ></SVG.ArrowCircleDown>
    ) : (
      <SVG.DoubleArrow
        width={isMobileView ? "1.25rem" : "1.5rem"}
        height={isMobileView ? "1.25rem" : "1.5rem"}
        fill={iconFill ? iconFill : disabled ? diabledIconColor : iconColor}
        style={{ transform: "rotate(180deg)" }}
      ></SVG.DoubleArrow>
    );
  return (
    <div
      className={`digit-back-link ${className} ${disabled ? "disabled" : ""}`}
      style={style ? style : {}}
      onClick={onClick}
    >
      {!hideIcon && <div className={`digit-back-link-icon`}>{icon}</div>}
      {!hideLabel && (
        <div className={`digit-back-link-label`}>
          {label || t("CS_COMMON_BACK")}
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
};

export default BackLink;
