import React, { Fragment, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FieldV1, Switch, TextBlock, Tag, Divider, MultiSelectDropdown, RadioButtons, Loader } from "@egovernments/digit-ui-components";
import { updateSelectedField } from "./redux/remoteConfigSlice";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { useCustomT } from "./hooks/useCustomT";
import { getFieldTypeFromMasterData, getFieldValueByPath, getFieldTypeFromMasterData2 } from "./helpers";
import { TextInput, Button } from "@egovernments/digit-ui-components";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import NewDependentFieldWrapper from "./NewDependentFieldWrapper";
import { getLabelFieldPairConfig } from "./redux/labelFieldPairSlice";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import PopupConfigEditor from "./PopUpConfigEditor";

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

const RenderField = React.memo(({ panelItem, selectedField, onFieldChange, fieldType, isGroupChild = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const { pageType, currentData } = useSelector((state) => state.remoteConfig);

  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState("");
  // Local state for toggles to control UI without forcing Redux writes
  const [localToggle, setLocalToggle] = useState(false);

  // Keep local toggle in sync when selectedField changes from outside
  useEffect(() => {
    setLocalToggle(Boolean(getFieldValue()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField, panelItem.bindTo]);
  const debounceTimerRef = useRef(null);

  // Check if field should be visible based on field type
  const isFieldVisible = () => {
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
  };

  if (!isFieldVisible()) {
    return null;
  }

  const getFieldValue = () => {
    const bindTo = panelItem.bindTo;
    return getFieldValueByPath(selectedField, bindTo, panelItem.defaultValue || "");
  };

  // Get localized field value for text fields
  const fieldValue = getFieldValue();
  const localizedFieldValue = useCustomT(fieldValue);

  // Initialize local value when field changes
  useEffect(() => {
    if (panelItem.fieldType === "text") {
      setLocalValue(localizedFieldValue || "");
    } else if (panelItem.fieldType === "number") {
      const value = getFieldValue();
      setLocalValue(value !== undefined && value !== null && value !== "" ? value : "");
    }
  }, [selectedField, panelItem.bindTo, panelItem.fieldType]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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

  useEffect(() => {
    if (panelItem.fieldType === "labelPairList") {
      const tenantId = Digit.ULBService.getCurrentTenantId();
      dispatch(getLabelFieldPairConfig({ tenantId }));
    }
  }, [panelItem.fieldType, dispatch]);

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
          const newField = JSON.parse(JSON.stringify(selectedField));
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
          onFieldChange({ ...selectedField, [bindTo]: finalValueToSave });
        }
      }, 800); // 800ms debounce
    },
    [panelItem.bindTo, dispatch, currentLocale, selectedField, onFieldChange]
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
      }, 800); // 800ms debounce
    },
    [panelItem.bindTo, selectedField, onFieldChange]
  );

  // Force dispatch on blur
  const handleBlur = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Immediately dispatch the current value
    if (panelItem.fieldType === "text") {
      // If isLocalisable is false, save directly without localization
      // If undefined or true, use localization
      if (panelItem?.isLocalisable === false) {
        handleFieldChange(localValue);
      } else {
        handleFieldChangeWithLoc(fieldValue, localValue);
      }
    } else if (panelItem.fieldType === "number") {
      handleNumberChange(localValue);
    }
  }, [
    panelItem.fieldType,
    panelItem?.isLocalisable,
    fieldValue,
    localValue,
    handleFieldChangeWithLoc,
    handleNumberChange,
    handleFieldChange,
  ]);

  const renderMainField = () => {
    switch (panelItem.fieldType) {
      case "toggle": {
        const bindTo = panelItem.bindTo;
        const isMandatory = selectedField?.mandatory === true;
        const isDisabled = panelItem?.disableForRequired && isMandatory;

        const handleToggleChange = (value) => {
          // Update local UI
          setLocalToggle(Boolean(value));
          const isHiddenField = bindTo === "hidden" || bindTo.includes(".hidden");
          const valueToSet = isHiddenField ? !Boolean(value) : Boolean(value);

          // Special handling for systemDate toggle
          if (bindTo === "systemDate" && Boolean(value) === true) {
            // When systemDate is toggled ON, clear startDate and endDate
            const updatedField = {
              ...selectedField,
              [bindTo]: valueToSet,
              dateRange: {
                ...selectedField.dateRange,
                startDate: null,
                endDate: null,
              },
            };
            onFieldChange(updatedField);
          } else {
            // Always update Redux store with the toggle value
            handleFieldChange(valueToSet);
          }
        };
        return (
          <>
            <Switch
              label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
              onToggle={handleToggleChange}
              isCheckedInitially={localToggle}
              shapeOnOff
              disabled={isDisabled}
              isLabelFirst={true}
              className={"digit-sidepanel-switch-wrap"}
            />
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
              setLocalValue(event.target.value);
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
        const isLengthField = panelItem.bindTo?.toLowerCase()?.includes("length") ;
        const isRangeField=  panelItem.label?.toLowerCase()?.includes("minimum") || panelItem.label?.toLowerCase()?.includes("maximum");
        return (
          <FieldV1
            type="number"
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
            value={localValue}
            onChange={(event) => {
              const inputValue = event.target.value;
              // Allow empty string to clear the field
              if (inputValue === "" || inputValue === null || inputValue === undefined) {
                setLocalValue("");
                handleNumberChange(null);
              } else {
                const value = parseInt(inputValue);
                // Only set if it's a valid number
                if (!isNaN(value) || typeof inputValue === "string") {
                  // Prevent negative values for length-related fields
                  if ((isLengthField || isRangeField) && value < 0) {
                    return;
                  }
                  setLocalValue(value);
                  handleNumberChange(value);
                }
              }
            }}
            onBlur={handleBlur}
            placeholder={t(panelItem.innerLabel) || ""}
            populators={{
              fieldPairClassName: "drawer-toggle-conditional-field",
              validation: { min: isLengthField ? 0 : undefined },
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
              style={{
                fontWeight: "600",
                marginBottom: "12px",
                fontSize: "14px",
              }}
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
        const switchRef = useRef(null);
        const [showTooltip, setShowTooltip] = useState(false);

        // Get field type options from Redux - using fixed key 'fieldTypeMappingConfig'
        const fieldTypeOptions = fieldTypeMaster?.fieldTypeMappingConfig || [];
        // Find current selected field type based on type and format
        const currentSelectedFieldType = fieldTypeOptions.find((item) => {
          const typeMatches = item?.metadata?.type === selectedField?.type;
          const formatMatches = item?.metadata?.format === selectedField?.format;

          // Special handling for custom format with fieldName
          if (selectedField?.format === "custom" && selectedField?.fieldName) {
            const fieldNameMatches = item?.type === selectedField?.fieldName;
            return typeMatches && formatMatches && fieldNameMatches;
          }

          // Handle different matching scenarios:
          // 1. If field has both type and format, match both
          if (selectedField?.format) {
            return typeMatches && formatMatches;
          }
          // 2. If field only has type, try to match where format equals the field's type
          // (e.g., field.type = "text" should match metadata: {type: "string", format: "text"})
          else {
            return typeMatches || item?.metadata?.format === selectedField?.type;
          }
        });

        // Get current field's metadata type
        const metadataType = currentSelectedFieldType?.metadata?.type;

        // Determine if field should be disabled
        const isTemplate = metadataType === "template";
        const isDynamic = metadataType === "dynamic";
        const isMandatory = selectedField?.mandatory === true;
        const isDisabled = (panelItem?.disableForRequired && isMandatory) || isTemplate || isDynamic;

        return (
          <div
            ref={switchRef}
            className="drawer-container-tooltip"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {isDisabled && <span className="onhover-tooltip-text"> {t("MANDATORY_FIELD_PROPERTIES_DISABLE_HOVER_TEXT")}</span>}
            <FieldV1
              config={{
                step: "",
              }}
              label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}
              onChange={(value) => {
                const isIdPopulator = value?.type === "idPopulator";
                const updatedField = {
                  ...selectedField,
                  type: value?.metadata?.type,
                  format: value?.metadata?.format,
                  ...(isIdPopulator && { isMdms: true, MdmsDropdown: true, schemaCode: "HCM.ID_TYPE_OPTIONS_POPULATOR" }),
                };
                onFieldChange(updatedField);
              }}
              placeholder={t(panelItem?.innerLabel) || ""}
              populators={{
                title: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`)),
                fieldPairClassName: "drawer-toggle-conditional-field",
                options: (() => {
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
                      name: t("FIELD_CATEGORY_BASIC"),
                      code: "basic",
                      options: basicOptions.map((item) => ({ ...item, name: item.type, code: t(`${item.category}.${item.type}`) })),
                    },
                    {
                      name: t("FIELD_CATEGORY_ADVANCED"),
                      code: "advanced",
                      options: advancedOptions.map((item) => ({ ...item, name: item.type, code: t(`${item.category}.${item.type}`) })),
                    },
                  ].filter((group) => group.options.length > 0);
                })(),
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
        const switchRef = useRef(null);

        // Fetch labelPairConfig state from Redux with all metadata
        const labelFieldPairState = useSelector((state) => state?.labelFieldPair);
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
          name: category.entity,
          options: (category.labelFields || []).map((field) => ({
            ...field,
            code: `${category.entity}.${field.name}`,
            name: field.name,
            fieldKey: field.fieldKey,
            jsonPath: field.jsonPath,
          })),
        }));

        // Convert selectedField.data [{key, value}] to option objects for MultiSelectDropdown
        const selectedOptions = selectedData
          .map((item) => {
            if (!item || !item.key) return null;

            // Find the matching option from nestedOptions
            for (const category of nestedOptions) {
              const option = category.options.find((opt) => opt.name === item.key);
              if (option) {
                return option; // Return the actual option object
              }
            }
            return null;
          })
          .filter(Boolean);

        return (
          <>
            <div ref={switchRef} className="drawer-container-tooltip">
              <div style={{ display: "flex" }}>
                <label>{t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`))}</label>
                <span className="mandatory-span">*</span>
              </div>

              <MultiSelectDropdown
                name={panelItem?.label}
                options={nestedOptions}
                optionsKey="name"
                chipsKey="code"
                disablePortal={true}
                type="multiselectdropdown"
                variant="nestedmultiselect"
                selectAllLabel={t("SELECT_ALL")}
                clearLabel={t("CLEAR_ALL")}
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

                frozenData={
                  selectedData.length === 1
                    ? selectedOptions.map((opt) => ({ code: opt.code }))
                    : []
                }
                onChipClose={(value) => {
                  // 🚫 BLOCK removal of last remaining item
                  if (selectedData.length === 1) {
                    if (
                      window.__appConfig_showToast &&
                      typeof window.__appConfig_showToast === "function"
                    ) {
                      window.__appConfig_showToast({
                        key: "error",
                        label: t("AT_LEAST_ONE_FIELD_MUST_BE_SELECTED"),
                      });
                    }
                    return;
                  }

                  // Filter out the removed item from selectedData
                  const updatedData = selectedData.filter((item) => item.key !== value.name);

                  // Update the field with the new data
                  onFieldChange({
                    ...selectedField,
                    data: updatedData,
                  });
                }}
                onClose={(selectedArray) => {
                  const extractedOptions =
                    selectedArray?.map((arr) => arr?.[1]) || [];

                  // 🚫 BLOCK deselect if only one already selected
                  if (extractedOptions.length === 0 && selectedData.length === 1) {
                    if (
                      window.__appConfig_showToast &&
                      typeof window.__appConfig_showToast === "function"
                    ) {
                      window.__appConfig_showToast({
                        key: "error",
                        label: t("AT_LEAST_ONE_FIELD_MUST_BE_SELECTED"),
                      });
                    }
                    return;
                  }

                  const mappedData = extractedOptions
                    .map((item) => {
                      let option;
                      if (Array.isArray(item) && item.length >= 2) {
                        option = item[1];
                      } else if (item?.name && item?.jsonPath) {
                        option = item;
                      } else {
                        return null;
                      }

                      return {
                        ...option,
                        key: option.name,
                        value: option.jsonPath,
                      };
                    })
                    .filter(Boolean);

                  // Safety check (extra guard)
                  if (mappedData.length === 0) {
                    if (
                      window.__appConfig_showToast &&
                      typeof window.__appConfig_showToast === "function"
                    ) {
                      window.__appConfig_showToast({
                        key: "error",
                        label: t("AT_LEAST_ONE_FIELD_MUST_BE_SELECTED"),
                      });
                    }
                    return;
                  }

                  const currentStr = JSON.stringify(selectedData);
                  const newStr = JSON.stringify(mappedData);

                  if (currentStr === newStr) return;

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
                        label={`${t(entityName || "ENTITY")} - ${t(item.key)}`}
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
        // Get columns from selectedField.data.columns
        const columns = selectedField?.data?.columns || [];

        // Count visible columns
        const visibleColumnsCount = columns.filter((col) => col.hidden !== true).length;

        const handleColumnVisibilityToggle = useCallback(
          (columnIndex, toggleValue) => {
            // Toggle ON means visible (hidden: false)
            // Toggle OFF means hidden (hidden: true)
            const hiddenValue = !Boolean(toggleValue);

            // Prevent hiding if this is the last visible column
            if (hiddenValue && visibleColumnsCount === 1) {
              // Show toast/alert to user
              if (window.__appConfig_showToast && typeof window.__appConfig_showToast === "function") {
                window.__appConfig_showToast({
                  key: "error",
                  label: t("AT_LEAST_ONE_COLUMN_MUST_BE_VISIBLE"),
                });
              }
              return; // Don't allow hiding
            }

            // Create updated columns array
            const updatedColumns = columns.map((col, idx) => {
              if (idx === columnIndex) {
                return { ...col, hidden: hiddenValue, isActive: !hiddenValue };
              }
              return col;
            });

            // Update the selectedField with new columns
            const updatedField = {
              ...selectedField,
              data: {
                ...selectedField.data,
                columns: updatedColumns,
              },
            };

            onFieldChange(updatedField);
          },
          [columns, selectedField, onFieldChange, visibleColumnsCount, t]
        );

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
                    const isLastVisible = visibleColumnsCount === 1 && column.hidden !== true;

                    return (
                      <LocalizationInput
                        key={`${column.header}-${index}`}
                        code={column.header}
                        label={`${t("COLUMN")} ${index + 1} - ${t(column.header)}`}
                        currentLocale={currentLocale}
                        dispatch={dispatch}
                        t={t}
                        placeholder={t("ADD_HEADER_LOCALIZATION")}
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
                <div style={{ marginTop: "8px", fontSize: "14px", color: "#666" }}>{t("NO_TABLE_COLUMNS_FOUND")}</div>
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
    // Get the localized value
    const localizedValue = useCustomT(code) || code;

    // Check if this is a table column input (has column data and toggle handler)
    const isTableColumn = column !== null && columnIndex !== null && onColumnToggle !== null;

    // For table columns, toggle state controls visibility of input
    // Toggle ON = visible (hidden: false)
    // Toggle OFF = hidden (hidden: true)
    const isColumnHidden = isTableColumn ? column.hidden !== false : false;

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
                key={`toggle-${columnIndex}-${toggleState}`} // Force re-render when state changes
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
            placeholder={placeholder || t("ADD_LOCALIZATION")}
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

    // Update the option with the localization code
    const updated = (selectedField[cField.bindTo] || []).map((i) => (i.code === item.code ? { ...i, name: localizationCode } : i));
    onFieldChange({ ...selectedField, [cField.bindTo]: updated });
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <TextInput type="text" value={translatedOptionValue || ""} placeholder={t("OPTION_PLACEHOLDER")} onChange={handleChange} />
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

  // Get the translated value using useCustomT (skip if prefixText/suffixText)
  const translatedValue = shouldSkipLocalization ? fieldValue : useCustomT(fieldValue);

  const [conditionalLocalValue, setConditionalLocalValue] = useState(translatedValue === true ? "" : translatedValue || "");
  const conditionalDebounceRef = useRef(null);

  useEffect(() => {
    setConditionalLocalValue(translatedValue === true ? "" : translatedValue || "");
  }, [translatedValue]);

  const handleConditionalChange = useCallback(
    (value) => {
      if (conditionalDebounceRef.current) {
        clearTimeout(conditionalDebounceRef.current);
      }

      conditionalDebounceRef.current = setTimeout(() => {
        let finalValueToSave;

        // Skip localization for prefixText and suffixText
        if (shouldSkipLocalization) {
          finalValueToSave = value; // Save the raw value directly
        } else {
          // Handle localization
          if (fieldValue && typeof fieldValue === "string") {
            // If a code already exists (and it's a string, not a boolean), update the localization entry
            dispatch(
              updateLocalizationEntry({
                code: fieldValue,
                locale: currentLocale || "en_IN",
                message: value,
              })
            );
            finalValueToSave = fieldValue; // Save the code instead of the value
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

        const newField = { ...selectedField };
        newField[cField.bindTo] = finalValueToSave;
        onFieldChange(newField);
      }, 800);
    },
    [selectedField, cField.bindTo, onFieldChange, fieldValue, dispatch, currentLocale, shouldSkipLocalization]
  );

  const handleConditionalBlur = useCallback(() => {
    if (conditionalDebounceRef.current) {
      clearTimeout(conditionalDebounceRef.current);
      conditionalDebounceRef.current = null;
    }

    // Immediately dispatch the current value with localization handling
    let finalValueToSave;

    // Skip localization for prefixText and suffixText
    if (shouldSkipLocalization) {
      finalValueToSave = conditionalLocalValue; // Save the raw value directly
    } else {
      if (fieldValue && typeof fieldValue === "string") {
        dispatch(
          updateLocalizationEntry({
            code: fieldValue,
            locale: currentLocale || "en_IN",
            message: conditionalLocalValue,
          })
        );
        finalValueToSave = fieldValue;
      } else if (conditionalLocalValue && typeof conditionalLocalValue === "string" && conditionalLocalValue.trim() !== "") {
        const timestamp = Date.now();
        const fieldName = cField.bindTo.replace(/\./g, "_").toUpperCase();
        const uniqueCode = `FIELD_${fieldName}_${timestamp}`;

        dispatch(
          updateLocalizationEntry({
            code: uniqueCode,
            locale: currentLocale || "en_IN",
            message: conditionalLocalValue,
          })
        );
        finalValueToSave = uniqueCode;
      }
    }

    const newField = { ...selectedField };
    newField[cField.bindTo] = finalValueToSave;
    onFieldChange(newField);
  }, [selectedField, cField.bindTo, conditionalLocalValue, onFieldChange, fieldValue, dispatch, currentLocale, shouldSkipLocalization]);

  switch (cField.type) {
    case "text":
    case "number":
    case "textarea":
      return (
        <div className="drawer-container-tooltip" style={{ marginTop: "8px" }}>
          <FieldV1
            type={cField.type}
            label={cField.label ? t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${cField.label}`)) : null}
            value={conditionalLocalValue}
            onChange={(event) => {
              setConditionalLocalValue(event.target.value);
              handleConditionalChange(event.target.value);
            }}
            onBlur={handleConditionalBlur}
            placeholder={cField.innerLabel ? t(cField.innerLabel) : null}
            populators={{ fieldPairClassName: "drawer-toggle-conditional-field", validation: cField.validation }}
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
            label={t("ADD_OPTIONS")}
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

  // Filter properties based on field type visibility - only show popup-specific properties
  const visiblePopupProperties = useMemo(() => {
    return currentTabProperties.filter((panelItem) => {
      // Only include properties explicitly marked as popup properties
      if (panelItem?.isPopupProperty !== true) {
        return false;
      }
      // Check if current field type matches any of the enabled types
      return !panelItem?.visibilityEnabledFor || panelItem.visibilityEnabledFor.length === 0 || panelItem.visibilityEnabledFor.includes("actionPopup");
    });
  }, [currentTabProperties, fieldType]);

  // Function to collect all validation errors from group fields
  const checkValidationErrors = useCallback(() => {
    const errors = [];

    // Check all tabs for group fields with validation
    Object.keys(panelConfig).forEach((tabKey) => {
      const tabProperties = panelConfig[tabKey] || [];

      tabProperties.forEach((panelItem) => {
        // Only check group fields with validation expressions
        if (panelItem.fieldType === "group" && panelItem.validationExpression) {
          // Check if this field is visible for current field type
          const isVisible =
            !panelItem?.visibilityEnabledFor ||
            panelItem.visibilityEnabledFor.length === 0 ||
            panelItem.visibilityEnabledFor.includes(fieldType);

          if (!isVisible) return;

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

  // Expose validation check function via window object
  useEffect(() => {
    window.__appConfig_hasValidationErrors = () => {
      const errors = checkValidationErrors();
      return errors.length > 0 ? errors : null;
    };

    return () => {
      delete window.__appConfig_hasValidationErrors;
    };
  }, [checkValidationErrors]);

  // Handle field changes
  const handleFieldChange = (updatedField) => {
    dispatch(updateSelectedField(updatedField));
  };

  // Handle tab change with validation
  const handleTabChange = (newTab) => {
    const errors = checkValidationErrors();
    if (errors.length > 0) {
      // Show toast error and prevent tab switch
      const errorMessage = errors.map((err) => t(err.message)).join(", ");
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
        <p>{t("APP_CONFIG_NO_FIELD_SELECTED")}</p>
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
          <Tag showIcon={true} label={t("CMP_DRAWER_FIELD_DISABLED_SINCE_HIDDEN")} type="warning" />
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
