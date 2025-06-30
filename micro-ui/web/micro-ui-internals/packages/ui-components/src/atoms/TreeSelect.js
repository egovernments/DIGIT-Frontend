import React, { useState, useEffect } from "react";
import { SVG } from "./SVG";
import { useTranslation } from "react-i18next";
import { Colors} from "../constants/colors/colorconstants";

const TreeSelectOption = ({ option, onSelect, isSelected, renderOptions, level = 0,optionsKey }) => {
  const [isExpanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const handleToggleDropdown = () => {
    if (option.options) {
      setExpanded(!isExpanded);
    }
  };
  const handleSelect = () => {
    if (!option.options) {
      onSelect(option);
    }
  };

  const primaryFill = Colors.lightTheme.text.primary;

  return (
    <div style={{ marginLeft: `${level !== 0 ? 22 : 0}px`, borderLeft: "1px solid #D6D5D4" }}>
      <div
        className={`digit-tree-select-option ${isExpanded ? "expanded" : ""} ${option.options ? "parent" : "child"} level-${level}`}
        onClick={option.options ? handleToggleDropdown : handleSelect}
        tabIndex={0}
        aria-expanded={option.options ? isExpanded : undefined}
        aria-label={t(option[optionsKey])}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            option.options ? handleToggleDropdown(e) : handleSelect(e);
          }
        }}
      >
        {option.options && (
          <div className="digit-toggle-dropdown">
            {isExpanded ? (
              <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill={primaryFill} />
            ) : (
              <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill={primaryFill} style={{ transform: "rotate(-90deg)" }} />
            )}
          </div>
        )}
        <div className="digit-option-label">{t(option[optionsKey])}</div>
      </div>
      {isExpanded &&
        option.options &&
        option.options.length > 0 &&
        renderOptions({ options: option.options, onSelect, isSelected, level: level + 1 })}
    </div>
  );
};
const TreeMultiSelect = ({ option, onSelect, isSelected, renderOptions, level = 0, isParentSelected, setParentSelected, optionsKey}) => {
  const [isExpanded, setExpanded] = useState(false);
  const { t } = useTranslation();
  const handleToggleDropdown = () => {
    if (option.options) {
      setExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    // Update the parent's selection status when the component is mounted
    setParentSelected(isSelected(option));
  }, [isSelected, option, setParentSelected]);

  const handleSelect = () => {
    if (option.options) {
      const selectedOptions = getFlattenedOptions(option.options);
      if (isSelected(option)) {
        onSelect([option, ...selectedOptions]);
      } else {
        // Checking if any child is already selected
        const anyChildSelected = selectedOptions.some((child) => isSelected(child));
        // If any child is already selected, selecting only the unselected children
        if (anyChildSelected) {
          const unselectedChildren = selectedOptions.filter((child) => !isSelected(child));
          onSelect([option, ...unselectedChildren]);
        } else {
          onSelect([option, ...selectedOptions]);
        }
      }
    } else {
      onSelect([option]);
    }
  };

  const getFlattenedOptions = (options) => {
    let flattened = [];
    options.forEach((option) => {
      if (option.options) {
        flattened.push(option);
        flattened = flattened.concat(getFlattenedOptions(option.options));
      } else {
        flattened.push(option);
      }
    });
    return flattened;
  };

  const allChildrenSelected = option.options && option.options.every((child) => isSelected(child));

  const isIntermediate = () => {
    if (option.options) {
      const selectedOptions = getFlattenedOptions(option.options);
      const someChildrenSelected = selectedOptions.some((child) => isSelected(child));
      return someChildrenSelected && !allChildrenSelected;
    }
    return false;
  };

  useEffect(() => {
    if (allChildrenSelected && !isSelected(option)) {
      // If all children are selected and the current option is not selected, select the option.
      onSelect([option]);
    } else if (isIntermediate(option) && isSelected(option)) {
      // If the option is in an intermediate state and is currently selected, deselect the option.
      onSelect([option]);
    }
  }, [allChildrenSelected, isSelected, isIntermediate, option, onSelect]);

  const primaryFill = Colors.lightTheme.text.primary;
  const primarySelectedColor = Colors.lightTheme.paper.primary;
  const SelectedColor = Colors.lightTheme.primary[1];

  return (
    <div style={{ marginLeft: `${level !== 0 ? 22 : 0}px` }} className={`container ${level === 0 ? "outerlevel" : "innerlevel"}`}>
      <div
        className={`digit-tree-multiselect-option ${isExpanded ? "expanded" : ""} ${option.options ? "parent" : "child"} ${
          isSelected(option) ? "checked" : ""
        } ${allChildrenSelected ? "all-child-selected" : ""} level-${level}`}
        style={{ gap: `${level !== 0 ? 12 : 4}px` }}
        onClick={!option.options ? handleSelect : handleToggleDropdown}
        role="button"
        tabIndex={0}
        aria-expanded={option.options ? isExpanded : undefined}
        aria-label={t(option[optionsKey])}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            !option.options ? handleSelect(e) : handleToggleDropdown(e);
          }
        }}
      >
        {option.options && (
          <div
            className="digit-toggle-dropdown"
          >
            {isExpanded ? (
              <SVG.ArrowDropDown
                width="1.5rem"
                height="1.5rem"
                fill={isParentSelected ? primaryFill : allChildrenSelected || isSelected(option) ? primarySelectedColor : primaryFill}
              />
            ) : (
              <SVG.ArrowDropDown
                width="1.5rem"
                height="1.5rem"
                fill={isParentSelected ? primaryFill : allChildrenSelected || isSelected(option) ? primarySelectedColor : primaryFill}
                style={{ transform: "rotate(-90deg)" }}
              />
            )}
          </div>
        )}
        <div
          className={`digit-option-checkbox ${isIntermediate() ? "intermediate" : ""} ${allChildrenSelected || isSelected(option) ? "checked" : ""}`}
        >
          <input type="checkbox" checked={allChildrenSelected || isSelected(option)} onChange={handleSelect} />
        </div>
        <div
          className={`digit-custom-checkbox ${allChildrenSelected || isSelected(option) ? "checked" : ""} ${isIntermediate() ? "intermediate" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect();
            }}
          role="checkbox"
          aria-checked={allChildrenSelected || isSelected(option)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              handleSelect(e);
            }
          }}
          style={{ marginRight: `${level == 0 ? 8 : 0}px` }}
        >
          {isIntermediate() ? (
            <div className="intermediate-state"></div>
          ) : (
            <SVG.Check fill={(allChildrenSelected || isSelected(option)) && !isParentSelected ? primarySelectedColor : SelectedColor} />
          )}
        </div>
        <div className="digit-option-label">{t(option[optionsKey])}</div>
      </div>
      {isExpanded && option.options && option.options.length > 0 && (
        <div className="child-options-container">
          {renderOptions({
            options: option.options,
            onSelect,
            isSelected,
            level: level + 1,
            isParentSelected: isSelected(option),
            setParentSelected,
          })}
        </div>
      )}
    </div>
  );
};
const TreeSelect = ({ options, onSelect, selectedOption, variant,optionsKey }) => {
  const renderOptions = ({ options, onSelect, isSelected, level, isParentSelected, setParentSelected }) => {
    return options.map((option) => (
      <div key={option.id} className={`digit-tree-select-options-container ${level === 0 ? "first-level" : ""}`}>
        {variant === "treemultiselect" ? (
          <TreeMultiSelect
            option={option}
            onSelect={onSelect}
            isSelected={isSelected}
            renderOptions={renderOptions}
            level={level}
            isParentSelected={isParentSelected}
            setParentSelected={setParentSelected}
            optionsKey={optionsKey}
          />
        ) : (
          <TreeSelectOption option={option} onSelect={onSelect} isSelected={isSelected} renderOptions={renderOptions} level={level} optionsKey={optionsKey}/>
        )}
      </div>
    ));
  };
  const isSelected = (option) => {
    if (variant === "treemultiselect") return selectedOption && selectedOption.some((selected) => selected.code === option.code);
    else return selectedOption && selectedOption.code === option.code;
  };
  return <div>{renderOptions({ options, onSelect, isSelected, level: 0, isParentSelected: false, setParentSelected: () => {} })}</div>;
};
export default TreeSelect;
