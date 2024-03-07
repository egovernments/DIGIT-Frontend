import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { SVG } from "./SVG";
import TreeSelect from "./TreeSelect";

const TextField = (props) => {
  const [value, setValue] = useState(props.selectedVal ? props.selectedVal : "");

  useEffect(() => {
    if (!props.keepNull)
      if (props.selectedVal) setValue(props.selectedVal);
      else {
        setValue("");
        props.setFilter("");
      }
    else setValue("");
  }, [props.selectedVal, props.forceSet]);

  function inputChange(e) {
    if (props.freeze) return;

    setValue(e.target.value);
    // the dropdown searchablility is made configurable through isSearchable prop
    if (props.isSearchable) {
      props.setFilter(e.target.value);
    }
  }

  function broadcastToOpen() {
    if (!props.disable) {
      props.dropdownDisplay(true);
    }
  }

  function broadcastToClose() {
    props.dropdownDisplay(false);
  }

  const replaceDotWithColon = (inputString) => {
    if (props?.variant === "nesteddropdown" || props?.variant === "treedropdown" && inputString) {
      const updatedInputString = inputString.replace(/\./g, ": ");
      return updatedInputString;
    }
    return inputString;
  };

  /* Custom function to scroll and select in the dropdowns while using key up and down */
  const keyChange = (e) => {
    if (e.key == "ArrowDown") {
      props.setOptionIndex((state) => (state + 1 == props.addProps.length ? 0 : state + 1));
      if (props.addProps.currentIndex + 1 == props.addProps.length) {
        e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollTo?.(0, 0);
      } else {
        props?.addProps?.currentIndex > 2 && e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollBy?.(0, 45);
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      props.setOptionIndex((state) => (state !== 0 ? state - 1 : props.addProps.length - 1));
      if (props.addProps.currentIndex == 0) {
        e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollTo?.(100000, 100000);
      } else {
        props?.addProps?.currentIndex > 2 && e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollBy?.(0, -45);
      }
      e.preventDefault();
    } else if (e.key == "Enter") {
      props.addProps.selectOption(props.addProps.currentIndex);
      e.preventDefault();
    }
  };

  return (
    <input
      ref={props.inputRef}
      className={`digit-employee-select-wrap--elipses ${!props.isSearchable ? "notSearchable" : ""} ${props.disable && "disabled"} ${props.variant ? props.variant : ""}`}
      type="text"
      value={replaceDotWithColon(value)}
      onChange={inputChange}
      onClick={props.onClick}
      onFocus={broadcastToOpen}
      onBlur={(e) => {
        broadcastToClose();
        props?.onBlur?.(e);
        if (props.selectedVal !== props.filterVal) {
          setTimeout(() => {
            props.setforceSet((val) => val + 1);
          }, 1000);
        }
      }}
      onKeyDown={keyChange}
      readOnly={props.disable}
      autoFocus={props.autoFocus}
      placeholder={props.placeholder}
      autoComplete={"off"}
      style={props.style}
    />
  );
};

const translateDummy = (text) => {
  return text;
};

const Dropdown = (props) => {
  const user_type = Digit.SessionStorage.get("userType");
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.selected ? props.selected : null);
  const [filterVal, setFilterVal] = useState("");
  const [isActive, setIsActive] = useState(-1);
  const [forceSet, setforceSet] = useState(0);
  const [optionIndex, setOptionIndex] = useState(-1);
  const optionRef = useRef(null);
  const hasCustomSelector = props.customSelector ? true : false;
  const t = props.t || translateDummy;

  useEffect(() => {
    setSelectedOption(props.selected);
  }, [props.selected]);

  function dropdownSwitch() {
    if (!props.disabled) {
      var current = dropdownStatus;
      if (!current) {
        document.addEventListener("mousedown", handleClick, false);
      }
      setDropdownStatus(!current);
      props?.onBlur?.();
    }
  }

  function handleClick(e) {
    if (!optionRef.current || !optionRef.current.contains(e.target)) {
      document.removeEventListener("mousedown", handleClick, false);
      setDropdownStatus(false);
    }
  }

  function dropdownOn(val) {
    const waitForOptions = () => setTimeout(() => setDropdownStatus(val), 500);
    const timerId = waitForOptions();
    return () => {
      clearTimeout(timerId);
    };
  }

  function onSelect(val) {
    if (val !== selectedOption || props.allowMultiselect) {
      props.select(val);
      setSelectedOption(val);
      setDropdownStatus(false);
    } else {
      setSelectedOption(val);
      setforceSet(forceSet + 1);
    }
  }

  function setFilter(val) {
    setFilterVal(val);
  }

  let filteredOption =
    (props.option && props.option?.filter((option) => t(option[props.optionKey])?.toUpperCase()?.indexOf(filterVal?.toUpperCase()) > -1)) || [];
  function selectOption(ind) {
    onSelect(filteredOption[ind]);
  }

  if (props.isBPAREG && selectedOption) {
    let isSelectedSameAsOptions = props.option?.filter((ob) => ob?.code === selectedOption?.code)?.length > 0;
    if (!isSelectedSameAsOptions) setSelectedOption(null);
  }

  const IconRender = (iconReq, isActive) => {
    const iconFill = isActive ? "#FFFFFF" : "#505A5F";
    try {
      const components = require("@egovernments/digit-ui-svg-components");
      const DynamicIcon = components?.[iconReq];
      if (DynamicIcon) {
        const svgElement = DynamicIcon({
          width: "1.25rem",
          height: "1.25rem",
          fill: iconFill,
          className: "",
        });
        return svgElement;
      } else {
        console.log("Icon not found");
        return null;
      }
    } catch (error) {
      console.error("Icon not found");
      return null;
    }
  };

  const flattenOptions = (options) => {
    let flattened = [];

    const flattenNestedOptions = (nestedOptions) => {
      nestedOptions.forEach((nestedOption) => {
        flattened.push(nestedOption);
        if (nestedOption.options) {
          flattenNestedOptions(nestedOption.options);
        }
      });
    };

    options.forEach((option) => {
      if (option.options) {
        flattened.push(option);
        flattenNestedOptions(option.options);
      } else {
        flattened.push(option);
      }
    });

    return flattened;
  };

  const flattenedOptions = flattenOptions(filteredOption);

  const renderOption = (option, index) => {
    const handleMouseDown = (e) => {
      if (e.button === 0) setIsActive(index);
    };
    const handleMouseUp = () => {
      setIsActive(-1);
    };

    return (
      <div
        className={`cp profile-dropdown--item ${props.variant ? props?.variant : ""}`}
        style={index === optionIndex ? { opacity: 1, backgroundColor: "#FFFAF7", border: "0.5px solid #F47738" } : {}}
        key={index}
        onClick={() => onSelect(option)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {props?.variant === "profiledropdown" || props?.variant === "profilenestedtext" ? (
          <div
            className={"profile-icon-container"}
            style={{
              width: `${props?.variant === "profiledropdown" ? "2rem" : props?.variant === "profilenestedtext" ? "2.935rem" : ""}`,
              height: `${props?.variant === "profiledropdown" ? "2rem" : props?.variant === "profilenestedtext" ? "2.935rem" : ""}`,
              backgroundImage: `url(${
                option.profileIcon
                  ? option.profileIcon
                  : "https://s3-alpha-sig.figma.com/img/a353/e61a/922f0cbf41a57918ee98e5f003d2f9b8?Expires=1705881600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=MmtDrFFMEexXuRiv~LIjrdvTBGtlOb-TqT4e6-pigcyH9ssnhhovhQa564Cp-~t9e6ZPtG33snEpEtOfVcElP-7VqK9HLqGJ7kVD3ZkR4jxGGkzVKLe7ItVqZeI3XD2HAWB2L~JY4s42dnm6658WWst~o6Fh8U9WuTJqB1iaOZyrvTf6VA2F66jcPozoTPjJeYyH0b3kGcxcGZEbkK-AbXwGkUsOJIKGr4dDVS7Gy2hgTabSd0mRkg0HTgntaLW0Zj~gzkgRTTPPUZst98npoIXE8cVimurJ4-KjYYRetx5li4O4PRl4uagRADIsxFxziDmMNv~~5IxEN4C2~0W9ew__"
              })`,
            }}
          />
        ) : null}
        <div className="option-des-container">
          <div style={{ display: "flex", gap: "0.25rem", alignItems: "center", width: "100%", minHeight: "18px" }}>
            {props?.showIcon && option?.icon && IconRender(option?.icon, index === isActive)}
            {props.isPropertyAssess ? (
              <div>{props.t ? props.t(option[props.optionKey]) : option[props.optionKey]}</div>
            ) : (
              <span
                className={`main-option ${props.variant ? props?.variant : ""}`}
              >
                {props.t ? props.t(option[props.optionKey]) : option[props.optionKey]}
              </span>
            )}
          </div>
          {(props.variant === "nestedtextdropdown" || props.variant === "profilenestedtext") && option.description && (
            <div className="option-description">{option.description}</div>
          )}
        </div>
      </div>
    );
  };

  const renderOptions = () => {
    const optionsToRender = props.variant === "nesteddropdown" || props.variant === "treedropdown" ? flattenedOptions : filteredOption;

    return optionsToRender.map((option, index) => {
      if (option.options) {
        return (
          <div key={index} className="digit-nested-category">
            <div className="digit-category-name">
              {props.variant === "treedropdown" && option.options.length > 0 && (
                <SVG.ArrowDropDown width="1.5rem" height="1.5rem" className="cp" fill="#505a5f" />
              )}
              {option.name}
            </div>
          </div>
        );
      } else {
        return renderOption(option, index);
      }
    });
  };
  return (
    <div
      className={`${user_type === "employee" ? "digit-employee-select-wrap" : "digit-select-wrap"} ${props?.className ? props?.className : ""}`}
      style={props?.style || {}}
    >
      {hasCustomSelector && (
        <div className={props.showArrow ? "cp flex-right column-gap-5" : "cp"} onClick={dropdownSwitch}>
          {props.customSelector}
          {props.showArrow && <SVG.ArrowDropDown onClick={dropdownSwitch} className={props.disabled && "disabled"} fill="#505a5f" />}
        </div>
      )}
      {!hasCustomSelector && (
        <div
          className={`${dropdownStatus ? "digit-select-active" : "digit-select"} ${props?.variant ? props?.variant : ""} ${!props?.isSearchable ? "notSearchable" : ""} ${
            props.disabled && "disabled"
          }`}
          style={
            props.errorStyle
            ? { border: "1px solid red", ...(props.noBorder ? { border: "none" } : {}) }
            : { ...(props.noBorder ? { border: "none" } : {}) }
          }
          onClick={props.variant === "treedropdown" || !props.isSearchable ? dropdownSwitch : null}
        >
          <TextField
            variant={props?.variant}
            isSearchable={props?.isSearchable}
            autoComplete={props.autoComplete}
            setFilter={setFilter}
            forceSet={forceSet}
            setforceSet={setforceSet}
            setOptionIndex={setOptionIndex}
            keepNull={props.keepNull}
            selectedVal={
              selectedOption
                ? props.t
                  ? props.isMultiSelectEmp
                    ? `${selectedOption} ${t("BPA_SELECTED_TEXT")}`
                    : props.t(
                        props.variant === "nesteddropdown" || props.variant === "treedropdown"
                          ? selectedOption.code
                          : props.optionKey
                          ? selectedOption[props.optionKey]
                          : selectedOption
                      )
                  : props.optionKey
                  ? selectedOption[props.optionKey]
                  : selectedOption
                : null
            }
            filterVal={filterVal}
            addProps={{ length: filteredOption.length, currentIndex: optionIndex, selectOption: selectOption }}
            dropdownDisplay={dropdownOn}
            handleClick={handleClick}
            disable={props.disabled}
            freeze={props.freeze ? true : false}
            autoFocus={props.autoFocus}
            placeholder={props.placeholder}
            onBlur={props?.onBlur}
            inputRef={props.ref}
          />
          {props.showSearchIcon ? null : (
            <SVG.ArrowDropDown fill={props?.disabled ? "#D6D5D4" : "#505A5F"} onClick={dropdownSwitch} className="cp" disable={props.disabled} />
          )}
          {props.showSearchIcon ? <SVG.Search onClick={dropdownSwitch} className="cp" disable={props.disabled} /> : null}
        </div>
      )}
      {dropdownStatus ? (
        props.optionKey ? (
          <div
            id="jk-dropdown-unique"
            className={`${hasCustomSelector ? "margin-top-10 display: table" : ""} digit-options-card`}
            style={{ ...props.optionCardStyles }}
            ref={optionRef}
          >
            {props.variant === "treedropdown" ? (
              <TreeSelect options={filteredOption} onSelect={onSelect} selectedOption={selectedOption} variant={props.variant} />
            ) : (
              renderOptions()
            )}
            {(props.variant === "nesteddropdown" ? flattenedOptions : filteredOption) &&
              (props.variant === "nesteddropdown" ? flattenedOptions : filteredOption).length === 0 && (
                <div className={`cp profile-dropdown--item ${props.variant ? props?.variant : ""}`} key={"-1"} onClick={() => {}}>
                  {<span> {"NO RESULTS FOUND"}</span>}
                </div>
              )}
          </div>
        ) : (
          <div
            className="digit-options-card"
            style={{ ...props.optionCardStyles, overflow: "scroll", maxHeight: "350px" }}
            id="jk-dropdown-unique"
            ref={optionRef}
          >
            {props.option
              ?.filter((option) => option?.toUpperCase().indexOf(filterVal?.toUpperCase()) > -1)
              .map((option, index) => {
                return (
                  <p
                    key={index}
                    style={
                      index === optionIndex
                        ? {
                            opacity: 1,
                            backgroundColor: "rgba(238, 238, 238, var(--bg-opacity))",
                          }
                        : {}
                    }
                    onClick={() => onSelect(option)}
                  >
                    {option}
                  </p>
                );
              })}
          </div>
        )
      ) : null}
    </div>
  );
};

Dropdown.propTypes = {
  customSelector: PropTypes.any,
  showArrow: PropTypes.bool,
  selected: PropTypes.any,
  style: PropTypes.object,
  option: PropTypes.array,
  optionKey: PropTypes.any,
  select: PropTypes.any,
  t: PropTypes.func,
};

Dropdown.defaultProps = {
  customSelector: null,
  showArrow: true,
  isSearchable:true,
};

export default Dropdown;
