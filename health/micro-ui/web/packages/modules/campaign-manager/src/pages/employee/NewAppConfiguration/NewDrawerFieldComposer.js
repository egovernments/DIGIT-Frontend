import React, { Fragment, useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FieldV1, Switch, TextBlock, Tag, Divider } from "@egovernments/digit-ui-components";
import { updateSelectedField } from "./redux/remoteConfigSlice";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { useCustomT } from "./hooks/useCustomT";
import { getFieldTypeFromMasterData, getFieldValueByPath } from "./helpers";

const RenderField = React.memo(({ panelItem, selectedField, onFieldChange, fieldType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);
  const { byName: fieldTypeMaster } = useSelector((state) => state.fieldTypeMaster);

  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState("");
  const debounceTimerRef = useRef(null);

  // Check if field should be visible based on field type
  const isFieldVisible = () => {
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

  // Check if conditional fields should be shown
  const shouldShowConditionalFields = () => {
    if (!panelItem?.showFieldOnToggle) {
      return false;
    }
    const fieldValue = getFieldValue();
    return Boolean(fieldValue);
  };

  // Get conditional fields to show
  const getConditionalFields = () => {
    if (!shouldShowConditionalFields() || !Array.isArray(panelItem?.conditionalField)) {
      return [];
    }
    return panelItem.conditionalField.filter((cField) => {
      if (cField.condition === undefined) {
        return true;
      }
      return cField.condition === Boolean(getFieldValue());
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
      case "toggle":
        return (
          <Switch
            label={t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem.label}`))}
            onToggle={handleFieldChange}
            isCheckedInitially={getFieldValue()}
            shapeOnOff
          />
        );

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

      case "fieldTypeDropdown": {
        const switchRef = useRef(null);
        const [showTooltip, setShowTooltip] = useState(false);

        // Get field type options from Redux
        const fieldTypeOptions = fieldTypeMaster?.FieldTypeMappingConfig || [];

        // Find current selected field type based on type and format
        const currentSelectedFieldType = fieldTypeOptions.find(
          (item) => item?.metadata?.type === selectedField?.type && item?.metadata?.format === selectedField?.format
        );

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
                  fieldType: value?.fieldType,
                  ...(isIdPopulator && { isMdms: true, MdmsDropdown: true, schemaCode: "HCM.ID_TYPE_OPTIONS_POPULATOR" }),
                };

                onFieldChange(updatedField);
              }}
              placeholder={t(panelItem?.innerLabel) || ""}
              populators={{
                title: t(Digit.Utils.locale.getTransformedLocale(`FIELD_DRAWER_LABEL_${panelItem?.label}`)),
                fieldPairClassName: "drawer-toggle-conditional-field",
                options: fieldTypeOptions
                  .filter((item) => item?.metadata?.type !== "template" && item?.metadata?.type !== "dynamic")
                  ?.sort((a, b) => a?.order - b?.order),
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
      {/* Render conditional fields */}
      {getConditionalFields().map((cField, index) => (
        <ConditionalField key={`${cField.bindTo}-${index}`} cField={cField} selectedField={selectedField} onFieldChange={onFieldChange} />
      ))}
    </div>
  );
});

// Separate component for conditional fields to avoid hooks violations
const ConditionalField = React.memo(({ cField, selectedField, onFieldChange }) => {
  const { t } = useTranslation();
  const [conditionalLocalValue, setConditionalLocalValue] = useState(selectedField[cField.bindTo] || "");
  const conditionalDebounceRef = useRef(null);

  useEffect(() => {
    setConditionalLocalValue(selectedField[cField.bindTo] || "");
  }, [selectedField, cField.bindTo]);

  const handleConditionalChange = useCallback(
    (value) => {
      if (conditionalDebounceRef.current) {
        clearTimeout(conditionalDebounceRef.current);
      }

      conditionalDebounceRef.current = setTimeout(() => {
        const newField = { ...selectedField };
        newField[cField.bindTo] = value;
        onFieldChange(newField);
      }, 800);
    },
    [selectedField, cField.bindTo, onFieldChange]
  );

  const handleConditionalBlur = useCallback(() => {
    if (conditionalDebounceRef.current) {
      clearTimeout(conditionalDebounceRef.current);
      const newField = { ...selectedField };
      newField[cField.bindTo] = conditionalLocalValue;
      onFieldChange(newField);
    }
  }, [selectedField, cField.bindTo, conditionalLocalValue, onFieldChange]);

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
  // Get panel configuration
  const panelConfig = panelProperties?.FieldPropertiesPanelConfig || {};
  const tabs = Object.keys(panelConfig);
  // Get current tab properties
  const currentTabProperties = useMemo(() => {
    return panelConfig[activeTab] || [];
  }, [panelConfig, activeTab]);

  // Get field type from field type master
  const fieldType = useMemo(() => {
    if (!selectedField || !fieldTypeMaster?.FieldTypeMappingConfig) {
      return selectedField?.type || "textInput";
    }
    return getFieldTypeFromMasterData(selectedField, fieldTypeMaster.FieldTypeMappingConfig);
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
        <p>No field selected</p>
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
            <RenderField panelItem={panelItem} selectedField={selectedField} onFieldChange={handleFieldChange} fieldType={fieldType} />
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
