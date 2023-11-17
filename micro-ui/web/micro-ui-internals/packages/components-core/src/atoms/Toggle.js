import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Toggle = (props) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("props.selectedoption");

  useEffect(() => {
    setSelected(props.selectedOption);
  }, [props.selectedOption]);

  function toggleOption(option) {
    const updatedSelection = selected === option ? null : option;
    setSelected(updatedSelection);
    props.onSelect(updatedSelection);
  }
  return (
    <div style={props?.style} className={`digit-toggle-toolbar ${props?.additionalWrapperClass ? props?.additionalWrapperClass : ""}`}>
      {props?.options?.map((option, ind) => (
        <div className={`toggle-option-container ${props?.disabled ? "disabled" : ""}`} key={ind}>
          <div className="digit-toggle-btn-wrap">
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
            <label className="digit-toggle-label">{t(option[props.optionsKey])}</label>
          </div>
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