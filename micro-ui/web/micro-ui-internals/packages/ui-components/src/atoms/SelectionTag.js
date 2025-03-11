import React, { useState} from "react";
import PropTypes from "prop-types";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";

const SelectionTag = ({
  width,
  errorMessage,
  options,
  onSelectionChanged,
  allowMultipleSelection = true,
  selected,
  withContainer
}) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState(selected || []);

  const handleOptionClick = (option) => {
    const updatedSelections = [...selectedOptions];
    const isSelected = updatedSelections.some(
      (selectedOption) => selectedOption.code === option.code
    );

    if (allowMultipleSelection) {
      if (isSelected) {
        // Remove the option if it's already selected
        const index = updatedSelections.findIndex(
          (selectedOption) => selectedOption.code === option.code
        );
        updatedSelections.splice(index, 1);
      } else {
        updatedSelections.push(option);
      }
    } else {
      if (isSelected) {
        updatedSelections.length = 0; // Clear selection if already selected
      } else {
        updatedSelections.length = 0; // Clear all and select the current option
        updatedSelections.push(option);
      }
    }
    setSelectedOptions(updatedSelections);
    onSelectionChanged(updatedSelections);
  };

  const secondaryIconColor = Colors.lightTheme.generic.inputBorder;
  const primaryIconColor = Colors.lightTheme.paper.primary;

  const IconRender = (iconReq, isActive) => {
    const iconFill = isActive ? primaryIconColor : secondaryIconColor;
    return iconRender(
      iconReq,
      iconFill,
      "1.5rem",
      "1.5rem",
      ""
    );
  };

  const renderOption = (option) => {
    const isSelected = selectedOptions.some(
      (selectedOption) => selectedOption.code === option.code
    );
    return (
      <div
        key={option.code}
        className={`option ${isSelected ? "selected" : ""}`}
        style={{ width }}
        onClick={() => handleOptionClick(option)}
      >
        {option.prefixIcon && (
          <span className="selectiontagicon">
            {IconRender(option?.prefixIcon, isSelected)}
          </span>
        )}
        <span className="selectiontag-option-label">{option.name}</span>
        {option.suffixIcon && (
          <span className="selectiontagicon">
            {IconRender(option?.suffixIcon, isSelected)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="selection-card-container">
      <div className={`selection-card ${errorMessage ? "error" : ""} ${!withContainer ? "hideContainer" : ""}`}>
        {options?.map(renderOption)}
      </div>
      {errorMessage && (
        <ErrorMessage
          message={t(errorMessage)}
          truncateMessage={true}
          maxLength={256}
          showIcon={true}
        />
      )}
    </div>
  );
};

SelectionTag.propTypes = {
  width: PropTypes.number,
  errorMessage: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      prefixIcon: PropTypes.node,
      suffixIcon: PropTypes.node,
    })
  ).isRequired,
  onSelectionChanged: PropTypes.func.isRequired,
  allowMultipleSelection: PropTypes.bool,
};

export default SelectionTag;
