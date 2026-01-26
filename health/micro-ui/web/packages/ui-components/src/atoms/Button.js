import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import StringManipulator from "./StringManipulator";
import Menu from "./Menu";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";

const Button = (props) => {
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const actionRef = useRef(null);
 // Fixed: Handle non-string labels safely
  const getFieldId = () => {
    if (props?.id) return props.id;
    
    const labelForId = typeof props?.label === 'string' ? props.label : null;
    const classNameForId = typeof props?.className === 'string' ? props.className : null;
    
    if (labelForId && Digit?.Utils?.getFieldIdName) {
      return Digit.Utils.getFieldIdName(labelForId);
    }
    if (classNameForId && Digit?.Utils?.getFieldIdName) {
      return Digit.Utils.getFieldIdName(classNameForId);
    }
    return "button";
  };
  
  const fieldId = getFieldId();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef?.current && !actionRef?.current.contains(event.target)) {
        setDropdownStatus(false);
      }
    };

    if (dropdownStatus) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownStatus]);

  const diabledIconColor = Colors.lightTheme.text.disabled;
  const iconColor = Colors.lightTheme.primary[1];
  const primaryIconColor = Colors.lightTheme.paper.primary;

  //To render the icon
  const IconRender = () => {
    const iconFill = props.iconFill
      ? props.iconFill
      : props?.variation === "primary"
      ? primaryIconColor
      : props?.isDisabled
      ? diabledIconColor
      : iconColor;
    const iconReq =
      props?.type === "actionButton" &&
      props?.showBottom &&
      dropdownStatus &&
      !props.icon
        ? "ArrowDropUp"
        : props?.type === "actionButton" &&
          props?.showBottom &&
          !dropdownStatus &&
          !props?.icon
        ? "ArrowDropDown"
        : props?.type === "actionButton" &&
          !props?.showBottom &&
          dropdownStatus &&
          !props.icon
        ? "ArrowDropDown"
        : props?.type === "actionButton" &&
          !props?.showBottom &&
          !dropdownStatus &&
          !props?.icon
        ? "ArrowDropUp"
        : props?.icon;
    let width, height;

    if (props.size === "large") {
      width = props.variation === "link" ? "1.25rem" : "1.5rem";
      height = props.variation === "link" ? "1.25rem" : "1.5rem";
    } else if (props.size === "medium") {
      width = "1.25rem";
      height = "1.25rem";
    } else if (props.size === "small") {
      width = "0.875rem";
      height = "0.875rem";
    } else {
      width = "1.5rem";
      height = "1.5rem";
    }
    return iconRender(
      iconReq,
      iconFill,
      width,
      height,
      `digit-button-customIcon ${props?.size ? props?.size : ""} ${
        props?.variation ? props?.variation : ""
      }`
    );
  };

  const icon = IconRender();

  const formattedLabel = React.isValidElement(props?.label)
  ? props?.label  // If it's a React element, render it as-is
  : props?.label
    ? props?.variation === "link"
      ? props?.label
      : StringManipulator(
          "CAPITALIZEFIRSTLETTER",
          StringManipulator("TRUNCATESTRING", String(props?.label), {
            maxLength: 64,
          })
        )
    : "";

  const handleActionButtonClick = (e) => {
    e.stopPropagation();
    setDropdownStatus(!dropdownStatus);
  };

  const buttonElement = (
    <button
      ref={props?.ref}
      className={`digit-button-${
        props?.variation ? props?.variation : "default"
      } ${props?.size ? props?.size : "large"} ${
        props?.className ? props?.className : ""
      } ${props?.isDisabled ? "disabled" : ""}`}
      type={props?.submit ? "submit" : props?.type || "button"}
      form={props.formId}
      onClick={
        props?.type === "actionButton"
          ? (e) => handleActionButtonClick(e)
          : props?.onClick
      }
      id={fieldId}
      disabled={props?.isDisabled || null}
      title={props?.title || ""}
      style={props.style ? props.style : null}
    >
      <div
        id={`${fieldId}-content`}
        className={`icon-label-container ${
          props?.variation ? props?.variation : ""
        } ${props?.size ? props?.size : ""}`}
      >
        {!props?.isSuffix && props?.icon && icon}
        <h2 style={{ ...props?.textStyles }} className="digit-button-label">
          {formattedLabel}
        </h2>
        {props?.isSuffix && props?.icon && icon}
        {props?.type === "actionButton" &&
          !props?.hideDefaultActionIcon &&
          !props?.icon &&
          icon}
      </div>
    </button>
  );

  return props?.type === "actionButton" ? (
    <div className={`digit-action-button-wrapper ${props?.wrapperClassName}`} style={props?.wrapperStyles} ref={actionRef}>
      {buttonElement}
      {dropdownStatus && (
        <div className="header-dropdown-container"  id={props?.id} >
          <Menu
            options={props?.options}
            setDropdownStatus={setDropdownStatus}
            dropdownStatus={dropdownStatus}
            isSearchable={props?.isSearchable}
            optionsKey={props?.optionsKey}
            onSelect={props?.onOptionSelect}
            showBottom={props?.showBottom}
            style={props?.menuStyles}
          />
        </div>
      )}
    </div>
  ) : (
    buttonElement
  );
};

Button.propTypes = {
  isDisabled: PropTypes.bool,
  /**
   * ButtonSelector content
   */
  label: PropTypes.string.isRequired,
  /**
   * button border theme
   */
  variation: PropTypes.string,
  /**
   * button id if any
   */
  id: PropTypes.string,
    /**
   * button icon if any
   */
  icon: PropTypes.string,
  /**
   * click handler
   */
  onClick: PropTypes.func.isRequired,
  /**
   * Custom classname
   */
  className: PropTypes.string,
  /**
   * Custom styles
   */
  style: PropTypes.object,
  /**
   * Custom label style or h2 style
   */
  textStyles: PropTypes.object,
  /**
   * button icon position
   */
  isSuffix: PropTypes.bool,
  /**
   * button size
   */
  size: PropTypes.string,
};

Button.defaultProps = {
  label: "",
  variation: "primary",
  onClick: () => {},
  size: "large",
};

export default Button;
