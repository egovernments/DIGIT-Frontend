import React, { useState } from "react";
import PropTypes from "prop-types";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";

const SelectionCard = ({
  width,
  errorMessage,
  options,
  onSelectionChanged,
  allowMultipleSelection = true,
}) => {
  const { t } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionClick = (option) => {
    const updatedSelections = [...selectedOptions];
    if (allowMultipleSelection) {
      if (updatedSelections.includes(option)) {
        const index = updatedSelections.indexOf(option);
        updatedSelections.splice(index, 1);
      } else {
        updatedSelections.push(option);
      }
    } else {
      if (updatedSelections.includes(option)) {
        updatedSelections.length = 0;
      } else {
        updatedSelections.length = 0;
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
    const isSelected = selectedOptions.includes(option);

    return (
      <div
        key={option.code}
        className={`option ${isSelected ? "selected" : ""}`}
        style={{ width }}
        onClick={() => handleOptionClick(option)}
      >
        {option?.prefixIcon && (
          <span className="selectioncardicon">
            {IconRender(option?.prefixIcon, isSelected)}
          </span>
        )}
        <span className="selectioncard-option-label">{option.name}</span>
        {option?.suffixIcon && (
          <span className="selectioncardicon">
            {IconRender(option?.suffixIcon, isSelected)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="selection-card-container">
      <div className={`selection-card ${errorMessage ? "error" : ""}`}>
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

SelectionCard.propTypes = {
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

export default SelectionCard;
