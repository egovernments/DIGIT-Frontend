import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Tag, Divider, FieldV1 } from "@egovernments/digit-ui-components";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { updateSelectedField } from "./redux/remoteConfigSlice";
import { useCustomT, useCustomTranslate } from "./hooks/useCustomT";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import PopupFieldConfigurator from "../../../components/PopupFieldConfigurator";
import { I18N_KEYS } from "../../../utils/i18nKeyConstants";

const PopupConfigEditor = ({ selectedField, viewMode }) => {
  const { t } = useTranslation();
  const customTranslate = useCustomTranslate();

  if (!selectedField?.properties?.popupConfig) {
    return null;
  }

  const popupConfig = selectedField.properties.popupConfig;

  // Helper function to check if a field has valid static configuration data
  const hasValidStaticData = (item) => {
    // For table format, check if columns exist and are an array
    if (item.format === "table") {
      return item.data?.columns && Array.isArray(item.data.columns) && item.data.columns.length > 0;
    }

    // For radioList, check if data exists and is an array
    if (item.format === "radioList") {
      return item.data && Array.isArray(item.data) && item.data.length > 0;
    }

    // For dropdown/select/selectionCard/dropdownTemplate - check enums, dropdownOptions, and schemaCode
    const configurableFormats = ["dropdown", "dropdownTemplate", "select", "selectionCard"];
    if (configurableFormats.includes(item.format)) {
      // Check if enums exists and is an actual array (not a string like "{{fn:...}}")
      const hasValidEnums = item.enums && Array.isArray(item.enums) && item.enums.length > 0;

      // Check if dropdownOptions exists and is an array
      const hasValidDropdownOptions = item.dropdownOptions && Array.isArray(item.dropdownOptions) && item.dropdownOptions.length > 0;

      // Check if schemaCode exists and is valid (not empty/undefined)
      const hasValidSchemaCode = item.schemaCode && typeof item.schemaCode === "string" && item.schemaCode.trim().length > 0;

      // At least one of these should be valid
      return hasValidEnums || hasValidDropdownOptions || hasValidSchemaCode;
    }

    return false;
  };

  // Check if there are any body items with labels
  const hasBodyLabels = Array.isArray(popupConfig.body) &&
    popupConfig.body.some((item) => item.label !== undefined);

  // Check if there are any configurable body items (with valid static enums or columns)
  const hasConfigurableBodyItems = Array.isArray(popupConfig.body) &&
    popupConfig.body.some((item) => {
      const configurableFormats = ["dropdown", "dropdownTemplate", "select", "selectionCard", "radioList", "table"];
      return item.format && configurableFormats.includes(item.format) && hasValidStaticData(item);
    });

  // Check if there are any footer actions with labels
  const hasFooterLabels = Array.isArray(popupConfig.footerActions) &&
    popupConfig.footerActions.some((item) => item.label !== undefined);

  return (
    <>
      <Divider />
      <div className="app-config-drawer-subheader">
        <div className={"app-config-drawer-subheader-text"}>{t(I18N_KEYS.APP_CONFIGURATION.APPCONFIG_POPUP_PROPERTIES)}</div>
        <span className="icon-wrapper new">
          <ConsoleTooltip iconFill={"#0B4B66"} style={{marginLeft:"0rem",top:"0rem"}} className="app-config-tooltip" toolTipContent={t(I18N_KEYS.APP_CONFIGURATION.TIP_APPCONFIG_POPUP_PROPERTIES)} />
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Popup Title */}
        {popupConfig.title !== undefined && (
          <>
          <PopupLabelField
            label="POPUP_TITLE"
            path="title"
            value={popupConfig.title}
            selectedField={selectedField}
            viewMode={viewMode}
          />
          <Divider/>
          </>
        )}

        {/* Popup Description */}
        {popupConfig.description !== undefined && (
          <>
          <PopupLabelField
            label="POPUP_DESCRIPTION"
            path="description"
            value={popupConfig.description}
            selectedField={selectedField}
            viewMode={viewMode}
          />
          <Divider/>
          </>
        )}

        {/* Body Fields - Show section if there are items with labels OR configurable items */}
        {(hasBodyLabels || hasConfigurableBodyItems) && (
          <>
            <div
              // style={{
              //   fontWeight: "600",
              //   fontSize: "14px",
              //   marginTop: "8px",
              // }}
              className="app-config-group-heading"
            >
              {t(I18N_KEYS.APP_CONFIGURATION.POPUP_BODY_FIELDS)}
            </div>
            {popupConfig.body.map((bodyItem, index) => {
              // Check if this field has a label
              const hasLabel = bodyItem.label !== undefined;

              // Check if this field is configurable using the helper function
              const configurableFormats = ["dropdown", "dropdownTemplate", "select", "selectionCard", "radioList", "table"];
              const isConfigurableType = bodyItem.format && configurableFormats.includes(bodyItem.format);
              const canConfigure = isConfigurableType && hasValidStaticData(bodyItem);

              // Only render if item has label OR is configurable
              if (!hasLabel && !canConfigure) {
                return null;
              }

              return (
                <div key={`body-${index}`} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Show label field if it exists */}
                  {hasLabel && (
                    <PopupLabelField
                      label={`BODY_ITEM_${bodyItem?.fieldName || index + 1}_LABEL`}
                      path={`body.${index}.label`}
                      value={bodyItem.label}
                      selectedField={selectedField}
                      viewMode={viewMode}
                    />
                  )}

                  {/* Show PopupFieldConfigurator if field is configurable */}
                  {canConfigure && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label
                        style={{ fontWeight: "500", fontSize: "14px" }}
                      >
                        {t(I18N_KEYS.APP_CONFIGURATION.CONFIGURE_OPTIONS_FOR) + `${bodyItem.label ? (customTranslate(bodyItem.label) || t(bodyItem.format)) : customTranslate(bodyItem.fieldName)}`}
                      </label>
                      <PopupFieldConfigurator
                        field={bodyItem}
                        t={t}
                        disabled={viewMode || false}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            <Divider/>
          </>
        )}

        {/* Footer Actions Labels - Only show section if there are items with labels */}
        {hasFooterLabels && (
          <>
            <div
              // style={{
              //   fontWeight: "600",
              //   fontSize: "14px",
              //   marginTop: "8px",
              // }}
              className="app-config-group-heading"
            >
              {t(I18N_KEYS.APP_CONFIGURATION.POPUP_FOOTER_ACTIONS_LABELS)}
            </div>
            {popupConfig.footerActions.map((footerAction, index) => {
              if (footerAction.label !== undefined) {
                return (
                  <PopupLabelField
                    key={`footer-${index}`}
                    label={`FOOTER_ACTION_${footerAction?.fieldName || index + 1}_LABEL`}
                    path={`footerActions.${index}.label`}
                    value={footerAction.label}
                    selectedField={selectedField}
                    viewMode={viewMode}
                  />
                );
              }
              return null;
            })}
          </>
        )}

        {/* Show message if no configurable properties found */}
        {!popupConfig.title && !popupConfig.description && !hasBodyLabels && !hasConfigurableBodyItems && !hasFooterLabels && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Tag showIcon={true} label={t(I18N_KEYS.APP_CONFIGURATION.CMP_DRAWER_NO_CONFIG_ERROR_CONTENT)} type="error" />
          </div>
        )}
      </div>
    </>
  );
};

// Individual label field component with localization (same pattern as LocalizationInput)
const PopupLabelField = ({ label, path, value, selectedField, viewMode }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);

  // Seeded templates can carry an empty code (e.g. popupConfig.description: "").
  // useCustomT("") always returns "", so edits under an empty code never display.
  // Generate a code lazily on first edit and keep it stable across keystrokes.
  const generatedCodeRef = useRef(null);
  const effectiveCode = value || generatedCodeRef.current;

  // Get localized value using useCustomT hook directly (same as LocalizationInput)
  // Don't fallback to code, empty string is valid
  const localizedValue = useCustomT(effectiveCode);

  // Keep keystrokes in local state; syncing the input straight from redux
  // re-renders mid-typing and scrambles fast input (same pattern as
  // NewDrawerFieldComposer's localValue + isEditingRef).
  const [localValue, setLocalValue] = useState(localizedValue);
  const isEditingRef = useRef(false);
  useEffect(() => {
    if (isEditingRef.current) return;
    setLocalValue(localizedValue);
  }, [localizedValue]);

  return (
    <div className="drawer-container-tooltip">
      {/* Label on top */}
      <div style={{ display: "flex", marginBottom: "8px" }}>
        <label style={{ fontWeight: "500", fontSize: "14px" }}>{t(label)}</label>
      </div>

      {/* Text field using FieldV1 - same as LocalizationInput */}
      <FieldV1
        value={localValue}
        type="text"
        placeholder={t(I18N_KEYS.APP_CONFIGURATION.ENTER_LABEL_TEXT) || ""}
        withoutLabel={true}
        disabled={viewMode}
        onBlur={() => {
          isEditingRef.current = false;
        }}
        onChange={(e) => {
          const val = e.target.value;
          isEditingRef.current = true;
          setLocalValue(val);
          let code = effectiveCode;
          if (!code) {
            // No code yet: mint one (same convention as NewDrawerFieldComposer)
            // and persist it into popupConfig so it saves with the configuration.
            code = `POPUP_${path.replace(/\./g, "_").toUpperCase()}_${Date.now()}`;
            generatedCodeRef.current = code;
            const newProperties = structuredClone(selectedField.properties);
            const keys = path.split(".");
            let node = newProperties.popupConfig;
            for (let i = 0; i < keys.length - 1; i++) {
              node = node?.[keys[i]];
            }
            if (node) {
              node[keys[keys.length - 1]] = code;
              dispatch(updateSelectedField({ properties: newProperties }));
            }
          }
          // Update localization for the code
          dispatch(
            updateLocalizationEntry({
              code,
              locale: currentLocale || "en_IN",
              message: val,
            })
          );
        }}
        populators={{
          fieldPairClassName: "drawer-toggle-conditional-field",
        }}
      />
    </div>
  );
};

export default PopupConfigEditor;