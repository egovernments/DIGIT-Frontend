import React, { useState, useEffect,Fragment } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import Button from "./Button";
import StringManipulator from "./StringManipulator";
import { Colors} from "../constants/colors/colorconstants";

const Toast = (props) => {

  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setIsVisible(false);
        if (props.onClose) {
          props.onClose();
        }
      },
      props?.transitionTime ? props.transitionTime : 5000
    );
    const animateTimeout = setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    return () => {
      clearTimeout(timeout);
      clearTimeout(animateTimeout);
    };
  }, [props.transitionTime, props.onClose]);

  const handleClose = () => {
    setIsVisible(false);
  };

  let variant;
  switch (props?.type) {
    case "success":
      variant = "digit-success";
      break;
    case "error":
      variant = "digit-error";
      break;
    case "warning":
      variant = "digit-warning";
      break;
    case "info":
      variant = "digit-info";
      break;
    default:
      variant = props?.variant || "";
      break;
  }

  const isWarningButtons = props?.isWarningButtons
    ? "digit-warning-buttons"
    : "";

  const sentenceCaseLabel = StringManipulator("TOSENTENCECASE", props.label);
  const color = Colors.lightTheme.paper.primary;

  if (!isVisible) {
    return null;
  }

  if (props?.type === "warning") {
    return (
      <div>
        <div
          className={`digit-toast-success ${
            isVisible && isAnimating ? "animate" : ""
          } ${variant} ${isWarningButtons}`}
          style={{ ...props.style }}
        >
          {!props?.isWarningButtons ? (
            <>
              <SVG.Warning fill={color} />
              <div className="toast-label" style={{ ...props.labelstyle }}>
                {sentenceCaseLabel}
              </div>
              <SVG.Close
                fill={color}
                className="digit-toast-close-btn"
                style={{ cursor: "pointer" }}
                onClick={props.onClose ? props.onClose : handleClose}
              />
            </>
          ) : (
            <div className="digit-toast-sub-container">
              <SVG.Error fill={color} />
              <div className="toast-label" style={{ ...props.labelstyle }}>
                {sentenceCaseLabel}
              </div>
              {props.isDleteBtn ? (
                <SVG.Close
                  fill={color}
                  className="digit-toast-close-btn"
                  style={{ cursor: "pointer" }}
                  onClick={props.onClose ? props.onClose : handleClose}
                />
              ) : null}
            </div>
          )}
          {props?.isWarningButtons ? (
            <div className="digit-warning-button-container">
              <Button theme="border" label={"NO"} onClick={props.onNo} />
              <Button label={"YES"} onClick={props.onYes} />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  const icon =
    props?.type === "error" ? (
      <SVG.Error fill={color} />
    ) : props?.type === "info" ? (
      <SVG.Info fill={color} />
    ) : (
      <SVG.CheckCircle fill={color} />
    );
    
  return (
    <div
      className={`digit-toast-success ${
        isVisible && isAnimating ? "animate" : ""
      } ${variant}`}
      style={{ ...props.style }}
    >
      {icon}
      <div className="toast-label" style={{ ...props.labelstyle }}>
        {sentenceCaseLabel}
      </div>
      <SVG.Close
        fill={color}
        className="digit-toast-close-btn"
        style={{ cursor: "pointer" }}
        onClick={props.onClose ? props.onClose : handleClose}
      />
    </div>
  );
};

Toast.propTypes = {
  label: PropTypes.string,
  onClose: PropTypes.func,
  isDleteBtn: PropTypes.bool,
  transitionTime: PropTypes.number,
  type: PropTypes.string,
};

Toast.defaultProps = {
  label: "",
  onClose: undefined,
  isDleteBtn: false,
};

export default Toast;
