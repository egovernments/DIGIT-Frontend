import React, { useState } from "react";
import PropTypes from "prop-types";
import ErrorMessage from "./ErrorMessage";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";
import Loader from "./Loader";

const SelectionTag = ({
  width,
  errorMessage,
  options,
  optionsKey = "name",
  onSelectionChanged,
  allowMultipleSelection = true,
  selected,
  withContainer,
  populators = {},
}) => {
  const { t: i18nT } = useTranslation();
  const t = populators?.t || i18nT;
  const [selectedOptions, setSelectedOptions] = useState(selected || []);

  const { isLoading, data } = window?.Digit?.Hooks.useCustomMDMS(
    Digit?.ULBService?.getStateId(),
    populators?.mdmsConfig?.moduleName,
    [
      {
        name: populators?.mdmsConfig?.masterName,
      },
    ],
    {
      select: populators?.mdmsConfig?.select
        ? createFunction(populators?.mdmsConfig?.select)
        : (data) => {
            const optionsData = _.get(
              data,
              `${populators?.mdmsConfig?.moduleName}.${populators?.mdmsConfig?.masterName}`,
              []
            );
            return optionsData
              .filter((opt) =>
                opt?.hasOwnProperty("active") ? opt.active : true
              )
              .map((opt) => ({
                ...opt,
                name: `${Digit.Utils.locale.getTransformedLocale(opt.code)}`,
              }));
          },
      enabled: populators?.mdmsConfig || populators?.mdmsV2 ? true : false,
    },
    populators?.mdmsv2
  );

  if (isLoading) {
    return <Loader />;
  }

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

  const handleKeyDown = (e, option) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(option);
    }
  };

  const secondaryIconColor = Colors.lightTheme.generic.inputBorder;
  const primaryIconColor = Colors.lightTheme.paper.primary;

  const IconRender = (iconReq, isActive) => {
    const iconFill = isActive ? primaryIconColor : secondaryIconColor;
    return iconRender(iconReq, iconFill, "1.5rem", "1.5rem", "");
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
        onKeyDown={(e) => handleKeyDown(e, option)}
        tabIndex={0}
        role={allowMultipleSelection ? "checkbox" : "radio"}
        aria-checked={isSelected}
        aria-label={t(option?.[optionsKey])}
      >
        {option.prefixIcon && (
          <span className="selectiontagicon" aria-hidden="true">
            {IconRender(option?.prefixIcon, isSelected)}
          </span>
        )}
        <span className="selectiontag-option-label">
          {t(option?.[optionsKey])}
        </span>
        {option.suffixIcon && (
          <span className="selectiontagicon" aria-hidden="true">
            {IconRender(option?.suffixIcon, isSelected)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="selection-card-container">
      <div
        className={`selection-card ${errorMessage ? "error" : ""} ${
          !withContainer ? "hideContainer" : ""
        }`}
        role={allowMultipleSelection ? "group" : "radiogroup"}
        aria-label={allowMultipleSelection ? "Select multiple options" : "Select one option"}
        aria-invalid={errorMessage ? "true" : "false"}
      >
        {data ? data?.map(renderOption) : options?.map(renderOption)}
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
