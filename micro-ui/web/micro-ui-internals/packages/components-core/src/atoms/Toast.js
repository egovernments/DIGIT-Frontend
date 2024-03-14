import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import Button from "./Button";

const Toast = (props) => {
  const [isVisible, setIsVisible] = useState(true);

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
    return () => clearTimeout(timeout);
  }, [props.transitionTime, props.onClose]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const variant = props?.error ? "digit-error" : props?.warning ? "digit-warning" : props?.variant ? props?.variant : "";
  const isWarningButtons = props?.isWarningButtons ? "digit-warning-buttons" : "";

  if (!isVisible) {
    return null;
  }

  if (props.error) {
    return (
      <div className={`digit-toast-success ${variant}`} style={{ ...props.style }}>
        <SVG.Error fill="#FFFFFF" />
        <div style={{ ...props.labelstyle }} className="toast-label">
          {props.label}
        </div>
        <SVG.Close fill="#FFFFFF" className="digit-toast-close-btn" onClick={props.onClose ? props.onClose : handleClose} />
      </div>
    );
  }

  if (props.warning) {
    return (
      <div>
        <div className={`digit-toast-success ${variant} ${isWarningButtons}`} style={{ ...props.style }}>
          {!props?.isWarningButtons ? (
            <>
              <SVG.Warning fill="#FFFFFF" />
              <div className="toast-label" style={{ ...props.labelstyle }}>
                {props.label}
              </div>
              <SVG.Close fill="#FFFFFF" className="digit-toast-close-btn" onClick={props.onClose ? props.onClose : handleClose} />
            </>
          ) : (
            <div className="digit-toast-sub-container">
              <SVG.Error fill="#FFFFFF" />
              <div className="toast-label" style={{ ...props.labelstyle }}>
                {props.label}
              </div>
              {props.isDleteBtn ? (
                <SVG.Close fill="#FFFFFF" className="digit-toast-close-btn" onClick={props.onClose ? props.onClose : handleClose} />
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

  return (
    <div className="digit-toast-success" style={{ ...props.style }}>
      <SVG.CheckCircle fill="#FFFFFF" />
      <div className="toast-label" style={{ ...props.labelstyle }}>
        {props.label}
      </div>
      <SVG.Close fill="#FFFFFF" className="digit-toast-close-btn" onClick={props.onClose ? props.onClose : handleClose} />
    </div>
  );
};

Toast.propTypes = {
  label: PropTypes.string,
  onClose: PropTypes.func,
  isDleteBtn: PropTypes.bool,
  transitionTime: PropTypes.number,
};

Toast.defaultProps = {
  label: "",
  onClose: undefined,
  isDleteBtn: false,
};

export default Toast;
