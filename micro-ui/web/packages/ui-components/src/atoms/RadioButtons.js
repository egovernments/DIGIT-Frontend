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

  // Generate unique ID for tracking (single source of truth)
  // ID Pattern: screenPath + composerType + composerId + sectionId + name + type + optionIndex
  const generateRadioId = (optionIndex, optionCode) => {
    return Digit?.Utils?.generateUniqueId?.({
      screenPath: props?.screenPath || "",
      composerType: props?.composerType || "standalone",
      composerId: props?.composerId || "",
      sectionId: props?.sectionId || "",
      name: props?.name || "radio",
      type: `radio-${optionCode || optionIndex}`,
      id: props?.id ? `${props.id}-${optionIndex}` : ""
    }) || `${props?.name || "radio"}-${optionIndex}`;
  };

  const isAnyPreselected = props?.options?.some(
    (option) => props?.value === option?.code && props?.disabled
  );

  return (
    <div
      style={props?.style}
      className={`digit-radio-options-wrap ${props?.alignVertical ? "vertical" : ""} ${props?.additionalWrapperClass ? props?.additionalWrapperClass : ""}`}
      aria-label={props?.label || "Radio button"}
      aria-describedby={props?.errors?.errorMessage ? "radio-error" : undefined}
      aria-invalid={props?.errors?.errorMessage ? "true" : "false"}
    >
      {props?.options?.map((option, ind) => {
        const uniqueId = generateRadioId(ind, option?.code);
        if (props?.optionsKey && !props?.isDependent) {
          return (
            <div className={`radio-option-container ${props?.disabled ? "disabled" : ""} ${(props?.value === option?.code && props?.disabled) ? "preselected" : ""} ${isAnyPreselected ? "has-preselected" : ""} ${props?.isLabelFirst ? "label-first" : ""}`} key={ind}>
              <span className={`digit-radio-btn-wrap ${props?.disabled ? "disabled" : ""} ${(props?.value === option?.code && props?.disabled) ? "preselected" : ""} ${isAnyPreselected ? "has-preselected" : ""}`}>
                <input
                  className="digit-radio-btn"
                  type="radio"
                  value={option}
                  checked={(selected === option?.code) || isEqual(selected, option) ? 1 : 0}
                  onChange={() => selectOption(option)}
                  disabled={props?.disabled}
                  name={props?.name}
                  id={uniqueId}
                  ref={props?.inputRef}
                  aria-describedby={props?.errors?.errorMessage ? "radio-error" : undefined}
                />
                <span className="digit-radio-btn-checkmark" aria-hidden="true"></span>
              </span>
              <label 
                style={props?.inputStyle} 
                htmlFor={uniqueId}
              >
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
                  id={uniqueId}
                  ref={props?.inputRef}
                  aria-describedby={props?.errors?.errorMessage ? "radio-error" : undefined}
                />
                <span className="digit-radio-btn-checkmark" aria-hidden="true"></span>
              </span>
              <label 
                style={props?.inputStyle} 
                htmlFor={uniqueId}
              >
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
                  id={uniqueId}
                  value={option}
                  checked={selected === option ? 1 : 0}
                  onChange={() => selectOption(option)}
                  disabled={props?.disabled}
                  name={props?.name}
                  ref={props?.inputRef}
                  aria-describedby={props?.errors?.errorMessage ? "radio-error" : undefined}
                />
                <span className="digit-radio-btn-checkmark" aria-hidden="true"></span>
              </span>

              <label 
                style={props?.inputStyle} 
                htmlFor={uniqueId}
              >
                {StringManipulator("TOSENTENCECASE", t(option))}
              </label>
            </div>
          );
        }
      })}
      {props?.errors?.errorMessage && (
        <div id="radio-error" role="alert" aria-live="polite">
          {props.errors.errorMessage}
        </div>
      )}
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