import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { TextInput, Tag , Divider} from "@egovernments/digit-ui-components";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { useCustomT, useCustomTranslate } from "./hooks/useCustomT";
import ConsoleTooltip from "../../../components/ConsoleToolTip";
import PopupFieldConfigurator from "../../../components/PopupFieldConfigurator";

const PopupConfigEditor = ({ selectedField }) => {
  const { t } = useTranslation();
  const customTranslate = useCustomTranslate();

  if (!selectedField?.properties?.popupConfig) {
    return null;
  }

  const popupConfig = selectedField.properties.popupConfig;

  // Check if there are any body items with labels
  const hasBodyLabels = Array.isArray(popupConfig.body) &&
    popupConfig.body.some((item) => item.label !== undefined);

  // Check if there are any configurable body items (with enums or columns)
  const hasConfigurableBodyItems = Array.isArray(popupConfig.body) &&
    popupConfig.body.some((item) => {
      const configurableFormats = ["dropdown", "dropdownTemplate", "select", "selectionCard", "radioList", "table"];
      const hasEnums = item.format === "radioList" ? item.data && Array.isArray(item.data) && item.data.length > 0 : item.enums && Array.isArray(item.enums) && item.enums.length > 0;
      const hasColumns = item.data?.columns && Array.isArray(item.data.columns) && item.data.columns.length > 0;
      return item.format && configurableFormats.includes(item.format) && (hasEnums || hasColumns);
    });

  // Check if there are any footer actions with labels
  const hasFooterLabels = Array.isArray(popupConfig.footerActions) &&
    popupConfig.footerActions.some((item) => item.label !== undefined);

  return (
    <>
      <Divider />
      <div className="app-config-drawer-subheader">
        <div className={"app-config-drawer-subheader-text"}>{t("APPCONFIG_POPUP_PROPERTIES")}</div>
        <span className="icon-wrapper new">
          <ConsoleTooltip className="app-config-tooltip new" toolTipContent={t("TIP_APPCONFIG_POPUP_PROPERTIES")} />
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
          />
          <Divider/>
          </>
        )}

        {/* Body Fields - Show section if there are items with labels OR configurable items */}
        {(hasBodyLabels || hasConfigurableBodyItems) && (
          <>
            <div
              style={{
                fontWeight: "600",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {t("POPUP_BODY_FIELDS")}
            </div>
            {popupConfig.body.map((bodyItem, index) => {
              // Check if this field has a label
              const hasLabel = bodyItem.label !== undefined;

              // Check if this field is configurable (has enums for dropdown/select/radio or columns for table)
              const hasEnums = bodyItem.format === "radioList" ? bodyItem.data && Array.isArray(bodyItem.data) && bodyItem.data.length > 0 : bodyItem.enums && Array.isArray(bodyItem.enums) && bodyItem.enums.length > 0;
              const hasColumns = bodyItem.data?.columns && Array.isArray(bodyItem.data.columns) && bodyItem.data.columns.length > 0;
              const configurableFormats = ["dropdown", "dropdownTemplate", "select", "selectionCard", "radioList", "table"];
              const isConfigurableType = bodyItem.format && configurableFormats.includes(bodyItem.format);
              const canConfigure = isConfigurableType && (hasEnums || hasColumns);

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
                    />
                  )}

                  {/* Show PopupFieldConfigurator if field is configurable */}
                  {canConfigure && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label
                        style={{ fontWeight: "500", fontSize: "14px" }}
                      >
                        {t("CONFIGURE_OPTIONS_FOR") + `${bodyItem.label ? (customTranslate(bodyItem.label) || t(bodyItem.format)) : customTranslate(bodyItem.fieldName)}`}
                      </label>
                      <PopupFieldConfigurator
                        field={bodyItem}
                        t={t}
                        disabled={false}
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
              style={{
                fontWeight: "600",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {t("POPUP_FOOTER_ACTIONS_LABELS")}
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
                  />
                );
              }
              return null;
            })}
          </>
        )}

        {/* Show message if no configurable properties found */}
        {!popupConfig.title && !hasBodyLabels && !hasConfigurableBodyItems && !hasFooterLabels && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Tag showIcon={true} label={t("CMP_DRAWER_NO_CONFIG_ERROR_CONTENT")} type="error" />
          </div>
        )}
      </div>
    </>
  );
};

// Individual label field component with debouncing and localization
const PopupLabelField = ({ label, path, value, selectedField }) => {
  const { t } = useTranslation();
  const customTranslate = useCustomTranslate();
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);

  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState("");
  const debounceTimerRef = useRef(null);

  // Get localized value using custom hook
  const localizedValue = customTranslate(value);

  // Initialize local value when value changes
  useEffect(() => {
    setLocalValue(localizedValue || "");
  }, [localizedValue]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced handler with localization (similar to handleFieldChangeWithLoc)
  const handleChange = useCallback(
    (event) => {
      const newValue = event.target.value;
      setLocalValue(newValue);

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the Redux dispatch
      debounceTimerRef.current = setTimeout(() => {
        let finalCode;

        // Handle localization
        if (value && typeof value === "string") {
          // If original value exists (it's a localization code), update it
          dispatch(
            updateLocalizationEntry({
              code: value,
              locale: currentLocale || "en_IN",
              message: newValue,
            })
          );
          finalCode = value; // Keep the existing code
        } 
      }, 800); // 800ms debounce
    },
    [path, value, dispatch, currentLocale]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {/* Label on top */}
      <label
        style={{
          fontSize: "14px",
          fontWeight: "500",
          color: "#0B0C0C",
        }}
      >
        {t(label)}
      </label>
      
      {/* Text field below */}
      <TextInput
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={t("ENTER_LABEL_TEXT") || ""}
        style={{
          width: "100%",
        }}
      />
    </div>
  );
};

export default PopupConfigEditor;