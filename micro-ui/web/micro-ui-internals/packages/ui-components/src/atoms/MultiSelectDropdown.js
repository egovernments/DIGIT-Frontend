import React, { useEffect, useReducer, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import RemoveableTag from "./RemoveableTag";
import { SVG } from "./SVG";
import Button from "./Button";
import TreeSelect from "./TreeSelect";

const MultiSelectDropdown = ({
  options,
  optionsKey,
  selected = [],
  onSelect,
  defaultLabel = "",
  defaultUnit = "",
  BlockNumber = 1,
  isOBPSMultiple = false,
  props,
  isPropsNeeded = false,
  ServerStyle = {},
  config,
  disabled,
  variant,
  addSelectAllCheck = false,
  addCategorySelectAllCheck = false,
  selectAllLabel = "",
  categorySelectAllLabel = ""
}) => {
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [optionIndex, setOptionIndex] = useState(-1);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [categorySelected, setCategorySelected] = useState({});
  const dropdownRef = useRef();
  const { t } = useTranslation();

  function reducer(state, action) {
    switch (action.type) {
      case "ADD_TO_SELECTED_EVENT_QUEUE":
        return [
          ...state,
          { code: action.payload?.[1]?.code, propsData: action.payload },
        ];
      case "REMOVE_FROM_SELECTED_EVENT_QUEUE":
        const newState = state.filter(
          (e) => e?.code !== action.payload?.[1]?.code
        );
        onSelect(
          newState.map((e) => e.propsData),
          props
        ); // Update the form state here
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
    return selected?.map((e) => ({ code: e?.code, propsData: [null, e] }));
  }
  const [alreadyQueuedSelectedState, dispatch] = useReducer(
    reducer,
    selected,
    fnToSelectOptionThroughProvidedSelection
  );

  useEffect(() => {
    if (!active) {
      onSelect(
        alreadyQueuedSelectedState?.map((e) => e.propsData),
        props
      );
    }
  }, [active]);

  useEffect(() => {
    const initialCategorySelectedState = options.reduce((acc, category) => {
      if (category.options) {
        acc[category.code] = category.options.every((option) =>
          alreadyQueuedSelectedState.some(
            (selectedOption) => selectedOption.code === option.code
          )
        );
      }
      return acc;
    }, {});
    setCategorySelected(initialCategorySelectedState);
  }, [options, alreadyQueuedSelectedState]);

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
        ? checkSelection(flattenedOptions.filter((option) => !option.options))
        : checkSelection(options);

    setSelectAllChecked(allOptionsSelected);

    const newCategorySelected = { ...categorySelected };
    options
      .filter((option) => option.options)
      .forEach((category) => {
        const allChildrenSelected = checkSelection(category.options);
        newCategorySelected[category.code] = allChildrenSelected;
      });
    setCategorySelected(newCategorySelected);
  }, [alreadyQueuedSelectedState]);

  function handleOutsideClickAndSubmitSimultaneously() {
    setActive(false);
  }

  window?.Digit?.Hooks.useClickOutside(
    dropdownRef,
    handleOutsideClickAndSubmitSimultaneously,
    active,
    { capture: true }
  );
  const filtOptns =
    searchQuery?.length > 0
      ? options?.filter(
          (option) =>
            t(
              option[optionsKey] &&
                typeof option[optionsKey] == "string" &&
                option[optionsKey].toUpperCase()
            )
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase()) >= 0
        )
      : options;

  function onSearch(e) {
    setSearchQuery(e.target.value);
  }

  function onSelectToAddToQueue(...props) {
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
  }

  const IconRender = (iconReq, isActive, isSelected) => {
    const iconFill = isActive || isSelected ? "#FFFFFF" : "#505A5F";
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
        console.log("Icon not Found");
        return null;
      }
    } catch (error) {
      console.error("Error in fetching icon");
      return null;
    }
  };

  const handleClearAll = () => {
    dispatch({ type: "REPLACE_COMPLETE_STATE", payload: [] });
    onSelect([], props);
  };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      dispatch({ type: "REPLACE_COMPLETE_STATE", payload: [] });
      setSelectAllChecked(false);
    } else {
      const payload =
        variant === "nestedmultiselect"
          ? flattenedOptions
              .filter((option) => !option.options)
              .map((option) => ({
                code: option.code,
                propsData: [null, option],
              }))
          : options.map((option) => ({
              code: option.code,
              propsData: [null, option],
            }));
      dispatch({
        type: "REPLACE_COMPLETE_STATE",
        payload: payload,
      });
      setSelectAllChecked(true);
    }
  };

  const handleCategorySelection = (parentOption) => {
    const childoptions = parentOption.options;
    if (!categorySelected[parentOption.code]) {
      childoptions?.forEach((option) => {
        dispatch({
          type: "ADD_TO_SELECTED_EVENT_QUEUE",
          payload: [null, option],
        });
      });
    } else {
      childoptions?.forEach((option) => {
        dispatch({
          type: "REMOVE_FROM_SELECTED_EVENT_QUEUE",
          payload: [null, option],
        });
      });
    }
  };

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

  /* Custom function to scroll and select in the dropdowns while using key up and down */
  const keyChange = (e) => {
    if (e.key == "ArrowDown") {
      setOptionIndex((state) =>
        state + 1 == filtOptns.length ? 0 : state + 1
      );
      if (optionIndex + 1 == filtOptns.length) {
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
        state !== 0 ? state - 1 : filtOptns.length - 1
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
      onSelectToAddToQueue(e, filtOptns[optionIndex]);
    }
  };

  const filteredOptions =
    searchQuery?.length > 0
      ? options?.filter(
          (option) =>
            t(
              option[optionsKey] &&
                typeof option[optionsKey] == "string" &&
                option[optionsKey].toUpperCase()
            )
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase()) >= 0
        )
      : options;

  const parentOptionsWithChildren = filteredOptions.filter(option => option.options && option.options.length > 0);

  const flattenOptions = (options) => {
    let flattened = [];
    options?.forEach((option) => {
      if (option.options) {
        flattened.push(option);
        flattened = flattened.concat(option.options);
      } else {
        flattened.push(option);
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

  const MenuItem = ({ option, index }) => {
    const [isActive, setIsActive] = useState(false);
    return (
      <div
        key={index}
        className={`digit-multiselectdropodwn-menuitem ${
          variant ? variant : ""
        } ${
          alreadyQueuedSelectedState.find(
            (selectedOption) => selectedOption.code === option.code
          )
            ? "checked"
            : ""
        } ${
          index === optionIndex &&
          !alreadyQueuedSelectedState.find(
            (selectedOption) => selectedOption.code === option.code
          )
            ? "keyChange"
            : ""
        }`}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onMouseLeave={() => setIsActive(false)}
      >
        <input
          type="checkbox"
          value={option.code}
          checked={
            alreadyQueuedSelectedState.find(
              (selectedOption) => selectedOption.code === option.code
            )
              ? true
              : false
          }
          onChange={(e) => {
            isPropsNeeded
              ? onSelectToAddToQueue(e, option, props)
              : isOBPSMultiple
              ? onSelectToAddToQueue(e, option, BlockNumber)
              : onSelectToAddToQueue(e, option);
          }}
          className={`digit-multi-select-dropdown-menuitem ${
            variant ? variant : ""
          }`}
        />
        <div className="digit-multiselectdropodwn-custom-checkbox">
          <SVG.Check width="20px" height="20px" fill={"#FFFFFF"} />
        </div>
        <div className="option-des-container">
          <div className="multiselectdropdown-icon-option">
            {config?.showIcon &&
              option?.icon &&
              IconRender(
                option?.icon,
                isActive,
                alreadyQueuedSelectedState.find(
                  (selectedOption) => selectedOption.code === option.code
                )
                  ? true
                  : false
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
            <div className="option-description">{option.description}</div>
          )}
        </div>
      </div>
    );
  };

  const selectAllOption = addSelectAllCheck && (
    <div
      className={`digit-multiselectdropodwn-menuitem ${
        variant ? variant : ""
      } ${addSelectAllCheck ? "selectAll" : ""}`}
    >
      <input
        type="checkbox"
        checked={selectAllChecked}
        onChange={handleSelectAll}
      />
      <div className={`digit-multiselectdropodwn-custom-checkbox-selectAll`}>
        <SVG.Check width="20px" height="20px" fill={"#C84C0E"} />
      </div>
      <p className={`digit-label ${addSelectAllCheck ? "selectAll" : ""}`}>
        {selectAllLabel ? selectAllLabel : "Select All"}
      </p>
    </div>
  );

  const Menu = () => {
    const optionsToRender =
      variant === "nestedmultiselect" ? flattenedOptions : filteredOptions;

    if (!optionsToRender) {
      return null;
    }

    return (
      <div>
        {selectAllOption}
        {optionsToRender?.map((option, index) => {
          if (option.options) {
            return (
              <div
                key={index}
                className={`digit-nested-category ${
                  addSelectAllCheck ? "selectAll" : ""
                }`}
              >
                <div className="digit-category-name">{t(option[optionsKey])}</div>
                {addCategorySelectAllCheck && (
                  <div
                    className="digit-category-selectAll"
                    onClick={() => handleCategorySelection(option)}
                  >
                    <div className="category-selectAll-label">
                      {categorySelectAllLabel
                        ? categorySelectAllLabel
                        : "Select All"}
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        selectAllChecked || categorySelected[option.code]
                      }
                    />
                    <div
                      className={`digit-multiselectdropodwn-custom-checkbox-selectAll`}
                    >
                      <SVG.Check width="20px" height="20px" fill={"#C84C0E"} />
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
        className={`digit-multiselectdropdown-wrap ${
          props?.className ? props?.className : ""
        } ${variant ? variant : ""}`}
        ref={dropdownRef}
        style={props?.style}
      >
        <div
          className={`digit-multiselectdropdown-master${
            active ? `-active` : ``
          } ${disabled ? "disabled" : ""}  ${variant ? variant : ""}`}
        >
          <input
            className="digit-cursorPointer"
            style={{ opacity: 0 }}
            type="text"
            onKeyDown={keyChange}
            onFocus={() => setActive(true)}
            value={searchQuery}
            onChange={onSearch}
          />
          <div className="digit-multiselectdropdown-label">
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
            <SVG.ArrowDropDown fill={disabled ? "#D6D5D4" : "#505A5F"} />
          </div>
        </div>
        {active ? (
          <div
            className="digit-multiselectdropdown-server"
            id="jk-dropdown-unique"
            style={ServerStyle ? ServerStyle : {}}
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
        ) : null}
      </div>
      {config?.isDropdownWithChip ? (
        <div className="digit-tag-container">
          {alreadyQueuedSelectedState.length > 0 &&
            alreadyQueuedSelectedState.map((value, index) => {
              if (!value.propsData[1]?.options) {
                const translatedText = t(value.code);
                const replacedText = replaceDotWithColon(translatedText);
                return (
                  <RemoveableTag
                    key={index}
                    text={
                      replacedText.length > 64
                        ? `${replacedText.slice(0, 64)}...`
                        : replacedText
                    }
                    onClick={
                      variant === "treemultiselect"
                        ? () => onSelectToAddToQueue([value])
                        : isPropsNeeded
                        ? (e) => onSelectToAddToQueue(e, value, props)
                        : (e) => onSelectToAddToQueue(e, value)
                    }
                    className="multiselectdropdown-tag"
                  />
                );
              }
              return null;
            })}
          {alreadyQueuedSelectedState.length > 0 && (
            <Button
              label={t(config?.clearLabel ? config?.clearLabel : "Clear All")}
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
                background: "#FAFAFA",
              }}
              textStyles={{
                height: "auto",
                fontSize: "0.875rem",
                fontWeight: "400",
                width: "100%",
                lineHeight: "16px",
                color: "#C84C0E",
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
  BlockNumber: PropTypes.number,
  isOBPSMultiple: PropTypes.bool,
  props: PropTypes.object,
  isPropsNeeded: PropTypes.bool,
  ServerStyle: PropTypes.object,
  config: PropTypes.object,
};

export default MultiSelectDropdown;
