import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SVG } from "./SVG";
import TreeSelect from "./TreeSelect";
import { CustomSVG } from "./CustomSVG";
import Menu from "./Menu";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";
import { getUserType } from "../utils/digitUtils";
import StringManipulator from "./StringManipulator";

const TextField = (props) => {
  const [value, setValue] = useState(
    props.selectedVal ? props.selectedVal : ""
  );

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
    if (
      props?.variant === "nesteddropdown" ||
      (props?.variant === "treedropdown" && inputString)
    ) {
      const updatedInputString = inputString.replace(/\./g, ": ");
      return updatedInputString;
    }
    return inputString;
  };

  /* Custom function to scroll and select in the dropdowns while using key up and down */
  const keyChange = (e) => {
    if (e.key == "ArrowDown") {
      props.setOptionIndex((state) =>
        state + 1 == props.addProps.length ? 0 : state + 1
      );
      if (props.addProps.currentIndex + 1 == props.addProps.length) {
        e?.target?.parentElement?.parentElement?.children
          ?.namedItem("jk-dropdown-unique")
          ?.scrollTo?.(0, 0);
      } else {
        props?.addProps?.currentIndex > 2 &&
          e?.target?.parentElement?.parentElement?.children
            ?.namedItem("jk-dropdown-unique")
            ?.scrollBy?.(0, 45);
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      props.setOptionIndex((state) =>
        state !== 0 ? state - 1 : props.addProps.length - 1
      );
      if (props.addProps.currentIndex == 0) {
        e?.target?.parentElement?.parentElement?.children
          ?.namedItem("jk-dropdown-unique")
          ?.scrollTo?.(100000, 100000);
      } else {
        props?.addProps?.currentIndex > 2 &&
          e?.target?.parentElement?.parentElement?.children
            ?.namedItem("jk-dropdown-unique")
            ?.scrollBy?.(0, -45);
      }
      e.preventDefault();
    } 
    else if (e.key === "Enter") {
      if (props.addProps.length === 1) {
          props.addProps.selectOption(0);
      }
       else {
          props.addProps.selectOption(props.addProps.currentIndex);
      }
      e.preventDefault();
  }
  };

  return (
    <input
      ref={props.inputRef}
      className={`digit-dropdown-employee-select-wrap--elipses ${
        !props.isSearchable ? "notSearchable" : ""
      } ${props.disable && "disabled"} ${props.variant ? props.variant : ""}`}
      type="text"
      value={replaceDotWithColon(value)}
      onChange={inputChange}
      onClick={props.onClick}
      onFocus={broadcastToOpen}
      id={props?.id}
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
      title={props.showToolTip ? replaceDotWithColon(value) : undefined}
    />
  );
};

const translateDummy = (text) => {
  return text;
};

const Dropdown = (props) => {
  const user_type = getUserType();
  const [dropdownStatus, setDropdownStatus] = useState(false);
  const [menuStatus, setMenuStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    props.selected ? props.selected : null
  );
  const [filterVal, setFilterVal] = useState("");
  const [isActive, setIsActive] = useState(-1);
  const [forceSet, setforceSet] = useState(0);
  const [optionIndex, setOptionIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const optionRef = useRef(null);
  const dropdownComponentRef = useRef(null);
  const menuRef = useRef(null); 
  const selectorRef = useRef(null);
  const hasCustomSelector = props.customSelector ? true : false;
  const t = props.t || translateDummy;

  // Generate unique ID for tracking (single source of truth)
  // ID Pattern: screenPath + composerType + composerId + sectionId + name + type
  const fieldId = Digit?.Utils?.generateUniqueId?.({
    screenPath: props?.screenPath || "",
    composerType: props?.composerType || "standalone",
    composerId: props?.composerId || "",
    sectionId: props?.sectionId || "",
    name: props?.name || props?.optionKey || "dropdown",
    type: "dropdown",
    id: props?.id
  }) || props?.id || props?.name;

  // Helper function to check if element is visible within all scroll ancestors
  const isElementVisibleInScrollParents = (element) => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    let parent = element.parentElement;

    while (parent) {
      const parentStyle = window.getComputedStyle(parent);
      const overflowY = parentStyle.overflowY;
      const overflow = parentStyle.overflow;

      // Check if parent has vertical scrolling enabled
      const hasVerticalScroll =
        overflowY === 'auto' ||
        overflowY === 'scroll' ||
        overflow === 'auto' ||
        overflow === 'scroll';

      // Also check if parent actually has scrollable content (scrollHeight > clientHeight)
      const isActuallyScrollable = hasVerticalScroll && parent.scrollHeight > parent.clientHeight;

      if (isActuallyScrollable) {
        const parentRect = parent.getBoundingClientRect();
        // Check if element is outside the scrollable parent's visible area
        if (rect.bottom <= parentRect.top || rect.top >= parentRect.bottom) {
          return false;
        }
      }
      parent = parent.parentElement;
    }

    // Also check viewport visibility
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom <= 0 || rect.top >= viewportHeight) {
      return false;
    }

    return true;
  };

  // Update dropdown position when it opens or on scroll/resize (only when using portal)
  useEffect(() => {
    // Skip if portal is disabled - no need to track position or visibility
    if (props.disablePortal) return;

    // Only check visibility on scroll/resize, not on initial position update
    const updatePositionOnScroll = () => {
      if (dropdownStatus && dropdownComponentRef.current) {
        // Check if the input field is visible within scroll parents and viewport
        if (!isElementVisibleInScrollParents(dropdownComponentRef.current)) {
          // Remove the mousedown listener before closing to prevent it from blocking reopening
          document.removeEventListener("mousedown", handleClick, false);
          setDropdownStatus(false);
          return;
        }

        const rect = dropdownComponentRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    // Initial position update without visibility check
    const setInitialPosition = () => {
      if (dropdownComponentRef.current) {
        const rect = dropdownComponentRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    if (dropdownStatus) {
      setInitialPosition();
      window.addEventListener("scroll", updatePositionOnScroll, true);
      window.addEventListener("resize", updatePositionOnScroll);
    }

    return () => {
      window.removeEventListener("scroll", updatePositionOnScroll, true);
      window.removeEventListener("resize", updatePositionOnScroll);
    };
  }, [dropdownStatus, props.disablePortal]);


  const scrollIntoViewIfNeeded = () => {
    if (dropdownComponentRef.current) {
      const rect = dropdownComponentRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Check if the component is outside the viewport
      const isOutsideViewport =
        rect.top < 0 || rect.left < 0 || rect.bottom > viewportHeight || rect.right > viewportWidth;

      if (isOutsideViewport) {
        // Scroll to make the component visible
        dropdownComponentRef.current.scrollIntoView({
          behavior: "smooth", // Optional: smooth scrolling
          block: "center",    // Scroll to the center vertically
          inline: "center",   // Scroll to the center horizontally
        });
      }
    }
  };

  useEffect(() => {
    scrollIntoViewIfNeeded();
  }, []); // Runs on mount


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

  function menuSwitch(){
    if(!props.disabled){
      var current = menuStatus;
      if (!current) {
        document.addEventListener("mousedown", handleClickOutside, false);
      }
      setMenuStatus(!current);
      props?.onBlur?.();
    }
  }

  function handleClickOutside(e) {
    if (!menuRef.current || !menuRef.current.contains(e.target)) {
      if(selectorRef?.current && selectorRef?.current.contains(e.target)){
        return ;
      }
      else{
        document.removeEventListener("mousedown", handleClickOutside, false);
        setMenuStatus(false);
      }
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
      setDropdownStatus(false);
    }
  }

  function setFilter(val) {
    setFilterVal(val);
  }

  // Filter options - for nested dropdowns, also search within child options
  let filteredOption =
    props.variant === "nesteddropdown" || props.variant === "treedropdown"
      ? filterVal?.length > 0
        ? props.option
            ?.map((option) => {
              const optionName = t(option[props?.optionKey])?.toUpperCase() || "";
              const searchVal = filterVal?.toUpperCase();
              const categoryMatches = optionName.indexOf(searchVal) > -1;

              if (option?.options && option.options.length > 0) {
                // Search within nested options
                const matchingNestedOptions = option?.options?.filter(
                  (nestedOption) =>
                    t(nestedOption[props?.optionKey])
                      ?.toUpperCase()
                      ?.indexOf(searchVal) > -1
                );

                // Include category if category name matches OR any children match
                if (categoryMatches) {
                  // Category matches - show all children
                  return option;
                } else if (matchingNestedOptions.length > 0) {
                  // Children match - show category with only matching children
                  return {
                    ...option,
                    options: matchingNestedOptions,
                  };
                }
              } else if (categoryMatches) {
                // Non-nested option that matches
                return option;
              }

              return null;
            })
            ?.filter(Boolean) || []
        : props.option || []
      : (props.option &&
          props.option?.filter(
            (option) =>
              t(option[props?.optionKey])
                ?.toUpperCase()
                ?.indexOf(filterVal?.toUpperCase()) > -1
          )) ||
        [];
  function selectOption(ind) {
    const optionsToSelect =
      props.variant === "nesteddropdown" || props.variant === "treedropdown"
        ? flattenedOptions
        : filteredOption;
    onSelect(optionsToSelect[ind]);
  }

  if (props.isBPAREG && selectedOption) {
    let isSelectedSameAsOptions =
      props.option?.filter((ob) => ob?.code === selectedOption?.code)?.length >
      0;
    if (!isSelectedSameAsOptions) setSelectedOption(null);
  }

  const inputBorderColor = Colors.lightTheme.generic.inputBorder;
  const dividerColor = Colors.lightTheme.generic.divider;
  const primaryColor = Colors.lightTheme.paper.primary;

  const IconRender = (iconReq, isActive) => {
    const iconFill = isActive ? primaryColor : inputBorderColor;
    return iconRender(
      iconReq,
      iconFill,
      "1.25rem",
      "1.25rem",
      ""
    );
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

    const parentOptionsWithChildren = options.filter(
      (option) => option.options && option.options.length > 0
    );

    parentOptionsWithChildren.forEach((option) => {
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
        className={`cp digit-dropdown-item ${
          props.variant ? props?.variant : ""
        } ${index === optionIndex ? "keyChange" : ""}`}
        key={index}
        role="button"
        onKeyDown={(e)=>{
          if (e.key=="Enter" || e.key==" "){
            onSelect(option)
          }
        }}
        onClick={() => onSelect(option)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {props?.variant === "profiledropdown" ||
        props?.variant === "profilenestedtext" ? (
          <div
            className={"profile-icon-container"}
            style={{
              width: `${
                props?.variant === "profiledropdown"
                  ? "2rem"
                  : props?.variant === "profilenestedtext"
                  ? "2.935rem"
                  : ""
              }`,
              height: `${
                props?.variant === "profiledropdown"
                  ? "2rem"
                  : props?.variant === "profilenestedtext"
                  ? "2.935rem"
                  : ""
              }`,
              ...(option.profileIcon && {
                backgroundImage: `url(${option.profileIcon})`,
              }),
            }}
          >
            {!option?.profileIcon && (
              <CustomSVG.ProfileIcon
                width={
                  props?.variant === "profiledropdown"
                    ? "2rem"
                    : props?.variant === "profilenestedtext"
                    ? "2.935rem"
                    : ""
                }
                height={
                  props?.variant === "profiledropdown"
                    ? "2rem"
                    : props?.variant === "profilenestedtext"
                    ? "2.935rem"
                    : ""
                }
              ></CustomSVG.ProfileIcon>
            )}
          </div>
        ) : null}
        <div className="option-des-container">
          <div className="icon-option">
            {props?.showIcon &&
              option?.icon &&
              IconRender(option?.icon, index === isActive)}
            {props.isPropertyAssess ? (
              <div>
                {props.t
                  ? props.t(option[props?.optionKey])
                  : option[props?.optionKey]}
              </div>
            ) : (
              <span
                className={`main-option ${props.variant ? props?.variant : ""}`}
                title={
                  props.showToolTip
                    ? props.t
                      ? props.t(option[props?.optionKey])
                      : option[props?.optionKey]
                    : undefined
                }
              >
                {StringManipulator("TOSENTENCECASE", props.t
                  ? props.t(option[props?.optionKey])
                  : option[props?.optionKey])}
              </span>
            )}
          </div>
          {(props.variant === "nestedtextdropdown" ||
            props.variant === "profilenestedtext") &&
            option.description && (
              <div className="option-description">{StringManipulator("TOSENTENCECASE", option.description)}</div>
            )}
        </div>
      </div>
    );
  };

  const optionsToRender =
    props.variant === "nesteddropdown" || props.variant === "treedropdown"
      ? flattenedOptions
      : filteredOption;

  const parentOptionsWithChildren = filteredOption.filter(
    (option) => option.options && option.options.length > 0
  );

  const renderOptions = () => {
    return optionsToRender.map((option, index) => {
      if (option.options) {
        return (
          <div key={index} className="digit-nested-category">
            <div className="digit-category-name">
              {props.variant === "treedropdown" &&
                option.options.length > 0 && (
                  <SVG.ArrowDropDown
                    width="1.5rem"
                    height="1.5rem"
                    className="cp"
                    fill={inputBorderColor}
                  />
                )}
              {StringManipulator("TOSENTENCECASE",t(option[props?.optionKey]))}
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
      className={`${
        user_type === "employee"
          ? "digit-dropdown-employee-select-wrap"
          : "digit-dropdown-select-wrap"
      } ${props?.className ? props?.className : ""}`}
      style={props?.style || {}}
      ref={dropdownComponentRef}
    >
      {(hasCustomSelector || props?.profilePic) && (
        <div
          className={`header-dropdown-label ${props?.theme || ""}`}
          onClick={menuSwitch}
          ref={selectorRef}
          role="button"
          aria-expanded={menuStatus}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") menuSwitch();
          }}
        >
          {props?.profilePic && (
            <span
              className={`header-dropdown-profile ${props?.theme || ""} ${
                typeof props?.profilePic === "string" ? "text" : ""
              }`}
            >
              {typeof props?.profilePic === "string"
                ? props?.profilePic?.[0]?.toUpperCase()
                : props?.profilePic}
            </span>
          )}
          {!props?.profilePic && props?.customSelector}
          {props?.showArrow && (
            <span className="header-dropdown-arrow">
              <SVG.ArrowDropDown
                fill={props?.theme === "dark" ? primaryColor : inputBorderColor}
              />
            </span>
          )}
        </div>
      )}

      {!hasCustomSelector && !props?.profilePic && (
        <div
          className={`${
            dropdownStatus
              ? "digit-dropdown-select-active"
              : "digit-dropdown-select"
          } ${props?.variant ? props?.variant : ""} ${
            !props?.isSearchable ? "notSearchable" : ""
          } ${props.disabled && "disabled"}`}
          style={
            props.errorStyle
              ? {
                  ...(props.noBorder ? { border: "none" } : {}),
                }
              : { ...(props.noBorder ? { border: "none" } : {}) }
          }
          onClick={
            props.variant === "treedropdown" || !props.isSearchable
              ? dropdownSwitch
              : null
          }
          role="button"
          tabIndex={0}
          aria-expanded={dropdownStatus}
          aria-label="Select an option"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") dropdownSwitch();
          }}
        >
          <TextField
            variant={props?.variant}
            isSearchable={props?.isSearchable}
            autoComplete={props.autoComplete}
            setFilter={setFilter}
            forceSet={forceSet}
            setforceSet={setforceSet}
            id={fieldId}
            setOptionIndex={setOptionIndex}
            keepNull={props.keepNull}
            selectedVal={
              selectedOption
                ? props.t
                  ? props.isMultiSelectEmp
                    ? `${selectedOption} ${t("BPA_SELECTED_TEXT")}`
                    : props.t(
                        props.variant === "nesteddropdown" ||
                          props.variant === "treedropdown"
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
            addProps={{
              length:
                props.variant === "nesteddropdown" ||
                props.variant === "treedropdown"
                  ? flattenedOptions.length
                  : filteredOption.length,
              currentIndex: optionIndex,
              selectOption: selectOption,
            }}
            dropdownDisplay={dropdownOn}
            handleClick={handleClick}
            disable={props.disabled}
            freeze={props.freeze ? true : false}
            autoFocus={props.autoFocus}
            placeholder={props.placeholder}
            onBlur={props?.onBlur}
            inputRef={props.ref}
            showToolTip={props.showToolTip}
          />
          {props.showSearchIcon ? null : (
            <SVG.ArrowDropDown
              fill={props?.disabled ? dividerColor : inputBorderColor}
              onClick={dropdownSwitch}
              className="cp"
              disable={props.disabled}
            />
          )}
          {props.showSearchIcon ? (
            <SVG.Search
              onClick={dropdownSwitch}
              className="cp"
              disable={props.disabled}
            />
          ) : null}
        </div>
      )}
      {(hasCustomSelector || props?.profilePic) && menuStatus && (
        <div className={"menu-div"} ref={menuRef}>
          <Menu
            options={props?.option}
            setDropdownStatus={setMenuStatus}
            dropdownStatus={menuStatus}
            isSearchable={props?.isSearchable}
            optionsKey={props?.optionKey}
            onSelect={onSelect}
            showBottom={props?.showBottom}
            style={props?.menuStyles}
            className={props?.profilePic ? "underProfile" : ""}
          />
        </div>
      )}
      {!hasCustomSelector && !props?.profilePIc && dropdownStatus && (() => {
        const dropdownContent = props.optionKey ? (
          <div
            id="jk-dropdown-unique"
            className={`digit-dropdown-options-card`}
            style={{
              ...(props.disablePortal ? {} : {
                position: "absolute",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width || "auto",
                zIndex: 999999,
              }),
              ...props.optionCardStyles,
            }}
            ref={optionRef}
            role="listbox"
          >
            {props.variant === "treedropdown" ? (
              <TreeSelect
                options={parentOptionsWithChildren}
                onSelect={onSelect}
                selectedOption={selectedOption}
                variant={props.variant}
                optionsKey={props?.optionKey}
              />
            ) : (
              renderOptions()
            )}
            {(props.variant === "nesteddropdown"
              ? flattenedOptions
              : filteredOption) &&
              (props.variant === "nesteddropdown"
                ? flattenedOptions
                : filteredOption
              ).length === 0 && (
                <div
                  className={`cp digit-dropdown-item unsuccessfulresults ${
                    props.variant ? props?.variant : ""
                  }`}
                  key={"-1"}
                  onClick={() => {}}
                >
                  {<span> {t("NO_RESULTS_FOUND")}</span>}
                </div>
              )}
          </div>
        ) : (
          <div
            className="digit-dropdown-options-card"
            style={{
              ...(props.disablePortal ? {
                overflow: "scroll",
                maxHeight: "350px",
              } : {
                position: "absolute",
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width || "auto",
                zIndex: 999999,
                overflow: "scroll",
                maxHeight: "350px",
              }),
               ...props.optionCardStyles,
            }}
            id="jk-dropdown-unique"
            ref={optionRef}
            role="listbox"
          >
            {props.option
              ?.filter(
                (option) =>
                  option?.toUpperCase().indexOf(filterVal?.toUpperCase()) > -1
              )
              .map((option, index) => {
                return (
                  <p
                    key={index}
                    role="option"
                    aria-selected={index === optionIndex}
                    onClick={() => onSelect(option)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onSelect(option);
                    }}
                    style={
                      index === optionIndex
                        ? {
                          opacity: 1,
                          backgroundColor:
                            "rgba(238, 238, 238, var(--bg-opacity))",
                        }
                        : {}
                    }
                  >
                    {option}
                  </p>
                );
              })}
          </div>
        );

        // Use portal only if not disabled and document exists
        if (!props.disablePortal && typeof document !== "undefined") {
          return createPortal(dropdownContent, document.body);
        }
        return dropdownContent;
      })()}
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
  disablePortal: PropTypes.bool,
};

Dropdown.defaultProps = {
  customSelector: null,
  showArrow: true,
  isSearchable: true,
  disablePortal: false,
};

export default Dropdown;
