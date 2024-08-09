import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const TooltipWrapper = ({
  children,
  arrow = false,
  title,
  placement = 'bottom',
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
  ...other
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
    setOpen(openProp);
  }, [openProp]);

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={tooltipRef}
      {...other}
    >
      {children}
      {open && (
        <div
          className={`tooltip-content tooltip-${placement}`}
          style={tooltipStyle}
        >
          {arrow && <div className="tooltip-arrow" />}
          {title}
        </div>
      )}
    </div>
  );
};

TooltipWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  arrow: PropTypes.bool,
  title: PropTypes.node.isRequired,
  placement: PropTypes.oneOf([
    'bottom',
    'bottom-end',
    'bottom-start',
    'left',
    'left-end',
    'left-start',
    'right',
    'right-end',
    'right-start',
    'top',
    'top-end',
    'top-start',
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
  onClose: PropTypes.func,
};

export default TooltipWrapper;
