import React, { useState, useEffect } from "react";
import { SVG } from "./SVG";

const TreeSelectOption = ({ option, onSelect, isSelected, renderOptions, level = 0 }) => {
  const [isExpanded, setExpanded] = useState(false);
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

  return (
    <div style={{ marginLeft: `${level !== 0 ? 22 : 0}px`, borderLeft: "1px solid #D6D5D4" }}>
      <div
        className={`digit-tree-select-option ${isExpanded ? "expanded" : ""} ${option.options ? "parent" : "child"} level-${level}`}
        onClick={option.options ? handleToggleDropdown : handleSelect}
      >
        {option.options && (
          <div className="digit-toggle-dropdown">
            {isExpanded ? (
              <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill={"#0B0C0C"} />
            ) : (
              <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill={"#0B0C0C"} style={{ transform: "rotate(-90deg)" }} />
            )}
          </div>
        )}
        <div className="digit-option-label">{option.name}</div>
      </div>
      {isExpanded &&
        option.options &&
        option.options.length > 0 &&
        renderOptions({ options: option.options, onSelect, isSelected, level: level + 1 })}
    </div>
  );
};
const TreeMultiSelect = ({ option, onSelect, isSelected, renderOptions, level = 0, isParentSelected, setParentSelected }) => {
  const [isExpanded, setExpanded] = useState(false);
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

  useEffect(() => {
    if (allChildrenSelected && !isSelected(option)) {
      // If all children are selected and the current option is not selected, select the option.
      onSelect([option]);
    } else if (isIntermediate(option) && isSelected(option)) {
      // If the option is in an intermediate state and is currently selected, deselect the option.
      onSelect([option]);
    }
  }, [allChildrenSelected, isSelected, isIntermediate, option, onSelect]);

  const isIntermediate = () => {
    if (option.options) {
      const selectedOptions = getFlattenedOptions(option.options);
      const someChildrenSelected = selectedOptions.some((child) => isSelected(child));
      return someChildrenSelected && !allChildrenSelected;
    }
    return false;
  };
  return (
    <div style={{ marginLeft: `${level !== 0 ? 22 : 0}px` }} className={`container ${level === 0 ? "outerlevel" : "innerlevel"}`}>
      <div
        className={`digit-tree-multiselect-option ${isExpanded ? "expanded" : ""} ${option.options ? "parent" : "child"} ${
          isSelected(option) ? "checked" : ""
        } ${allChildrenSelected ? "all-child-selected" : ""} level-${level}`}
        style={{ gap: `${level !== 0 ? 12 : 4}px` }}
        onClick={!option.options ? handleSelect : handleToggleDropdown}
      >
        {option.options && (
          <div
            className="digit-toggle-dropdown"
          >
            {isExpanded ? (
              <SVG.ArrowDropDown
                width="1.5rem"
                height="1.5rem"
                fill={isParentSelected ? "#0B0C0C" : allChildrenSelected || isSelected(option) ? "#FFFFFF" : "#0B0C0C"}
              />
            ) : (
              <SVG.ArrowDropDown
                width="1.5rem"
                height="1.5rem"
                fill={isParentSelected ? "#0B0C0C" : allChildrenSelected || isSelected(option) ? "#FFFFFF" : "#0B0C0C"}
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
          style={{ marginRight: `${level == 0 ? 8 : 0}px` }}
        >
          {isIntermediate() ? (
            <div className="intermediate-state"></div>
          ) : (
            <SVG.Check fill={(allChildrenSelected || isSelected(option)) && !isParentSelected ? "#FFFFFF" : "#F47738"} />
          )}
        </div>
        <div className="digit-option-label">{option.name}</div>
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
const TreeSelect = ({ options, onSelect, selectedOption, variant }) => {
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
          />
        ) : (
          <TreeSelectOption option={option} onSelect={onSelect} isSelected={isSelected} renderOptions={renderOptions} level={level} />
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
