import React, { useState, useEffect } from "react";
import { Switch, TextInput } from "@egovernments/digit-ui-components";
import { useSelector, useDispatch } from "react-redux";
import { updateLocalizationEntry } from "../pages/employee/NewAppConfiguration/redux/localizationSlice";
import { updatePopupFieldProperty } from "../pages/employee/NewAppConfiguration/redux/remoteConfigSlice";
import { useCustomT } from "../pages/employee/NewAppConfiguration/hooks/useCustomT";

/**
 * PopupFieldConfigurator - Component for configuring popup field properties
 *
 * Supports configuring different component types within popup bodies:
 * - dropdown, dropdownTemplate, select, selectionCard, radio: Uses field.enums array
 * - table: Uses field.data.columns array
 *
 * Uses a unified `isActive` property for all item types (both enums and columns).
 * Default isActive is true if not specified.
 *
 * Users can:
 * - Edit the localization for each option/column name
 * - Enable/disable options by toggling (sets isActive property)
 * - Text field is disabled when toggle is off
 *
 * @param {Object} field - The popup body field object
 * @param {Function} t - Translation function
 * @param {boolean} disabled - Whether the inputs should be disabled
 */
const PopupFieldConfigurator = ({ field, t, disabled = false }) => {
  // Determine the type of component and get the items to configure
  const isTableComponent = field?.format === "table";
  const isEnumComponent = ["dropdown", "dropdownTemplate", "select", "selectionCard", "radioList"].includes(field?.format);
  console.log("isEnumComponent:", isEnumComponent); 

  let items = [];
  let itemType = "";
  let propertyPath = "";

  if (isTableComponent) {
    items = field?.data?.columns || [];
    itemType = "column";
    propertyPath = "data";
  } else if (isEnumComponent) {
    items = field?.format === "radioList" ? field?.data : field?.enums  || [];
    itemType = "option";
    propertyPath = field?.format === "radioList" ? "data" : "enums";
  }

  if (items.length === 0) return null;

  // Count active/visible items (for table columns, prevent hiding last one)
  const activeItemsCount = items.filter((item) => item.isActive !== false).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {items.map((item, index) => {
        const isLastActive = activeItemsCount === 1 && item.isActive !== false && isTableComponent;
        return (
          <ItemLocalizationInput
            key={`${item.code || item.header || item.name}-${index}`}
            item={item}
            itemIndex={index}
            itemType={itemType}
            field={field}
            propertyPath={propertyPath}
            t={t}
            disabled={disabled}
            isLastActive={isLastActive}
          />
        );
      })}
    </div>
  );
};

/**
 * ItemLocalizationInput - Generic component for enum option or table column
 * with text field and toggle
 */
const ItemLocalizationInput = React.memo(({ item, itemIndex, itemType, field, propertyPath, t, disabled, isLastActive }) => {
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);
  const { selectedField } = useSelector((state) => state.remoteConfig);

  // Get the localization code (name for enums, header for columns)
  const localizationCode = item.name || item.header;
  const localizedValue = useCustomT(localizationCode) || localizationCode;

  // Toggle state - isActive is true by default if not specified
  const isActive = item.isActive !== false;
  const [toggleState, setToggleState] = useState(isActive);

  // Sync toggle state with item's isActive property
  useEffect(() => {
    setToggleState(item.isActive !== false);
  }, [item.isActive]);

  // Handle toggle - update the isActive property
  const handleToggle = (value) => {
    // Prevent deactivating if this is the last active column in a table
    if (isLastActive && !value) {
      // Show toast/alert to user
      if (window.__appConfig_showToast && typeof window.__appConfig_showToast === "function") {
        window.__appConfig_showToast({
          key: "error",
          label: t("AT_LEAST_ONE_COLUMN_MUST_BE_VISIBLE"),
        });
      }
      return;
    }

    setToggleState(value);

    // Create a new array with updated item to avoid mutating frozen objects
    const currentItems = field[propertyPath];
    const updatedItems = currentItems.map((currentItem, idx) => {
      if (idx === itemIndex) {
        // Create new object with updated isActive property
        return { ...currentItem, isActive: value };
      }
      return currentItem;
    });

    // Trigger Redux update with new array
    const updates = {};
    updates[propertyPath] = updatedItems;

    dispatch(
      updatePopupFieldProperty({
        fieldName: selectedField?.fieldName,
        format: selectedField?.format,
        updates,
      })
    );
  };

  // Handle text input change - update localization
  const handleTextChange = (e) => {
    const newValue = e.target.value;

    // Update localization
    dispatch(
      updateLocalizationEntry({
        code: localizationCode,
        locale: currentLocale || "en_IN",
        message: newValue,
      })
    );
  };

  // Label prefix and placeholder based on item type
  const labelPrefix = itemType === "column" ? t("COLUMN") : t("OPTION_PLACEHOLDER");
  const placeholder = itemType === "column"
    ? (t("ADD_HEADER_LOCALIZATION") || "Add header localization")
    : (t("ADD_LOCALIZATION") || "Add localization");

  // Display label text
  const label = `${labelPrefix} ${itemIndex + 1}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Label row with toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label style={{ fontWeight: "500", fontSize: "14px" }}>{label}</label>

        {/* Toggle switch */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Switch
            label=""
            onToggle={handleToggle}
            disable={disabled || isLastActive}
            isCheckedInitially={toggleState}
            key={`toggle-${item.code || itemIndex}-${toggleState}`}
            shapeOnOff
            isLabelFirst={true}
            className={"digit-sidepanel-switch-wrap"}
          />
        </div>
      </div>

      {/* Text input - hide with CSS when inactive */}
        <TextInput
          type="text"
          value={localizedValue}
          onChange={handleTextChange}
          placeholder={placeholder}
          disabled={!toggleState}
          style={{
            width: "100%",
          }}
        />
      
    </div>
  );
});

export default PopupFieldConfigurator;
