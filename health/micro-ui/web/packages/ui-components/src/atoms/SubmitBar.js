import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { iconRender } from "../utils/iconRender";
import { Colors } from "../constants/colors/colorconstants";

const SubmitBar = forwardRef((props, ref) => {
  const primaryIconColor = Colors.lightTheme.paper.primary;
 const fieldId = props?.id||Digit?.Utils?.getFieldIdName?.( props?.label || props?.className || "button")||"NA";

  const icon = iconRender(
    props?.icon,
    props?.iconFill || primaryIconColor,
    "1.5rem",
    "1.5rem",
    `digit-button-customIcon`
  );

  return (
    <button
      ref={ref}
      disabled={props.disabled ? true : false}
      className={`${props.disabled ? `digit-submit-bar ${"disabled"}` : "digit-submit-bar"} ${props.className ? props.className : ""}`}
      type={props.submit ? "submit" : "button"}
      style={{ ...props.style }}
      onClick={props.onSubmit}
      id={fieldId}
      {... props.form ? {form: props.form} : {}}
    >
      <div className={`icon-label-container`}    id={`${fieldId}-content`}>
        {!props?.isSuffix && props?.icon && icon}
        <h2 className="digit-button-label">{props.label}</h2>
        {props?.isSuffix && props?.icon && icon}
      </div>
    </button>
  );
});

SubmitBar.propTypes = {
  /**
   * Is it a normal button or submit button?
   */
  submit: PropTypes.any,
    /**
   * button id if any
   */
  id: PropTypes.string,
  /**
   * style for the button
   */
  style: PropTypes.object,
  /**
   * SubmitButton contents
   */
  label: PropTypes.string,
  /**
   * Optional click handler
   */
  onSubmit: PropTypes.func,
};

SubmitBar.defaultProps = {};

export default SubmitBar;
