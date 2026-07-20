import React, { useEffect, useReducer, useRef, useState, useMemo, useCallback, useDeferredValue, useTransition } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FixedSizeList as List } from "react-window";

import { Button, CardHeader, Dropdown, LabelFieldPair, Loader } from "@egovernments/digit-ui-components";
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
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [optionIndex, setOptionIndex] = useState(-1);
  const searchDebounceRef = useRef(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [categorySelected, setCategorySelected] = useState({});
  const [showPopUp, setShowPopUp] = useState(false);
  const [dropDownType, setDropDownType] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef();
  const listRef = useRef(null);

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
          setSearchInputValue("");
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

  // Use a content-based key so the sync fires when selected items change, not just count
  const selectedSyncKey = useMemo(() => selected?.map((s) => s?.code).join(",") ?? "", [selected]);

  useEffect(() => {
    dispatch({
      type: "REPLACE_COMPLETE_STATE",
      payload: fnToSelectOptionThroughProvidedSelection(selected),
    });
  }, [selectedSyncKey]);

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
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
      setSearchQuery("");
      setSearchInputValue("");
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
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, [active]);

  const checkSelection = useCallback((optionstobeiterated) => {
    if (optionstobeiterated && optionstobeiterated.length > 0) {
      return optionstobeiterated.every((option) => selectedCodesSet.has(option.code));
    }
    return false;
  }, [selectedCodesSet]);

  useEffect(() => {
    const allOptionsSelected =
      variant === "nestedmultiselect" ? checkSelection(flattenedOptions.filter((option) => !option.options)) : checkSelection(options);

    setSelectAllChecked(allOptionsSelected);

    const query = deferredSearchQuery?.toLowerCase();
    const newCategorySelected = {};
    options
      .filter((option) => option.options)
      .forEach((category) => {
        let filteredCategoryOptions = category.options;

        if (query?.length > 0) {
          filteredCategoryOptions = category.options.filter((option) =>
            t(option?.code)?.toLowerCase()?.includes(query)
          );
        }

        if (filteredCategoryOptions?.length > 0) {
          newCategorySelected[category.code] = checkSelection(filteredCategoryOptions);
        }
      });

    setCategorySelected(newCategorySelected);
  }, [options, selectedCodesSet, deferredSearchQuery, checkSelection, flattenedOptions, variant, t]);

  function handleOutsideClickAndSubmitSimultaneously() {
    setActive(false);
  }

  window?.Digit?.Hooks.useClickOutside(dropdownRef, handleOutsideClickAndSubmitSimultaneously, active, { capture: true });
  const filtOptns = useMemo(() => {
    if (!deferredSearchQuery || deferredSearchQuery.length === 0) return options;
    const query = deferredSearchQuery.toLowerCase();
    return options?.filter(
      (option) =>
        t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey].toUpperCase())
          .toLowerCase()
          .indexOf(query) >= 0
    );
  }, [options, deferredSearchQuery, optionsKey, t]);

  useEffect(() => {
    setOptionIndex(0);
  }, [searchQuery]);

  function onSearch(e) {
    const value = e.target.value;
    setSearchInputValue(value);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
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
      // Show processing state immediately, then yield to browser before heavy work
      setIsProcessing(true);
      requestAnimationFrame(() => {
        startTransition(() => {
          if (selectAllChecked) {
            // Only remove items that are in the current options, keep others
            const currentOptionCodesSet = new Set(
              variant === "nestedmultiselect"
                ? flattenedOptions.filter((option) => !option.options).map((option) => option.code)
                : options.map((option) => option.code)
            );
            const remainingSelections = alreadyQueuedSelectedState.filter(
              (selected) => !currentOptionCodesSet.has(selected.code) || frozenCodesSet.has(selected.code)
            );
            dispatch({ type: "REPLACE_COMPLETE_STATE", payload: remainingSelections });
            setSelectAllChecked(false);
          } else {
            // Build the new selections from current options
            const sourceOptions =
              variant === "nestedmultiselect"
                ? flattenedOptions.filter((option) => !option.options)
                : options;

            // Use Set for O(n) dedup instead of O(n²) .some() check
            const newCodesSet = new Set(sourceOptions.map((option) => option.code));

            // Keep existing selections that aren't in the new set
            const existingSelections = alreadyQueuedSelectedState.filter(
              (existing) => !newCodesSet.has(existing.code)
            );

            const newPayload = sourceOptions.map((option) => ({
              code: option.code,
              name: option.name,
              propsData: [null, option],
            }));

            const mergedPayload = [...existingSelections, ...newPayload];

            dispatch({
              type: "REPLACE_COMPLETE_STATE",
              payload: mergedPayload,
            });
            setSelectAllChecked(true);
          }
          setIsProcessing(false);
          onSelect(
            alreadyQueuedSelectedState?.map((e) => e.propsData),
            getCategorySelectAllState(),
            props
          );
        });
      });
    } else {
      onSelect();
    }
  };

  const handleCategorySelection = (parentOption) => {
    if (!restrictSelection) {
      setIsProcessing(true);
      requestAnimationFrame(() => {
        startTransition(() => {
          const childoptions = parentOption.options;
          let newState;
          if (!categorySelected[parentOption.code]) {
            // Add all children in a single batch dispatch
            const childCodes = new Set(childoptions?.map((o) => o.code));
            const existing = alreadyQueuedSelectedState.filter((s) => !childCodes.has(s.code));
            const toAdd = childoptions
              ?.filter((option) => !selectedCodesSet.has(option.code))
              ?.map((option) => ({ code: option.code, name: option.name, propsData: [null, option] })) || [];
            newState = [...existing, ...alreadyQueuedSelectedState.filter((s) => childCodes.has(s.code)), ...toAdd];
          } else {
            // Remove all children in a single batch dispatch
            const childCodes = new Set(childoptions?.map((o) => o.code));
            newState = alreadyQueuedSelectedState.filter((s) => !childCodes.has(s.code) || frozenCodesSet.has(s.code));
          }
          dispatch({ type: "REPLACE_COMPLETE_STATE", payload: newState });
          setCategorySelected((prev) => ({
            ...prev,
            [parentOption.code]: !categorySelected[parentOption.code],
          }));
          setIsProcessing(false);
          onSelect(
            newState.map((e) => e.propsData),
            getCategorySelectAllState(),
            props
          );
        });
      });
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
      const newIndex = optionIndex + 1 >= optionToScroll.length ? 0 : optionIndex + 1;
      setOptionIndex(newIndex);
      if (listRef.current) {
        listRef.current.scrollToItem(newIndex);
      }
      e.preventDefault();
    } else if (e.key == "ArrowUp") {
      const newIndex = optionIndex !== 0 ? optionIndex - 1 : optionToScroll.length - 1;
      setOptionIndex(newIndex);
      if (listRef.current) {
        listRef.current.scrollToItem(newIndex);
      }
      e.preventDefault();
    } else if (e.key == "Enter") {
      selectOptionThroughKeys(e, optionToScroll[optionIndex]);
    }
  };
  const filteredOptions = useMemo(() => {
    if (!deferredSearchQuery || deferredSearchQuery.length === 0) return options;
    const query = deferredSearchQuery.toLowerCase();
    return options
      ?.map((option) => {
        if (option?.options && option.options.length > 0) {
          const matchingNestedOptions = option.options.filter((nestedOption) =>
            t(nestedOption.code).toLowerCase().includes(query)
          );
          if (matchingNestedOptions.length > 0) {
            return {
              ...option,
              options: matchingNestedOptions,
            };
          }
        } else if (option?.code) {
          if (t(option.code).toLowerCase().includes(query)) {
            return option;
          }
        }
        return null;
      })
      .filter(Boolean);
  }, [options, deferredSearchQuery, t]);

  const parentOptionsWithChildren = useMemo(
    () => filteredOptions.filter((option) => option.options && option.options.length > 0),
    [filteredOptions]
  );

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
    const seenCodes = new Map();
    const flattened = [];

    options?.forEach((option) => {
      const existing = seenCodes.get(option?.code);

      if (existing) {
        // If the code already exists, merge the new options into the copy
        if (option.options) {
          existing.options = (existing.options || []).concat(option.options);
        }
      } else {
        // Create a shallow copy to avoid mutating the original option
        const copy = option.options ? { ...option, options: [...option.options] } : option;
        seenCodes.set(option?.code, copy);
        flattened.push(copy);
      }

      // Flatten any nested options
      const children = option.options || [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!seenCodes.has(child.code)) {
          seenCodes.set(child.code, child);
          flattened.push(child);
        }
      }
    });

    // Dedup child options using Map — operates on our copies, not originals
    for (let i = 0; i < flattened.length; i++) {
      const option = flattened[i];
      if (option.options && option.options.length > 0) {
        const childMap = new Map();
        for (let j = 0; j < option.options.length; j++) {
          const opt = option.options[j];
          if (!childMap.has(opt.code)) {
            childMap.set(opt.code, opt);
          }
        }
        option.options = Array.from(childMap.values());
      }
    }

    return flattened;
  };

  const flattenedOptions = useMemo(() => flattenOptions(parentOptionsWithChildren), [parentOptionsWithChildren]);

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

  // Build a Set for O(1) selected lookups instead of repeated .find()
  const selectedCodesSet = useMemo(
    () => new Set(alreadyQueuedSelectedState.map((s) => s.code)),
    [alreadyQueuedSelectedState]
  );

  // Build a Set for frozen codes
  const frozenCodesSet = useMemo(
    () => new Set(frozenData.map((f) => f.code)),
    [frozenData]
  );

  const MenuItem = React.memo(({ option, index }) => {
    const [isActive, setIsActive] = useState(false);
    const isSelected = selectedCodesSet.has(option.code);
    const isFrozen = disableClearAll === false ? false : frozenCodesSet.has(option.code);
    return (
      <div
        key={index}
        className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""} ${isSelected ? "checked" : ""} ${
          index === optionIndex && !isSelected ? "keyChange" : ""
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
          checked={isFrozen || isSelected}
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
              IconRender(option?.icon, isActive, isSelected)}
            <p className="digit-label">{t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey])}</p>
          </div>
          {variant === "nestedtextmultiselect" && option.description && <div className="option-description">{option.description}</div>}
        </div>
      </div>
    );
  });

  const selectAllOption = addSelectAllCheck && (
    <div className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""} ${addSelectAllCheck ? "selectAll" : ""}`}>
      <input type="checkbox" checked={selectAllChecked} onChange={handleSelectAll} />
      <div className={`digit-multiselectdropodwn-custom-checkbox-selectAll`}>
        <SVG.Check width="20px" height="20px" fill={primaryIconColor} />
      </div>
      <p className={`digit-label ${addSelectAllCheck ? "selectAll" : ""}`}>{selectAllLabel ? selectAllLabel : t(I18N_KEYS.COMMON.SELECT_ALL)}</p>
    </div>
  );
  const ITEM_HEIGHT = 45;
  const MAX_VISIBLE_ITEMS = 8;
  const OVERSCAN_COUNT = 5;

  const Menu = () => {
    const optionsToRender = variant === "nestedmultiselect" ? flattenedOptions : filteredOptions;

    if (!optionsToRender || optionsToRender?.length === 0) {
      return (
        <div className={`digit-multiselectdropodwn-menuitem ${variant ? variant : ""} unsuccessfulresults`} key={"-1"} onClick={() => {}}>
          {<span> {t(I18N_KEYS.COMPONENTS.NO_RESULTS_FOUND)}</span>}
        </div>
      );
    }

    // Add 2px buffer to prevent sub-pixel scrollbar when items exactly fill the container
    const listHeight = Math.min(optionsToRender.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT + 2;

    const VirtualizedRow = ({ index, style }) => {
      const option = optionsToRender[index];
      if (option.options) {
        return (
          <div style={style} key={index} className={`digit-nested-category ${addSelectAllCheck ? "selectAll" : ""}`}>
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
        return (
          <div style={style}>
            <MenuItem option={option} index={index} />
          </div>
        );
      }
    };

    return (
      <div>
        {selectAllOption}
        <List
          ref={listRef}
          height={listHeight}
          itemCount={optionsToRender.length}
          itemSize={ITEM_HEIGHT}
          width="100%"
          overscanCount={OVERSCAN_COUNT}
          style={{ overflowX: "hidden" }}
        >
          {VirtualizedRow}
        </List>
      </div>
    );
  };
  return (
    <div style={{ position: "relative" }}>
      {(isProcessing || isPending) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.6)",
            zIndex: 1001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Loader />
        </div>
      )}
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
            value={searchInputValue}
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
              label={config?.clearLabel ? t(config?.clearLabel) : t(I18N_KEYS.COMMON.CLEAR_ALL)}
              title={config?.clearLabel ? t(config?.clearLabel) : t(I18N_KEYS.COMMON.CLEAR_ALL)}
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
