import React, { useEffect, useState, useRef,Fragment } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import { Colors } from "../constants/colors/colorconstants";
import { Spacers } from "../constants/spacers/spacers";

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
  onClose = null
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
    onClose ? onClose() : setIsOpen(false);
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
      const newWidth =
        position === "right" ? window.innerWidth - e.clientX : e.clientX;
      setSliderWidth(
        newWidth > (defaultClosedWidth || 64)
          ? newWidth
          : defaultClosedWidth || 64
      );
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
        className={`digit-slider-container ${type} ${position} ${
          isOpen ? "open" : "closed"
        } ${className} ${isOverlay ? "overlay" : ""}`}
        style={{
          ...styles,
          transition: `width ${transitionDuration || 0.5}s`,
          width: isOpen
            ? sliderWidth
            : type === "dynamic"
            ? defaultClosedWidth || 64
            : 0,
        }}
        aria-label={isOpen ? "Side panel expanded" : "Side panel collapsed"}
        aria-expanded={isOpen}
      >
        {type === "dynamic" && (
          <div
            className={`slider-handler ${type || ""} ${position || ""}`}
            onClick={toggleSlider}
            onMouseDown={handleMouseDown}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSlider();
              }
            }}
            style={{ cursor: isDraggable && isOpen ? "ew-resize" : "pointer" }}
            tabIndex={0}
            role="button"
            aria-label={isOpen ? "Collapse side panel" : "Expand side panel"}
            aria-expanded={isOpen}
          >
            {!hideScrollIcon && <div className="scroll-bar" aria-hidden="true"></div>}
            {!hideArrow && (
              <div className="slider-handler-svg" aria-hidden="true">
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
        <div className={`slider-content`} role="region" aria-label="Side panel content">
          {header && isOpen && (
            <div className="slider-header" role="banner">
              {addClose && isOpen && (
                <div 
                  className="close-icon" 
                  onClick={handleClose}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClose();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Close side panel"
                >
                  <SVG.Close
                    width={"1.5rem"}
                    height={"1.5rem"}
                    fill={iconColor}
                  />
                </div>
              )}
              {header}
            </div>
          )}
          {
            closedHeader && !isOpen && (
              <div className="slider-header">
              {closedHeader}
            </div>
            )
          }
          <div
            className={`slider-body ${
              sections && sections.length > 0 ? "with-sections" : ""
            }`}
            role="main"
            aria-label="Side panel body"
          >
            {isOpen
              ? sections && sections?.length > 0
                ? sections?.map((section, index) => (
                    <div className="section-divider-wrapper">
                      <div key={index} className="slider-section" role="region" aria-label={`Section ${index + 1}`}>
                        {section}
                      </div>
                      {index < sections.length - 1 && (
                        <div className="section-divider" role="separator" aria-hidden="true"></div>
                      )}
                    </div>
                  ))
                : children
              : sections && sections?.length > 0
              ? closedSections?.map((section, index) => (
                  <div className="section-divider-wrapper">
                    <div key={index} className="slider-section" role="region" aria-label={`Collapsed section ${index + 1}`}>
                      {section}
                    </div>
                    {index < sections.length - 1 && (
                      <div className="section-divider" aria-hidden="true"></div>
                    )}
                  </div>
                ))
              : closedContents}
          </div>

          {footer && isOpen && <div className="slider-footer" role="contentinfo">{footer}</div>}
          {closedFooter && !isOpen && <div className="slider-footer" role="contentinfo">{closedFooter}</div>}
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
