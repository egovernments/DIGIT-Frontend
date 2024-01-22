import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Toggle = (props) => {
  const { t } = useTranslation();
  var selected = props.selectedOption ? props.selectedOption : (props.options.length > 0 ? props.options[0].code : null);;

  function toggleOption(option) {
    props.onSelect(option);
  }
  return (
    <div style={props?.style} className={`digit-toggle-toolbar ${props?.additionalWrapperClass ? props?.additionalWrapperClass : ""}`}>
      {props?.options?.map((option, ind) => (
        <div className={`toggle-option-container ${props?.disabled ? "disabled" : ""}`} key={ind}>
          <label className={`digit-toggle-btn-wrap ${selected === option.code ? "checked" : ""}`}>
            <input
              className="digit-toggle-input"
              type="radio"
              name={props.name}
              value={option.code}
              checked={selected === option.code}
              onChange={() => toggleOption(option.code)}
              disabled={props?.disabled}
              ref={props.inputRef}
            />
            <span className="digit-toggle-label">{(t(option[props.optionsKey]))}</span>
          </label>
        </div>
      ))}
    </div>
  );
};

Toggle.propTypes = {
  selectedOption: PropTypes.any,
  onSelect: PropTypes.func,
  options: PropTypes.any,
  optionsKey: PropTypes.string,
  additionalWrapperClass: PropTypes.string,
  disabled: PropTypes.bool,
  inputRef: PropTypes.object,
};

Toggle.defaultProps = {};

export default Toggle;