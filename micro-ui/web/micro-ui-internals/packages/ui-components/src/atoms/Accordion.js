import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SVG } from "./SVG";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";
import { Spacers } from "../constants/spacers/spacers";
import Divider from "./Divider";
import StringManipulator from "./StringManipulator";

const Accordion = ({
  title,
  children,
  icon,
  iconFill,
  iconWidth,
  iconHeight,
  number,
  isOpenInitially,
  onToggle,
  customClassName,
  customStyles,
  hideCardBorder,
  hideDivider,
  hideCardBg,
  hideBorderRadius,
  isClosed,
  isChild
}) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  const iconColor = Colors.lightTheme.primary[1];
  const toggleIconColor = Colors.lightTheme.text.primary;
  const toggleiconSize = Spacers.spacer6;
  const iconSize = Spacers.spacer6;

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
    onToggle && onToggle(!isOpen);
  };

  useEffect(() => {
    if (isClosed !== undefined && isClosed) {
      setIsOpen(false);
    }
  }, [isClosed]);

    const contentId = `accordion-panel-${title.replace(/\s+/g, "-").toLowerCase()}`;
    const headerId = `accordion-header-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div
      className={`digit-accordion ${customClassName} ${
        !hideCardBorder ? "border" : ""
      } ${!hideBorderRadius ? "borderRadius" : ""} ${
        !hideCardBg ? "cardBg" : ""
      } ${!hideDivider && isOpen ? "withDivider" : ""} ${
        hideDivider && isOpen ? "no-divider" : ""
      } ${
        isChild ? "nested" : ""
      }`}
      style={customStyles}
    >
      <div
        id={headerId}
        className="digit-accordion-title"
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggleAccordion}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleAccordion();
          }
        }}
      >
        {icon && (
          <div className="digit-accordion-icon">
            {iconRender(
              icon,
              iconFill || iconColor,
              iconWidth || iconSize,
              iconHeight || iconSize,
              `digit-accordion-icon`
            )}
          </div>
        )}
        {number && (
          <div className="digit-accordion-number">
            {number}
            {"."}
          </div>
        )}
        <div className="digit-accordion-header-title">{StringManipulator("TOSENTENCECASE", title)}</div>
        <div
          className={`digit-accordion-toggle ${
            isOpen ? "animate-open" : "animate-close"
          }`}
        >
          <SVG.ArrowBackIos
            fill={toggleIconColor}
            width={toggleiconSize}
            height={toggleiconSize}
          ></SVG.ArrowBackIos>
        </div>
      </div>
      <div
        id={contentId}
        className={`digit-accordion-content ${isOpen ? "open" : ""}`}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconFill: PropTypes.string,
  iconWidth: PropTypes.string,
  iconHeight: PropTypes.string,
  number: PropTypes.node,
  isOpenInitially: PropTypes.bool,
  hideCardBorder: PropTypes.bool,
  hideDivider: PropTypes.bool,
  hideCardBg: PropTypes.bool,
  hideBorderRadius: PropTypes.bool,
  onToggle: PropTypes.func,
  customClassName: PropTypes.string,
  customStyles: PropTypes.object,
  isClosed: PropTypes.bool,
};

Accordion.defaultProps = {
  icon: null,
  number: null,
  isOpenInitially: false,
  customClassName: "",
  customStyles: {},
  hideCardBorder: false,
  hideDivider: false,
  hideCardBg: false,
  hideBorderRadius: false,
  isClosed: false,
};

const AccordionList = ({
  children,
  allowMultipleOpen = true,
  addDivider,
  className,
  styles,
}) => {
  const [openIndex, setOpenIndex] = useState(allowMultipleOpen ? [] : -1);

  const handleToggle = (index) => {
    if (allowMultipleOpen) {
      setOpenIndex((prevState) =>
        prevState?.includes(index)
          ? prevState?.filter((i) => i !== index)
          : [...prevState, index]
      );
    } else {
      setOpenIndex(index === openIndex ? -1 : index);
    }
  };

  useEffect(() => {}, [openIndex]);

  return (
    <div className={`digit-accordion-wrapper ${className}`} style={styles}>
      {React.Children.map(children, (child, index) => (
        <React.Fragment key={index}>
          {React.cloneElement(child, {
            isClosed: allowMultipleOpen
              ? openIndex.length > 0 && !openIndex.includes(index)
              : openIndex !== index,
            onToggle: () => handleToggle(index),
          })}
          {addDivider && index < React.Children.count(children) - 1 && (
            <Divider className="digit-accordion-divider" variant={"small"} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

AccordionList.propTypes = {
  children: PropTypes.node.isRequired,
  allowMultipleOpen: PropTypes.bool,
  addDivider: PropTypes.bool,
  customClassName: PropTypes.string,
  customStyles: PropTypes.object,
};

AccordionList.defaultProps = {
  allowMultipleOpen: true,
  addDivider: false,
  customClassName: "",
  customStyles: {},
};

export { AccordionList, Accordion };
