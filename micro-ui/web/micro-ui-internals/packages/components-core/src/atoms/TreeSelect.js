import React, { useState} from "react";
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
        {option.options && (
          <div className="digit-toggle-dropdown" onClick={handleToggleDropdown}>
            {isExpanded ? (
              <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill="#0B0C0C" />
            ) : (
              <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill="#0B0C0C" style={{ transform: "rotate(-90deg)" }} />
            )}
          </div>
        )}
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
const TreeMultiSelect = ({ option, alreadySelectedQueue, setAlreadySelectedQueue, level = 0, renderOptions }) => {
  const [selectedOptions, setSelectedOptions] = useState(alreadySelectedQueue);
  const [isExpanded, setExpanded] = useState(false);
  const handleToggleDropdown = () => {
    setExpanded(!isExpanded);
  };
  const handleSelect = () => {
    const updatedSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selectedOption) => selectedOption !== option)
      : [...selectedOptions, option];
    setSelectedOptions(updatedSelectedOptions);
    setAlreadySelectedQueue(updatedSelectedOptions);
  };
  
  return (
    <div style={{ marginLeft: `${level * 20}px`, borderLeft: "1px solid #D6D5D4" }}>
      <div className={`digit-tree-select-option ${isExpanded ? "expanded" : ""} ${option.options ? "parent" : "child"}`}>
        {option.options && (
          <div className="digit-toggle-dropdown" onClick={handleToggleDropdown}>
            {isExpanded ? (
              <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill="#0B0C0C" />
            ) : (
              <SVG.ArrowDropDown width="1.5rem" height="1.5rem" fill="#0B0C0C" style={{ transform: "rotate(-90deg)" }} />
            )}
          </div>
        )}
        <div className={`digit-option-checkbox ${selectedOptions.includes(option) ? "checked" : ""}`}>
          <input type="checkbox" checked={selectedOptions.includes(option)} onChange={() => handleSelect()} />
        </div>
        <div className={`digit-custom-checkbox ${selectedOptions.includes(option) ? "checked" : ""}`} onClick={() => handleSelect()}>
          <SVG.Check fill={"white"} />
        </div>
        <div className="digit-option-label" onClick={() => handleSelect()}>
          {option.name}
        </div>
      </div>
      {isExpanded &&
        option.options &&
        option.options.length > 0 &&
        renderOptions({ options: option.options, level: level + 1, renderOptions, onSelect: handleSelect, selectedOptions })}
    </div>
  );
};
const TreeSelect = ({ options, onSelect, selectedOption, variant }) => {
  const renderOptions = ({ options, onSelect, isSelected, level }) => {
    return options.map((option) => (
      <div key={option.id} className={`digit-tree-select-options-container`}>
        {variant === "treemultiselect" ? (
          <TreeMultiSelect
            option={option}
            setAlreadySelectedQueue={() => {}}
            alreadySelectedQueue={selectedOption ? selectedOption : []}
            level={level}
            renderOptions={renderOptions}
          />
        ) : (
          <TreeSelectOption
            option={option}
            onSelect={onSelect}
            isSelected={isSelected}
            renderOptions={renderOptions}
            level={level}
          />
        )}
      </div>
    ));
  };
  const isSelected = (option) => {
    return selectedOption && selectedOption.code === option.code;
  };
  return <div>{renderOptions({ options, onSelect, isSelected, level: 0 })}</div>;
};
export default TreeSelect;