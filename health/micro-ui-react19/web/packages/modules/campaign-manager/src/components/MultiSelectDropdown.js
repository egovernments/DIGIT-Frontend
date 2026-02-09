import React, { useEffect, useReducer, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
// import Chip from "./Chip";
// import { SVG } from "./SVG";
// import Button from "./Button";
// import TreeSelect from "./TreeSelect";
// import { Colors} from "../constants/colors/colorconstants";
// import { iconRender } from "../utils/iconRender";

import { Button, CardHeader, Dropdown, LabelFieldPair } from "@egovernments/digit-ui-components";
import { TreeSelect } from "@egovernments/digit-ui-components";
import { SVG } from "@egovernments/digit-ui-components";
import { Chip } from "@egovernments/digit-ui-components";
import { PopUp } from "@egovernments/digit-ui-components";
import { CardLabel } from "@egovernments/digit-ui-components";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

const Colors = {
  lightTheme: {
    primary: {
      1: "#C84C0E",
      2: "#0B4B66",
      bg: "#FBEEE8",
    },
    text: {
      primary: "#363636",
      secondary: "#787878",
      disabled: "#C5C5C5",
    },
    alert: {
      error: "#B91900",
      errorbg: "#FFF5F4",
      success: "#00703C",
      successbg: "#F1FFF8",
      warning: "#9E5F00",
      warningbg: "#FFF9F0",
      info: "#0057BD",
      infobg: "#DEEFFF",
    },
    generic: {
      background: "#EEEEEE",
      divider: "#D6D5D4",
      inputBorder: "#505A5F",
    },
    paper: {
      primary: "#FFFFFF",
      secondary: "#FAFAFA",
    },
  },
};

const primaryColor = Colors.lightTheme.paper.primary;
const inputBorderColor = Colors.lightTheme.generic.inputBorder;
const primaryIconColor = Colors.lightTheme.primary[1];
const dividerColor = Colors.lightTheme.generic.divider;
const background = Colors.lightTheme.paper.secondary;

const Wrapper = ({
  boundaryOptions,
  setShowPopUp,
  alreadyQueuedSelectedState,
  onSelect,
  popUpOption,
  hierarchyType,
  frozenData,
  frozenType,
  onClose,
  disableClearAll = false,
}) => {
  const [dummySelected, setDummySelected] = useState(alreadyQueuedSelectedState);
  const boundaryType = alreadyQueuedSelectedState.find((item) => item.propsData[1] !== null)?.propsData[1]?.type;
  const { t } = useTranslation();
  function removeFromDummySelected(...props) {
    const updatedDummySelectedData = dummySelected.filter((item) => item.code !== props?.[1]?.code);
    setDummySelected(updatedDummySelectedData);
  }
  function handleSelected(value) {
    let res = [];
    value &&
      value?.map((ob) => {
        res.push(ob?.[1]);
      });

    res = res.map((item, index) => {
      if (!item.propsData) {
        const ob = value[index];
        return {
          code: item.code,
          name: item.name,
          propsData: [
            null,
            {
              code: item.code,
              name: item.name,
              type: item.type,
              parent: item.parent,
            },
          ],
        };
      }
      return item;
    });
    setDummySelected(res);
  }

  const handleClearAll = () => {
    setDummySelected([]);
  };
  return (
    <PopUp
      className={"selecting-boundaries-pop"}
      type={"default"}
      heading={`${t((hierarchyType + "_" + boundaryType).toUpperCase())} ${t(I18N_KEYS.COMPONENTS.DIGIT_SELECT)}`}
      children={[]}
      onOverlayClick={() => {
        setShowPopUp(false);
      }}
      footerChildren={[
        <Button
          className={"campaign-type-alert-button"}
          type={"button"}
          size={"large"}
          variation={"secondary"}
          label={t(I18N_KEYS.COMPONENTS.DIGIT_CLOSE)}
          title={t(I18N_KEYS.COMPONENTS.DIGIT_CLOSE)}
          onClick={() => {
            setShowPopUp(false);
          }}
        />,
        <Button
          className={"campaign-type-alert-button"}
          type={"button"}
          size={"large"}
          variation={"primary"}
          label={t(I18N_KEYS.COMPONENTS.DIGIT_CONFIRM_SELECTION)}
          title={t(I18N_KEYS.COMPONENTS.DIGIT_CONFIRM_SELECTION)}
          onClick={() => {
            const selectedPropsData = dummySelected.map((item) => item.propsData);
            onSelect(selectedPropsData);
            onClose(selectedPropsData);
            setShowPopUp(false);
          }}
        />,
      ]}
      onClose={() => {
        setShowPopUp(false);
      }}
      sortFooterChildren={true}
    >
      <LabelFieldPair>
        <CardLabel className={"boundary-selection-label"}>
          {t((hierarchyType + "_" + boundaryType).toUpperCase())}
          <span className="mandatory-span">*</span>
        </CardLabel>
        <div style={{ width: "100%" }}>
          <MultiSelectDropdown
            t={t}
            isSearchable={true}
            props={{ className: "selecting-boundaries-dropdown" }}
            options={Object.entries(popUpOption)
              .filter(([key]) => key.startsWith(boundaryType))
              .flatMap(([key, value]) =>
                Object.entries(value || {})
                  .filter(([subkey, item]) => {
                    // When disableClearAll is false (user clicked Yes), show all options
                    if (disableClearAll === false) {
                      return true;
                    }
                    const itemCode = item?.split(".")?.[0];
                    if (frozenData?.length > 0) {
                      const isFrozen = frozenData.some((frozenOption) => {
                        return frozenOption.code === subkey && frozenOption.type === boundaryType;
                      });
                      return frozenType === "filter" ? !isFrozen : true; // Filter or include based on frozenType
                    }
                    return true;
                  })
                  .map(([subkey, item]) => ({
                    code: item?.split(".")?.[0],
                    name: item?.split(".")?.[0],
                    options: [
                      {
                        code: subkey,
                        name: subkey,
                        type: boundaryType,
                        parent: `${item?.split(".")?.[0]}`,
                      },
                    ],
                  }))
              )}
            onSelect={(value) => {
              handleSelected(value);
            }}
            selected={dummySelected}
            optionsKey={"code"}
            addCategorySelectAllCheck={true}
            addSelectAllCheck={true}
            selectedNumber={dummySelected?.length}
            variant="nestedmultiselect"
            frozenData={frozenData}
          />
        </div>
      </LabelFieldPair>

      {Object.entries(
        dummySelected.reduce((acc, item) => {
          const parent = item?.propsData?.[1]?.parent || "Uncategorized";
          if (!acc[parent]) acc[parent] = [];
          acc[parent].push(item);
          return acc;
        }, {})
      ).map(([parent, items]) => (
        <div key={parent} className="parent-group">
          <div className="parent">{t(parent)}</div>
          <div className="digit-tag-container">
            {items.map((value, index) => {
              const translatedText = t(value.code);
              // Use disableClearAll to control close buttons
              const isClose = disableClearAll;
              return (
                <Chip
                  key={index}
                  text={translatedText?.length > 64 ? `${translatedText.slice(0, 64)}...` : translatedText}
                  onClick={(e) => removeFromDummySelected(e, value)}
                  className="multiselectdropdown-tag"
                  hideClose={isClose}
                />
              );
            })}
          </div>
          {!disableClearAll && (
            <Button
              label={t(I18N_KEYS.COMPONENTS.HCM_CLEAR_ALL)}
              title={t(I18N_KEYS.COMPONENTS.HCM_CLEAR_ALL)}
              onClick={() => {
                const updatedDummySelected = dummySelected.filter((item) => item?.propsData?.[1]?.parent !== parent);
                setDummySelected(updatedDummySelected);
              }}
              // onClick={handleClearAll}
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
                marginTop: "1rem",
                marginBottom: "1rem",
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
      ))}
    </PopUp>
  );
};

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
  frozenData = [],
  selectedNumber,
  popUpOption,
  hierarchyType,
  frozenType,
  isSearchable = false,
  disableClearAll = false,
}) => {
  const [active, setActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [optionIndex, setOptionIndex] = useState(-1);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [categorySelected, setCategorySelected] = useState({});
  const [showPopUp, setShowPopUp] = useState(false);
  const [dropDownType, setDropDownType] = useState(null);
  const dropdownRef = useRef();

  const { t } = useTranslation();

  function reducer(state, action) {
    switch (action.type) {
      case "ADD_TO_SELECTED_EVENT_QUEUE":
        // Check if the item already exists to prevent duplication
        if (state.some((e) => e.code === action.payload?.[1]?.code) || !action?.payload?.[1]?.type) {
          return state; // Return state unchanged if item is already in queue
        }
        return [...state, { code: action?.payload?.[1]?.code, name: action?.payload?.[1]?.name, propsData: action.payload }];
        // Check if the item already exists to prevent duplication
        if (state.some((e) => e.code === action.payload?.[1]?.code) || !action?.payload?.[1]?.type) {
          return state; // Return state unchanged if item is already in queue
        }
        return [...state, { code: action?.payload?.[1]?.code, name: action?.payload?.[1]?.name, propsData: action.payload }];

      case "REMOVE_FROM_SELECTED_EVENT_QUEUE":
        const newState = state.filter((e) => e?.code !== action.payload?.[1]?.code);
        onSelect(
          newState.map((e) => e.propsData),
          getCategorySelectAllState(),
          props
        );
        if (onClose && !active) {
          setSearchQuery("");
          onClose(
            newState.map((e) => e.propsData),
            getCategorySelectAllState(),
            props
          );
        }
        // Update the form state here
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

  // useEffect(() => {
  //   if (selected?.length == 0) {
  //     dispatch({
  //       type: "REPLACE_COMPLETE_STATE",
  //       payload: fnToSelectOptionThroughProvidedSelection(selected),
  //     });
  //   }
  // }, [selected?.length]);

  function fnToSelectOptionThroughProvidedSelection(selected) {
    return selected?.map((e) => ({ code: e?.code, name: e?.name, propsData: [null, e] }));
  }
  const [alreadyQueuedSelectedState, dispatch] = useReducer(reducer, selected, fnToSelectOptionThroughProvidedSelection);

  useEffect(() => {
    if (!active) {
      setSearchQuery("");
      onSelect(
        alreadyQueuedSelectedState?.map((e) => e.propsData),
        getCategorySelectAllState(),
        props
      );
      if (onClose) {
        onClose(
          alreadyQueuedSelectedState?.map((e) => e.propsData),
          getCategorySelectAllState(),
          props
        );
      }
    }
  }, [active]);

  useEffect(() => {
    const initialCategorySelectedState = options.reduce((acc, category) => {
      if (category.options) {
        var filteredCategoryOptions = category?.options;
        if (searchQuery?.length > 0) {
          filteredCategoryOptions = category?.options?.filter((option) =>
            t(option?.code)?.toLowerCase()?.includes(searchQuery?.toLowerCase())
          );
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
        alreadyQueuedSelectedState.some((selectedOption) => selectedOption.code === option.code)
      );
    } else {
      return false;
    }
  };

  useEffect(() => {
    const allOptionsSelected =
      variant === "nestedmultiselect" ? checkSelection(flattenedOptions.filter((option) => !option.options)) : checkSelection(options);

    setSelectAllChecked(allOptionsSelected);

    const newCategorySelected = { ...categorySelected };
    options
      .filter((option) => option.options)
      .forEach((category) => {
        newCategorySelected[category.code] = undefined;
      });
    options
      .filter((option) => option.options)
      .forEach((category) => {
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
    setActive(false);
  }

  window?.Digit?.Hooks.useClickOutside(dropdownRef, handleOutsideClickAndSubmitSimultaneously, active, { capture: true });
  const filtOptns =
    searchQuery?.length > 0
      ? options?.filter(
          (option) =>
            t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey].toUpperCase())
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase()) >= 0
        )
      : options;

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
          const isAlreadySelected = alreadyQueuedSelectedState.some((selectedOption) => selectedOption.code === option.code);
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
      onSelect(
        alreadyQueuedSelectedState?.map((e) => e.propsData),
        getCategorySelectAllState(),
        props
      );
    } else {
      onSelect();
    }
  }

  const IconRender = (iconReq, isActive, isSelected) => {
    const iconFill = isActive || isSelected ? primaryColor : inputBorderColor;
    return iconRender(iconReq, iconFill, "1.25rem", "1.25rem", "");
  };

  const handleClearAll = () => {
    dispatch({ type: "REPLACE_COMPLETE_STATE", payload: [] });
    onSelect([], getCategorySelectAllState(), props);
    if (onClose) {
      onClose([], getCategorySelectAllState(), props);
    }
  };

  const openPopUp = (alreadyQueuedSelectedState) => {
    setShowPopUp(true);
  };

  const handleSelectAll = () => {
    if (!restrictSelection) {
      if (selectAllChecked) {
        // Only remove items that are in the current options, keep others
        const currentOptionCodes =
          variant === "nestedmultiselect"
            ? flattenedOptions.filter((option) => !option.options).map((option) => option.code)
            : options.map((option) => option.code);
        const remainingSelections = alreadyQueuedSelectedState.filter((selected) => !currentOptionCodes.includes(selected.code));
        dispatch({ type: "REPLACE_COMPLETE_STATE", payload: remainingSelections });
        setSelectAllChecked(false);
      } else {
        const newPayload =
          variant === "nestedmultiselect"
            ? flattenedOptions
                .filter((option) => !option.options)
                .map((option) => ({
                  code: option.code,
                  name: option.name,
                  propsData: [null, option],
                }))
            : options.map((option) => ({
                code: option.code,
                name: option.name,
                propsData: [null, option],
              }));

        // Merge with existing selections, avoiding duplicates
        const existingSelections = alreadyQueuedSelectedState.filter(
          (existing) => !newPayload.some((newItem) => newItem.code === existing.code)
        );
        const mergedPayload = [...existingSelections, ...newPayload];

        dispatch({
          type: "REPLACE_COMPLETE_STATE",
          payload: mergedPayload,
        });
        setSelectAllChecked(true);
      }
      onSelect(
        alreadyQueuedSelectedState?.map((e) => e.propsData),
        getCategorySelectAllState(),
        props
      );
    } else {
      onSelect();
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
      onSelect(
        alreadyQueuedSelectedState?.map((e) => e.propsData),
        getCategorySelectAllState(),
        props
      );
    } else {
      onSelect();
    }
  };

  function getCategorySelectAllState() {
    if (variant === "nestedmultiselect") {
      const categorySelectAllState = {};
      options
        .filter((option) => option.options)
        .forEach((category) => {
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
    let checked = alreadyQueuedSelectedState.find((selectedOption) => selectedOption.code === option.code) ? true : false;
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
    const optionToScroll = variant === "nestedmultiselect" ? flattenedOptions : filteredOptions;
    if (e.key == "ArrowDown") {
      setOptionIndex((state) => (state + 1 == optionToScroll.length ? 0 : state + 1));
      if (optionIndex + 1 == optionToScroll.length) {
        e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollTo?.(0, 0);
      } else {
        optionIndex > 2 && e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollBy?.(0, 45);
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      setOptionIndex((state) => (state !== 0 ? state - 1 : optionToScroll.length - 1));
      if (optionIndex === 0) {
        e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollTo?.(100000, 100000);
      } else {
        optionIndex > 2 && e?.target?.parentElement?.parentElement?.children?.namedItem("jk-dropdown-unique")?.scrollBy?.(0, -45);
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
              const matchingNestedOptions = option.options.filter((nestedOption) =>
                t(nestedOption.code).toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (matchingNestedOptions.length > 0) {
                return {
                  ...option,
                  options: matchingNestedOptions,
                };
              }
            } else if (option?.code) {
              if (t(option.code).toLowerCase().includes(searchQuery.toLowerCase())) {
                return option;
              }
            }

            return null;
          })
          .filter(Boolean)
      : options;

  const parentOptionsWithChildren = filteredOptions.filter((option) => option.options && option.options.length > 0);

  // const flattenOptions = (options) => {
  //   let flattened = [];
  //   options?.forEach((option) => {
  //     if (option.options) {
  //       flattened.push(option);
  //       flattened = flattened.concat(option.options);
  //     } else {
  //       flattened.push(option);
  //     }
  //   });
  //   return flattened;
  // };

  const flattenOptions = (options) => {
    let flattened = [];

    options?.forEach((option) => {
      const existingOption = flattened.find((flattenedOption) => flattenedOption?.code === option?.code);

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
    flattened = flattened.filter((option, index, self) => index === self.findIndex((o) => o.code === option.code));

    flattened.forEach((option) => {
      if (option.options) {
        option.options = option.options.filter((opt, idx, arr) => idx === arr.findIndex((o) => o.code === opt.code));
      }
    });

    return flattened;
  };

  const flattenedOptions = flattenOptions(parentOptionsWithChildren);

  function findParentOption(childOption, options) {
    for (const option of options) {
      if (option.options && option.options.some((child) => child.code === childOption.code)) {
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
    // When disableClearAll is false (user clicked Yes), don't freeze any options
    // Only use frozenData when disableClearAll is not explicitly set to false
    const isFrozen = disableClearAll === false ? false : frozenData.some((frozenOption) => frozenOption.code === option.code);
    return (
      <div
        key={index}
        className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""} ${
          alreadyQueuedSelectedState.find((selectedOption) => selectedOption.code === option.code) ? "checked" : ""
        } ${
          index === optionIndex && !alreadyQueuedSelectedState.find((selectedOption) => selectedOption.code === option.code)
            ? "keyChange"
            : ""
        }${isFrozen ? "frozen" : ""}`}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onMouseLeave={() => setIsActive(false)}
        style={{
          pointerEvents: isFrozen ? "none" : "auto",
          opacity: isFrozen ? 0.6 : 1,
        }}
      >
        <input
          type="checkbox"
          value={option.code}
          checked={isFrozen || alreadyQueuedSelectedState.find((selectedOption) => selectedOption.code === option.code) ? true : false}
          // checked={alreadyQueuedSelectedState.find((selectedOption) => selectedOption.code === option.code) ? true : false}
          // onChange={(e) => {
          //   isPropsNeeded
          //     ? onSelectToAddToQueue(e, option, props)
          //     : isOBPSMultiple
          //     ? onSelectToAddToQueue(e, option, BlockNumber)
          //     : onSelectToAddToQueue(e, option);
          // }}
          // className={`digit-multi-select-dropdown-menuitem ${
          //   variant ? variant : ""
          // }`}
          onChange={(e) => {
            if (!isFrozen) {
              isPropsNeeded ? onSelectToAddToQueue(e, option, props) : onSelectToAddToQueue(e, option);
            }
          }}
          className={`digit-multi-select-dropdown-menuitem ${variant ? variant : ""} ${isFrozen ? "disabled" : ""}`}
          disabled={isFrozen}
          style={{
            cursor: isFrozen ? "not-allowed" : "pointer",
          }}
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
                alreadyQueuedSelectedState.find((selectedOption) => selectedOption.code === option.code) ? true : false
              )}
            <p className="digit-label">{t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey])}</p>
          </div>
          {variant === "nestedtextmultiselect" && option.description && <div className="option-description">{option.description}</div>}
        </div>
      </div>
    );
  };

  const selectAllOption = addSelectAllCheck && (
    <div className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""} ${addSelectAllCheck ? "selectAll" : ""}`}>
      <input type="checkbox" checked={selectAllChecked} onChange={handleSelectAll} />
      <div className={`digit-multiselectdropodwn-custom-checkbox-selectAll`}>
        <SVG.Check width="20px" height="20px" fill={primaryIconColor} />
      </div>
      <p className={`digit-label ${addSelectAllCheck ? "selectAll" : ""}`}>{selectAllLabel ? selectAllLabel : t(I18N_KEYS.COMMON.SELECT_ALL)}</p>
    </div>
  );
  const Menu = () => {
    const optionsToRender = variant === "nestedmultiselect" ? flattenedOptions : filteredOptions;

    if (!optionsToRender || optionsToRender?.length === 0) {
      return (
        <div className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""} unsuccessfulresults`} key={"-1"} onClick={() => {}}>
          {<span> {t(I18N_KEYS.COMPONENTS.NO_RESULTS_FOUND)}</span>}
        </div>
      );
    }

    return (
      <div>
        {selectAllOption}
        {optionsToRender?.map((option, index) => {
          if (option.options) {
            return (
              <div key={index} className={`digit-nested-category ${addSelectAllCheck ? "selectAll" : ""}`}>
                <div className="digit-category-name">{t(option[optionsKey])}</div>
                {addCategorySelectAllCheck && (
                  <div className="digit-category-selectAll" onClick={() => handleCategorySelection(option)}>
                    <div className="category-selectAll-label">{categorySelectAllLabel ? categorySelectAllLabel : t(I18N_KEYS.COMMON.SELECT_ALL)}</div>
                    <input type="checkbox" checked={selectAllChecked || categorySelected[option.code]} />
                    <div className={`digit-multiselectdropodwn-custom-checkbox-selectAll`}>
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
        className={`digit-multiselectdropdown-wrap ${props?.className ? props?.className : ""} ${variant ? variant : ""}`}
        ref={dropdownRef}
        style={props?.style}
      >
        <div
          className={`digit-multiselectdropdown-master${active ? `-active` : ``} ${disabled ? "disabled" : ""}  ${variant ? variant : ""} ${
            isSearchable ? "serachable" : ""
          }`}
        >
          <input
            className="digit-cursorPointer"
            style={{}}
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
                  ? `${countFinalChildOptions(alreadyQueuedSelectedState)} ${defaultUnit} Selected`
                  : defaultLabel}
              </p>
            ) : (
              // ) : (
              //   <p>{alreadyQueuedSelectedState.length > 0 ? `${alreadyQueuedSelectedState.length} ${defaultUnit} Selected` : defaultLabel}</p>
              // )}
              <p>
                {selectedNumber
                  ? `${selectedNumber} ${defaultUnit} Selected`
                  : alreadyQueuedSelectedState.length > 0
                  ? `${alreadyQueuedSelectedState.length} ${defaultUnit} Selected`
                  : defaultLabel}
              </p>
            )}
            <SVG.ArrowDropDown fill={disabled ? dividerColor : inputBorderColor} />
          </div>
        </div>
        {active ? (
          <div className="digit-multiselectdropdown-server" id="jk-dropdown-unique" style={ServerStyle ? ServerStyle : {}}>
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
            alreadyQueuedSelectedState
              .filter((value) => !value.propsData[1]?.options)
              .slice(0, config?.numberOfChips || 4)
              .map((value, index) => {
                const translatedText = t(config?.chipKey ? value[config?.chipKey] : value.code);
                const replacedText = replaceDotWithColon(translatedText);
                // disableClearAll takes precedence - when true, hide all close buttons
                // when false, show close buttons (allow modification)
                const isClose = disableClearAll;
                return (
                  <Chip
                    key={index}
                    text={replacedText?.length > 64 ? `${replacedText.slice(0, 64)}...` : replacedText}
                    onClick={
                      variant === "treemultiselect"
                        ? () => onSelectToAddToQueue([value])
                        : isPropsNeeded
                        ? (e) => onSelectToAddToQueue(e, value, props)
                        : (e) => {
                            onSelectToAddToQueue(e, value);
                          }
                    }
                    hideClose={isClose}
                    className="multiselectdropdown-tag"
                  />
                );
              })}

          {alreadyQueuedSelectedState.length > (config?.numberOfChips || 4) && (
            <Button
              label={`+${alreadyQueuedSelectedState.length - (config?.numberOfChips || 4)} ${t(I18N_KEYS.COMPONENTS.HCM_SELECTED)}`}
              title={`+${alreadyQueuedSelectedState.length - (config?.numberOfChips || 4)} ${t(I18N_KEYS.COMPONENTS.HCM_SELECTED)}`}
              onClick={() => openPopUp(alreadyQueuedSelectedState)}
              variation="link"
            />
          )}
          {showPopUp && (
            <Wrapper
              boundaryOptions={options}
              setShowPopUp={setShowPopUp}
              alreadyQueuedSelectedState={alreadyQueuedSelectedState}
              onSelect={onSelect}
              onClose={onClose}
              popUpOption={popUpOption}
              hierarchyType={hierarchyType}
              frozenData={frozenData}
              frozenType={frozenType}
              disableClearAll={disableClearAll}
            ></Wrapper>
          )}
          {alreadyQueuedSelectedState.length > 0 && !disableClearAll && (
            <Button
              label={t(config?.clearLabel ? config?.clearLabel : t(I18N_KEYS.COMMON.CLEAR_ALL))}
              title={t(config?.clearLabel ? config?.clearLabel : t(I18N_KEYS.COMMON.CLEAR_ALL))}
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
                background: "#FFFFFF",
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
  onClose: PropTypes.func,
  defaultLabel: PropTypes.string,
  defaultUnit: PropTypes.string,
  props: PropTypes.object,
  isPropsNeeded: PropTypes.bool,
  ServerStyle: PropTypes.object,
  config: PropTypes.object,
  disableClearAll: PropTypes.bool,
};

export default MultiSelectDropdown;
