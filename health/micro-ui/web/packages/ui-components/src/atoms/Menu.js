import React, { useState} from "react";
import PropTypes from "prop-types";
import TextInput from "./TextInput";
import { useTranslation } from "react-i18next";
import { Colors} from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";

const Menu = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [optionIndex, setOptionIndex] = useState(-1);
  const [isActive, setIsActive] = useState(-1);
  const { t } = useTranslation();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchFilteredOptions = props?.options.filter((option) =>
    option[props?.optionsKey]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSelect = (val) => {
    props.onSelect(val);
    props.setDropdownStatus(false); 
  };

  const handleMouseDown = (index) => {
    setOptionIndex(index); 
  };


  const secondaryIconColor = Colors.lightTheme.generic.inputBorder;
  const primaryIconColor = Colors.lightTheme.paper.primary;

  const IconRender = (iconReq, isActive) => {
    const iconFill = isActive ? primaryIconColor : secondaryIconColor;
    return iconRender(
      iconReq,
      iconFill,
      "1.25rem",
      "1.25rem",
      ""
    );
  };


  return (
    <div
      className={`header-dropdown-menu ${
        props?.footerdropdown ? "footer-dropdown" : ""
      } ${props?.showBottom ? "showBottom" : ""} ${props?.className || ""}`}
      ref={props?.ref}
      style={props?.style}
      role="listbox"
      aria-activedescendant={
        optionIndex >= 0 ? `option-${optionIndex}` : undefined
      }
    >
      {props?.isSearchable && (
        <div className="header-dropdown-search-container">
          <TextInput
            type="search"
            className="header-dropdown-search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            autoFocus={true}
          ></TextInput>
        </div>
      )}
      <div className="header-dropdown-options" id="header-dropdown-unique">
        {searchFilteredOptions.length !== 0 ? (
          searchFilteredOptions.map((option, index) => (
            <div
              key={index}
              id={`option-${index}`}
              role="option"
              aria-selected={index === optionIndex}
              tabIndex={0}
              className={`header-dropdown-option ${
                index === optionIndex ? "activeIndex" : ""
              } ${index === optionIndex ? "keyChange" : ""}`}
              onClick={(e) => {e.stopPropagation(); onSelect(option);}}
              onMouseDown={() => handleMouseDown(index)}
            >
              {IconRender(option?.icon, index === optionIndex)}
              {t(option[props?.optionsKey])}
            </div>
          ))
        ) : (
          <div className="header-dropdown-nooption">{t("No Results Found")}</div>
        )}
      </div>
    </div>
  );
};

Menu.propTypes = {
  options: PropTypes.array,
  showBottom: PropTypes.bool,
  isSearchable: PropTypes.bool,
  style: PropTypes.object,
  optionsKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

Menu.defaultProps = {
  options: [],
  onSelect: () => {},
};

export default Menu;
