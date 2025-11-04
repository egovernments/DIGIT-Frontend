import React, { Fragment, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FieldV1, Switch, TextBlock, Tag, Divider } from "@egovernments/digit-ui-components";
import { updateSelectedField } from "./redux/remoteConfigSlice";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { useCustomT } from "./hooks/useCustomT";
import { getFieldTypeFromMasterData, getFieldValueByPath } from "./helpers";
import { TextInput, Button } from "@egovernments/digit-ui-components";
import { DustbinIcon } from "../../../components/icons/DustbinIcon";
import NewDependentFieldWrapper from "./NewDependentFieldWrapper";

const RenderField = React.memo(({ panelItem, selectedField, onFieldChange, fieldType, isGroupChild = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const { pageType } = useSelector((state) => state.remoteConfig);

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
      setLocalValue(getFieldValue() || 0);
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
      // If no condition specified, always show the field
      if (cField.condition === undefined) {
        return true;
      }
      // Show field only if its condition matches the current toggle value
      return cField.condition === toggleValue;
    });
  };

  const handleFieldChange = (value) => {
    const bindTo = panelItem.bindTo;

    // Update the field with the code (or value if no localization)
    if (bindTo.includes(".")) {
      // Handle nested properties
      const keys = bindTo.split(".");
      const newField = { ...selectedField };
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
          // Handle nested properties
          const keys = bindTo.split(".");
          const newField = { ...selectedField };
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
          // Handle nested properties
          const keys = bindTo.split(".");
          const newField = { ...selectedField };
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
      handleFieldChangeWithLoc(fieldValue, localValue);
    } else if (panelItem.fieldType === "number") {
      handleNumberChange(localValue);
    }
  }, [panelItem.fieldType, fieldValue, localValue, handleFieldChangeWithLoc, handleNumberChange]);

  const renderMainField = () => {
    switch (panelItem.fieldType) {
      case "toggle": {
        const bindTo = panelItem.bindTo;

        const handleToggleChange = (value) => {
          // Update local UI
          setLocalToggle(Boolean(value));

          // Always update Redux store with the toggle value
          handleFieldChange(Boolean(value));
        };
        return (
          <div>
            <Switch
              label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
              onToggle={handleToggleChange}
              isCheckedInitially={localToggle}
              shapeOnOff
            />
            {/* Render Conditional Fields */}
            {localToggle && getConditionalFields().map((cField, index) => (
              <ConditionalField
                key={`${cField.bindTo}-${index}`}
                cField={cField}
                selectedField={selectedField}
                onFieldChange={onFieldChange}
              />
            ))}
          </div>
        );
      }

      case "text":
        return (
          <FieldV1
            type="text"
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
            value={localValue}
            onChange={(event) => {
              setLocalValue(event.target.value);
              handleFieldChangeWithLoc(fieldValue, event.target.value);
            }}
            onBlur={handleBlur}
            placeholder={t(panelItem.innerLabel) || ""}
            populators={{ fieldPairClassName: "drawer-field" }}
          />
        );

      case "number":
        return (
          <FieldV1
            type="number"
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
            value={localValue}
            onChange={(event) => {
              const value = parseInt(event.target.value) || 0;
              setLocalValue(value);
              handleNumberChange(value);
            }}
            onBlur={handleBlur}
            placeholder={t(panelItem.innerLabel) || ""}
            populators={{ fieldPairClassName: "drawer-field" }}
          />
        );

      case "group": {
        // Evaluate validation expression
        const evaluateValidation = () => {
          if (!panelItem.validationExpression) {
            return true;
          }

          try {
            // Create a safe evaluation context with only the selectedField data
            const evalContext = { ...selectedField };

            // Replace property paths in expression with actual values
            const expression = panelItem.validationExpression;

            // Use Function constructor for safe evaluation (safer than eval)
            const func = new Function(...Object.keys(evalContext), `return ${expression}`);
            return func(...Object.values(evalContext));
          } catch (error) {
            console.error("Validation expression error:", error);
            return true; // Return true on error to avoid blocking
          }
        };

        const isValid = evaluateValidation();

        // Render group with children
        return (
          <div style={{
            border: `1px solid ${isValid ? "#e0e0e0" : "#d32f2f"}`,
            borderRadius: "4px",
            padding: "12px",
            marginBottom: "8px",
            backgroundColor: isValid ? "#f9f9f9" : "#fff4f4"
          }}>
            <div style={{
              fontWeight: "600",
              marginBottom: "12px",
              fontSize: "14px"
            }}>
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
              <div style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#d32f2f",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span style={{ fontSize: "14px" }}>⚠</span>
                {t(panelItem.validationMessage)}
              </div>
            )}
          </div>
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
        const isMandatory = selectedField?.required === true || selectedField?.required?.required === true;
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
                options: fieldTypeOptions.filter((item) => {
                  // Always filter out dynamic types
                  if (item?.metadata?.type === "dynamic") return false;
                  // Filter out template types only for forms (pageType === "object")
                  if (pageType === "object" && item?.metadata?.type === "template") return false;
                  return true;
                }),
                optionsKey: "type",
              }}
              type={"dropdown"}
              value={currentSelectedFieldType}
              disabled={isDisabled}
            />
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      {renderMainField()}
    </div>
  );
});

// Separate component for conditional fields to avoid hooks violations
const ConditionalField = React.memo(({ cField, selectedField, onFieldChange }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);

  // Get the raw value (localization code) from selectedField
  const fieldValue = selectedField[cField.bindTo] || "";

  // Get the translated value using useCustomT
  const translatedValue = useCustomT(fieldValue);

  const [conditionalLocalValue, setConditionalLocalValue] = useState(translatedValue || "");
  const conditionalDebounceRef = useRef(null);

  useEffect(() => {
    setConditionalLocalValue(translatedValue || "");
  }, [translatedValue]);

  const handleConditionalChange = useCallback(
    (value) => {
      if (conditionalDebounceRef.current) {
        clearTimeout(conditionalDebounceRef.current);
      }

      conditionalDebounceRef.current = setTimeout(() => {
        let finalValueToSave;

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

        const newField = { ...selectedField };
        newField[cField.bindTo] = finalValueToSave;
        onFieldChange(newField);
      }, 800);
    },
    [selectedField, cField.bindTo, onFieldChange, fieldValue, dispatch, currentLocale]
  );

  const handleConditionalBlur = useCallback(() => {
    if (conditionalDebounceRef.current) {
      clearTimeout(conditionalDebounceRef.current);
      conditionalDebounceRef.current = null;
    }

    // Immediately dispatch the current value with localization handling
    let finalValueToSave;

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

    const newField = { ...selectedField };
    newField[cField.bindTo] = finalValueToSave;
    onFieldChange(newField);
  }, [selectedField, cField.bindTo, conditionalLocalValue, onFieldChange, fieldValue, dispatch, currentLocale]);

  switch (cField.type) {
    case "text":
      return (
        <div style={{ marginTop: "8px" }}>
          <FieldV1
            type="text"
            label={cField.label ? t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${cField.label}`)) : null}
            value={conditionalLocalValue}
            onChange={(event) => {
              setConditionalLocalValue(event.target.value);
              handleConditionalChange(event.target.value);
            }}
            onBlur={handleConditionalBlur}
            placeholder={cField.innerLabel ? t(cField.innerLabel) : null}
            populators={{ fieldPairClassName: "drawer-field" }}
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
          {(selectedField[cField.bindTo] || []).map((item, index) => (
            <div key={item.code || index} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <TextInput
                type="text"
                value={item.name || ""}
                placeholder={t("OPTION_PLACEHOLDER")}
                onChange={(e) => {
                  const updated = (selectedField[cField.bindTo] || []).map((i) =>
                    i.code === item.code ? { ...i, name: e.target.value } : i
                  );
                  onFieldChange({ ...selectedField, [cField.bindTo]: updated });
                }}
              />
              <div
                onClick={() => {
                  const filtered = (selectedField[cField.bindTo] || []).filter((i) => i.code !== item.code);
                  onFieldChange({ ...selectedField, [cField.bindTo]: filtered });
                }}
                style={{
                  cursor: "pointer",
                  color: "#c84c0e",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <DustbinIcon />
              </div>
            </div>
          ))}

          <Button
            type="button"
            icon="AddIcon"
            size="small"
            variation="tertiary"
            label={t("ADD_OPTIONS")}
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
        <div style={{ marginTop: "8px" }}>
          <FieldV1
            type="dropdown"
            label={cField.label ? t(Digit.Utils.locale.getTransformedLocale(`${cField.label}`)) : null}
            value={cField.options?.find((i) => i[dropdownOptionKey] === bindValue) || null}
            onChange={(value) => onFieldChange({ ...selectedField, [cField.bindTo]: value?.[dropdownOptionKey] })}
            placeholder={cField.innerLabel ? t(cField.innerLabel) : null}
            populators={{
              options: cField.options || [],
              optionsKey: dropdownOptionKey,
              fieldPairClassName: "drawer-field",
            }}
          />
        </div>
      );

    case "dependencyFieldWrapper":
      return (
        <NewDependentFieldWrapper
          t={t}
        />
      );

    default:
      return null;
  }
});

// Simple tabs component
const Tabs = React.memo(({ tabs, activeTab, onTabChange }) => {
  const { t } = useTranslation();

  return (
    <div className="configure-app-tabs">
      {tabs.map((tab) => (
        <button key={tab} className={`configure-app-tab-head ${activeTab === tab ? "active" : ""} hover`} onClick={() => onTabChange(tab)}>
          {t(`TAB_${tab.toUpperCase()}`)}
        </button>
      ))}
    </div>
  );
});

function NewDrawerFieldComposer() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Get data from Redux
  const { selectedField } = useSelector((state) => state.remoteConfig);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);
  const { byName: panelProperties } = useSelector((state) => state.fieldPanelMaster);
  // Local state for tabs
  const [activeTab, setActiveTab] = useState("content");
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
    return getFieldTypeFromMasterData(selectedField, fieldTypeMaster.fieldTypeMappingConfig);
  }, [selectedField, fieldTypeMaster]);

  // Filter properties based on field type visibility
  const visibleTabProperties = useMemo(() => {
    return currentTabProperties.filter((panelItem) => {
      // If visibilityEnabledFor is empty, the field is always visible
      if (!panelItem?.visibilityEnabledFor || panelItem.visibilityEnabledFor.length === 0) {
        return true;
      }
      // Check if current field type matches any of the enabled types
      return panelItem.visibilityEnabledFor.includes(fieldType);
    });
  }, [currentTabProperties, fieldType]);

  // Handle field changes
  const handleFieldChange = (updatedField) => {
    dispatch(updateSelectedField(updatedField));
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
      <div className="app-config-drawer-subheader">
        <div>{t("APPCONFIG_PROPERTIES")}</div>
      </div>
      <Divider />

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Description */}
      <TextBlock
        body=""
        caption={t(`CMP_DRAWER_WHAT_IS_${activeTab.toUpperCase()}`)}
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
        {visibleTabProperties.map((panelItem) => (
          <div key={panelItem.id} className="drawer-field-container">
            <RenderField
              panelItem={panelItem}
              selectedField={selectedField}
              onFieldChange={handleFieldChange}
              fieldType={fieldType}
            />
          </div>
        ))}

        {/* No properties message */}
        {visibleTabProperties.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Tag showIcon={true} label={t(`CMP_DRAWER_NO_CONFIG_ERROR_${activeTab.toUpperCase()}`)} type="error" />
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default React.memo(NewDrawerFieldComposer);