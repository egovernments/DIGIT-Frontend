import React from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import StringManipulator from "./StringManipulator";
import { useTranslation } from "react-i18next";

const RadioButtons = (props) => {
  const { t: i18nT } = useTranslation();
  const t = props?.t || i18nT;

  var selected = props?.selectedOption;
  function selectOption(value) {
    props.onSelect(value);
  }

  const isAnyPreselected = props?.options?.some(
    (option) => props?.value === option?.code && props?.disabled
  );

  return (
    <div style={props?.style} className={`digit-radio-options-wrap ${props?.alignVertical ? "vertical" : ""} ${props?.additionalWrapperClass ? props?.additionalWrapperClass : ""}`}>
      {props?.options?.map((option, ind) => {
        if (props?.optionsKey && !props?.isDependent) {
          return (
            <div className={`radio-option-container ${props?.disabled ? "disabled" : ""} ${(props?.value === option?.code && props?.disabled) ? "preselected" : ""} ${isAnyPreselected ? "has-preselected" : ""} ${props?.isLabelFirst ? "label-first" : ""}`} key={ind}>
              <span className={`digit-radio-btn-wrap ${props?.disabled ? "disabled" : ""} ${(props?.value === option?.code && props?.disabled) ? "preselected" : ""} ${isAnyPreselected ? "has-preselected" : ""}`}>
                <input
                  className="digit-radio-btn"
                  type="radio"
                  value={option}
                  checked={(selected === option?.code) || (selected?.code === option?.code) || isEqual(selected, option) ? 1 : 0}
                  onChange={() => selectOption(option)}
                  disabled={props?.disabled}
                  name={props?.name}
                  id={props?.id}
                  ref={props?.inputRef}
                />
                <span className="digit-radio-btn-checkmark"></span>
              </span>
              <label style={props?.inputStyle} for={props?.id}>
                {StringManipulator(
                  "TOSENTENCECASE",
                  t(option[props?.optionsKey])
                )}
              </label>
            </div>
          );
        } else if (props?.optionsKey && props?.isDependent) {
          return (
            <div className={`radio-option-container ${props?.disabled ? "disabled" : ""} ${(props?.value === option?.code && props?.disabled) ? "preselected" : ""} ${isAnyPreselected ? "has-preselected" : ""} ${props?.isLabelFirst ? "label-first" : ""}`} key={ind}>
              <span className={`digit-radio-btn-wrap ${props?.disabled ? "disabled" : ""} ${(props?.value === option?.code && props?.disabled) ? "preselected" : ""} ${isAnyPreselected ? "has-preselected" : ""}`}>
                <input
                  className="digit-radio-btn"
                  type="radio"
                  value={option}
                  checked={selected?.code === option?.code ? 1 : 0}
                  onChange={() => selectOption(option)}
                  disabled={props?.disabled}
                  name={props?.name}
                  id={props?.id}
                  ref={props?.inputRef}
                />
                <span className="digit-radio-btn-checkmark"></span>
              </span>
              <label style={props?.inputStyle} for={props?.id}>
                {StringManipulator("TOSENTENCECASE",t(
                  props?.labelKey
                    ? `${props?.labelKey}_${option?.code}`
                    : option?.code
                ))}
              </label>
            </div>
          );
        } else {
          return (
            <div className={`radio-option-container ${props?.disabled ? "disabled" : ""} ${(props?.value === option.code && props?.disabled) ? "preselected" : ""} ${isAnyPreselected ? "has-preselected" : ""} ${props?.isLabelFirst ? "label-first" : ""}`} key={ind}>
              <span className={`digit-radio-btn-wrap ${props?.disabled ? "disabled" : ""} ${(props?.value === option.code && props?.disabled) ? "preselected" : ""} ${isAnyPreselected ? "has-preselected" : ""}`}>
                <input
                  className="digit-radio-btn"
                  type="radio"
                  id={props?.id}
                  value={option}
                  checked={selected === option ? 1 : 0}
                  onChange={() => selectOption(option)}
                  disabled={props?.disabled}
                  name={props?.name}
                  ref={props?.inputRef}
                />
                <span className="digit-radio-btn-checkmark"></span>
              </span>

              <label style={props?.inputStyle} for={props?.id}>
                {StringManipulator("TOSENTENCECASE", t(option))}
              </label>
            </div>
          );
        }
      })}
    </div>
  );
};

RadioButtons.propTypes = {
  selectedOption: PropTypes.any,
  onSelect: PropTypes.func,
  options: PropTypes.any,
  optionsKey: PropTypes.string,
  innerStyles: PropTypes.any,
  style: PropTypes.any,
};

RadioButtons.defaultProps = {};

export default RadioButtons;