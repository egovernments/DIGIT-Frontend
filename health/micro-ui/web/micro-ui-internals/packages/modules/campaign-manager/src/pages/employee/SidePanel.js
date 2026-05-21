import React, { useEffect, useState, useRef, Fragment } from "react";
import PropTypes from "prop-types";
import { SVG } from "@egovernments/digit-ui-components";

const Colors = {
  lightTheme: {
    primary: {
      1: "#C84C0E",
      2: "#0B4B66",
      bg: "#FBEEE8",
    },
    text: {
      primary: "#363636",
      secondary: "#787878",
      disabled: "#C5C5C5",
    },
    alert: {
      error: "#B91900",
      errorbg: "#FFF5F4",
      success: "#00703C",
      successbg: "#F1FFF8",
      warning: "#9E5F00",
      warningbg: "#FFF9F0",
      info: "#0057BD",
      infobg: "#DEEFFF",
    },
    generic: {
      background: "#EEEEEE",
      divider: "#D6D5D4",
      inputBorder: "#505A5F",
    },
    paper: {
      primary: "#FFFFFF",
      secondary: "#FAFAFA",
    },
  },
};
const Spacers = {
  spacer0: "0rem",
  spacer1: "0.25rem",
  spacer2: "0.5rem",
  spacer3: "0.75rem",
  spacer4: "1rem",
  spacer5: "1.25rem",
  spacer6: "1.5rem",
  spacer7: "1.75rem",
  spacer8: "2rem",
  spacer9: "2.25rem",
  spacer10: "2.5rem",
  spacer11: "2.75rem",
  spacer12: "3rem",
};

const SidePanel = ({
  className = "",
  styles = {},
  type = "static",
  position = "right",
  children,
  header,
  footer,
  bgActive = false,
  isOverlay = false,
  isDraggable = false,
  hideArrow,
  hideScrollIcon,
  sections = [],
  defaultOpenWidth,
  defaultClosedWidth,
  addClose,
  closedContents,
  closedSections,
  closedHeader,
  closedFooter,
  transitionDuration,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(defaultOpenWidth || 300);
  const isDragging = useRef(false);

  const iconColor = Colors.lightTheme.text.primary;
  const iconSize = Spacers.spacer8;

  const toggleSlider = () => {
    if (type === "static") return;
    if (isOpen) {
      setIsOpen(false);
      setSliderWidth(defaultClosedWidth || 64);
      return;
    }
    setIsOpen((prevState) => !prevState);
    if (!isOpen) {
      setSliderWidth(defaultOpenWidth);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMouseDown = (e) => {
    if (isDraggable && type === "dynamic" && isOpen) {
      isDragging.current = true;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging.current && sliderRef.current && isOpen) {
      const newWidth = position === "right" ? window.innerWidth - e.clientX : e.clientX;
      setSliderWidth(newWidth > (defaultClosedWidth || 64) ? newWidth : defaultClosedWidth || 64);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {}, [isOpen]);

  return (
    <>
      {!bgActive && <div className="slider-bg-active" />}
      <div
        ref={sliderRef}
        className={`digit-slider-container ${type} ${position} ${isOpen ? "open" : "closed"} ${className} ${isOverlay ? "overlay" : ""}`}
        style={{
          ...styles,
          transition: `width ${transitionDuration || 0.5}s`,
          width: isOpen ? sliderWidth : type === "dynamic" ? defaultClosedWidth || 64 : 0,
        }}
      >
        {type === "dynamic" && (
          <div
            className={`slider-handler ${type || ""} ${position || ""}`}
            onClick={toggleSlider}
            onMouseDown={handleMouseDown}
            style={{ cursor: isDraggable && isOpen ? "ew-resize" : "pointer" }}
          >
            {!hideScrollIcon && <div className="scroll-bar"></div>}
            {!hideArrow && (
              <div className="slider-handler-svg">
                <SVG.ChevronRight
                  width={iconSize}
                  height={iconSize}
                  fill={iconColor}
                  style={{
                    transform: isOpen
                      ? position === "left"
                        ? "rotate(180deg)"
                        : "rotate(0deg)"
                      : position === "left"
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                    transition: "transform 0.3s ease",
                  }}
                ></SVG.ChevronRight>
              </div>
            )}
          </div>
        )}
        <div className={`slider-content`}>
          {header && isOpen && (
            <div className="slider-header">
              {addClose && isOpen && (
                <div className="close-icon" onClick={handleClose}>
                  <SVG.Close width={"1.5rem"} height={"1.5rem"} fill={iconColor} />
                </div>
              )}
              {header}
            </div>
          )}
          {closedHeader && !isOpen && <div className="slider-header">{closedHeader}</div>}
          <div className={`slider-body ${sections && sections.length > 0 ? "with-sections" : ""}`}>
            {isOpen
              ? sections && sections?.length > 0
                ? sections?.map((section, index) => (
                    <div className="section-divider-wrapper">
                      <div key={index} className="slider-section">
                        {section}
                      </div>
                      {index < sections.length - 1 && <div className="section-divider"></div>}
                    </div>
                  ))
                : children
              : sections && sections?.length > 0
              ? closedSections?.map((section, index) => (
                  <div className="section-divider-wrapper">
                    <div key={index} className="slider-section">
                      {section}
                    </div>
                    {index < sections.length - 1 && <div className="section-divider"></div>}
                  </div>
                ))
              : closedContents}
          </div>

          {footer && isOpen && <div className="slider-footer">{footer}</div>}
          {closedFooter && !isOpen && <div className="slider-footer">{closedFooter}</div>}
        </div>
      </div>
    </>
  );
};

SidePanel.propTypes = {
  className: PropTypes.string,
  styles: PropTypes.object,
  type: PropTypes.oneOf(["static", "dynamic"]),
  position: PropTypes.oneOf(["left", "right"]),
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  addClose: PropTypes.bool,
  closedContents: PropTypes.node,
  closedSections: PropTypes.arrayOf(PropTypes.node),
  closedHeader: PropTypes.node,
  closedFooter: PropTypes.node,
  transitionDuration: PropTypes.number,
  bgActive: PropTypes.bool,
  isOverlay: PropTypes.bool,
  isDraggable: PropTypes.bool,
  sections: PropTypes.arrayOf(PropTypes.node),
  hideArrow: PropTypes.bool,
  hideScrollIcon: PropTypes.bool,
  defaultOpenWidth: PropTypes.number,
  defaultClosedWidth: PropTypes.number,
};

export default SidePanel;
