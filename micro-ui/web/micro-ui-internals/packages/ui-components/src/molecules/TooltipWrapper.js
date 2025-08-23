import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Tooltip from "../atoms/Tooltip";

const TooltipWrapper = ({
  children,
  arrow = false,
  content,
  placement = "bottom",
  enterDelay = 100,
  leaveDelay = 0,
  followCursor = false,
  open: openProp,
  disableFocusListener = false,
  disableHoverListener = false,
  disableInteractive = false,
  disableTouchListener = false,
  onOpen,
  onClose,
  style,
  wrapperClassName,
  ClassName,
  header,
  description,
  theme,
  ...props
}) => {
  const [open, setOpen] = useState(openProp || false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const timeout = useRef(null);
  const tooltipRef = useRef(null);

  const showTooltip = () => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setOpen(true);
      if (onOpen) onOpen();
    }, enterDelay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setOpen(false);
      if (onClose) onClose();
    }, leaveDelay);
  };

  const handleMouseEnter = (event) => {
    if (!disableHoverListener) {
      showTooltip();
      if (followCursor) {
        setTooltipStyle({
          top: event.clientY,
          left: event.clientX,
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (!disableHoverListener) {
      hideTooltip();
    }
  };

  const handleFocus = () => {
    if (!disableFocusListener) {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (!disableFocusListener) {
      hideTooltip();
    }
  };

  const handleTouchStart = () => {
    if (!disableTouchListener) {
      showTooltip();
    }
  };

  const handleTouchEnd = () => {
    if (!disableTouchListener) {
      hideTooltip();
    }
  };

  useEffect(() => {
    if (followCursor) {
      const handleMouseMove = (event) => {
        setTooltipStyle({
          top: event.clientY,
          left: event.clientX,
        });
      };
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [followCursor]);

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  return (
    <div
      className={`tooltip-wrapper ${wrapperClassName || ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tooltipRef={tooltipRef}
      {...props}
    >
      {children}
      {open && (
        <Tooltip
          content={content}
          placement={placement}
          arrow={arrow}
          style={{ ...style, ...tooltipStyle }}
          className={ClassName}
          header={header}
          description={description}
          theme={theme}
        />
      )}
    </div>
  );
};

TooltipWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  arrow: PropTypes.bool,
  title: PropTypes.node.isRequired,
  placement: PropTypes.oneOf([
    "bottom",
    "bottom-end",
    "bottom-start",
    "left",
    "right",
    "top",
    "top-end",
    "top-start",
    "left-end",
    "left-start",
    "right-end",
    "right-start",
  ]),
  enterDelay: PropTypes.number,
  leaveDelay: PropTypes.number,
  followCursor: PropTypes.bool,
  open: PropTypes.bool,
  disableFocusListener: PropTypes.bool,
  disableHoverListener: PropTypes.bool,
  disableInteractive: PropTypes.bool,
  disableTouchListener: PropTypes.bool,
  onOpen: PropTypes.func,
  style: PropTypes.object,
  onClose: PropTypes.func,
};

TooltipWrapper.defaultProps = {
  arrow: true,
};

export default TooltipWrapper;
