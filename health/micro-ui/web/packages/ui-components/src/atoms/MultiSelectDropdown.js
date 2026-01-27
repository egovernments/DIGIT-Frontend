import React, { useEffect, useReducer, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Chip from "./Chip";
import { SVG } from "./SVG";
import Button from "./Button";
import TreeSelect from "./TreeSelect";
import { Colors } from "../constants/colors/colorconstants";
import { iconRender } from "../utils/iconRender";

const MultiSelectDropdown = ({
  options,
  optionsKey,
  selected = [],
  onSelect,
  onClose,
  defaultLabel = "",
  defaultUnit = "",
  props,
  isPropsNeeded = false,
  ServerStyle = {},
  config,
  disabled,
  variant,
  addSelectAllCheck = false,
  addCategorySelectAllCheck = false,
  selectAllLabel = "",
  categorySelectAllLabel = "",
  restrictSelection = false,
  isSearchable = false,
  chipsKey,
  frozenData = [],
  handleViewMore,
  disablePortal = false,
  disableClearAll = false,
  onChipClose,
  screenPath,
  composerType,
  composerId,
  sectionId,
  name,
  id,
}) => {
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [optionIndex, setOptionIndex] = useState(-1);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [categorySelected, setCategorySelected] = useState({});
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef();
  const isInitialMount = useRef(true);
  const closedByScrollRef = useRef(false);
  const { t } = useTranslation();

  // Generate unique ID for tracking (single source of truth)
  // ID Pattern: screenPath + composerType + composerId + sectionId + name + type
  const fieldId = Digit?.Utils?.generateUniqueId?.({
    screenPath: screenPath || "",
    composerType: composerType || "standalone",
    composerId: composerId || "",
    sectionId: sectionId || "",
    name: name || optionsKey || "multiselect",
    type: "multiselect",
    id: id
  }) || id || name;

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
    if (disablePortal) return;

    // Only check visibility on scroll/resize, not on initial position update
    const updatePositionOnScroll = () => {
      if (active && dropdownRef.current) {
        // Check if the input field is visible within scroll parents and viewport
        if (!isElementVisibleInScrollParents(dropdownRef.current)) {
          closedByScrollRef.current = true;
          setActive(false);
          return;
        }

        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    // Initial position update without visibility check
    const setInitialPosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    if (active) {
      // Reset the scroll-closed flag when dropdown opens
      closedByScrollRef.current = false;
      setInitialPosition();
      window.addEventListener("scroll", updatePositionOnScroll, true);
      window.addEventListener("resize", updatePositionOnScroll);
    }

    return () => {
      window.removeEventListener("scroll", updatePositionOnScroll, true);
      window.removeEventListener("resize", updatePositionOnScroll);
    };
  }, [active, disablePortal]);

  function reducer(state, action) {
    switch (action.type) {
      case "ADD_TO_SELECTED_EVENT_QUEUE":
        // Check if the item already exists to prevent duplication
        if (state.some((e) => e.code === action.payload?.[1]?.code)) {
          return state; // Return state unchanged if item is already in queue
        }
        return [
          ...state,
          { code: action.payload?.[1]?.code, name: action?.payload?.[1]?.name, propsData: action.payload, },
        ];
      case "REMOVE_FROM_SELECTED_EVENT_QUEUE":
        const newState = state?.filter(
          (e) => e?.code !== action.payload?.[1]?.code
        );
        // onSelect is now called via useEffect when state changes
        return newState;
      case "REPLACE_COMPLETE_STATE":
        return action.payload;
      default:
        return state;
    }
  }

  useEffect(() => {
    dispatch({
      type: "REPLACE_COMPLETE_STATE",
      payload: fnToSelectOptionThroughProvidedSelection(selected),
    });
  }, [selected?.length]);

  function fnToSelectOptionThroughProvidedSelection(selected) {
    return selected?.map((e) => ({ code: e?.code, name: e?.name, propsData: [null, e] }));
  }
  const [alreadyQueuedSelectedState, dispatch] = useReducer(
    reducer,
    selected,
    fnToSelectOptionThroughProvidedSelection
  );

  // Store callbacks in refs to avoid stale closures and unnecessary re-renders
  const onSelectRef = useRef(onSelect);
  const onCloseRef = useRef(onClose);
  onSelectRef.current = onSelect;
  onCloseRef.current = onClose;

  // Call onSelect whenever selection changes (real-time updates)
  // Skip initial mount to maintain backward compatibility
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onSelectRef.current(
      alreadyQueuedSelectedState?.map((e) => e.propsData),
      getCategorySelectAllState(),
      props
    );
  }, [alreadyQueuedSelectedState]);

  useEffect(() => {
    if (!active) {
      setSearchQuery("");
      if (onCloseRef.current) {
        onCloseRef.current(
          alreadyQueuedSelectedState?.map((e) => e.propsData),
          getCategorySelectAllState(),
          props
        );
      }
    }
  }, [active]);

  useEffect(() => {
    const initialCategorySelectedState = options?.reduce((acc, category) => {
      if (category.options) {
        var filteredCategoryOptions = category?.options;
        if (searchQuery?.length > 0) {
          filteredCategoryOptions = category?.options?.filter((option) => t(option?.code)?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
        }
        acc[category.code] = filteredCategoryOptions.every((option) =>
          alreadyQueuedSelectedState.some((selectedOption) => selectedOption.code === option.code)
        );
      }
      return acc;
    }, {});
    setCategorySelected(initialCategorySelectedState);
  }, [options, alreadyQueuedSelectedState, searchQuery]);

  const checkSelection = (optionstobeiterated) => {
    if (optionstobeiterated && optionstobeiterated.length > 0) {
      return optionstobeiterated?.every((option) =>
        alreadyQueuedSelectedState.some(
          (selectedOption) => selectedOption.code === option.code
        )
      );
    } else {
      return false;
    }
  };

  useEffect(() => {
    const allOptionsSelected =
      variant === "nestedmultiselect"
        ? checkSelection(flattenedOptions?.filter((option) => !option.options))
        : checkSelection(options);

    setSelectAllChecked(allOptionsSelected);

    const newCategorySelected = { ...categorySelected };
    options
      ?.filter((option) => option.options)
      ?.forEach((category) => {
        newCategorySelected[category.code] = undefined;
      });
    options
      ?.filter((option) => option.options)
      ?.forEach((category) => {
        // If the category has already been marked as false, skip further processing for this category.
        if (newCategorySelected[category.code] === false) return;
        let filteredCategoryOptions = category?.options;
        if (searchQuery?.length > 0) {
          filteredCategoryOptions = category?.options?.filter((option) =>
            t(option?.code)?.toLowerCase()?.includes(searchQuery?.toLowerCase())
          );
        }
        if (filteredCategoryOptions?.length > 0) {
          const allChildrenSelected = checkSelection(filteredCategoryOptions);
          if (!allChildrenSelected) {
            newCategorySelected[category.code] = false; // Mark as false if any child is not selected.
          } else {
            newCategorySelected[category.code] = true; // Mark as true if all children are selected.
          }
        }
      });
    setCategorySelected(newCategorySelected);
  }, [options, alreadyQueuedSelectedState, searchQuery]);

  function handleOutsideClickAndSubmitSimultaneously() {
    // Skip if dropdown was just closed by scroll - prevents blocking reopening
    if (closedByScrollRef.current) {
      closedByScrollRef.current = false;
      return;
    }
    setActive(false);
  }

  window?.Digit?.Hooks.useClickOutside(
    dropdownRef,
    handleOutsideClickAndSubmitSimultaneously,
    active,
    { capture: true }
  );

  useEffect(() => {
    setOptionIndex(0);
  }, [searchQuery]);

  function onSearch(e) {
    setSearchQuery(e.target.value);
  }

  function onSelectToAddToQueue(...props) {
    if (!restrictSelection) {
      if (variant === "treemultiselect") {
        const currentoptions = props[0];
        currentoptions?.forEach((option) => {
          const isAlreadySelected = alreadyQueuedSelectedState.some(
            (selectedOption) => selectedOption.code === option.code
          );
          if (!isAlreadySelected) {
            dispatch({
              type: "ADD_TO_SELECTED_EVENT_QUEUE",
              payload: [null, option],
            });
          } else {
            dispatch({
              type: "REMOVE_FROM_SELECTED_EVENT_QUEUE",
              payload: [null, option],
            });
            const parentOption = findParentOption(option, options);
            if (parentOption) {
              dispatch({
                type: "REMOVE_FROM_SELECTED_EVENT_QUEUE",
                payload: [null, parentOption],
              });
            }
          }
        });
      } else {
        const isChecked = arguments[0].target.checked;
        isChecked
          ? dispatch({ type: "ADD_TO_SELECTED_EVENT_QUEUE", payload: arguments })
          : dispatch({
            type: "REMOVE_FROM_SELECTED_EVENT_QUEUE",
            payload: arguments,
          });
      }
    } else {
      onSelectRef.current();
    }
  }

  const primaryColor = Colors.lightTheme.paper.primary;
  const inputBorderColor = Colors.lightTheme.generic.inputBorder;
  const primaryIconColor = Colors.lightTheme.primary[1];
  const dividerColor = Colors.lightTheme.generic.divider;
  const background = Colors.lightTheme.paper.secondary;

  const IconRender = (iconReq, isActive, isSelected) => {
    const iconFill = isActive || isSelected ? primaryColor : inputBorderColor;
    return iconRender(
      iconReq,
      iconFill,
      "1.25rem",
      "1.25rem",
      ""
    );
  };

  const handleClearAll = () => {
    // Prevent clear all if disabled
    if (disableClearAll) return;

    dispatch({ type: "REPLACE_COMPLETE_STATE", payload: [] });
    // onSelect is called via useEffect when alreadyQueuedSelectedState changes
    if (onCloseRef.current) {
      onCloseRef.current([], getCategorySelectAllState(), props);
    }
  };

  const handleSelectAll = () => {
    if (!restrictSelection) {
      if (selectAllChecked) {
        dispatch({ type: "REPLACE_COMPLETE_STATE", payload: [] });
        setSelectAllChecked(false);
      } else {
        const payload =
          variant === "nestedmultiselect"
            ? flattenedOptions
              ?.filter((option) => !option.options)
              ?.map((option) => ({
                code: option.code,
                name: option.name,
                propsData: [null, option],
              }))
            : options.map((option) => ({
              code: option.code,
              name: option.name,
              propsData: [null, option],
            }));
        dispatch({
          type: "REPLACE_COMPLETE_STATE",
          payload: payload,
        });
        setSelectAllChecked(true);
      }
      // onSelect is called via useEffect when alreadyQueuedSelectedState changes
    } else {
      onSelectRef.current();
    }
  };

  const handleCategorySelection = (parentOption) => {
    if (!restrictSelection) {
      const childoptions = parentOption.options;
      if (!categorySelected[parentOption.code]) {
        childoptions?.forEach((option) => {
          const isAlreadySelected = alreadyQueuedSelectedState.some((selectedOption) => selectedOption.code === option.code);
          if (!isAlreadySelected) {
            dispatch({
              type: "ADD_TO_SELECTED_EVENT_QUEUE",
              payload: [null, option],
            });
          }
        });
      } else {
        childoptions?.forEach((option) => {
          dispatch({
            type: "REMOVE_FROM_SELECTED_EVENT_QUEUE",
            payload: [null, option],
          });
        });
      }
      setCategorySelected((prev) => ({
        ...prev,
        [parentOption.code]: !categorySelected[parentOption.code],
      }));
      // onSelect is called via useEffect when alreadyQueuedSelectedState changes
    } else {
      onSelectRef.current();
    }
  };

  function getCategorySelectAllState() {
    if (variant === "nestedmultiselect") {
      const categorySelectAllState = {};
      options
        ?.filter((option) => option.options)
        ?.forEach((category) => {
          categorySelectAllState[category.code] = {
            isSelectAllChecked: categorySelected[category.code] || false,
          };
        });
      return categorySelectAllState;
    }
    return {};
  }


  const replaceDotWithColon = (inputString) => {
    if (inputString) {
      const updatedInputString = inputString.replace(/\./g, ": ");
      return updatedInputString;
    }
  };

  const countFinalChildOptions = (totalselectedOptions) => {
    let count = 0;
    totalselectedOptions?.forEach((option) => {
      if (!option.propsData[1]?.options) {
        count += 1;
      }
    });
    return count;
  };

  const selectOptionThroughKeys = (e, option) => {
    if (!option) return;
    let checked = alreadyQueuedSelectedState.find(
      (selectedOption) => selectedOption?.code === option?.code
    )
      ? true
      : false;
    if (!checked) {
      dispatch({
        type: "ADD_TO_SELECTED_EVENT_QUEUE",
        payload: [null, option],
      });
    } else {
      dispatch({
        type: "REMOVE_FROM_SELECTED_EVENT_QUEUE",
        payload: [null, option],
      });
    }
  };

  /* Custom function to scroll and select in the dropdowns while using key up and down */
  const keyChange = (e) => {
    const optionToScroll =
      variant === "nestedmultiselect" ? flattenedOptions : filteredOptions;

    if (optionToScroll.length === 0) {
      return; // No options to navigate
    }

    if (e.key == "ArrowDown") {
      setOptionIndex((state) =>
        state + 1 == optionToScroll.length ? 0 : state + 1
      );
      if (optionIndex + 1 == optionToScroll.length) {
        e?.target?.parentElement?.parentElement?.children
          ?.namedItem("jk-dropdown-unique")
          ?.scrollTo?.(0, 0);
      } else {
        optionIndex > 2 &&
          e?.target?.parentElement?.parentElement?.children
            ?.namedItem("jk-dropdown-unique")
            ?.scrollBy?.(0, 45);
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      setOptionIndex((state) =>
        state !== 0 ? state - 1 : optionToScroll.length - 1
      );
      if (optionIndex === 0) {
        e?.target?.parentElement?.parentElement?.children
          ?.namedItem("jk-dropdown-unique")
          ?.scrollTo?.(100000, 100000);
      } else {
        optionIndex > 2 &&
          e?.target?.parentElement?.parentElement?.children
            ?.namedItem("jk-dropdown-unique")
            ?.scrollBy?.(0, -45);
      }
      e.preventDefault();
    } else if (e.key == "Enter") {
      selectOptionThroughKeys(e, optionToScroll[optionIndex]);
    }
  };

  const filteredOptions =
    searchQuery?.length > 0
      ? options
        ?.map((option) => {
          if (option?.options && option.options.length > 0) {
            const matchingNestedOptions = option?.options?.filter(
              (nestedOption) =>
                t(nestedOption.code)
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            );

            if (matchingNestedOptions.length > 0) {
              return {
                ...option,

                options: matchingNestedOptions,
              };
            }
          } else if (option?.code) {
            if (
              t(option.code).toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return option;
            }
          }

          return null;
        })
        ?.filter(Boolean)
      : options;

  const parentOptionsWithChildren = filteredOptions?.filter(
    (option) => option.options && option.options.length > 0
  );

  const flattenOptions = (options) => {
    let flattened = [];
    options?.forEach((option) => {
      const existingOption = flattened.find(
        (flattenedOption) => flattenedOption?.code === option?.code
      );
      if (existingOption) {
        // If the code already exists, merge the new options
        if (option.options) {
          existingOption.options = existingOption.options || [];
          existingOption.options = existingOption.options.concat(option.options);
        }
      } else {
        flattened.push(option);
      }
      // Flatten any nested options
      if (option.options) {
        flattened = flattened.concat(option.options);
      }
    });
    // Remove duplicates by 'code' within the flattened array
    flattened = flattened?.filter(
      (option, index, self) =>
        index === self.findIndex((o) => o.code === option.code)
    );
    flattened.forEach((option) => {
      if (option.options) {
        option.options = option?.options?.filter(
          (opt, idx, arr) => idx === arr.findIndex((o) => o.code === opt.code)
        );
      }
    });
    return flattened;
  };

  const flattenedOptions = flattenOptions(parentOptionsWithChildren);

  function findParentOption(childOption, options) {
    for (const option of options) {
      if (
        option.options &&
        option.options.some((child) => child.code === childOption.code)
      ) {
        return option;
      }
      if (option.options) {
        const parentOption = findParentOption(childOption, option.options);
        if (parentOption) {
          return parentOption;
        }
      }
    }
    return null;
  }

  // Handler for chip close with disableClearAll check
  const handleChipClose = (value) => {
    if (variant === "treemultiselect") {
      onSelectToAddToQueue([value]);
    } else if (isPropsNeeded) {
      onSelectToAddToQueue({ target: { checked: false } }, value, props);
    } else {
      onSelectToAddToQueue({ target: { checked: false } }, value);
    }

    if (onChipClose) {
        onChipClose(value);
      }
  };

  const MenuItem = ({ option, index }) => {
    const [isActive, setIsActive] = useState(false);
    const isFrozen = frozenData.some((frozenOption) => frozenOption.code === option.code);
    const isSelected = alreadyQueuedSelectedState.find(
      (selectedOption) => selectedOption.code === option.code
    );
    const isKeyboardFocused = index === optionIndex && !isSelected;

    return (
      <div
        key={index}
        className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""
          } ${isSelected ? "checked" : ""} ${isKeyboardFocused ? "keyChange" : ""
          } ${isFrozen ? "frozen" : ""}`}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onMouseLeave={() => setIsActive(false)}
        role="option"
        aria-selected={isSelected ? "true" : "false"}
        aria-disabled={isFrozen ? "true" : "false"}
        tabIndex={-1}
      >
        <input
          type="checkbox"
          value={option.code}
          checked={isFrozen || isSelected ? true : false}
          onChange={(e) => {
            if (!isFrozen) {
              isPropsNeeded
                ? onSelectToAddToQueue(e, option, props)
                : onSelectToAddToQueue(e, option);
            }
          }}
          className={`digit-multi-select-dropdown-menuitem ${variant ? variant : ""
            } ${isFrozen ? "disabled" : ""}`}
          disabled={isFrozen}
          style={{
            cursor: isFrozen ? "not-allowed" : "pointer",
          }}
          aria-label={`${isFrozen ? "Disabled option" : "Select option"}: ${t(
            option[optionsKey] &&
            typeof option[optionsKey] == "string" &&
            option[optionsKey]
          )}`}
          aria-describedby={
            variant === "nestedtextmultiselect" && option.description
              ? `option-desc-${index}`
              : undefined
          }
        />
        <div className="digit-multiselectdropodwn-custom-checkbox">
          <SVG.Check width="20px" height="20px" fill={primaryColor} />
        </div>
        <div className="option-des-container">
          <div className="multiselectdropdown-icon-option">
            {config?.showIcon &&
              option?.icon &&
              IconRender(
                option?.icon,
                isActive,
                isSelected ? true : false
              )}
            <p className="digit-label">
              {t(
                option[optionsKey] &&
                typeof option[optionsKey] == "string" &&
                option[optionsKey]
              )}
            </p>
          </div>
          {variant === "nestedtextmultiselect" && option.description && (
            <div
              className="option-description"
              id={`option-desc-${index}`}
              aria-label="Option description"
            >
              {option.description}
            </div>
          )}
        </div>
      </div>
    );
  };

  const selectAllOption = addSelectAllCheck && (
    <div
      className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""
        } ${addSelectAllCheck ? "selectAll" : ""}`}
      role="option"
      aria-selected={selectAllChecked ? "true" : "false"}
      tabIndex={-1}
    >
      <input
        type="checkbox"
        checked={selectAllChecked}
        onChange={handleSelectAll}
        aria-label={`Select all options: ${selectAllLabel ? selectAllLabel : t("SELECT_ALL")}`}
      />
      <div className={`digit-multiselectdropodwn-custom-checkbox-selectAll`}>
        <SVG.Check width="20px" height="20px" fill={primaryIconColor} />
      </div>
      <p className={`digit-label ${addSelectAllCheck ? "selectAll" : ""}`}>
        {selectAllLabel ? selectAllLabel : t("SELECT_ALL")}
      </p>
    </div>
  );

  const Menu = () => {
    const optionsToRender =
      variant === "nestedmultiselect" ? flattenedOptions : filteredOptions;

    if (!optionsToRender || optionsToRender?.length === 0) {
      return (
        <div
          className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""
            } unsuccessfulresults`}
          key={"-1"}
          onClick={() => { }}
          role="option"
          aria-selected="false"
          aria-disabled="true"
          tabIndex={-1}
        >
          {<span> {t("NO_RESULTS_FOUND")}</span>}
        </div>
      );
    }

    return (
      <div role="listbox" aria-multiselectable="true">
        {selectAllOption}
        {optionsToRender?.map((option, index) => {
          if (option.options) {
            return (
              <div
                key={index}
                className={`digit-nested-category ${addSelectAllCheck || addCategorySelectAllCheck ? "selectAll" : ""
                  }`}
                role="group"
                aria-label={`Category: ${t(option[optionsKey])}`}
              >
                <div className="digit-category-name">
                  {t(option[optionsKey])}
                </div>
                {addCategorySelectAllCheck && (
                  <div
                    className="digit-category-selectAll"
                    onClick={() => handleCategorySelection(option)}
                    role="option"
                    aria-selected={selectAllChecked || categorySelected[option?.code] ? "true" : "false"}
                    tabIndex={-1}
                    aria-label={`Select all items in category: ${t(option[optionsKey])}`}
                  >
                    <div className="category-selectAll-label">
                      {categorySelectAllLabel
                        ? categorySelectAllLabel
                        : t("SELECT_ALL")}
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        selectAllChecked || categorySelected[option?.code]
                      }
                      aria-label={`Select all in ${t(option[optionsKey])} category`}
                    />
                    <div
                      className={`digit-multiselectdropodwn-custom-checkbox-selectAll`}
                      aria-hidden="true"
                    >
                      <SVG.Check width="20px" height="20px" fill={primaryIconColor} />
                    </div>
                  </div>
                )}
              </div>
            );
          } else {
            return <MenuItem option={option} key={index} index={index} />;
          }
        })}
      </div>
    );
  };

  return (
    <div>
      <div
        id={fieldId}
        className={`digit-multiselectdropdown-wrap ${props?.className ? props?.className : ""
          } ${variant ? variant : ""}`}
        ref={dropdownRef}
        style={props?.style}
      >
        <div
          className={`digit-multiselectdropdown-master${active ? `-active` : ``
            } ${disabled ? "disabled" : ""}  ${variant ? variant : ""} ${isSearchable ? "searchable" : ""}`}
          role="combobox"
          aria-expanded={active ? "true" : "false"}
          aria-haspopup="listbox"
          aria-label={`Multi-select dropdown: ${defaultLabel}`}
          aria-owns="jk-dropdown-unique"
          aria-describedby="dropdown-description"
        >
          <input
            className="digit-cursorPointer"
            style={{}}
            type="text"
            onKeyDown={keyChange}
            onFocus={() => setActive(true)}
            value={searchQuery}
            onChange={onSearch}
            aria-label={`Search options in ${defaultLabel}`}
            aria-autocomplete="list"
          />
          <div
            className="digit-multiselectdropdown-label"
            title={
              alreadyQueuedSelectedState.length > 0
                ? `${variant === "treemultiselect"
                  ? countFinalChildOptions(alreadyQueuedSelectedState)
                  : alreadyQueuedSelectedState.length} 
                   ${defaultUnit} Selected`
                : defaultLabel
            }
            id="dropdown-description"
            aria-live="polite"
          >
            {variant === "treemultiselect" ? (
              <p>
                {alreadyQueuedSelectedState.length > 0
                  ? `${countFinalChildOptions(
                    alreadyQueuedSelectedState
                  )} ${defaultUnit} Selected`
                  : defaultLabel}
              </p>
            ) : (
              <p>
                {alreadyQueuedSelectedState.length > 0
                  ? `${alreadyQueuedSelectedState.length} ${defaultUnit} Selected`
                  : defaultLabel}
              </p>
            )}
            <SVG.ArrowDropDown onClick={() => setActive(true)} fill={disabled ? dividerColor : inputBorderColor} />
          </div>
        </div>
        {active && (() => {
          const dropdownContent = (
            <div
              className="digit-multiselectdropdown-server"
              id="jk-dropdown-unique"
              style={{
                ...(disablePortal ? {} : {
                  position: "absolute",
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width || "auto",
                  zIndex: 999999,
                }),
                ...(ServerStyle ? ServerStyle : {}),
              }}
              role="region"
              aria-label="Dropdown options"
            >
              {variant === "treemultiselect" ? (
                <TreeSelect
                  options={parentOptionsWithChildren}
                  onSelect={onSelectToAddToQueue}
                  selectedOption={alreadyQueuedSelectedState}
                  variant={variant}
                  optionsKey={optionsKey}
                />
              ) : (
                <Menu />
              )}
            </div>
          );

          // Use portal only if not disabled and document exists
          if (!disablePortal && typeof document !== "undefined") {
            return createPortal(dropdownContent, document.body);
          }
          return dropdownContent;
        })()}
      </div>
      {config?.isDropdownWithChip ? (
        <div className="digit-tag-container" role="region" aria-label="Selected options">
          {alreadyQueuedSelectedState.length > 0 &&
            alreadyQueuedSelectedState
              ?.filter((value) => !value.propsData[1]?.options)
              ?.slice(0, config?.numberOfChips || alreadyQueuedSelectedState.length)
              ?.map((value, index) => {
                const translatedText = t(
                  chipsKey ? value[chipsKey] : value.code
                );
                const replacedText = replaceDotWithColon(translatedText);
                const isClose = frozenData.some(
                  (frozenOption) => frozenOption.code === value.code
                );
                return (
                  <Chip
                    key={index}
                    text={
                      replacedText?.length > 64
                        ? `${replacedText.slice(0, 64)}...`
                        : replacedText
                    }
                    onClick={() => handleChipClose(value)}
                    hideClose={isClose || (disableClearAll && alreadyQueuedSelectedState.length === 1)}
                    className="multiselectdropdown-tag"
                  />
                );
              })}
          {alreadyQueuedSelectedState.length > (config?.numberOfChips || alreadyQueuedSelectedState.length) && (
            <Button
              label={`+${alreadyQueuedSelectedState.length - (config?.numberOfChips || alreadyQueuedSelectedState.length)
                } ${t("SELECTED")}`}
              onClick={() => handleViewMore(alreadyQueuedSelectedState)}
              variation="link"
            />
          )}
          {alreadyQueuedSelectedState.length > 0 && frozenData.length === 0 && !disableClearAll && (
            <Button
              label={t(config?.clearLabel ? config?.clearLabel : t("CLEAR_ALL"))}
              onClick={handleClearAll}
              variation=""
              style={{
                height: "2rem",
                minWidth: "4.188rem",
                minHeight: "2rem",
                padding: "0.5rem",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "0.25rem",
                border: "1px solid #C84C0E",
                background: background,
              }}
              textStyles={{
                height: "auto",
                fontSize: "0.875rem",
                fontWeight: "400",
                width: "100%",
                lineHeight: "16px",
                color: primaryIconColor,
              }}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

MultiSelectDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  optionsKey: PropTypes.string.isRequired,
  selected: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
  defaultLabel: PropTypes.string,
  defaultUnit: PropTypes.string,
  props: PropTypes.object,
  isPropsNeeded: PropTypes.bool,
  ServerStyle: PropTypes.object,
  config: PropTypes.object,
  disablePortal: PropTypes.bool,
  disableClearAll: PropTypes.bool,
  onChipClose: PropTypes.func,
};

MultiSelectDropdown.defaultProps = {
  disablePortal: false,
  disableClearAll: false,
};

export default MultiSelectDropdown;