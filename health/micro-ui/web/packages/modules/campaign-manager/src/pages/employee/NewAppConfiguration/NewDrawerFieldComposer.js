import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FieldV1, Switch, TextBlock, Tag, Divider } from "@egovernments/digit-ui-components";
import { updateSelectedField } from "./redux/remoteConfigSlice";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { useCustomT } from "./hooks/useCustomT";
import { getFieldTypeFromMasterData, getFieldValueByPath } from "./helpers";

const RenderField = ({ panelItem, selectedField, onFieldChange, fieldType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);

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

  const handleFieldChangeWithLoc = (code, value, pI) => {
    const bindTo = panelItem.bindTo;
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
  };

  const renderMainField = () => {
    switch (panelItem.fieldType) {
      case "toggle":
        return (
          <Switch
            label={t(`FIELD_DRAWER_LABEL_${panelItem.label}`)}
            onToggle={handleFieldChange}
            isCheckedInitially={getFieldValue()}
            shapeOnOff
          />
        );

      case "text":
        return (
          <FieldV1
            type="text"
            label={t(`FIELD_DRAWER_LABEL_${panelItem.label}`)}
            value={useCustomT(getFieldValue())}
            onChange={(event) => handleFieldChangeWithLoc(getFieldValue(), event.target.value, panelItem)}
            placeholder={t(panelItem.innerLabel) || ""}
            populators={{ fieldPairClassName: "drawer-field" }}
          />
        );

      case "number":
        return (
          <FieldV1
            type="number"
            label={t(`FIELD_DRAWER_LABEL_${panelItem.label}`)}
            value={getFieldValue()}
            onChange={(event) => handleFieldChange(parseInt(event.target.value) || 0)}
            placeholder={t(panelItem.innerLabel) || ""}
            populators={{ fieldPairClassName: "drawer-field" }}
          />
        );

      default:
        return null;
    }
  };

  const renderConditionalField = (cField) => {
    switch (cField.type) {
      case "text":
        return (
          <FieldV1
            key={cField.bindTo}
            type="text"
            label={t(`FIELD_DRAWER_LABEL_${cField.label}`)}
            value={selectedField[cField.bindTo]}
            onChange={(event) => {
              const newField = { ...selectedField };
              newField[cField.bindTo] = event.target.value;
              onFieldChange(newField);
            }}
            placeholder={t(cField.innerLabel) || ""}
            populators={{ fieldPairClassName: "drawer-field" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderMainField()}
      {/* Render conditional fields */}
      {getConditionalFields().map((cField, index) => (
        <div key={`${cField.bindTo}-${index}`} style={{ marginTop: "8px" }}>
          {renderConditionalField(cField)}
        </div>
      ))}
    </div>
  );
};

// Simple tabs component
const Tabs = ({ tabs, activeTab, onTabChange }) => {
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
};

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
