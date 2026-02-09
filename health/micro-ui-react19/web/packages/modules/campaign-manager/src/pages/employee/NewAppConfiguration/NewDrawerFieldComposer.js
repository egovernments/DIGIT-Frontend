import React, { Fragment, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FieldV1, Switch, TextBlock, Tag, Divider, MultiSelectDropdown, RadioButtons, Loader } from "@egovernments/digit-ui-components";
import { updateSelectedField } from "./redux/remoteConfigSlice";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { useCustomT } from "./hooks/useCustomT";
import { getFieldTypeFromMasterData, getFieldValueByPath, getFieldTypeFromMasterData2, getFieldTypeOptionFromMasterData } from "./helpers";
import { TextInput, Button } from "@egovernments/digit-ui-components";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import NewDependentFieldWrapper from "./NewDependentFieldWrapper";
import { getLabelFieldPairConfig } from "./redux/labelFieldPairSlice";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import PopupConfigEditor from "./PopUpConfigEditor";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

// Utility functions for date conversion
const convertEpochToDateString = (epoch) => {
  if (!epoch) return "";
  const date = new Date(epoch);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const convertDateStringToEpoch = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).getTime();
};

// Helper function to check if a value is empty (null, undefined, empty string, or empty array)
const isValueEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

const RenderField = React.memo(({ panelItem, selectedField, onFieldChange, fieldType, isGroupChild = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const { pageType, currentData } = useSelector((state) => state.remoteConfig);

  // Hoisted hooks from switch cases to avoid hooks-in-conditionals violation
  const labelFieldPairState = useSelector((state) => state?.labelFieldPair);
  const fieldTypeDropdownRef = useRef(null);
  const labelPairListRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState("");
  // Local state for toggles to control UI without forcing Redux writes
  const [localToggle, setLocalToggle] = useState(false);

  const debounceTimerRef = useRef(null);
  // Ref to always have latest local value (prevents stale closure in blur handler)
  const localValueRef = useRef("");
  // Ref to track if user is actively editing (prevents useEffect from overwriting local value)
  const isEditingRef = useRef(false);

  // Ref to track latest selectedField for use in debounced callbacks (prevents stale closures)
  const selectedFieldRef = useRef(selectedField);
  useEffect(() => {
    selectedFieldRef.current = selectedField;
  }, [selectedField]);

  // Memoized getFieldValue to avoid recreating on every render
  const getFieldValue = useCallback(() => {
    const bindTo = panelItem.bindTo;
    return getFieldValueByPath(selectedField, bindTo, panelItem.defaultValue || "");
  }, [selectedField, panelItem.bindTo, panelItem.defaultValue]);

  // Keep local toggle in sync when selectedField changes from outside
  useEffect(() => {
    setLocalToggle(Boolean(getFieldValue()));
  }, [getFieldValue]);

  // Check if field should be visible based on field type
  const isFieldVisible = useCallback(() => {
    // If this is a child of a group, always show it (group handles its own visibility)
    if (isGroupChild) {
      return true;
    }
    // If visibilityEnabledFor is empty, the field is always visible
    if (!panelItem?.visibilityEnabledFor || panelItem.visibilityEnabledFor.length === 0) {
      return true;
    }
    // Check if current field type matches any of the enabled types
    return panelItem.visibilityEnabledFor.includes(fieldType);
  }, [isGroupChild, panelItem?.visibilityEnabledFor, fieldType]);

  // Get localized field value for text fields
  const fieldValue = getFieldValue();
  const localizedFieldValue = useCustomT(fieldValue);

  // Hoisted useCallback for table column visibility toggle
  const columns = selectedField?.data?.columns || [];
  const visibleColumnsCount = useMemo(() =>
    columns.filter((col) => col.isActive !== false).length,
    [columns]
  );

  const handleColumnVisibilityToggle = useCallback(
    (columnIndex, toggleValue) => {
      const currentColumns = selectedFieldRef.current?.data?.columns || [];
      const currentVisibleCount = currentColumns.filter((col) => col.isActive !== false).length;

      // Toggle ON means visible (hidden: false)
      // Toggle OFF means hidden (hidden: true)
      const hiddenValue = !Boolean(toggleValue);

      // Prevent hiding if this is the last visible column
      if (hiddenValue && currentVisibleCount === 1) {
        if (window.__appConfig_showToast && typeof window.__appConfig_showToast === "function") {
          window.__appConfig_showToast({
            key: "error",
            label: t(I18N_KEYS.APP_CONFIGURATION.AT_LEAST_ONE_COLUMN_MUST_BE_VISIBLE),
          });
        }
        return;
      }

      // Create updated columns array
      const updatedColumns = currentColumns.map((col, idx) => {
        if (idx === columnIndex) {
          return { ...col, hidden: hiddenValue, isActive: !hiddenValue };
        }
        return col;
      });

      // Update the selectedField with new columns
      const updatedField = {
        ...selectedFieldRef.current,
        data: {
          ...selectedFieldRef.current?.data,
          columns: updatedColumns,
        },
      };

      onFieldChange(updatedField);
    },
    [onFieldChange, t]
  );

  // Memoized options for fieldTypeDropdown to prevent recomputation every render
  const fieldTypeDropdownOptions = useMemo(() => {
    const fieldTypeOptions = fieldTypeMaster?.fieldTypeMappingConfig || [];
    const filteredOptions = fieldTypeOptions.filter((item) => {
      // Always filter out dynamic types
      if (item?.metadata?.type === "dynamic") return false;
      // Filter out template types only for forms (pageType === "object")
      if (pageType === "object" && item?.metadata?.type === "template") return false;
      return true;
    });

    const basicOptions = filteredOptions.filter((item) => item?.category === "basic");
    const advancedOptions = filteredOptions.filter((item) => item?.category === "advanced");

    return [
      {
        name: t(I18N_KEYS.APP_CONFIGURATION.FIELD_CATEGORY_BASIC),
        code: "basic",
        options: basicOptions.map((item) => ({ ...item, name: item.type, code: t(`${item.category}.${item.type}`) })),
      },
      {
        name: t(I18N_KEYS.APP_CONFIGURATION.FIELD_CATEGORY_ADVANCED),
        code: "advanced",
        options: advancedOptions.map((item) => ({ ...item, name: item.type, code: t(`${item.category}.${item.type}`) })),
      },
    ].filter((group) => group.options.length > 0);
  }, [fieldTypeMaster?.fieldTypeMappingConfig, pageType, t]);

  // Initialize local value when field changes
  useEffect(() => {
    // Don't overwrite local value while user is actively editing
    if (isEditingRef.current) return;
    if (panelItem.fieldType === "text") {
      const newVal = localizedFieldValue || "";
      setLocalValue(newVal);
      localValueRef.current = newVal;
    } else if (panelItem.fieldType === "number") {
      const value = getFieldValue();
      const newVal = value !== undefined && value !== null && value !== "" ? value : "";
      setLocalValue(newVal);
      localValueRef.current = newVal;
    }
  }, [panelItem.fieldType, localizedFieldValue, getFieldValue]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Fetch labelPairConfig when field type is labelPairList
  useEffect(() => {
    if (panelItem.fieldType === "labelPairList") {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      dispatch(getLabelFieldPairConfig({ tenantId }));
    }
  }, [panelItem.fieldType, dispatch]);

  // Early return AFTER all hooks to comply with React rules
  if (!isFieldVisible()) {
    return null;
  }

  // Get conditional fields to show based on toggle value
  const getConditionalFields = () => {
    // Only show conditional fields if showFieldOnToggle is enabled
    if (!panelItem?.showFieldOnToggle || !Array.isArray(panelItem?.conditionalField)) {
      return [];
    }

    const toggleValue = Boolean(getFieldValue());

    return panelItem.conditionalField.filter((cField) => {
      // If no condition specified, show only when toggle is true
      if (cField.condition === undefined) {
        return toggleValue;
      }
      // Show field only if its condition matches the current toggle value
      return cField.condition === toggleValue;
    });
  };

  const handleFieldChange = (value) => {
    const bindTo = panelItem.bindTo;

    // Update the field with the code (or value if no localization)
    if (bindTo.includes(".")) {
      // Handle nested properties with deep copy to avoid frozen object issues
      const keys = bindTo.split(".");
      const newField = JSON.parse(JSON.stringify(selectedField));
      let current = newField;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      onFieldChange(newField);
    } else {
      onFieldChange({ ...selectedField, [bindTo]: value });
    }
  };

  // Debounced handler for text fields with localization
  const handleFieldChangeWithLoc = useCallback(
    (code, value) => {
      const bindTo = panelItem.bindTo;

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the Redux dispatch
      debounceTimerRef.current = setTimeout(() => {
        // Use ref to get latest selectedField (prevents stale closure)
        const currentSelectedField = selectedFieldRef.current;
        let finalValueToSave;

        // Handle localization
        if (code) {
          // If a code is provided, update the localization entry
          dispatch(
            updateLocalizationEntry({
              code: code,
              locale: currentLocale || "en_IN",
              message: value,
            })
          );
          finalValueToSave = code; // Save the code instead of the value
        } else if (value && typeof value === "string" && value.trim() !== "") {
          // Create a unique code if no code is provided
          const timestamp = Date.now();
          const fieldName = bindTo.replace(/\./g, "_").toUpperCase();
          const uniqueCode = `FIELD_${fieldName}_${timestamp}`;

          // Update localization entry with the new code
          dispatch(
            updateLocalizationEntry({
              code: uniqueCode,
              locale: currentLocale || "en_IN",
              message: value,
            })
          );
          finalValueToSave = uniqueCode; // Save the generated code
        }

        // Update the field with the code (or value if no localization)
        if (bindTo.includes(".")) {
          // Handle nested properties with deep copy to avoid frozen object issues
          const keys = bindTo.split(".");
          const newField = JSON.parse(JSON.stringify(currentSelectedField));
          let current = newField;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = finalValueToSave;
          onFieldChange(newField);
        } else {
          onFieldChange({ ...currentSelectedField, [bindTo]: finalValueToSave });
        }
      }, 800); // 800ms debounce
    },
    [panelItem.bindTo, dispatch, currentLocale, onFieldChange]
  );

  // Debounced handler for number fields
  const handleNumberChange = useCallback(
    (value) => {
      const bindTo = panelItem.bindTo;

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the Redux dispatch
      debounceTimerRef.current = setTimeout(() => {
        // Use ref to get latest selectedField (prevents stale closure)
        const currentSelectedField = selectedFieldRef.current;
        if (bindTo.includes(".")) {
          // Handle nested properties with deep copy to avoid frozen object issues
          const keys = bindTo.split(".");
          const newField = JSON.parse(JSON.stringify(currentSelectedField));
          let current = newField;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = value;
          onFieldChange(newField);
        } else {
          onFieldChange({ ...currentSelectedField, [bindTo]: value });
        }
      }, 800); // 800ms debounce
    },
    [panelItem.bindTo, onFieldChange]
  );

  // Force dispatch immediately on blur (bypasses debounce)
  const handleBlur = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Use refs for latest values (prevents stale closure when blur fires right after onChange)
    const currentLocalValue = localValueRef.current;
    const currentSelectedField = selectedFieldRef.current;
    const bindTo = panelItem.bindTo;

    // Dispatch immediately to Redux (not debounced)
    if (panelItem.fieldType === "text") {
      if (panelItem?.isLocalisable === false) {
        // Non-localizable text: save raw value directly
        if (bindTo.includes(".")) {
          const keys = bindTo.split(".");
          const newField = JSON.parse(JSON.stringify(currentSelectedField));
          let current = newField;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = currentLocalValue;
          onFieldChange(newField);
        } else {
          onFieldChange({ ...currentSelectedField, [bindTo]: currentLocalValue });
        }
      } else {
        // Localizable text: handle localization code
        const currentFieldValue = getFieldValueByPath(currentSelectedField, bindTo, panelItem.defaultValue || "");
        let finalValueToSave;
        if (currentFieldValue) {
          dispatch(
            updateLocalizationEntry({
              code: currentFieldValue,
              locale: currentLocale || "en_IN",
              message: currentLocalValue,
            })
          );
          finalValueToSave = currentFieldValue;
        } else if (currentLocalValue && typeof currentLocalValue === "string" && currentLocalValue.trim() !== "") {
          const timestamp = Date.now();
          const fieldName = bindTo.replace(/\./g, "_").toUpperCase();
          const uniqueCode = `FIELD_${fieldName}_${timestamp}`;
          dispatch(
            updateLocalizationEntry({
              code: uniqueCode,
              locale: currentLocale || "en_IN",
              message: currentLocalValue,
            })
          );
          finalValueToSave = uniqueCode;
        }
        if (bindTo.includes(".")) {
          const keys = bindTo.split(".");
          const newField = JSON.parse(JSON.stringify(currentSelectedField));
          let current = newField;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = finalValueToSave;
          onFieldChange(newField);
        } else {
          onFieldChange({ ...currentSelectedField, [bindTo]: finalValueToSave });
        }
      }
    } else if (panelItem.fieldType === "number") {
      // Number: save value directly
      const numValue = currentLocalValue === "" || currentLocalValue === null || currentLocalValue === undefined ? null : currentLocalValue;
      if (bindTo.includes(".")) {
        const keys = bindTo.split(".");
        const newField = JSON.parse(JSON.stringify(currentSelectedField));
        let current = newField;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = numValue;
        onFieldChange(newField);
      } else {
        onFieldChange({ ...currentSelectedField, [bindTo]: numValue });
      }
    }
    isEditingRef.current = false;
  }, [
    panelItem.fieldType,
    panelItem?.isLocalisable,
    panelItem.bindTo,
    panelItem.defaultValue,
    dispatch,
    currentLocale,
    onFieldChange,
  ]);

  const renderMainField = () => {
    switch (panelItem.fieldType) {
      case "toggle": {
        const bindTo = panelItem.bindTo;
        const isMandatory = selectedField?.mandatory === true;
        const isDisabled = panelItem?.disableForRequired && isMandatory;

        const handleToggleChange = (value) => {
          const newToggleValue = Boolean(value);

          // Update local UI
          setLocalToggle(newToggleValue);
          const isHiddenField = bindTo === "hidden" || bindTo.includes(".hidden");
          const valueToSet = isHiddenField ? !newToggleValue : newToggleValue;

          let updatedField;

          // Handle nested properties with deep copy (e.g., "visibilityCondition.expression")
          if (bindTo.includes(".")) {
            const keys = bindTo.split(".");
            updatedField = JSON.parse(JSON.stringify(selectedField));
            let current = updatedField;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!current[keys[i]]) {
                current[keys[i]] = {};
              }
              current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = valueToSet;
          } else {
            // Only update the toggle's bindTo property, do not modify conditional field values
            updatedField = {
              ...selectedField,
              [bindTo]: valueToSet,
            };
          }

          // Special handling for systemDate toggle
          if (bindTo === "systemDate" && newToggleValue === true) {
            // When systemDate is toggled ON, clear startDate and endDate
            updatedField = {
              ...updatedField,
              dateRange: {
                ...selectedField.dateRange,
                startDate: null,
                endDate: null,
              },
            };
          }

          // Special handling for isMdms toggle
          // Retain existing values in both directions - transformer will decide what to use based on isMdms
          if (bindTo === "isMdms") {
            if (newToggleValue === true) {
              // When isMdms is toggled ON, just set isMdms to true
              // Keep dropDownOptions for potential switch back
              updatedField = {
                ...updatedField,
                isMdms: true,
              };
            } else {
              // When isMdms is toggled OFF, just set isMdms to false
              // Keep schemaCode for potential switch back
              updatedField = {
                ...updatedField,
                isMdms: false,
              };
            }
          }

          // isGS1 and scanner regex pattern are mutually exclusive
          if (newToggleValue) {
            const resolvedBindTo = bindTo.replace("toArray.", "");
            if (resolvedBindTo === "isGS1") {
              updatedField = { ...updatedField, pattern: false };
            } else if (resolvedBindTo === "pattern") {
              updatedField = { ...updatedField, isGS1: false };
            }
          }

          onFieldChange(updatedField);
        };
        return (
          <>
            <div id={`digit-sidepanel-switch-wrap-${panelItem.label}`}>
              <Switch
                label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
                onToggle={handleToggleChange}
                isCheckedInitially={localToggle}
                shapeOnOff
                disabled={isDisabled}
                isLabelFirst={true}
                className={"digit-sidepanel-switch-wrap sidepanel"}
              />
            </div>
            {/* Render Conditional Fields based on condition property */}
            {getConditionalFields().map((cField, index) => (
              <ConditionalField
                key={`${cField.bindTo}-${index}`}
                cField={cField}
                selectedField={selectedField}
                onFieldChange={onFieldChange}
              />
            ))}
          </>
        );
      }

      case "text": {
        const isMandatory = selectedField?.mandatory === true;
        const isDisabled = panelItem?.disableForRequired && isMandatory;
        return (
          <FieldV1
            type="text"
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
            value={localValue}
            onChange={(event) => {
              isEditingRef.current = true;
              setLocalValue(event.target.value);
              localValueRef.current = event.target.value;
              // If isLocalisable is false, save directly without localization
              // If undefined or true, use localization
              if (panelItem?.isLocalisable === false) {
                handleFieldChange(event.target.value);
              } else {
                handleFieldChangeWithLoc(fieldValue, event.target.value);
              }
            }}
            onBlur={handleBlur}
            placeholder={t(panelItem.innerLabel) || ""}
            populators={{ fieldPairClassName: "drawer-toggle-conditional-field" }}
            disabled={isDisabled}
          />
        );
      }

      case "number": {
        const isMandatory = selectedField?.mandatory === true;
        const isDisabled = panelItem?.disableForRequired && isMandatory;
        // Check if this is a length-related field (should not allow negative values)
        const isLengthField = panelItem.bindTo?.toLowerCase()?.includes("length");
        const isRangeField = panelItem.label?.toLowerCase()?.includes("minimum") || panelItem.label?.toLowerCase()?.includes("maximum");
        const shouldPreventNegative = isLengthField || isRangeField;

        return (
          <FieldV1
            type="number"
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
            value={localValue}
            onChange={(event) => {
              isEditingRef.current = true;
              const inputValue = event.target.value;
              // Allow empty string to clear the field
              if (inputValue === "" || inputValue === null || inputValue === undefined) {
                setLocalValue("");
                localValueRef.current = "";
                handleNumberChange(null);
                return;
              }

              // Validate input format - reject invalid patterns like "--1", "++1", etc.
              // Allow only valid number formats: optional single minus followed by digits
              const isValidFormat = /^-?\d+$/.test(inputValue);
              if (!isValidFormat) {
                // Clear the field for invalid format
                setLocalValue("");
                localValueRef.current = "";
                handleNumberChange(null);
                return;
              }

              const value = parseInt(inputValue, 10);
              // Only set if it's a valid number
              if (!isNaN(value)) {
                // Prevent negative values for length-related fields
                if (shouldPreventNegative && value < 0) {
                  // Clear the field for negative values in length/range fields
                  setLocalValue("");
                  localValueRef.current = "";
                  handleNumberChange(null);
                  return;
                }
                setLocalValue(value);
                localValueRef.current = value;
                handleNumberChange(value);
              } else {
                // Clear the field for NaN
                setLocalValue("");
                localValueRef.current = "";
                handleNumberChange(null);
              }
            }}
            onBlur={handleBlur}
            placeholder={t(panelItem.innerLabel) || ""}
            populators={{
              allowNegativeValues: !shouldPreventNegative,
              fieldPairClassName: "drawer-toggle-conditional-field",
              validation: {
                min: shouldPreventNegative ? 0 : undefined,
                pattern: shouldPreventNegative ? "^\\d+$" : "^-?\\d+$",
              },
            }}
            disabled={isDisabled}
          />
        );
      }

      case "date": {
        const isMandatory = selectedField?.mandatory === true;
        const isDisabled = panelItem?.disableForRequired && isMandatory;

        // Check if systemDate is enabled, and if so, disable this date field
        const isSystemDateEnabled = selectedField?.systemDate === true;
        const shouldDisable = isDisabled || isSystemDateEnabled;

        return (
          <FieldV1
            type="date"
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
            value={getFieldValue() ? convertEpochToDateString(getFieldValue()) : ""}
            onChange={(event) => {
              const epochValue = convertDateStringToEpoch(event.target.value);

              // Check if this is part of dateRange (startDate or endDate)
              const isDateRangeField = panelItem.bindTo?.includes("dateRange.");

              if (isDateRangeField) {
                // Update the date field
                if (panelItem.bindTo.includes(".")) {
                  const keys = panelItem.bindTo.split(".");
                  const newField = JSON.parse(JSON.stringify(selectedField));
                  let current = newField;
                  for (let i = 0; i < keys.length - 1; i++) {
                    if (!current[keys[i]]) {
                      current[keys[i]] = {};
                    }
                    current = current[keys[i]];
                  }
                  current[keys[keys.length - 1]] = epochValue;

                  // Check if both startDate and endDate are now filled
                  const hasStartDate = newField.dateRange?.startDate !== null && newField.dateRange?.startDate !== undefined;
                  const hasEndDate = newField.dateRange?.endDate !== null && newField.dateRange?.endDate !== undefined;

                  // If both date fields have values, turn off systemDate
                  if (hasStartDate && hasEndDate) {
                    newField.systemDate = false;
                  }

                  onFieldChange(newField);
                } else {
                  onFieldChange({ ...selectedField, [panelItem.bindTo]: epochValue });
                }
              } else {
                handleFieldChange(epochValue);
              }
            }}
            placeholder={t(panelItem.innerLabel) || ""}
            populators={{ fieldPairClassName: "drawer-toggle-conditional-field" }}
            disabled={shouldDisable}
          />
        );
      }

      case "group": {
        // Evaluate validation expression
        const evaluateValidation = () => {
          if (!panelItem.validationExpression) {
            return true;
          }

          try {
            const expression = panelItem.validationExpression;
            // Create a plain object copy to avoid "object is not extensible" errors
            // This allows expressions to reference properties directly (e.g., "range.max > range.min")
            const plainFieldCopy = JSON.parse(JSON.stringify(selectedField));

            // Extract field paths from expression (e.g., "lengthRange.minLength", "lengthRange.maxLength")
            const fieldPaths = expression.match(/[\w.]+/g)?.filter((p) => p.includes(".")) || [];

            // Helper to get nested value from path like "lengthRange.minLength"
            const getNestedValue = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

            // Check if ALL fields in expression have non-empty values - if any is empty, skip validation
            const allFieldsFilled = fieldPaths.every((path) => {
              const value = getNestedValue(plainFieldCopy, path);
              return value !== null && value !== undefined && value !== "";
            });
            if (!allFieldsFilled) return true;

            // Get all property names and values from the plain copy
            // Replace dots in property names with underscores to make them valid JS parameter names
            const paramNames = Object.keys(plainFieldCopy).map((key) => key.replace(/\./g, "_"));
            const paramValues = Object.values(plainFieldCopy);
            // Create function with all property names as parameters
            const func = new Function(...paramNames, `return ${expression}`);
            const result = func(...paramValues);
            return result;
          } catch (error) {
            console.error("Validation expression error:", error);
            return true; // Return true on error to avoid blocking
          }
        };

        const isValid = evaluateValidation();
        // Render group with children
        return (
          <>
            <div
              className={"app-config-group-heading"}
            >
              {t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {panelItem.children?.map((childItem, index) => (
                <RenderField
                  key={`${childItem.id}-${index}`}
                  panelItem={childItem}
                  selectedField={selectedField}
                  onFieldChange={onFieldChange}
                  fieldType={fieldType}
                  isGroupChild={true}
                />
              ))}
            </div>
            {/* Show validation message if validation fails */}
            {panelItem.validationMessage && !isValid && (
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#d32f2f",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ fontSize: "14px" }}>⚠</span>
                {t(panelItem.validationMessage)}
              </div>
            )}
          </>
        );
      }

      case "fieldTypeDropdown": {
        // Using hoisted refs and state from top of component
        // Get field type options from Redux - using fixed key 'fieldTypeMappingConfig'
        const fieldTypeOptions = fieldTypeMaster?.fieldTypeMappingConfig || [];
        // Find current selected field type based on type and format
        const currentSelectedFieldType = getFieldTypeOptionFromMasterData(selectedField, fieldTypeOptions);

        // Get current field's metadata type
        const metadataType = currentSelectedFieldType?.metadata?.type;

        // Determine if field should be disabled
        const isTemplate = metadataType === "template";
        const isDynamic = metadataType === "dynamic";
        const isMandatory = selectedField?.mandatory === true;
        const isDisabled = (panelItem?.disableForRequired && isMandatory) || isTemplate || isDynamic;

        return (
          <div
            ref={fieldTypeDropdownRef}
            className="drawer-container-tooltip"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {isDisabled && <span className="onhover-tooltip-text"> {t(I18N_KEYS.APP_CONFIGURATION.MANDATORY_FIELD_PROPERTIES_DISABLE_HOVER_TEXT)}</span>}
            <FieldV1
              config={{
                step: "",
              }}
              label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
              onChange={(value) => {
                const isIdPopulator = value?.type === "idPopulator";

                // Check if the new field type supports isMdms (has dropdown/select capabilities)
                const newFieldFormat = value?.metadata?.format;
                const supportsDropdownOptions = ["dropdown", "select", "multiselect", "radio"].includes(newFieldFormat);

                let updatedField;

                if (isIdPopulator) {
                  // idPopulator: set MDMS specific values
                  updatedField = {
                    ...selectedField,
                    type: value?.metadata?.type,
                    format: value?.metadata?.format,
                    isMdms: true,
                    MdmsDropdown: true,
                    schemaCode: "HCM.ID_TYPE_OPTIONS_POPULATOR",
                  };
                } else if (supportsDropdownOptions) {
                  // Field type supports dropdown options - reset MDMS/dropdown related values
                  updatedField = {
                    ...selectedField,
                    type: value?.metadata?.type,
                    format: value?.metadata?.format,
                    // Reset MDMS related values
                    isMdms: false,
                    MdmsDropdown: false,
                    schemaCode: null,
                    // Reset dropdown options
                    dropDownOptions: null,
                    enums: null,
                  };
                } else {
                  // Field type doesn't support dropdown options - clear all dropdown/MDMS related values
                  updatedField = {
                    ...selectedField,
                    type: value?.metadata?.type,
                    format: value?.metadata?.format,
                    // Clear MDMS related values
                    isMdms: undefined,
                    MdmsDropdown: undefined,
                    schemaCode: undefined,
                    // Clear dropdown options
                    dropDownOptions: undefined,
                    enums: undefined,
                  };
                }

                onFieldChange(updatedField);
              }}
              placeholder={t(panelItem?.innerLabel) || ""}
              populators={{
                title: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`)),
                fieldPairClassName: "drawer-toggle-conditional-field",
                options: fieldTypeDropdownOptions,
                optionsKey: "name",
                variant: "nesteddropdown",
                isSearchable: true,
                optionsCustomStyle:{maxHeight:"15vh"}
              }}
              type={"dropdown"}
              variant="nesteddropdown"
              value={currentSelectedFieldType ? { ...currentSelectedFieldType, name: currentSelectedFieldType.type, code: t(`${currentSelectedFieldType.category}.${currentSelectedFieldType.type}`) } : null}
              disabled={isDisabled}
            />
          </div>
        );
      }
      case "labelPairList": {
        // Using hoisted refs and state from top of component
        const {
          config: allLabelPairConfig = [],
          status,
          dataSource,
          error
        } = labelFieldPairState;
        // Show loading state while fetching from MDMS
        if (status === 'loading') {
          return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <Loader />
            </div>
          );
        }

        // Don't render until we have data (either from MDMS or fallback)
        // This prevents dummy config from being applied prematurely
        const shouldRender = status === 'succeeded' || status === 'failed';

        if (!shouldRender) {
          // Still in idle state, return null to prevent rendering
          return null;
        }

        // Filter label pairs based on module and page
        const isEnabledForModuleAndPage = (modules = [], module, page) =>
          modules.some((m) => m?.[module]?.enabledPages?.includes(page));

        const labelPairConfig = allLabelPairConfig
          .map((entity) => {
            const labelFields = (entity.labelFields || []).filter((field) =>
              isEnabledForModuleAndPage(
                field.modules,
                currentData?.module,
                currentData?.page
              )
            );

            return labelFields.length
              ? { ...entity, labelFields }
              : null;
          })
          .filter(Boolean);


        // Get currently selected data from selectedField.data
        const selectedData = selectedField?.data || [];

        // Create nested options structure for MultiSelectDropdown
        const nestedOptions = labelPairConfig.map((category) => ({
          code: category.entity,
          name: Digit.Utils.locale.getTransformedLocale(`LABEL_PAIR_CATEGORY_${category.entity}`),
          options: (category.labelFields || []).map((field) => ({
            ...field,
            code: `${category.entity}.${field.name}`,
            name: Digit.Utils.locale.getTransformedLocale(`LABEL_PAIR_${field.fieldKey}`),
            fieldKey: field.fieldKey,
            keyName: field.name,
            jsonPath: field.jsonPath,
          })),
        }));

        // Convert selectedField.data [{key, value}] to option objects for MultiSelectDropdown
        const selectedOptions = selectedData
          .map((item) => {
            if (!item || !item.key) return null;

            // Find the matching option from nestedOptions
            for (const category of nestedOptions) {
              const option = category.options.find((opt) => opt.keyName === item.key);
              if (option) {
                return option; // Return the actual option object
              }
            }
            return null;
          })
          .filter(Boolean);

        return (
          <>
            <div ref={labelPairListRef} className="drawer-container-tooltip">
              <div style={{ display: "flex" }}>
                <label>{t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}</label>
                <span className="mandatory-span">*</span>
              </div>

              <MultiSelectDropdown
                name={panelItem?.label}
                options={nestedOptions}
                optionsKey="name"
                chipsKey="name"
                disablePortal={true}
                type="multiselectdropdown"
                variant="nestedmultiselect"
                selectAllLabel={t(I18N_KEYS.COMMON.SELECT_ALL)}
                clearLabel={t(I18N_KEYS.COMMON.CLEAR_ALL)}
                config={{ isDropdownWithChip: true }}
                selected={selectedOptions} // Pass actual option objects directly
                onSelect={(selectedArray) => {
                  // selectedArray = [[null, option], [null, option]]
                  // const extractedOptions =
                  //   selectedArray?.map((arr) => arr?.[1]) || [];

                  // // 🚫 BLOCK removal of last remaining item
                  // if (extractedOptions.length === 0 && selectedData.length === 1) {
                  //   if (
                  //     window.__appConfig_showToast &&
                  //     typeof window.__appConfig_showToast === "function"
                  //   ) {
                  //     window.__appConfig_showToast({
                  //       key: "error",
                  //       label: t("AT_LEAST_ONE_FIELD_MUST_BE_SELECTED"),
                  //     });
                  //   }

                  //   // 🔁 Force restore current selection
                  //   onFieldChange({
                  //     ...selectedField,
                  //     data: selectedData,
                  //   });

                  //   return;
                  // }
                }}

                onChipClose={(value) => {
                  // Filter out the removed item from selectedData
                  const updatedData = selectedData.filter((item) => item.name !== value.name);

                  // Update the field with the new data (allow empty array)
                  onFieldChange({
                    ...selectedField,
                    data: updatedData,
                  });
                }}
                onClose={(selectedArray) => {
                  const extractedOptions =
                    selectedArray?.map((arr) => arr?.[1]) || [];
                  const mappedData = extractedOptions
                    .map((item) => {
                      let option;
                      if (Array.isArray(item) && item.length >= 2) {
                        option = item[1];
                      } else if (item?.keyName && item?.jsonPath) {
                        option = item;
                      } else {
                        return null;
                      }

                      return {
                        ...option,
                        key: option.keyName,
                        value: option.jsonPath,
                      };
                    })
                    .filter(Boolean);


                  const currentStr = JSON.stringify(selectedData);
                  const newStr = JSON.stringify(mappedData);

                  if (currentStr === newStr) return;

                  // Update the field with the new data (allow empty array)
                  onFieldChange({
                    ...selectedField,
                    data: mappedData,
                  });
                }}
                disabled={false}
                disableClearAll={true}
                t={t}
              />

              {/* Display selected fields with localization inputs */}
              {selectedData.length > 0 && (
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedData.map((item, index) => {
                    // Find entity name for this field
                    let entityName = "";
                    for (const entity of labelPairConfig) {
                      const field = entity.labelFields?.find((f) => f.name === item.key);
                      if (field) {
                        entityName = entity.entity;
                        break;
                      }
                    }

                    return (
                      <LocalizationInput
                        key={`${item.key}-${index}`}
                        code={item.key}
                        // item={item}
                        label={`${t(Digit.Utils.locale.getTransformedLocale(`LABEL_PAIR_CATEGORY_${entityName}`) || "ENTITY")} - ${t(Digit.Utils.locale.getTransformedLocale(`LABEL_PAIR_${item.fieldKey}`))}`}
                        // entityName={entityName}
                        selectedField={selectedField}
                        currentLocale={currentLocale}
                        dispatch={dispatch}
                        t={t}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </>
        );
      }
      case "table": {
        // Using hoisted columns, visibleColumnsCount, and handleColumnVisibilityToggle from top of component
        return (
          <>
            <div className="drawer-container-tooltip">
              <div style={{ display: "flex", marginBottom: "12px" }}>
                <label>{t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}</label>
              </div>

              {/* Display header localization inputs for each column */}
              {columns.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {columns.map((column, index) => {
                    // Check if this is the last visible column
                    const isLastVisible = visibleColumnsCount === 1 && column.isActive !== false;

                    return (
                      <LocalizationInput
                        key={`${column.header}-${index}`}
                        code={column.header}
                        label={`${t(I18N_KEYS.COMMON.COLUMN)} ${index + 1} - ${t(column.header)}`}
                        currentLocale={currentLocale}
                        dispatch={dispatch}
                        t={t}
                        placeholder={t(I18N_KEYS.COMMON.ADD_HEADER_LOCALIZATION)}
                        column={column}
                        columnIndex={index}
                        onColumnToggle={handleColumnVisibilityToggle}
                        isLastVisible={isLastVisible}
                      />
                    );
                  })}
                </div>
              )}

              {columns.length === 0 && (
                <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>{t(I18N_KEYS.APP_CONFIGURATION.NO_TABLE_COLUMNS_FOUND)}</div>
              )}
            </div>
          </>
        );
      }
      default:
        return null;
    }
  };

  return <div className="drawer-container-tooltip">{renderMainField()}</div>;
});

const LocalizationInput = React.memo(
  ({
    code,
    label,
    currentLocale,
    dispatch,
    t,
    placeholder,
    // Optional props for table column toggle
    column = null,
    columnIndex = null,
    onColumnToggle = null,
    isLastVisible = false,
  }) => {
    // Get the localized value - don't fallback to code, empty string is valid
    const localizedValue = useCustomT(code);

    // Check if this is a table column input (has column data and toggle handler)
    const isTableColumn = column !== null && columnIndex !== null && onColumnToggle !== null;

    // For table columns, toggle state controls visibility of input
    // Toggle ON = visible (hidden: false)
    // Toggle OFF = hidden (hidden: true)
    const isColumnHidden = isTableColumn ? column.isActive === false : false;

    // Local state to control the toggle and prevent it from changing when disabled
    const [toggleState, setToggleState] = useState(!isColumnHidden);

    // Sync toggle state with column hidden property
    useEffect(() => {
      setToggleState(!isColumnHidden);
    }, [isColumnHidden]);

    const handleToggle = (value) => {
      // Don't allow toggling off if this is the last visible column
      if (isLastVisible) {
        return; // Don't update state, don't call handler
      }

      // Update local state
      setToggleState(value);
      // Call parent handler
      onColumnToggle(columnIndex, value);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Label row with toggle for table columns */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label style={{ fontWeight: "500", fontSize: "14px" }}>{label}</label>

          {/* Show toggle only for table columns */}
          {isTableColumn && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Switch
                label=""
                onToggle={handleToggle}
                disable={isLastVisible}
                isCheckedInitially={toggleState}
                key={`toggle-${columnIndex}`}
                shapeOnOff
                isLabelFirst={true}
                className={"digit-sidepanel-switch-wrap"}
              />
            </div>
          )}
        </div>

        {/* Always render the input but hide it with CSS to maintain hook call order */}
        <div style={{ display: isColumnHidden ? "none" : "block" }}>
          <FieldV1
            value={localizedValue}
            type="text"
            placeholder={placeholder || t(I18N_KEYS.COMMON.ADD_LOCALIZATION)}
            onChange={(e) => {
              const val = e.target.value;
              // Update localization for the code
              dispatch(
                updateLocalizationEntry({
                  code: code,
                  locale: currentLocale || "en_IN",
                  message: val,
                })
              );
            }}
            populators={{
              fieldPairClassName: "drawer-toggle-conditional-field",
            }}
            disabled={isColumnHidden}
          />
        </div>
      </div>
    );
  }
);

// Separate component for option items to avoid hooks violations
const OptionItem = React.memo(({ item, cField, selectedField, onFieldChange, onDelete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);

  // Get translated value for display
  const translatedOptionValue = useCustomT(item.name);

  const handleChange = (e) => {
    const newValue = e.target.value;

    // Handle localization for the option name
    let localizationCode = item.name;

    if (localizationCode && typeof localizationCode === "string") {
      // Update existing localization entry
      dispatch(
        updateLocalizationEntry({
          code: localizationCode,
          locale: currentLocale || "en_IN",
          message: newValue,
        })
      );
    } else if (newValue && newValue.trim() !== "") {
      // Create new localization code
      const timestamp = Date.now();
      localizationCode = `OPTION_${item.code}_${timestamp}`;

      dispatch(
        updateLocalizationEntry({
          code: localizationCode,
          locale: currentLocale || "en_IN",
          message: newValue,
        })
      );
    }

    // Don't call onFieldChange if localizationCode is still empty (no valid name entered)
    if (!localizationCode || (typeof localizationCode === "string" && localizationCode.trim() === "")) {
      return;
    }

    // Update the option with the localization code
    const updated = (selectedField[cField.bindTo] || []).map((i) => (i.code === item.code ? { ...i, name: localizationCode } : i));
    onFieldChange({ ...selectedField, [cField.bindTo]: updated });
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <TextInput type="text" value={translatedOptionValue || ""} placeholder={t(I18N_KEYS.APP_CONFIGURATION.OPTION_PLACEHOLDER)} onChange={handleChange} />
      <div
        onClick={onDelete}
        style={{
          cursor: "pointer",
          fontWeight: "600",
          marginLeft: "1rem",
          fontSize: "1rem",
          color: "#c84c0e",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <DustbinIcon />
      </div>
    </div>
  );
});

// Separate component for conditional fields to avoid hooks violations
const ConditionalField = React.memo(({ cField, selectedField, onFieldChange }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);

  // Check if this field should skip localization
  // If isLocalisable is false, skip localization
  // If undefined or true, use localization (unless it's a special field like prefixText/suffixText/number)
  const shouldSkipLocalization =
    cField?.isLocalisable === false || cField.bindTo === "prefixText" || cField.bindTo === "suffixText" || cField.type === "number";

  // Get the raw value (localization code) from selectedField
  const fieldValue = selectedField[cField.bindTo] || "";

  // Always call useCustomT unconditionally to avoid hooks violation
  // Then conditionally use its result
  const localizedValue = useCustomT(fieldValue);
  const translatedValue = shouldSkipLocalization ? fieldValue : localizedValue;

  const [conditionalLocalValue, setConditionalLocalValue] = useState(translatedValue === true ? "" : translatedValue || "");
  const conditionalDebounceRef = useRef(null);
  // Ref to track if user is actively editing (prevents useEffect from overwriting local value)
  const isEditingRef = useRef(false);
  // Ref to always have latest local value (prevents stale closure in blur handler)
  const localValueRef = useRef(conditionalLocalValue);
  // Ref to always have latest selectedField (prevents stale closure in debounced callbacks)
  const selectedFieldRef = useRef(selectedField);
  // Ref to always have latest fieldValue
  const fieldValueRef = useRef(fieldValue);

  // Keep refs in sync
  useEffect(() => {
    selectedFieldRef.current = selectedField;
  }, [selectedField]);
  useEffect(() => {
    fieldValueRef.current = fieldValue;
  }, [fieldValue]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (conditionalDebounceRef.current) {
        clearTimeout(conditionalDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Don't overwrite local value while user is actively editing
    if (isEditingRef.current) return;
    const newVal = translatedValue === true ? "" : translatedValue || "";
    setConditionalLocalValue(newVal);
    localValueRef.current = newVal;
  }, [translatedValue]);

  const handleConditionalChange = useCallback(
    (value) => {
      if (conditionalDebounceRef.current) {
        clearTimeout(conditionalDebounceRef.current);
      }

      conditionalDebounceRef.current = setTimeout(() => {
        // Use refs to get latest values (prevents stale closures)
        const currentSelectedField = selectedFieldRef.current;
        const currentFieldValue = fieldValueRef.current;
        let finalValueToSave;

        // Skip localization for prefixText and suffixText
        if (shouldSkipLocalization) {
          finalValueToSave = value; // Save the raw value directly
        } else {
          // Handle localization
          if (currentFieldValue && typeof currentFieldValue === "string") {
            // If a code already exists (and it's a string, not a boolean), update the localization entry
            dispatch(
              updateLocalizationEntry({
                code: currentFieldValue,
                locale: currentLocale || "en_IN",
                message: value,
              })
            );
            finalValueToSave = currentFieldValue; // Save the code instead of the value
          } else if (value && typeof value === "string" && value.trim() !== "") {
            // Create a unique code if no code is provided
            const timestamp = Date.now();
            const fieldName = cField.bindTo.replace(/\./g, "_").toUpperCase();
            const uniqueCode = `FIELD_${fieldName}_${timestamp}`;

            // Update localization entry with the new code
            dispatch(
              updateLocalizationEntry({
                code: uniqueCode,
                locale: currentLocale || "en_IN",
                message: value,
              })
            );
            finalValueToSave = uniqueCode; // Save the generated code
          }
        }

        const newField = { ...currentSelectedField };
        newField[cField.bindTo] = finalValueToSave;
        onFieldChange(newField);
      }, 800);
    },
    [cField.bindTo, onFieldChange, dispatch, currentLocale, shouldSkipLocalization]
  );

  const handleConditionalBlur = useCallback(() => {
    if (conditionalDebounceRef.current) {
      clearTimeout(conditionalDebounceRef.current);
      conditionalDebounceRef.current = null;
    }

    // Use refs for latest values (prevents stale closure when blur fires right after onChange)
    const currentLocalValue = localValueRef.current;
    const currentSelectedField = selectedFieldRef.current;
    const currentFieldValue = fieldValueRef.current;

    // Immediately dispatch the current value with localization handling
    let finalValueToSave;

    // Skip localization for prefixText and suffixText
    if (shouldSkipLocalization) {
      finalValueToSave = currentLocalValue; // Save the raw value directly
    } else {
      if (currentFieldValue && typeof currentFieldValue === "string") {
        dispatch(
          updateLocalizationEntry({
            code: currentFieldValue,
            locale: currentLocale || "en_IN",
            message: currentLocalValue,
          })
        );
        finalValueToSave = currentFieldValue;
      } else if (currentLocalValue && typeof currentLocalValue === "string" && currentLocalValue.trim() !== "") {
        const timestamp = Date.now();
        const fieldName = cField.bindTo.replace(/\./g, "_").toUpperCase();
        const uniqueCode = `FIELD_${fieldName}_${timestamp}`;

        dispatch(
          updateLocalizationEntry({
            code: uniqueCode,
            locale: currentLocale || "en_IN",
            message: currentLocalValue,
          })
        );
        finalValueToSave = uniqueCode;
      }
    }

    const newField = { ...currentSelectedField };
    newField[cField.bindTo] = finalValueToSave;
    onFieldChange(newField);
    isEditingRef.current = false;
  }, [cField.bindTo, onFieldChange, dispatch, currentLocale, shouldSkipLocalization]);

  // Check if this is a prefix field for mobileNumber : should only accept numbers
  const isMobileNumberPrefix = selectedField?.format === "mobileNumber" && cField.bindTo === "prefixText";
  // Check if this is a prefix or suffix field for integer/number type
  const isIntegerPrefixOrSuffix = selectedField?.type === "integer" && (cField.bindTo === "prefixText" || cField.bindTo === "suffixText");
  const maxPrefixSuffixLength = 5; // Maximum length for prefix/suffix to prevent UI breaking

  switch (cField.type) {
    case "text":
    case "number":
    case "textarea":
      return (
        <div className="drawer-container-tooltip" style={{ marginTop: "8px" }}>
          <FieldV1
            type={isMobileNumberPrefix ? "text" : cField.type}
            label={cField.label ? t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${cField.label}`)) : null}
            value={conditionalLocalValue}
            onChange={(event) => {
              let newValue = event.target.value;

              // For mobile number prefix, only allow numbers and limit length
              if (isMobileNumberPrefix) {
                // Remove any non-numeric characters
                newValue = newValue.replace(/[^0-9]/g, "");
                // Limit the length
                if (newValue.length > maxPrefixSuffixLength) {
                  newValue = newValue.slice(0, maxPrefixSuffixLength);
                }
              }

              // For number type prefix/suffix, limit length
              if (isIntegerPrefixOrSuffix) {
                if (newValue.length > maxPrefixSuffixLength) {
                  newValue = newValue.slice(0, maxPrefixSuffixLength);
                }
              }

              isEditingRef.current = true;
              setConditionalLocalValue(newValue);
              localValueRef.current = newValue;
              handleConditionalChange(newValue);
            }}
            onBlur={handleConditionalBlur}
            placeholder={cField.innerLabel ? t(cField.innerLabel) : null}
            populators={{ fieldPairClassName: "drawer-toggle-conditional-field", validation: cField.validation,...((isMobileNumberPrefix || isIntegerPrefixOrSuffix) && { maxLength: maxPrefixSuffixLength }) }}
          />
        </div>
      );
    case "options":
      return (
        <div
          style={{
            padding: "1.5rem",
            border: "1px solid #c84c0e",
            borderRadius: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {(selectedField[cField.bindTo] || [])?.map((item, index) => (
            <OptionItem
              key={item?.code || index}
              item={item}
              cField={cField}
              selectedField={selectedField}
              onFieldChange={onFieldChange}
              onDelete={() => {
                const filtered = (selectedField[cField.bindTo] || []).filter((i) => i.code !== item.code);
                onFieldChange({ ...selectedField, [cField.bindTo]: filtered });
              }}
            />
          ))}

          <Button
            type="button"
            icon="AddIcon"
            size="small"
            variation="tertiary"
            label={t(I18N_KEYS.APP_CONFIGURATION.ADD_OPTIONS_SIDEPANEL)}
            title={t(I18N_KEYS.APP_CONFIGURATION.ADD_OPTIONS_SIDEPANEL)}
            className={`app-config-add-option-button`}
            style={{ color: "#c84c0e", height: "1.5rem", width: "fit-content" }}
            textStyles={{ color: "#c84c0e", fontSize: "0.875rem" }}
            onClick={() => {
              const newOption = { code: crypto.randomUUID(), name: "" };
              const updated = selectedField[cField.bindTo] ? [...selectedField[cField.bindTo], newOption] : [newOption];
              onFieldChange({ ...selectedField, [cField.bindTo]: updated });
            }}
          />
        </div>
      );

    case "dropdown":
      const dropdownOptionKey = cField.optionKey || "schemaCode";
      const bindValue = selectedField[cField.bindTo];
      return (
        <div className="drawer-container-tooltip" style={{ marginTop: "8px" }}>
          <FieldV1
            type="dropdown"
            label={cField.label ? t(Digit.Utils.locale.getTransformedLocale(`${cField.label}`)) : null}
            value={cField.options?.find((i) => i[dropdownOptionKey] === bindValue) || null}
            onChange={(value) => onFieldChange({ ...selectedField, [cField.bindTo]: value?.[dropdownOptionKey] })}
            placeholder={cField.innerLabel ? t(cField.innerLabel) : null}
            populators={{
              options: cField.options || [],
              optionsKey: dropdownOptionKey,
              fieldPairClassName: "drawer-toggle-conditional-field",
              disablePortal: true,
              optionsCustomStyle: { maxHeight: "10vh" }
            }}
          />
        </div>
      );

    case "dependencyFieldWrapper":
      return selectedField?.type !== "template" ? <NewDependentFieldWrapper t={t} /> : <></>;

    case "radioOptions":
      return (
        <RadioButtons
          options={cField?.options}
          additionalWrapperClass="app-config-radio"
          selectedOption={cField?.options?.find((i) => i.pattern === selectedField?.[cField?.bindTo])}
          onSelect={(value) => {
            onFieldChange({ ...selectedField, [cField?.bindTo]: value?.pattern });
          }}
          optionsKey="code"
        />
      );

    default:
      return null;
  }
});

// Simple tabs component - exported for use in SidePanelApp header
export const Tabs = React.memo(({ tabs, activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className="configure-app-tabs">
      {tabs.map((tab) => (
        <button key={tab} className={`configure-app-tab-head ${activeTab === tab ? "active" : ""} hover`} onClick={() => onTabChange(tab)}>
          <p style={{ margin: 0, position: "relative"}}>{t(`TAB_${tab.toUpperCase()}`)}</p>
        </button>
      ))}
    </div>
  );
});

function NewDrawerFieldComposer({ activeTab, onTabChange }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Get data from Redux
  const { selectedField } = useSelector((state) => state.remoteConfig);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const { byName: panelProperties } = useSelector((state) => state.fieldPanelMaster);
  // State to track validation errors
  const [validationErrors, setValidationErrors] = useState([]);

  // Get panel configuration - using fixed key 'drawerPanelConfig'
  const panelConfig = panelProperties?.drawerPanelConfig || {};
  const tabs = Object.keys(panelConfig);
  // Get current tab properties
  const currentTabProperties = useMemo(() => {
    return panelConfig[activeTab] || [];
  }, [panelConfig, activeTab]);

  // Get field type from field type master - using fixed key 'fieldTypeMappingConfig'
  const fieldType = useMemo(() => {
    if (!selectedField || !fieldTypeMaster?.fieldTypeMappingConfig) {
      return selectedField?.type || "textInput";
    }
    return getFieldTypeFromMasterData2(selectedField, fieldTypeMaster.fieldTypeMappingConfig);
  }, [selectedField, fieldTypeMaster]);

  // Filter properties based on field type visibility
  const visibleTabProperties = useMemo(() => {
    return currentTabProperties.filter((panelItem) => {
      // If visibilityEnabledFor is empty, the field is always visible
      if (!panelItem?.visibilityEnabledFor || panelItem.visibilityEnabledFor.length === 0) {
        return true;
      }
      // Check if current field type matches any of the enabled types
      return panelItem.visibilityEnabledFor.includes(fieldType) && panelItem?.isPopupProperty !== true;
    });
  }, [currentTabProperties, fieldType]);

  // Function to collect validation errors for the selected field (group validations only)
  // Note: Mandatory conditional field validation is now handled in AppConfigurationWrapper for ALL fields
  const checkValidationErrors = useCallback(() => {
    const errors = [];

    // Check all tabs for group fields with validation expressions (for selected field only)
    Object.keys(panelConfig).forEach((tabKey) => {
      const tabProperties = panelConfig[tabKey] || [];

      tabProperties.forEach((panelItem) => {
        // Check if this field is visible for current field type
        const isVisible =
          !panelItem?.visibilityEnabledFor ||
          panelItem.visibilityEnabledFor.length === 0 ||
          panelItem.visibilityEnabledFor.includes(fieldType);

        if (!isVisible) return;

        // Check group fields with validation expressions
        if (panelItem.fieldType === "group" && panelItem.validationExpression) {
          try {
            const expression = panelItem.validationExpression;
            const plainFieldCopy = JSON.parse(JSON.stringify(selectedField));

            // Extract field paths from expression (e.g., "lengthRange.minLength", "lengthRange.maxLength")
            const fieldPaths = expression.match(/[\w.]+/g)?.filter((p) => p.includes(".")) || [];

            // Helper to get nested value from path like "lengthRange.minLength"
            const getNestedValue = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

            // Check if ALL fields in expression have non-empty values - if any is empty, skip validation
            const allFieldsFilled = fieldPaths.every((path) => {
              const value = getNestedValue(plainFieldCopy, path);
              return value !== null && value !== undefined && value !== "";
            });
            if (!allFieldsFilled) return;

            const paramNames = Object.keys(plainFieldCopy).map((key) => key.replace(/\./g, "_"));
            const paramValues = Object.values(plainFieldCopy);
            const func = new Function(...paramNames, `return ${expression}`);
            const result = func(...paramValues);

            if (!result) {
              errors.push({
                fieldLabel: panelItem.label,
                message: panelItem.validationMessage,
                tab: tabKey,
              });
            }
          } catch (error) {
            console.error("Validation expression error:", error);
          }
        }
      });
    });

    setValidationErrors(errors);
    return errors;
  }, [panelConfig, selectedField, fieldType]);

  // Update validation errors when selectedField changes
  useEffect(() => {
    if (selectedField) {
      checkValidationErrors();
    }
  }, [selectedField, checkValidationErrors]);

  // Note: window.__appConfig_hasValidationErrors is now set in AppConfigurationWrapper
  // to validate ALL fields, not just the selected field

  // Handle field changes
  const handleFieldChange = (updatedField) => {
    dispatch(updateSelectedField(updatedField));
  };

  // Handle tab change with validation
  const handleTabChange = (newTab) => {
    const errors = checkValidationErrors();
    if (errors.length > 0) {
      // Show toast error and prevent tab switch
      const errorMessage = errors.map((err) => {
        // Handle error messages with parameters
        if (err.messageParams) {
          return t(err.message, err.messageParams);
        }
        return t(err.message);
      }).join(", ");
      // Show toast via window callback if available
      if (window.__appConfig_showToast && typeof window.__appConfig_showToast === "function") {
        window.__appConfig_showToast({
          key: "error",
          label: errorMessage,
        });
      }
      return;
    }
    onTabChange(newTab);
  };

  // Don't render if no field selected
  if (!selectedField) {
    return (
      <div style={{ padding: "16px" }}>
        <p>{t(I18N_KEYS.APP_CONFIGURATION.APP_CONFIG_NO_FIELD_SELECTED)}</p>
      </div>
    );
  }

  return (
    <Fragment>
      {/* Moved to SidePanelApp header for sticky behavior */}
      {/* <div className="app-config-drawer-subheader">
        <div className={"app-config-drawer-subheader-text"}>{t("APPCONFIG_PROPERTIES")}</div>
        <span className="icon-wrapper new">
          <ConsoleTooltip className="app-config-tooltip new" toolTipContent={t("TIP_APPCONFIG_PROPERTIES")} />
        </span>
      </div>
      <Divider /> */}

      {/* Tabs - Moved to SidePanelApp header for sticky behavior */}
      {/* <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} /> */}

      {/* Tab Description */}
      <TextBlock
        body=""
        caption={
          selectedField?.type === "template"
            ? t(`CMP_DRAWER_WHAT_IS_${activeTab.toUpperCase()}_${selectedField?.type?.toUpperCase()}`)
            : t(`CMP_DRAWER_WHAT_IS_${activeTab.toUpperCase()}`)
        }
        header=""
        captionClassName="camp-drawer-caption"
        subHeader=""
      />

      {/* Hidden Field Warning */}
      {selectedField?.hidden && (
        <div style={{ marginBottom: "16px" }}>
          <Tag showIcon={true} label={t(I18N_KEYS.APP_CONFIGURATION.CMP_DRAWER_FIELD_DISABLED_SINCE_HIDDEN)} type="warning" />
        </div>
      )}

      {/* Field Properties */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {visibleTabProperties.map((panelItem) => {
          const bindTo = panelItem?.bindTo || "";

          // If bindTo has ".", take the first part (parent key), otherwise use the whole bindTo
          const parentKey = bindTo.includes(".") ? bindTo.split(".")[0] : bindTo;

          const shouldShowToggle = !(
            (
              selectedField?.format === "panelCard" &&
              parentKey && // not empty
              selectedField?.[parentKey] === undefined
            ) // hide if missing
          );
          return shouldShowToggle ? (
            <div key={panelItem.id} className="drawer-toggle-field-container">
              <RenderField panelItem={panelItem} selectedField={selectedField} onFieldChange={handleFieldChange} fieldType={fieldType} />
            </div>
          ) : null;
        })}

        {/* No properties message */}
        {visibleTabProperties.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Tag showIcon={true} label={t(`CMP_DRAWER_NO_CONFIG_ERROR_${activeTab.toUpperCase()}`)} type="error" />
          </div>
        )}
      </div>
      {/* Popup Properties Section - Only for actionPopup field type */}
      {fieldType === "actionPopup" && activeTab === "content" && (
        <PopupConfigEditor selectedField={selectedField} />
      )}
    </Fragment>
  );
}

export default React.memo(NewDrawerFieldComposer);
