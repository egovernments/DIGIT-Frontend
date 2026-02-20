import React, { useState, useEffect } from "react";
import { Switch, FieldV1 } from "@egovernments/digit-ui-components";
import { useSelector, useDispatch } from "react-redux";
import { updateLocalizationEntry } from "../pages/employee/NewAppConfiguration/redux/localizationSlice";
import { updatePopupFieldProperty } from "../pages/employee/NewAppConfiguration/redux/remoteConfigSlice";
import { useCustomT } from "../pages/employee/NewAppConfiguration/hooks/useCustomT";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

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

  // Count active/visible items (prevent hiding/toggling last one for all field types)
  const activeItemsCount = items.filter((item) => item.isActive !== false).length;

  // If only 1 item exists total, don't show toggles at all
  const hideToggles = items.length === 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {items.map((item, index) => {
        // Check if this is the last active item (applies to all field types)
        const isLastActive = activeItemsCount === 1 && item.isActive !== false;
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
            hideToggle={hideToggles}
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
const ItemLocalizationInput = React.memo(({ item, itemIndex, itemType, field, propertyPath, t, disabled, isLastActive, hideToggle = false }) => {
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.localization);
  const { selectedField } = useSelector((state) => state.remoteConfig);

  // Get the localization code (name for enums, header for columns)
  const localizationCode = item.name || item.header;
  // Don't fallback to code, empty string is valid (same as LocalizationInput)
  const localizedValue = useCustomT(localizationCode);

  // Toggle state - isActive is true by default if not specified
  const isActive = item.isActive !== false;
  const [toggleState, setToggleState] = useState(isActive);

  // Sync toggle state with item's isActive property
  useEffect(() => {
    setToggleState(item.isActive !== false);
  }, [item.isActive]);

  // Handle toggle - update the isActive property
  const handleToggle = (value) => {
    // Prevent deactivating if this is the last active item
    if (isLastActive && !value) {
      // Show toast/alert to user
      if (window.__appConfig_showToast && typeof window.__appConfig_showToast === "function") {
        window.__appConfig_showToast({
          key: "error",
          label: t(I18N_KEYS.COMPONENTS.AT_LEAST_ONE_ITEM_MUST_BE_ACTIVE),
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
        selectedField,  // Pass the actionPopup field (the parent field with popupConfig)
        fieldName: field?.fieldName,  // Use the inner popup body/footer field
        format: field?.format,
        updates,
      })
    );
  };

  // Label prefix and placeholder based on item type
  const labelPrefix = itemType === "column" ? t(I18N_KEYS.COMMON.COLUMN) : t(I18N_KEYS.COMMON.ADD_LOCALIZATION);
  const placeholder = itemType === "column"
    ? (t(I18N_KEYS.COMMON.ADD_HEADER_LOCALIZATION) || "Add header localization")
    : (t(I18N_KEYS.COMMON.ADD_LOCALIZATION) || "Add localization");

  // Display label text - use translated fieldName instead of index
  const translatedFieldName = t(Digit.Utils.locale.getTransformedLocale(localizationCode)) ;
  const label = `${labelPrefix}: ${translatedFieldName}`;

  return (
    <div className="drawer-container-tooltip">
      {/* Label row with toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <label style={{ fontWeight: "500", fontSize: "14px" }}>{label}</label>

        {/* Toggle switch - hidden if only 1 item exists or if this is the last active item */}
        {!hideToggle && !isLastActive && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Switch
              label=""
              onToggle={handleToggle}
              disable={disabled}
              isCheckedInitially={toggleState}
              key={`toggle-${item.code || itemIndex}-${toggleState}`}
              shapeOnOff
              isLabelFirst={true}
              className={"digit-sidepanel-switch-wrap"}
            />
          </div>
        )}
      </div>

      {/* Text field using FieldV1 - same as LocalizationInput */}
      <div style={{ display: !toggleState ? "none" : "block" }}>
        <FieldV1
          value={localizedValue}
          type="text"
          placeholder={placeholder}
          withoutLabel={true}
          onChange={(e) => {
            const val = e.target.value;
            // Update localization for the code
            dispatch(
              updateLocalizationEntry({
                code: localizationCode,
                locale: currentLocale || "en_IN",
                message: val,
              })
            );
          }}
          populators={{
            fieldPairClassName: "drawer-toggle-conditional-field",
          }}
          disabled={disabled || !toggleState}
        />
      </div>
    </div>
  );
});

export default PopupFieldConfigurator;
