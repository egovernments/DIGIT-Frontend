import React, { useState } from "react";
import { SVG } from "./SVG";

const TreeSelectOption = ({ option, onSelect, isSelected, renderOptions, level = 0 }) => {
  const [isExpanded, setExpanded] = useState(false);
  const handleToggleDropdown = () => {
    setExpanded(!isExpanded);
  };
  const handleSelect = () => {
    if (!option.options) {
      onSelect(option);
    }
  };

  return (
    <div style={{ marginLeft: `${level * 20}px`, borderLeft: "1px solid #D6D5D4" }}>
      <div className={`digit-tree-select-option ${isExpanded ? "expanded" : ""} ${option.options ? "parent" : "child"}`}>
        <div className="digit-toggle-dropdown" onClick={handleToggleDropdown}>
          {isExpanded ? (
            <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill="#0B0C0C" />
          ) : (
            <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill="#0B0C0C" style={{ transform: "rotate(-90deg)" }} />
          )}
        </div>
        <div className="digit-option-label" onClick={handleSelect}>
          {option.name}
        </div>
      </div>
      {isExpanded &&
        option.options &&
        option.options.length > 0 &&
        renderOptions({ options: option.options, onSelect, isSelected, level: level + 1 })}
    </div>
  );
};
const TreeMultiSelect = ({ option, onSelect, isSelected, renderOptions, level = 0 }) => {
  const [isExpanded, setExpanded] = useState(false);
  const handleToggleDropdown = () => {
    setExpanded(!isExpanded);
  };
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
  return (
    <div style={{ marginLeft: `${level * 20}px`, borderLeft: "1px solid #D6D5D4" }}>
      <div className={`digit-tree-select-option ${isExpanded ? "expanded" : ""} ${option.options ? "parent" : "child"}`}>
        <div className="digit-toggle-dropdown" onClick={handleToggleDropdown}>
          {isExpanded ? (
            <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill="#0B0C0C" />
          ) : (
            <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill="#0B0C0C" style={{ transform: "rotate(-90deg)" }} />
          )}
        </div>
        <div
          className={`digit-option-checkbox ${isIntermediate() ? "intermediate" : ""} ${allChildrenSelected || isSelected(option) ? "checked" : ""}`}
        >
          <input type="checkbox" checked={allChildrenSelected || isSelected(option)} onChange={handleSelect} />
        </div>
        <div
          className={`digit-custom-checkbox ${allChildrenSelected || isSelected(option) ? "checked" : ""} ${isIntermediate() ? "intermediate" : ""}`}
          onClick={handleSelect}
        >
          {isIntermediate() ? (
            <div className="intermediate-state"></div>
          ) : (
            <SVG.Check fill={allChildrenSelected || isSelected(option) ? "#F47738" : "white"} />
          )}
        </div>
        <div className="digit-option-label" onClick={handleSelect}>
          {option.name}
        </div>
      </div>
      {isExpanded &&
        option.options &&
        option.options.length > 0 &&
        renderOptions({ options: option.options, onSelect, isSelected, level: level + 1 })}
    </div>
  );
};
const TreeSelect = ({ options, onSelect, selectedOption, variant }) => {
  const renderOptions = ({ options, onSelect, isSelected, level }) => {
    return options.map((option) => (
      <div key={option.id} className={`digit-tree-select-options-container`}>
        {variant === "treemultiselect" ? (
          <TreeMultiSelect option={option} onSelect={onSelect} isSelected={isSelected} renderOptions={renderOptions} level={level} />
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
  return <div>{renderOptions({ options, onSelect, isSelected, level: 0 })}</div>;
};
export default TreeSelect;
