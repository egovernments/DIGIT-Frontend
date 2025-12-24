import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { TextInput, Divider, Tag } from "@egovernments/digit-ui-components";
import { updateLocalizationEntry } from "./redux/localizationSlice";
import { useCustomT } from "./hooks/useCustomT";
import ConsoleTooltip from "../../../components/ConsoleToolTip";

const PopupConfigEditor = ({ selectedField }) => {
  const { t } = useTranslation();

  if (!selectedField?.properties?.popupConfig) {
    return null;
  }

  const popupConfig = selectedField.properties.popupConfig;

  // Check if there are any body items with labels
  const hasBodyLabels = Array.isArray(popupConfig.body) && 
    popupConfig.body.some((item) => item.label !== undefined);

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
          <PopupLabelField
            label="POPUP_TITLE"
            path="title"
            value={popupConfig.title}
            selectedField={selectedField}
          />
        )}

        {/* Body Fields Labels - Only show section if there are items with labels */}
        {hasBodyLabels && (
          <>
            <div
              style={{
                fontWeight: "600",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {t("POPUP_BODY_LABELS")}
            </div>
            {popupConfig.body.map((bodyItem, index) => {
              if (bodyItem.label !== undefined) {
                return (
                  <PopupLabelField
                    key={`body-${index}`}
                    label={`BODY_ITEM_${bodyItem?.fieldName || index + 1}_LABEL`}
                    path={`body.${index}.label`}
                    value={bodyItem.label}
                    selectedField={selectedField}
                  />
                );
              }
              return null;
            })}
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

        {/* Show message if no labels found */}
        {!popupConfig.title && !hasBodyLabels && !hasFooterLabels && (
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
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);

  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState("");
  const debounceTimerRef = useRef(null);

  // Get localized value using custom hook
  const localizedValue = useCustomT(value);

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