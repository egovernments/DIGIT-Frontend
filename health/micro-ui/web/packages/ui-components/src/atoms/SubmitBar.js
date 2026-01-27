import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { iconRender } from "../utils/iconRender";
import { Colors } from "../constants/colors/colorconstants";
import { useButtonId } from "../hoc/ButtonIdentificationContext";
import "./SubmitBar.css"

const SubmitBar = forwardRef((props, ref) => {
  const primaryIconColor = Colors.lightTheme.paper.primary;

  // Generate unique button ID using context-aware hook
  const { id: generatedId, dataAttributes } = useButtonId({
    explicitId: props?.id,
    buttonType: props?.submit ? "submit" : "button",
    buttonName: props?.name || "submit",
  });

  const icon = iconRender(
    props?.icon,
    props?.iconFill || primaryIconColor,
    "1.5rem",
    "1.5rem",
    `digit-button-customIcon`
  );

  return (
    <span className="spanWrapper">
      <button
        ref={ref}
        id={generatedId}
        disabled={props.disabled ? true : false}
        className={`${props.disabled ? `digit-submit-bar ${"disabled"}` : "digit-submit-bar"} ${props.className ? props.className : ""}`}
        type={props.submit ? "submit" : "button"}
        style={{ ...props.style }}
        onClick={props.onSubmit}
        {... props.form ? {form: props.form} : {}}
        {...dataAttributes}
      >
        <div className={`icon-label-container`}>
          {!props?.isSuffix && props?.icon && icon}
          <h2 className="digit-button-label">{props.label}</h2>
          {props?.isSuffix && props?.icon && icon}
        </div>
      </button>
    </span>
  );
});

SubmitBar.propTypes = {
  /**
   * Is it a normal button or submit button?
   */
  submit: PropTypes.any,
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
  /**
   * Explicit ID for the button (optional - auto-generated if not provided)
   */
  id: PropTypes.string,
  /**
   * Semantic name for the button (used in auto-ID generation, not localized)
   */
  name: PropTypes.string,
};

SubmitBar.defaultProps = {};

export default SubmitBar;
